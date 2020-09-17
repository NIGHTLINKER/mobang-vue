import axios from "axios"

const request=axios.create({
	baseURL:"http://localhost:8000"
});

export const userApi={
	registerUser:(email, password, name)=>{
		return request.post('/user', {
			email:email,
			password:password,
			name:name
		})
	},
	loginUser:(email,password)=>{
		return request.post("/user/login", {
			email,
			password
		})
	}
}

export const sellerApi={
	registerSeller:(email, password, name)=>{
		return request.post('/seller', {
			email:email,
			password:password,
			name:name
		})
	},
	loginSeller:(email,password)=>{
		return request.post("/seller/login", {
			email,
			password
		})
	}
}

export const postApi={
	post:(formData)=>{
		return request.post("/post", formData, {
			headers:{
				"Content-Type":"multipart/form-data"
			}
		})
	},
	getFile:(src)=>{
		return request.get("/post/images",{
			params:{
				src:src
			},
			// binary large object
			// 바이너리 라지 오브젝트, 이미지, 사운드, 비디오 등 멀티미디어 데이터를 다룰때
			responseType:"blob"
		})
	},
	// 파라미터 기본값 설정 가능
	getList:(searchKeyword="")=>{
		return request.get("/post", {
			params:{
				searchKeyword:searchKeyword
			}
		})
	},
	getDetail:(id)=>{
		return request.get(`/post/${id}`);
	}
}

