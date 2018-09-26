const db = require("../models");
//used to create a tool that checks users are logged in 
const jwt = require("jsonwebtoken");

exports.signin = async function(req, res, next){
    // finding a user
    //checking if their password matches what was sent to the server
    //if it all matches
        //log them in 
    try {
        let user = await db.User.findOne({
            email: req.body.email
        });
        let { id, username, profileImageUrl } = user;
        let isMatch = await user.comparePassword(req.body.password);
        if (isMatch){
            let token = jwt.sign(
                {
                    id,
                    username,
                    profileImageUrl
                },
                process.env.SECRET_KEY
            );
            return res.status(200).json({
                id,
                username,
                profileImageUrl,
                token
            });
        } else {
            return next({
                status: 400,
                message: "Invalid Email/Password."
            });
        }
    } catch(err){
        return next({
            status: 400,
            message: "Invalid Email/Password."
        }); 
    }
};

exports.signup = async function(req, res, next){
    try {
        //create a user
        let user = await db.User.create(req.body);
        let { id, username, profileImageUrl} = user;
        //create a token (signin a token)
        let token = jwt.sign({
            id,
            username,
            profileImageUrl
        },
        process.env.SECRET_KEY
        );
        return res.status(200).json({
            id,
            username,
            profileImageUrl,
            token
        });
    } catch(err){
        //if a validation fails!
        //see what kind of error
        //if it is a certain error 11000
        //respond with username/email already taken
        //otherwise just send back a generic 400
        if(err.code === 11000){
            err.message = "Sorry, that username and/or email is taken";
        }
        return next({
            status: 400,
            message: err.message
        });        
    }
};