<template>
	<div>
		<div class="h3 ml-auto mr-auto text-center p-2 border-top">{{title}}</div>
		<div class="mt-3 ml-auto mr-auto text-center w-75">{{address}}</div>
		<div class="mt-3 mb-3 ml-auto mr-auto text-center w-75">{{content}}</div>
		<div v-if="options.length" class="text-center border-top border-bottom pb-3">
			<div class="mt-3 mb-3 text-center ml-auto mr-auto w-75">옵션</div>
			<span class="m-3" v-for="option in options" :key="option.option">{{option.option}}</span>
		</div>
		<div v-if="images.length"  class="d-flex ml-auto mr-auto justify-content-center border-top border-bottom pb-3 w-75">
			<div class="shadow post-image" v-for="img in images" :key="img.image" :style="{backgroundImage:`url(${img.image})`}"></div>
		</div>
        <div ref="map" class="w-50 ml-auto mr-auto" style="height:500px;">지도</div>
	</div>
</template>

<script>
import PostComponent from "../components/PostComponent"
import {postApi} from "../utils/axios";
export default {
  components:{
    PostComponent
  },
  data(){
    return{
		title:"",
		content:"",
		address:"",
		latitude:"",
		longitude:"",
		options:[],
		images:[]
    };
  },
  async mounted(){
    const addressScript=document.createElement("script");
    addressScript.src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    document.head.appendChild(addressScript);
    const mapScript=document.createElement("script");
    mapScript.onload=()=>kakao.maps.load();
    mapScript.src="http://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=086121b9f0388986a18ef31a78b76558&libraries=services";
    document.head.appendChild(mapScript);

	const {data}=await postApi.getDetail(this.$route.params.id);
	const {room}=data;
	this.title=room.title;
	this.content=room.content;
	this.address=room.address;
	// 혹시모르니까 예외처리 하긴하는데..... 이미지가 있는 글만 목록에 뜨니까 굳이 해야하나 싶은? 하지만 일단 함
	if(room.Images.length){
		room.Images.forEach(async(img)=>{
			const res=await postApi.getFile(img.src);
			const blob=new Blob([res.data], {
				type:res.headers["content-type"]
			});
			this.images.push({image:window.URL.createObjectURL(blob)});
		});
	}
	if(room.Options.length){
		room.Options.forEach(async(option)=>{
			this.options.push({option:option.item});
		})
	}
	let mapOption={
		center: new daum.maps.LatLng(37.537187, 127.005476), // 중심좌표
		level:6 //지도의 확대레벨
		}
		const mapContainer=this.$refs.map;
		const map=new daum.maps.Map(mapContainer, mapOption);
		let geocoder=new daum.maps.services.Geocoder();
		 geocoder.addressSearch(this.address, (results, status)=>{
		if(status===daum.maps.services.Status.OK){
			console.log(results);
			const {y, x, address_name}=results[0];
			console.log(y, x, address_name);

			this.address=address_name;
			let coords = new daum.maps.LatLng(y, x);
			this.latitude=y;
			this.longitude=x;
			mapContainer.style.display="block";
			map.relayout();
			map.setLevel(4);
			map.setCenter(coords);
			let marker=new daum.maps.Marker({
			position:coords,
			map:map
			})
		}
	})
  }
}
</script>

<style>
.post-image{
  width:300px;
  height:200px;
  background-size: cover;
}
</style>