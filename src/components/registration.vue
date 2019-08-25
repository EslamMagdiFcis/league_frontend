<template>
  <v-app>
    <v-content>
      <v-container
        fluid
        fill-height
      >
        <v-layout
          align-center
          justify-center
        >
          <v-flex
            xs12
            sm8
            md4
          >
            <v-card class="elevation-12">
              <v-toolbar
                color="primary"
                dark
                flat
              >
                <v-toolbar-title>Registration Form</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                  v-model="user.username"
                    label="Usename"
                    name="Usename"
                    type="text"
                  ></v-text-field>

                  <v-text-field
                  v-model="user.email"
                    label="Email address"
                    name="email"
                    type="email"
                  ></v-text-field>

                  <v-text-field
                  v-model="user.password"
                    label="Password"
                    name="password"
                    type="password"
                  ></v-text-field>

                  <v-text-field
                  v-model="user.password2"
                    label="Confirm Password"
                    name="password"
                    type="password"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn v-on:click='register' color="primary">Join</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import axios from 'axios';

  export default {
    data(){
        return {
            user:{
              username: '',
              email: '',
              password: '',
              password2: '',
            }
        }
    },
    
    created() { 
    },
    
    methods:{
        register(){
          let endPoint = 'http://127.0.0.1:8000/api/users/register/';
          // let data = {'username': this.username ,'password': this.password}
            axios.post(endPoint, this.user)
            .then(user_response => {
                // var user = localStorage.getItem('user');
                // localStorage.setItem('user', JSON.stringify(user_response));
                this.$router.push({name:'teams'});
            });
        },
    }
  }
</script>