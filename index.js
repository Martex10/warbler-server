//this loads all of our environment variables from .env file on to process.env
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require("./handlers/error");
const authRoutes = require("./routes/auth");
const messagesRoutes = require("./routes/messages");
const mongoose = require("mongoose");
const { loginRequired, ensureCorrectUser } = require("./middleware/auth");
const db = require("./models");

app.set('port', (process.env.PORT || 8081));
mongoose.set('useFindAndModify', false);

app.use(cors());
app.use(bodyParser.json());

//all my routes here 
//prefixed all of routes with /api/auth
app.use("/api/auth", authRoutes);
app.use(
    "/api/users/:id/messages", 
    loginRequired, 
    ensureCorrectUser, 
    messagesRoutes
);

app.get("/api/messages", loginRequired, async function(req, res, next){
    try {
        let messages = await db.Message.find()
            .sort({ createdAt: "desc" })
            .populate("user", {
                username: true,
                profileImageUrl: true
              });
            return res.status(200).json(messages);
    } catch(err){
        return next(err);
    }
});

app.use(function(req, res, next){
    let err = new Error("Not Found");
    err.status = 404;
    next(err);
});
// makes all the errors look the same for the front end
app.use(errorHandler);

app.listen(app.get('port'), function(){
    console.log(`Server is starting on port`, app.get('port'));
});