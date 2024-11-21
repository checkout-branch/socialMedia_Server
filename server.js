const express = require('express')
const app = express()

app.get('/',(req,res)=>{
    res.send('this is a server created for start hosting')
})

app.listen(5000)