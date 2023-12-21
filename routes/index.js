const multer = require('multer')
const { ObjectId } = require('mongodb');
// Multer setup
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/blogs')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var upload = multer({ storage: storage })

var express = require('express');
const sessionStorage =require('sessionstorage-for-nodejs')

var router = express.Router();
var blogList = require('../resources/blogs');
const Blog = require('../models/blogdb');

//for login
const path = require('path');
const bcrypt = require("bcryptjs");
const collection = require("../models/config");

//login function
//convert data into json
const app= express();
app.use(express.json());
app.use(express.urlencoded({extended:false}));

//logout
sessionStorage.kill

//const app= express();
// use Ejs as view engine
app.set('view engine','ejs');
//app.use(express.static("public"));

/* get login page */
router.get('/login', function(req, res, next){
  res.render('login',{title: "Login/Signup"})
})

//register user
router.get('/signup',(req, res)=>{
  res.render("signup",);
});
router.post("/signup",async(req, res)=>{
    const data={
        name: req.body.username,
        password: req.body.password
    }

    //check if user already exists
    const existingUser= await collection.findOne({name:data.name});
    if(existingUser){
        res.send("User Already exists");
    }else{
        //hash the password
        const saltRounds= 10; //number of rounds for bcrypt
        const hashPassword = await bcrypt.hash(data.password, saltRounds);
        data.password = hashPassword; //replace the hash pw with original password
        const userdata= await collection.insertMany(data);
        console.log(userdata)
        res.render('login',{title: 'Blogs' , blogList: blogList})

    }
})



//login
router.post('/login', async(req, res)=>{
    try{
        const check= await collection.findOne({name:req.body.username});
        console.log('check',check)
        if (!check){
            res.send("User not found");
        }
        //compare hash password
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        console.log('pw',isPasswordMatch)
        if(isPasswordMatch){
          const blogs = await Blog.find()
          req.session.user = check
          sessionStorage.setItem("user",check)

            res.render('validhome',{title: 'home' ,  blogList: blogs, user: check});
        }else{
            res.send("Password incorrect")
        }
    }
    catch(error){
      console.log(error)
        res.send("Wrong detail",error)
    }
})


/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Nawa Aama', });
// });

/* get about us page */
router.get('/aboutus', function(req, res, next){
  res.render('aboutus',{title: "About Us"})
})
/* get tracker page */
router.get('/calculator', function(req, res, next){
  res.render('calculator',{title: "Tracker"})
})


// get 
//index page 
router.get('/', async function(req, res, next) {
  // session = req.session
  const blogs = await Blog.find();
  console.log("Blogs", blogs);
  res.render('index', { title: 'Blogs' , blogList: blogs});

});




// CRUD operation on blogs
// add blogs
router.get('/addblogs', function(req, res, next) {
  res.render('addblogs', { title: 'Add Blogs' });
});

//save route
router.post('/save', upload.single("files"), async function (req, res) {
  
    session = req.session

   // console.log("sesion ",req.session.user)
    console.log(req.body, req.file)
    // convert author id to objectId

    const auth_user = sessionStorage.getItem("user");
    console.log("auth user",auth_user)
    // Convert string to ObjectId

    const author_id = auth_user ?auth_user._id  : new  ObjectId('5fc7c70d6c651f0024a3e1f9')


    await Blog.create({
      title: req.body.title,
      content: req.body.content,
      image: "blogs/" + req.file?.originalname,
      author_id: author_id
    })
res.redirect('/')
})


//edit blogs
router.get('/edit/:id', async function (req, res) {
  console.log(req.params.id);
  const blogs = await Blog.findOne({ _id: req.params.id });
  res.render('editblogs', {
    title: "Edit Blog",
    blogs
  })
})

// post the edited blog
router.post('/edit/:id', async function (req, res) {
 
  
  await Blog.findOneAndUpdate({_id:req.params.id},{
    title : req.body.title,
    content : req.body.content
  })

  res.redirect('/');
})

// delete blogs 
router.post('/remove/:id',async function(req, res, next){
  console.log("delte blogid",req.params.id)

  // check if author is author 
    const  blog = await Blog.deleteOne({_id:req.params.id})

   res.redirect('/')
  })


//static blog display matra garna haleko pachi remove garne ho
router.get('/post/:id', async(req, res) => {
  try{
        
    let slug= req.params.id;
    const data= await Blog.findById({_id: slug});

    const locals={
        title: data.title,
        body: data.content,
        image: data.image,
        description: "Simple blog using nodeJS, Express and mongoDB"
    }
    console.log(locals)
    res.render('post' ,{locals, data});
}catch(error){
    console.log(error);
} // Assuming 'blogsre.ejs' or 'blogsre.html' is in your 'views' directory
});
module.exports = router;


