import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import router from './routes/authRoute'

dotenv.config()
const app =express ()
const port = process.env.PORT || 5000

app.use(express.json())

mongoose.connect(process.env.MONGO_URI ||'' )
    .then(()=>console.log('mongodb connected'))
    .catch((err)=>console.log(err))

    console.log(process.env.MONGO_URI)
app.use('/api/user',router)
app.listen(port,()=>{
    console.log('server running on port 3000')
})