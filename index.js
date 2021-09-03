const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');

const config = require('./config/key');
const { User } = require("./models/User");

//application/x-www-form-urlencoded
app.use(express.urlencoded({extended:true}));
//application/json
app.use(express.json());

const mongoose =require('mongoose')
mongoose.connect(config.mongoURI,err => {
    if(err) throw err;
    console.log('Connected to MongoDB!!!')
 })
    
app.get('/', (req, res) => {
  res.send('몽고디비')
})

app.post('/register',(req,res)=>{
  //회원가입 할 때 필요한 정보들을 client에서 가져오면
  //그것들을 데이터 베이스에 넣어준다
 
  const user = new User(req.body)
  user.save((err,doc)=>{
    if(err) return res.json({success: false, err})
    return res.status(200).json({success: true})
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})