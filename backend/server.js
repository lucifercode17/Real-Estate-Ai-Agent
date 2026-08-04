const express = require('express');

require('dotenv').config()
const mongoose = require("mongoose")
const PORT = process.env.PORT || 3000;
const db_path = process.env.MONGO_URI;
const projectRoutes = require('./Routes/Project.Routes');
const aiRouter = require('./Routes/Openai.Routes')
const leadRouter = require('./Routes/Lead.Routes')
const cors = require('cors');



const app = express();
app.use(express.urlencoded({extended:true}))
app.use(express.json());
app.use(cors({
  origin:[ "http://localhost:5173",
    "https://real-estate-ai-agent-weld.vercel.app"
  ],
  credentials: true}));

app.use("/api/project",projectRoutes);
app.use("/api/ai",aiRouter);
app.use("/api/Lead",leadRouter);

app.get('/',(req,res) =>{
  res.end("the backend is running")
})

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
   
    console.log("Mongo Connected");
  app.listen(PORT,(req,res) =>{
  console.log(`the sever is running on the localhost${PORT}`)
})
})
.catch(err=>console.log(err));
