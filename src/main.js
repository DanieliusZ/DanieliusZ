// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.css'

import App from './App'
import router from './router'
import * as Firebase from 'firebase'
import './firebase'
import {store} from './store/index'
import DateFilter from './filters/date'
import MinutesFilter from './filters/minutes'
import TimeDigitalFilter from './filters/to-time'
import MonthsFilter from './filters/months'
import DecimelFilter from './filters/toFixed'
import AlertCmp from './components/Shared/Alert.vue'
import VueFire from 'vuefire'

Vue.use(VueFire)
Vue.use(Vuetify)

Vue.config.productionTip = false
Vue.filter('date', DateFilter)
Vue.filter('minutes', MinutesFilter)
Vue.filter('toDigits', TimeDigitalFilter)
Vue.filter('toMonths', MonthsFilter)
Vue.filter('toDecim', DecimelFilter)
Vue.component('app-alert', AlertCmp)

/* eslint-disable no-new */

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
  created (){
    Firebase.auth().onAuthStateChanged((user)=>{
      if(user){
        this.$store.dispatch('autoSignIn', user)
      }
    })
  }
})
