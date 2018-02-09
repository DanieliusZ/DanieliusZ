import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Dashboard from '@/components/dashboard'
import Workforce from '@/components/workforce'
import Identity from '@/components/naming'
import AuthGuard from './auth-guard'
import adminGuard from './adminGuard'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
      beforeEnter: AuthGuard     
    },
    {
      path:'/workforce',
      name:'workforce',
      component:Workforce,
      beforeEnter: adminGuard
    },
    // {
    //   path:'/identify',
    //   name:'identity',
    //   component:Identity,
    //   beforeEnter:AuthGuard
    // }
  ], 
  mode:'history'
})
