<template>
    <v-layout mt-3>
        <v-flex sm6 offset-sm3>
            <v-card>
                <v-card-title>Please select the name you will be recognised</v-card-title>
                <v-text-field
                    name="name"
                    label="Name"
                    id="name"
                    type="text"
                    required
                    v-model="name"
                ></v-text-field>
                <v-btn dark color="teal darken-4" type="submit" @click="onNameConfirm">Confirm</v-btn>
            </v-card>

        </v-flex>
    </v-layout>

</template>

<script>
export default {
  data(){
      return{
          name:null
      }
  },
  methods:{
      onNameConfirm(){
        const name={name:this.name}
        this.$store.dispatch('namingYourself', name)
        this.$router.push('/dashboard')
      }
  }
}
</script>
