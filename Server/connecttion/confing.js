
import mongoose from "mongoose";
mongoose.connect("mongodb://localhost:27017/RTO_API")

.then(()=>{console.log("Connection succesfull");})
.catch((e)=>{console.log(e);})
