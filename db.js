//  for user login and authentication
const mongoose= require("mongoose");
const connect = mongoose.connect("mongodb+srv://jasmineb:NawaAama@cluster0.hdnidxc.mongodb.net/?retryWrites=true&w=majority");

//check connection
connect.then(()=>{
    console.log("Database connected Successfully")
})
.catch(()=>{
    console.log("Connection unsuccessful")
});

