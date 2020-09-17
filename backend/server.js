const express=require("express");
const app=express();
const morgan=require("morgan");
const {sequelize}=require("./models");
const cors=require("cors");
const PORT=8000;
const indexRouter=require("./routes");
const userRouter=require("./routes/user");
const sellerRouter=require("./routes/seller");
const postRouter=require("./routes/post");

app.use(
	cors({
		// origin:"http://localhost:8080" 도 가능
		origin:true,
		credentials:true
	})
)
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({extended:false}));

sequelize.sync({force:false}).then(()=>console.log("db 접속 성공")).catch(err=>console.log(err));

app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/seller", sellerRouter);
app.use("/post", postRouter);

app.listen(PORT, ()=>console.log(`this server listening on ${PORT}`));