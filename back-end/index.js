import express from 'express';
import dotenv from 'dotenv'

import morgan from 'morgan';
import multer from 'multer';
import cors from 'cors'
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import {register} from './controllers/auth.js'
import {createPost} from './controllers/posts.js'
import authRoutes from './routes/auth.js'
import postRoutes from './routes/posts.js'
import userRoutes from './routes/users.js'
import {users,posts} from './data/data.js'
import mongoose from 'mongoose';
import User from './models/User.js';
import Post from './models/Post.js';
import { verifyToken } from './middlewares/auth.js';
dotenv.config();
const app=express();
const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename)
//middlewares
app.use(morgan('common'))
//to increase the size of the data when making post request
app.use(bodyParser.json({limit:"30mb",extended:true}));
app.use(bodyParser.urlencoded({limit:"30mb",extended:true}));
app.use(express.json());
const corsOptions = {
  origin: 'http://localhost:3000', // Allow requests from this origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
   // Allowed methods
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions))

app.use("/assets",express.static(path.join(__dirname,'public/assets')))

const port=process.env.PORT
//file storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/assets')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
//now wheenerver we want to store something,it will get store in assets folder with orignial name of the file
const upload = multer({ storage: storage })
//routes
app.post("/auth/register",upload.single("picture"),register)
app.post("/posts",verifyToken,upload.single('picture'),createPost);
app.use("/auth",authRoutes);
app.use("/users",userRoutes)
app.use('/posts',postRoutes);
//database connection
mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log('Connected to DB')
}).catch((err)=>{
    console.log(err);
})
app.listen(port,(req,res)=>{
    console.log('App Listening at port ', port)
    // User.insertMany(users);
    // Post.insertMany(posts)
    
})