const express = require('express')
const app = express()
const port = 5000

const mongoose =require('mongoose')
mongoose.connect('mongodb+srv://minjin:zldzhd!!12@cluster0.pdt7a.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',err => {
    if(err) throw err;
    console.log('Connected to MongoDB!!!')
 })
    
app.get('/', (req, res) => {
  res.send('Hello World! 안녕하세요 ')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})