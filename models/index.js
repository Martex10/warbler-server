//mongosse is our ODM(object data manager) 
//a wrapper on top of mongo that allows us to make queries more efficiently 
const mongoose = require("mongoose");
// this is useful to see the mongo queries that are sent in the terminal 
mongoose.set("debug", true);
//we will set what promise library we are useing 
//we will be useing ES2015 async functions
mongoose.Promise = Promise;
//conect to a data base
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/warbler", {
    keepAlive: true,
    useNewUrlParser: true
});

module.exports.User = require("./user");
module.exports.Message = require("./message");