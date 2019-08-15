<template>
  <v-app>
    <v-content>
      <v-container>
        <v-data-table
          :headers="headers"
          :items="items"
          :options.sync="options"
          :server-items-length="totalItems"
          :loading="loading"
          :footer-props="{showCurrentPage ,itemsPerPageOptions}"
          sort-by="rank"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar flat color="white">
              <v-toolbar-title>Teams</v-toolbar-title>
              <v-divider
                class="mx-4"
                inset
                vertical
              ></v-divider>
              <v-spacer></v-spacer>
              <v-dialog v-model="dialog" max-width="500px">
                <template v-slot:activator="{ on }">
                  <v-btn color="primary" dark class="mb-2" v-on="on">New Team</v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field v-model="editedItem.name" label="Team name"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field v-model="editedItem.rank" label="Rank"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field v-model="editedItem.points" label="Points"></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                    <v-btn color="blue darken-1" text @click="save">Save</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          <template v-slot:item.action="{ item }">
            <v-icon
              class="mr-2"
              color='green'
              @click="editItem(item)"
            >
              mdi-pencil
            </v-icon>
            <v-icon
              color='red'
              @click="deleteItem(item)"
            >
              mdi-delete
            </v-icon>
          </template>
          <template v-slot:no-data>
            <v-btn color="primary" @click="initialize">Reset</v-btn>
          </template>
        </v-data-table>
        <h1>{{test}}</h1>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import axios from 'axios';
  export default {
    data: () => ({
      dialog: false,
      options:{
        itemsPerPage:10,
        page:1
      },
      showCurrentPage: true,
      itemsPerPageOptions:[10],         
      totalItems: 0,
      headers: [
        {
          text: 'Name',
          align: 'left',
          sortable: false,
          value: 'name',
        },
        { text: 'Rank', value: 'rank' },
        { text: 'Points', value: 'points' },
        { text: 'Actions', value: 'action', sortable: false },
      ],
      loading: true,
      items: [],
      editedIndex: -1,
      editedItem: {
        id: 0,
        name: '',
        rank: 0,
        points: 0,
      },
      defaultItem: {
        id:0 ,
        name: '',
        rank: 0,
        points: 0,
      },
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Team' : 'Edit Team'
      },
      test () {
        this.initialize()
        return null
      },
      
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
    },

    created () {
      this.initialize()
    },

    methods: {
      initialize () {
        this.loading = true
        let params = {'params':{ 'limit' : this.options.itemsPerPage, 'offset' : (this.options.page-1)*10}}
        let endPoint = 'http://127.0.0.1:8000/api/teams/'
        axios.get(endPoint, params)
        .then(response =>{
          this.items = response.data.results
          this.totalItems = response.data.count
          this.loading = false
        });
      },

      deleteTeam(teamID){
        let config = this.authConfig();
        let endPoint = 'http://127.0.0.1:8000/api/teams/' + teamID + '/';
        axios.delete(endPoint, config)
        .then(response => {
          if (response.id == teamID){
            this.initialize()
          }
          this.initialize()
        });
      },

      updateTeam(team){
        let config = this.authConfig()
        let endPoint = 'http://127.0.0.1:8000/api/teams/' + team.id + '/'
        axios.put(endPoint, team, config)
        .then(response => {
          if (response.name == team.name){
            this.initialize()
          }
          this.initialize();
        });
      },

      createTeam(team){
        let config = this.authConfig()
        let endPoint = 'http://127.0.0.1:8000/api/teams/create/'
        axios.post(endPoint, team, config)
        .then(response => {
          if (response.name == team.name){
            this.initialize()
          }
          this.initialize()
        });
      },

      authConfig(){
        let user = JSON.parse(localStorage.getItem('user'));
        let accessToken = 'Bearer ' + user.data.access;
        let config = {'headers': {'Authorization':  accessToken}}
        return config;
      },

      editItem (item) {
        this.editedIndex = this.items.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        if(confirm('Are you sure you want to delete '+ item.name +' Team ?')){
          this.deleteTeam(item.id)
        }
      },

      close () {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },

      save () {
        if (this.editedIndex > -1) {
          this.updateTeam(this.editedItem)
        } else {
          this.createTeam(this.editedItem)
        }
        this.close()
      },
    },
  }
</script>
