<template>
  <v-app>
  </v-app>
</template>

<script>
  export default {
    data(){
        return {
        }
    },
    
    created() {
      this.logOut()  
    },
    
    methods:{
        logOut(){
          localStorage.removeItem('user');
          this.$router.push({name:'login'});
        },
    }
  }
</script>