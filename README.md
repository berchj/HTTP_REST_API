To test this project: 

    - npm install to install all dependencies
    - create the database 'demo' on your mysql's client -> "CREATE DATABASE demo;"
    - import the databasedump -> 'mysql -u ${user} -p demo < demo.sql
    - in /lib/pool put your user and password of your mysql's client
    - run 'npm run test' to start
    - go to localhost:5454

Functionality
The API has to fulfill the following conditions:

    - Endpoints for authentication using JWT. Also an endpoint for refreshing the JWT access token.  

        1 - 
        
            - endpoint : http://localhost:5454/api/v1/login
            - method : 'POST'        
            - body (require to send this): {
                username:admin,
                password:admin                
            }
            - response (expected) : {
                    "accessToken" : "........" (copy this string),
                    "refreshToken": "........" (copy this string too)
            }
        
        2- (to verify the authentication)        
            - FIRST in POSTMAN go to "Authorization" and select Bearer Token and paste the "accessToken" that you copy from the response of endpoint "/login" in step 1
            - endpoint : http://localhost:5454/api/v1/directors
            - method : 'GET'                    
            - response (expected) : {
                "data": [
                    {
                        "id": 1,
                        "name": "Julio",
                        "gender": "Male",
                        "email": "Juliobermudezch@gmail.com"
                    },
                    {
                        "id": 2,
                        "name": "Stef",
                        "gender": "female",
                        "email": "stef@mail.com"
                    },
                    {
                        "id": 3,
                        "name": "juan",
                        "gender": "male",
                        "email": "juan@mail.com"
                    },
                    {
                        "id": 4,
                        "name": "zabu",
                        "gender": "male",
                        "email": "zabu@mail.com"
                    }
                ]
            }
        3 - 
            - the token expires in 50 seconds... after the token is already expired do this: 
            endpoint : http://localhost:5454/api/v1/token
            method: 'POST'
            - body (require to send this): {
                token: '${ the refreshToken copied in step 1 }'                
            }
            -response (expected) : {
                "accessToken":"accessToken" (the refreshed token) (IMPORTANT COPY THIS STRING)
            }
        4 - 
            - FIRST in POSTMAN go to "Authorization" and select Bearer Token and paste the "accessToken" that you copied from step 3
            - endpoint: http://localhost:5454/api/v1/directors
            - method: 'GET'
            - response (expected) : {
                "data": [
                    {
                        "id": 1,
                        "name": "Julio",
                        "gender": "Male",
                        "email": "Juliobermudezch@gmail.com"
                    },
                    {
                        "id": 2,
                        "name": "Stef",
                        "gender": "female",
                        "email": "stef@mail.com"
                    },
                    {
                        "id": 3,
                        "name": "juan",
                        "gender": "male",
                        "email": "juan@mail.com"
                    },
                    {
                        "id": 4,
                        "name": "zabu",
                        "gender": "male",
                        "email": "zabu@mail.com"
                    }
                ]
            }



    - Endpoint for retrieving movies. It should be allowed to filter and sort by some field.

        - endpoint : http://localhost:5454/api/v1/movie?title=d
        - method : 'GET'        
        -response (expected) : {
            "data": [
                {
                    "id": 2,
                    "title": "dungeons and dragons",
                    "description": "sci fi movie",
                    "director_id": 1,
                    "genre": "sci fi"
                },
                {
                    "id": 1,
                    "title": "dracula",
                    "description": "terror film",
                    "director_id": 1,
                    "genre": "horror"
                }
            ]
        }

    - Endpoint for retrieving the information (director included) of a specific episode of a TV Show

        - endpoint : http://localhost:5454/api/v1/episode/${some episode name stored in the database}
        - method : 'GET'        
        -response (expected) : {
            "name": "new world",
            "description": "the new world",
            "number_of_episode": 1,
            "seasons_id": 1,
            "seasons_tv_shows_id": 1,
            "director_episode_id": 1,
            "director_id": 1,
            "director_name": "Julio",
            "director_email": "Juliobermudezch@gmail.com",
            "director_gender": "Male"
        }



    - Endpoint for adding a new object (it could be for any entity you like).

        - endpoint : http://localhost:5454/api/v1/add_director
        - method : 'POST'
        - body (required to send this): {
            name:(string),
            gender:(string),
            email:(string),
        }
        -response (expected) : {
            "message": "Director stored successfully"
        }
        

      