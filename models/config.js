const mongoose= require("mongoose");
//schema
const loginSchema= new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    }
});

//collection port
const collection= new mongoose.model("users", loginSchema)

module.exports= collection;