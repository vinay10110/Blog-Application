require('dotenv').config();
const express=require('express');
const bcrypt=require('bcrypt');
const User=require('./models/User');
const Post=require('./models/Post');
const cors=require('cors');
const path=require('path');
const jwt=require('jsonwebtoken');
const mongoose = require('mongoose');
const cookieparser=require('cookie-parser');
const multer=require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' });
const fs=require('fs');
const app=express();
app.use('/uploads', express.static(__dirname + '/uploads'));
const corsoptions={
  origin:`${process.env.HOST_ADDRESS}`,
  credentials:true,
  methods:['GET','PUT','POST','DELETE'],
  header:{
    'Access-Control-Allow-Credentials':true,
    'Access-Control-Allow-Methods':['GET','PUT','POST','DELETE'],
   
  }
}
app.use(cors(corsoptions));
app.use(express.json());
app.use(cookieparser());
const salt=bcrypt.genSaltSync(10);
const secret='dsg3yugr838fg83efh93f93hf93f';
mongoose.connect(`${process.env.MONGO_URL}`)
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

app.post('/post', uploadMiddleware.single('file'), async (req,res) => {
  const {originalname,path} = req.file;
  const parts = originalname.split('.');
  const ext = parts[parts.length - 1];
  const newPath = path+'.'+ext;
  fs.renameSync(path, newPath);

  const {token} = req.cookies;
  jwt.verify(token, secret, {}, async (err,info) => {
    if (err) throw err;
    const {title,summary,content} = req.body;
    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover:newPath,
      author:info.id,
    });
    res.json(postDoc);
  });

});

app.put('/post',uploadMiddleware.single('file'), async (req,res) => {
  let newPath = null;
  if (req.file) {
    const {originalname,path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    newPath = path+'.'+ext;
    fs.renameSync(path, newPath);
  }

  const {token} = req.cookies;
  jwt.verify(token, secret, {}, async (err,info) => {
    if (err) throw err;
    const {id,title,summary,content} = req.body;
    const postDoc = await Post.findById(id);
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    if(!isAuthor){
      return res.status(400).json("your are not the Author");
    }
    await postDoc.updateOne({
      title,
      summary,
      content,
      cover: newPath?newPath:postDoc.cover,
    })
    res.json(postDoc);
  

  
  });

});

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

app.listen(`${process.env.PORT_ADDRESS}`);
