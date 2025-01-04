import express from 'express';
const app = express();
const port = 5001; 
const __dirname = path.resolve()
app.use("static",express.static(path.join(__dirname,'public')))
app.get('/',(req,res)=>{
    res.send("hello world")
})

app.listen(port, function(){
    console.log("http://localhost:"+ port);
})