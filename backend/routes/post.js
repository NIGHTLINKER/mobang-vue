const express = require("express");
const { upload } = require("../utils/multer");
const { Room, Option, Image, sequelize } = require("../models");
const Sequelize = require("sequelize");
const fs = require("fs").promises;
const router = express.Router();
const Op=Sequelize.Op;

router.get("/", async(req, res)=>{
	try {
		console.log(req.query);
		const data=await Room.findAll({
			include:[{model:Option}, {model:Image}],
			where:{
				address:{
					[Op.like] : `%${req.query.searchKeyword}%`
				}
			}
		});
		console.log(data);
		return res.json({room:data});
	} catch (error) {
		console.log(error);
		return res.json({room:false})
	}
})

router.get("/images", async(req, res)=>{
	try {
		console.log(req.query.src);
		const file=await fs.readFile(req.query.src);
		return res.send(file);
	} catch (error) {
		return res.json({upload:false})
	}
})

router.post("/", upload.array("files"), async (req, res)=>{
	const transaction=await sequelize.transaction();
	try {
		// room에 대한 정보들 title, content, address, longitude, latitude, seller_id
		// 이미지의 경로 및 이미지들(multer 처리)
		// option들
		const {title, content, address, latitude, longitude, seller_id, options}=req.body;
		console.log(req.body);
		console.log(req.files);
		const room=await Room.create(
			{
				title,
				content,
				address,
				seller_id,
				longitude,
				latitude
			},{
				transaction:transaction
			}
		);
		
		if(options){
			if(typeof options==="string"){
				await Option.create({
					item:options,
					room_id:room.dataValues.id
				},
				{
					transaction:transaction
				})
			} else{
				await Promise.all(options.map(async(li) =>{
					await Option.create({
						item:li,
						room_id:room.dataValues.id
					},
					{
						transaction:transaction
					})
				}))
			}
		}

		if(req.files){
			await Promise.all(
				req.files.map(async(li)=>{
					await Image.create({
						src:li.path,
						room_id:room.dataValues.id
					},
					{
						transaction:transaction
					})
				})
			)
		}
		console.log(room);
		await transaction.commit();
		return res.json({upload:true});
	} catch (error) {
		console.log(error);
		await transaction.rollback();
		// console.log(req.files);
		if(req.files){
			req.files.forEach(li=>{
				console.log(li.path);
				fs.unlink(li.path, err=>{
					if(err){
						console.log(err);
					}
				})
			})
		}
		return res.json({upload:false});
	}
});

router.get("/:id", async(req, res)=>{
	try {
		console.log(req.params);
		const data=await Room.findOne({
			include:[{model:Option}, {model:Image}],
			where:{
				id:req.params.id
			}
		});
		return res.json({room:data});			
	} catch (error) {
		console.log(error);
		return res.json({room:false});
	}
});

// 업데이트는 option 따로, rooms 따로, images 따로 업데이트를 해주기
router.put("/:id/option", async(req, res)=>{
	console.log(req.params);
	const transaction=await sequelize.transaction();
	try {
		const del=await Option.destroy(
			{
				where:{
					room_id:req.params.id
				}
			},
			{
				transaction:transaction
			}
		);
		console.log(del);
		const {options} = req.query;
		console.log(options);
		if(options){
			if(typeof options==="string"){
				await Option.create({
					item:options,
					room_id:req.params.id
				},
				{
					transaction:transaction
				})
			} else{
				await Promise.all(options.map(async(li) =>{
					await Option.create({
						item:li,
						room_id:req.params.id
					},
					{
						transaction:transaction
					})
				}))
			}
		}
		await transaction.commit();
		return res.json({update:true});
	} catch (error) {
		console.log(error);
		await transaction.rollback();
		return res.json({update:false})
	}
});

// 이미지 업데이트
// db에 이미지들 전체 삭제
// 파일들도 경로찾아서 삭제
// 새로 이미지 업로드(multer)

module.exports=router;