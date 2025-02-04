import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from "../views/Main.vue"
import Post from "../views/Post.vue"
import List from "../views/List.vue"
import Detail from "../views/Detail.vue"

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Main',
    component: Main
  },
  {
    path: '/post',
    name: 'Post',
    component: Post
  },
  {
    path: '/list',
    name: 'List',
    component: List
  },
  {
    path:'/detail/:id',
    name:'Detail',
    component:Detail
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
