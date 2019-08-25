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
              <v-toolbar-title>Players</v-toolbar-title>
              <v-divider
                class="mx-4"
                inset
                vertical
              ></v-divider>
              <v-spacer></v-spacer>
              <v-dialog v-model="dialog" max-width="500px">
                <template v-slot:activator="{ on }">
                  <v-btn color="primary" dark class="mb-2" v-on="on">New Player</v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" sm="6" md="6">
                          <v-text-field v-model="editedItem.first_name" label="First name"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-text-field v-model="editedItem.last_name" label="Last Name"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="12">
                          <v-radio-group v-model="editedItem.gender" :mandatory="false" label='Gender' row>
                            <v-radio label="Male" value="m"></v-radio>
                            <v-radio label="Female" value="f"></v-radio>
                          </v-radio-group>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                           <v-menu
                                  ref="menu"
                                  v-model="menu"
                                  :close-on-content-click="false"
                                  transition="scale-transition"
                                  offset-y
                                  full-width
                                  min-width="290px"
                                >
                                  <template v-slot:activator="{ on }">
                                    <v-text-field
                                      v-model="editedItem.birth_date"
                                      label="Birthday date"
                                      prepend-icon="mdi-calendar-range"
                                      readonly
                                      v-on="on"
                                    ></v-text-field>
                                  </template>
                                  <v-date-picker
                                    v-model="editedItem.birth_date"
                                    ref='picker'
                                    :max="new Date().toISOString().substr(0, 10)"
                                    min="1950-01-01"
                                    @change="saveDate"
                                  ></v-date-picker>
                                </v-menu>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-select
                            v-model="editedItem.team"
                            :items="teams"
                            label="Team"
                          ></v-select>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-text-field v-model="editedItem.shirt_number" label="Shirt number"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-select
                            v-model="editedItem.position"
                            :items="positions"
                            label="Postion"
                          ></v-select>
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
      menu: false,
      options:{
        itemsPerPage:10,
        page:1
      },
      showCurrentPage: true,
      itemsPerPageOptions:[10],
      teams: [],
      nameKeyteams: {},
      idKeyteams: {},
      totalItems: 0,
      headers: [
        {
          text: 'First Name',
          align: 'left',
          sortable: false,
          value: 'first_name',
        },
        { text: 'Last Name', value: 'last_name' },
        { text: 'Team', value: 'team' },
        { text: 'Shirt Number', value: 'shirt_number' },
        { text: 'Actions', value: 'action', sortable: false },
      ],
      positions: ['Goalkeeper', 'Full-Back', 'Wing-Back', 'Central Defender',
                  'Centre Back', 'Sweeper', 'Central Midfield', 'Wide Midfield', 
                  'Wide Winger', 'Striker Forward', 'Centre Forward','Centre Forward'],
      loading: true,
      items: [],
      editedIndex: -1,
      editedItem: {
        id: 0,
        first_name: '',
        last_name: '',
        team: '',
        shirt_number: 0,
        position: '',
        gender: 'm',
        birth_date: ''
      },
      defaultItem: {
         id: 0,
        first_name: '',
        last_name: '',
        team: '',
        shirt_number: 0,
        position: '',
        gender: 'm',
        birth_date: ''
      },
    }),

    computed: {

      formTitle () {
        return this.editedIndex === -1 ? 'New Player' : 'Edit Player'
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

      menu (val) {
        val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
        
      },

    },

    mounted () {
      this.initialize()
      this.readTeamName()
      this.readTeamNameWithID()
    },

    methods: {

      saveDate (date) {
        this.$refs.menu.save(date)
      },

      getTeamID(teamName){
        return this.nameKeyteams[teamName]
      },

      getTeamName(teamID){
        return this.idKeyteams[teamID]
      },

      readTeamNameWithID(){
        let params = {'params':{ 'limit' : 100, 'fields' : 'name,id'}}
        let endPoint = 'http://127.0.0.1:8000/api/teams/'
        axios.get(endPoint, params)
        .then(response =>{
           for (let index in response.data.results) {
             this.nameKeyteams[response.data.results[index]['name']] = response.data.results[index]['id']
             this.idKeyteams[response.data.results[index]['id']] = response.data.results[index]['name']
             }
        });
      },

      readTeamName(){
        let params = {'params':{ 'limit' : 100, 'fields' : 'name'}}
        let endPoint = 'http://127.0.0.1:8000/api/teams/'
        axios.get(endPoint, params)
        .then(response =>{
           for (let index in response.data.results) {
             this.teams.push(response.data.results[index]['name'])
             }
        });
      },

      initialize () {
        this.loading = true
        let params = {'params':{ 'limit' : this.options.itemsPerPage, 'offset' : (this.options.page - 1) * 10}}
        let endPoint = 'http://127.0.0.1:8000/api/players/'
        axios.get(endPoint, params)
        .then(response =>{
          response.data.results.forEach(player => {
              player.position = this.getFullPostion(player.position)
              player.team = this.getTeamName(player.team)
            });
          this.items = response.data.results
          this.totalItems = response.data.count
          this.loading = false
        });
      },

      deletePlayer(playerID){
        let config = this.authConfig();
        let endPoint = 'http://127.0.0.1:8000/api/players/' + playerID + '/';
        axios.delete(endPoint, config)
        .then(response => {
          if (response.id == playerID){
            this.initialize()
          }
          this.initialize()
        });
      },

      updatePlayer(player){
        player.position = this.getShortPostion(player.position)
        player.team = this.getTeamID(player.team)
        let config = this.authConfig()
        let endPoint = 'http://127.0.0.1:8000/api/players/' + player.id + '/'
        axios.put(endPoint, player, config)
        .then(response => {
          if (response.name == player.name){
            this.initialize()
          }
          this.initialize();
        });
      },

      createPlayer(player){
        player.position = this.getShortPostion(player.position)
        player.team = this.getTeamID(player.team)
        let config = this.authConfig()
        let endPoint = 'http://127.0.0.1:8000/api/players/'
        axios.post(endPoint, player, config)
        .then(response => {
          if (response.name == player.name){
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
        if(confirm('Are you sure you want to delete '+ item.first_name + ' ' + item.last_name +' Player ?')){
          this.deletePlayer(item.id)
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
          this.updatePlayer(this.editedItem)
        } else {
          this.createPlayer(this.editedItem)
        }
        this.close()
      },

      getShortPostion(position){
        const postions = {  'Goalkeeper': 'GK',
                            'Full-Back': 'FB',
                            'Wing-Back': 'WB',
                            'Central Defender': 'CD',
                            'Centre Back': 'CC',
                            'Sweeper': 'S',
                            'Central Midfield': 'CM',
                            'Wide Midfield': 'WM',
                            'Wide Winger': 'WW',
                            'Striker Forward': 'SF',
                            'Centre Forward': 'CF',
                            }
        return postions[position]
      },

      getFullPostion(position){
        const postions = {  'GK': 'Goalkeeper',
                            'FB': 'Full-Back',
                            'WB': 'Wing-Back',
                            'CD': 'Central Defender',
                            'CC': 'Centre Back',
                            'S': 'Sweeper',
                            'CM': 'Central Midfield',
                            'WM': 'Wide Midfield',
                            'WW': 'Wide Winger',
                            'SF': 'Striker Forward',
                            'CF': 'Centre Forward',
                            }
        return postions[position]
      }
    },
  }
</script>
