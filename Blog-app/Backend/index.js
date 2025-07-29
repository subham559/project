const express=require("express")
const app=express()
const  mongoose  = require("mongoose")
const dotenv=require('dotenv')
const cors=require('cors')
const multer=require('multer')
const path=require('path')
const cookieParser=require('cookie-parser')
const authRoute=require('./routes/auth')
const userRoute=require('./routes/users')
const postRoute=require('./routes/posts')
const commentRoute=require('./routes/comments')



//database
mongoose.connect('mongodb+srv://avii:avii%402309@cluster0.mfj9gxg.mongodb.net/')
.then(() => console.log('connected to mongodb'))
.catch(err => console.log('error connecting to mongodb', err))  


//middlewares
dotenv.config()
app.use("/images",express.static(path.join(__dirname,"/images")))
app.use(express.json())
app.use(cookieParser())
app.use(cors({origin:"http://localhost:5173",credentials:true}))
app.use("/api/auth",authRoute)
app.use("/api/users",userRoute)
app.use("/api/posts",postRoute)
app.use("/api/comments",commentRoute)

//image upload
const storage=multer.diskStorage({
    destination:(req,file,fn)=>{
        fn(null,"images")
    },
    filename:(req,file,fn)=>{
       fn(null,req.body.img)
       //fn(null,"image1.jpg")
    }
})
const upload=multer({storage:storage})
app.post("/api/upload",upload.single("file"),(req,res)=>{

    if(!req.file){
        console.log("No file uploaded");
        return res.status(400).json({ error: "No file uploaded." });

    }
    res.status(200).json("Image has been uploaded successfully")
})

app.listen(5000,()=> {
    // connectDB()
console.log("app is running on port "+process.env.PORT)
}) 