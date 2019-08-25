<template>
  <v-app>
    <v-toolbar>
      <v-toolbar-title>League</v-toolbar-title>

      <div class="flex-grow-1"></div>

      <v-toolbar-items>
        <!-- <router-link to='/players' exact text>Players</router-link> -->
        
        <!-- <v-btn text>Trainers</v-btn> -->
        <!-- <v-btn text>Teams</v-btn> -->
        <!-- <v-btn text>Matches</v-btn> -->
      </v-toolbar-items>

      <template v-if="$vuetify.breakpoint.smAndUp">
        <router-link to='players' exact>
          <v-btn text>Players</v-btn>
        </router-link>
        <router-link to='trainers' exact>
          <v-btn text>Trainers</v-btn>
        </router-link>
        <router-link to='teams' exact>
          <v-btn text>Teams</v-btn>
        </router-link>
        <router-link to='matches' exact>
          <v-btn text>Matches</v-btn>
        </router-link>
        <router-link to='registration' exact>
          <v-btn text>
            <v-icon>mdi-account-plus</v-icon> join now
          </v-btn>
        </router-link>
        <router-link to='login' exact>
          <v-btn text>
            <v-icon>mdi-login</v-icon> login
          </v-btn>
        </router-link>

        <router-link to='logout' exact>
          <v-btn text>
              <v-icon>mdi-logout</v-icon> logout
          </v-btn>
        </router-link>
        <v-btn icon>
        
        </v-btn>
      </template>
    </v-toolbar>
    <router-view></router-view>
  </v-app>
</template>

<style scoped>
  a {  text-decoration: none;}
</style>
<script>

export default {
  name: 'App',
  components: {
  
  },
  data: () => ({

  }),
};
</script>
