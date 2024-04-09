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
const bodyParser=require('body-parser');
require('dotenv').config();
const secret=process.env.secret;
app.use(cors({
  origin: `${process.env.HOST_ADDRESS}`,
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Content-Length', 'X-Requested-With'],
  credentials:true
}));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', `${process.env.HOST_ADDRESS}`);
  next();
});
app.use(cookieParser());
app.use(bodyParser.json({ limit: '50mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use(express.json())
mongoose.connect(`${process.env.MONGO_URL}`);
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
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const userDoc = await User.findOne({ username });
    if (!userDoc) {
      return res.status(404).json({ message: 'User not found' });
    }
    const passOk = bcrypt.compareSync(password, userDoc.password);
    const id = userDoc.id;
    if (passOk) {
      const token = jwt.sign({ username, id: userDoc._id }, secret, { expiresIn: '1h' });
      return res.json({ username, id, token });
    } else {
      return res.status(400).json({ message: 'Wrong credentials' });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});
app.get('/profile', (req,res) => {
  const token = req.headers.authorization;
  const tokenParts = token.split(' ');
  const toker = tokenParts[1];
  if(token){
    jwt.verify(toker, secret, {}, (err,info) => {
      if (err) throw err;
      res.json(info);
    });
  }
  
});
app.post('/logout', (req,res) => {
  res.cookie('token', '').json('ok');
});

app.post('/post', async (req,res) => {
  const token = req.headers.authorization;
  const tokenParts = token.split(' ');
  const toker = tokenParts[1];
  const {id}=jwt.decode(toker);
  jwt.verify(toker, secret, {}, async (err,info) => {
    if (err) throw err;
    const {title,summary,content,fileData} = req.body;
   
    const newPostMessage = new Post({ title, summary, content,fileData,author:id })
    try {
        await newPostMessage.save();
        res.status(201).json(newPostMessage );
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
  });
});
app.put('/post', async (req,res) => {
  const token = req.headers.authorization;
  const tokenParts = token.split(' ');
  const toker = tokenParts[1];
  const person=jwt.decode(toker);
  jwt.verify(toker, secret, {}, async (err,info) => {
    if (err) throw err;
    const {id,title,summary,content,fileData} = req.body;
    const postDoc = await Post.findById(id);
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(person.id);
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
  const token = req.headers.authorization;
  const tokenParts = token.split(' ');
  const toker = tokenParts[1];
  const person=jwt.decode(toker);
  jwt.verify(toker,secret,{},async(err,info)=>{
    if(err) throw err;
    const {id} = req.body;
    const postDoc = await Post.findById(id);
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(person.id);
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