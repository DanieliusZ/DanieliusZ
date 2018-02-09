<template>
  <v-container>
    <v-layout row v-if="error">
      <v-flex xs12 sm6 offset-sm3>
        <app-alert @dismissed="onDismissed" :text="error.message"></app-alert>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex sm6 offset-sm3>
        <v-card >
          <v-layout row>
            <h3 class="teal darken-4 text-xs-center">
              Please provide credentials
            </h3>
          </v-layout>
          <form @submit.prevent>
            <v-layout row>
              <v-flex>
                <v-text-field
                  name="email"
                  label="Mail"
                  id="email"
                  type="email"
                  required
                  v-model="email"
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex>
                <v-text-field
                  name="password"
                  label="Password"
                  id="password"
                  type="password"
                  required
                  v-model="password"
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex class="text-xs-center">
                <v-btn
                  dark
                  color="teal darken-4"
                  type="submit"
                  @click="onSignin"
                >Log In</v-btn>
                <v-btn
                  color="teal lighten-4"
                  type="submit"
                  @click="onSignup"
                >Sign Up</v-btn>          
              </v-flex>
            </v-layout>
          </form>
        </v-card >
      </v-flex>
    </v-layout>

  </v-container>
</template>


<script>
export default {
  data(){
    return{
      email:'',
      password:''
    }
  },
  created () {
    this.$store.dispatch('clearError')
  },
  computed: {
    user(){
      return this.$store.getters.user
    },
    error(){
      return this.$store.getters.error
    }
  },
  methods: {
    onSignup(){
      this.$store.dispatch('signUserUp',{email:this.email, password:this.password})
    },
    onSignin(){
      this.$store.dispatch('signUserIn',{email:this.email, password:this.password})
    },
    onDismissed (){
      console.log('Dismissed Alert')
      this.$store.dispatch('clearError')
    }
  }
}
</script>

<style scoped>
h3{
  color:white;
  width:100%;
  padding:1rem;
}
</style>
