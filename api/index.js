const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const User = require('./models/User');
const Post = require('./models/Post');
const bcrypt=require('bcrypt')
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const salt = bcrypt.genSaltSync(10);
const secret = 'asdfe45we45w345wegw345werjktjwertkj';
const bodyParser=require('body-parser')
app.use(cors({
  origin: 'https://blog-application-lovat.vercel.app/',
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Content-Length', 'X-Requested-With'],
  credentials:true
}));
app.use(cookieParser());
app.use(bodyParser.json({ limit: '50mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use(express.json())
mongoose.connect('mongodb+srv://vinaychakravarthi10110:Vo4W2aCCwodu7R0F@clusterk.y84cuo9.mongodb.net/?retryWrites=true&w=majority&appName=Clusterk');
app.post('/register', async (req,res) => {
  const {username,password} = req.body;
  try{
    const userDoc = await User.create({
      username,
      password:bcrypt.hashSync(password,salt),
    });
    res.json(userDoc);
  } catch(e) {
    console.log(e);
    res.status(400).json(e);
  }
});
app.post('/login', async (req,res) => {
  const {username,password} = req.body;
  const userDoc = await User.findOne({username});
  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (passOk) {
    jwt.sign({username,id:userDoc._id}, secret, {}, (err,token) => {
      if (err) throw err;
      res.cookie('token', token).json({
        id:userDoc._id,
        username,
      });
    });
  } else {
    res.status(400).json('wrong credentials');
  }
});
app.get('/profile', (req,res) => {
  const {token} = req.cookies;
 
  jwt.verify(token, secret, {}, (err,info) => {
    if (err) throw err;
    res.json(info);
  });
});
app.post('/logout', (req,res) => {
  res.cookie('token', '').json('ok');
});

app.post('/post', async (req,res) => {
  const {token} = req.cookies;
  jwt.verify(token, secret, {}, async (err,info) => {
    if (err) throw err;
    const {title,summary,content,fileData} = req.body;
   
    const newPostMessage = new Post({ title, summary, content,fileData,author:info.id })
    try {
        await newPostMessage.save();
        res.status(201).json(newPostMessage );
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
  });
});
app.put('/post', async (req,res) => {
  const {token} = req.cookies;
  console.log(token);
  jwt.verify(token, secret, {}, async (err,info) => {
    if (err) throw err;
    const {id,title,summary,content,fileData} = req.body;
    const postDoc = await Post.findById(id);
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res.status(400).json('you are not the author');
    }
    const updatedPost = await Post.findByIdAndUpdate( id,{
      title,
      summary,
      content,
      fileData
    }); 
    res.json(updatedPost);
  });
});
app.delete('/post',async(req,res)=>{
  const {token}=req.cookies;
  jwt.verify(token,secret,{},async(err,info)=>{
    if(err) throw err;
    const {id} = req.body;
    const postDoc = await Post.findById(id);
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res.status(400).json('you are not the author');
    }
    await postDoc.deleteOne();
    res.json({message:"deleted succesfully"})
  })
})
app.get('/post', async (req,res) => { 
  res.json(
    await Post.find()
      .populate('author', ['username'])
      .sort({createdAt: -1})
      .limit(20)
  );
});

app.get('/post/:id', async (req, res) => {
  const {id} = req.params;
  const postDoc = await Post.findById(id).populate('author', ['username']);
  res.json(postDoc);
})
app.listen(4000);