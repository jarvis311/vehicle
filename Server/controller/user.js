import mongoose from "mongoose";
import ResponseMassage from "../Response/All_Response.js"
import helper from "../helper/helper.js";
import Cryptr from "cryptr";
const cryptr = new Cryptr("RTO-Service");
import user from "../model/User.js"

const user_register = async(req,res)=>{
    try {
    const password = cryptr.encrypt(req.body.password);
    const data = new user({
      name: req.body.name,
      email: req.body.email,
      password: password,
    });
    const result = await data.save();
    res.send(await helper.successResponse("User Create Successfuly"))  
    return
  } catch (error) {
        console.log(error)
    }
}
const User_update = async(req,res)=>{
    try {
        if (!req.body.id || req.body.id === "") {
            res.send("id requried")
            return
          }
          if (!req.body.email || req.body.email === "") {
            res.send("email requried")
            return
          }
          if (!req.body.password || req.body.password === "") {
            res.send("password requried")
            return
          }
          const find = await user.findOne({ _id: req.body.id })
          if (!find) {
            res.send("Data Not Exits")
            return
          }
          var data = {
            name:req.body.name,
            email: req.body.email,
            password: cryptr.encrypt(req.body.password)
          }
          const result = await user.findByIdAndUpdate({ _id: req.body.id }, data, { new: true })
          res.send(await helper.successResponse("User Update Successfuly"))
    } catch (error) {
        console.log(error.message);
    }
}

const login = async(req,res)=>{
    try {
      console.log('req.body', req.body)
        let data = await user.findOne({
            email: { $regex: req.body.email, $options: "i" },
          });
          if (!req.body.email || req.body.email == "") {
            res.json({
              status: false,
              response_code: 401,
              response_message: "Email Field Is Required",
            });
            return;
          }
          if (!req.body.password || req.body.password == "") {
            res.json({
              status: false,
              response_code: 401,
              response_message: "Password Field Is Required",
            });
            return;
          }
          if (data == null) {
            res.json({
              status: false,
              response_code: 401,
              response_message: "Email Id not Match",
            });
            return;
          } else {
            if (cryptr.decrypt(data.password) === req.body.password) {
              const weboken = await data.gettoken();
              res.send({ data, auth: weboken });
              return;
            } else {
              res.json({
                status: false,
                response_code: 401,
                response_message: "Password Not Match",
              });
              return;
            }
          }
    } catch (error) {
        console.log(error)
    }
}

const logout = async(req,res)=>{
     try {
      console.log('req.admin', req.admin)
        req.admin.tokens = req.admin.tokens.filter((curr) => {
            return curr.token !== req.token
        })
        await req.admin.save()
        res.send(await helper.successResponse("User Logout Successfuly"))
    } catch (err) {
     console.log(err)
    }
}

const Protect_route = async(req,res)=>{
  try {
    console.log("object")
    res.json({
      status: true,
      response_code: 200,
      response_message: "User Verified Succesfully.",
    });
  } catch (err) {
    res.json({
      status: false,
      response_code: 401,
      response_message: "something went wrong",
    });
  }
}
export default {user_register , User_update , login , logout , Protect_route}