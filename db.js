//  for user login and authentication
const mongoose= require("mongoose");
//const connect = mongoose.connect("mongodb+srv://jasmineb:NawaAama@cluster0.hdnidxc.mongodb.net/?retryWrites=true&w=majority");
const connect = mongoose.connect("mongodb+srv://user1:123@bookapp.dk8urmt.mongodb.net/community")

//check connection
connect.then(()=>{
    console.log("Database connected Successfully")
})
.catch(()=>{
    console.log("Connection unsuccessful")
});

