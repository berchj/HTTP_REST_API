require('dotenv').config() 
const express = require('express')
const router = express.Router()
const pool = require('../lib/pool')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({extended:false}))

/**
 * Middleware for authentication
 */

    function authenticateToken(req,res,next){
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        if(token == null) return res.sendStatus(401)
        jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(error,user)=>{
            if (error) throw error
            req.user = user
            next()
        })
    }
    function generateAccessToken(user){
        return jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'50s'})
    }

/**
 * Endpoints for authentication using JWT. Also an endpoint for refreshing the JWT access token.
 */

    router.post('/login',(req,res) => {
        //authenticate user 
        const username = req.body.username
        const user = { name:username }
        const accessToken = generateAccessToken(user)
        const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
        refreshTokens.push(refreshToken)        
        res.send({accessToken: accessToken,refreshToken: refreshToken})
    })

/**
 * "Also an endpoint for refreshing the JWT access token"
 */

    let refreshTokens = []

    router.post('/token',(req,res) => {
        const refreshToken = req.body.token
        if (refreshToken == null) return res.sendStatus(401)
        if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
        jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET, (error,user) => {  
            if (error) return res.sendStatus(403)
            const accessToken = generateAccessToken({name:user.name})
            res.send({accessToken:accessToken})
         })
    })

/**
 * Endpoints for authentication using JWT (allows to cofirm authentication && expiration using the token string).
 */

    router.get('/directors',authenticateToken,(req,res) => {
        pool.getConnection((error,connection) => {
            if (error) throw error
            let q = `SELECT * FROM director`
            connection.query(q,(error,rows,fields) =>{
                if (error) throw error
                if(rows.length){
                    res.json({data:rows})
                }else{                    
                    res.json({message:'ERROR : not found'})
                }
            })
            connection.release()
        })
    })    

/**
 * Endpoint for adding a new object (it could be for any entity you like).
 */    
    router.post('/add_director',(req,res) => {
        try {
            pool.getConnection((error,connection) => {
                if (error) throw error
                const name = req.body.name.trim().toLowerCase()
                const gender = req.body.gender.trim().toLowerCase()
                const email = req.body.email.trim().toLowerCase()
                let q = `SELECT * FROM director WHERE name = ${connection.escape(name)}`
                connection.query(q,(error,rows,fields) => {
                    if (error) throw error
                    if (rows.length){
                        res.send({
                            message:'ERROR: that name is already stored.',                            
                        })
                    }else{
                        let q = `SELECT * FROM director WHERE email = ${connection.escape(email)}`
                        connection.query(q,(error,rows,fields) => {
                            if (error) throw error
                            if(rows.length){
                                res.send({message:'ERROR: that email is already stored.'})
                            }else{
                                let q = `INSERT INTO director (name,gender,email) VALUES (
                                    ${connection.escape(name)},
                                    ${connection.escape(gender)},
                                    ${connection.escape(email)}
                                )`
                                connection.query(q,(error,rows,fields) => {
                                    if (error) throw error 
                                    res.status(201)
                                    res.send({
                                        message:'Director stored successfully'
                                    })
                                })
                            }
                        })
                    }
                })
                connection.release()
            })
        } catch (error) {
            console.error(new Error(error))
        }
    })

/**
 * Endpoint for retrieving movies. It should be allowed to filter and sort by some field.
 */
    router.get('/movie',(req,res) => {
        pool.getConnection((error,connection) => {
            if(error) throw error
            let q = `SELECT * FROM movies WHERE title LIKE '%${req.query.title}%' ORDER BY id DESC `
            connection.query(q,(error,rows,fields) => {
                if (error) throw error
                if(rows.length){
                    res.status(200)
                    res.send({data:rows})
                }else{
                    res.status(404)
                    res.send({message:'ERROR: not found'})
                }
            })
            connection.release()
        })
    })

/**
 * Endpoint for retrieving the information (director included) of a specific episode of a TV Show
 * 
 */
    router.get('/episode/:name',(req,res) => {
        try {
            pool.getConnection((error,connection) => {
                if (error) throw error
                let q = `SELECT * FROM episodes WHERE name LIKE '%${req.params.name}%'`
                connection.query(q,(error,rows,fields) => {
                    if (error) throw error
                    if (rows.length){
                        let q = `SELECT                         
                                    episodes.name,
                                    episodes.description,
                                    episodes.number_of_episode,
                                    episodes.seasons_id,
                                    episodes.seasons_tv_shows_id,
                                    episodes.director_episode_id,
                                    director.id as director_id,
                                    director.name as director_name,
                                    director.email as director_email,
                                    director.gender as director_gender
                                FROM 
                                    episodes 
                                INNER JOIN 
                                    director 
                                WHERE 
                                    episodes.director_episode_id = director.id;`
                        connection.query(q,(error,rows,fields) => {
                            if (error) throw error
                            res.status(200)
                            res.send({data:rows})
                        })
                    }else{
                        res.status(404)
                        res.send({message:'not found'})
                    }
                })
                connection.release()
            })
        } catch (error) {
            console.error(new Error(error))
        }
    })





module.exports = router