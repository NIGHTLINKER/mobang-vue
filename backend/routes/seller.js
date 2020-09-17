const express=require("express");
const router=express.Router();
const {Seller}=require("../models");
const {hashPassword, comparePassword} = require("../utils/bcrypt");

//회원가입
router.post("/", async(req, res)=>{
	try {
		const {email, password, name}=req.body;
		if(email&&password&&name){
			const hashedPassword=await hashPassword(password);
			console.log(hashedPassword);
			const data=await Seller.create({
				email:email,
				password:hashedPassword,
				name:name
			});
			console.log(data);
		}
		return res.json({signup:true});
	} catch (error) {
		return res.json({signup:false});
	}
});

router.post("/login", async(req, res)=>{
	try {
		const {email, password}=req.body;
		const userData=await Seller.findOne({
			where:{
				email:email
			}
		})
		console.log(userData);
		const hashedPassword=userData.dataValues.password;
		const compareResult=await comparePassword(password, hashedPassword);
		if(compareResult){
			return res.json({
				// 일반유저는 auth 3 판매자일 경우에는 2
				login:true,
				id:userData.dataValues.id,
				name:userData.dataValues.name,
				auth:2,
			});
		} else{
			throw new Error();
		}
		return res.json({login:true});
	} catch (error) {
		console.log(error);
		return res.json({login:false});
	}
})

module.exports=router;