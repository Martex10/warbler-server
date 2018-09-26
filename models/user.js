const mongoose = require("mongoose");
//library used for hashing the user password and 
//turning it into something that can not be reversed. 
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profileImageUrl: {
        type: String
    },
    messages: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: "Message"
        }
    ]
});

//adding a hook that will help us hash the password
userSchema.pre("save", async function(next){
    try {
        if (!this.isModified("password")) {
            return next();
        }
        let hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
        return next();
    } catch (err) {
        return next(err);
    }
});

userSchema.methods.comparePassword = async function(candidatePassword, next){
    try {
        let isMatch = await bcrypt.compare(candidatePassword, this.password);
        //returns a true or false 
        return isMatch;
    } catch(err){
        return next(err);
    }
};

const User = mongoose.model("User", userSchema);

module.exports = User;