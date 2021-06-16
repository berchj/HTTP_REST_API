const express = require('express')
const app = express()
const port = 5454
const router = require('./routes/router')
app.use('/api/v1',router)
app.listen(port,()=>{
    console.info(`server running on port ${port}`)
})