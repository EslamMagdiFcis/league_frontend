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
                <v-toolbar-title>Login form</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                  v-model="username"
                    label="Login"
                    name="login"
                    type="text"
                  ></v-text-field>

                  <v-text-field
                  v-model="password"
                    label="Password"
                    name="password"
                    type="password"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn v-on:click='logIn' color="primary">Login</v-btn>
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
            username: '',
            password: ''
        }
        },
    methods:{
        logIn:function(){
          let endPoint = 'http://127.0.0.1:8000/api/token/';
          let data = {'username': this.username ,'password': this.password}
            axios.post(endPoint, data)
            .then(user_response => {
                // var user = localStorage.getItem('user');
                localStorage.setItem('user', JSON.stringify(user_response));
                this.$router.push({name:'teams'});
            });
        }
    }
  }
</script>