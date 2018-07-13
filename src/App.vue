<template>
  <v-app>
    <v-toolbar dark color="teal darken-4" v-if="userIsAuthenticated">
      <v-toolbar-title>Welcome {{user.email}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn flat v-if="userIsAuthenticated" to='/dashboard'>
            <v-icon left>dashboard</v-icon>
            Dashboard
        </v-btn>
        <!-- <v-btn flat v-if="userIsAuthenticated" to='/identify'>
          <v-icon left>face</v-icon>
          Name yourself
        </v-btn> -->
        <v-btn flat v-if="user.id==adminId" to='/workforce'>
          <v-icon left>supervisor_account</v-icon>
          Workers
        </v-btn>
        <v-btn flat v-if="userIsAuthenticated" @click="onLogout">
          <v-icon left>exit_to_app</v-icon>
          Logout
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <router-view/>
  </v-app>
</template>

<script>
  import {adminID} from './admin';
  export default {
    data(){
      return{
        adminId:adminID,
      }
    },
    computed:{
      user(){
        return this.$store.getters.user
      },
      userIsAuthenticated(){
        return this.$store.getters.user
      }
    },
    methods:{
      onLogout(){
        this.$store.dispatch('logout')
      }
    },
    watch:{
      user(value){
        if(value!==null&&value!==undefined){
          this.$router.push('/dashboard')
        }
        else this.$router.push('/')
    }
  },
  }
</script>
