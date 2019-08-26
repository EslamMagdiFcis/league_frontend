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
              <v-toolbar-title>Matches</v-toolbar-title>
              <v-divider
                class="mx-4"
                inset
                vertical
              ></v-divider>
              <v-spacer></v-spacer>
              <v-dialog v-model="dialog" max-width="500px">
                <template v-slot:activator="{ on }">
                  <v-btn color="primary" dark class="mb-2" v-on="on">New Match</v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" sm="6" md="6">
                          <v-select
                            v-model="editedItem.teamInfo.team"
                            :items="teams"
                            label="Team"
                          ></v-select>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-select
                            v-model="editedItem.guestTeamInfo.team"
                            :items="teams"
                            label="Guest Team"
                          ></v-select>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-text-field v-model="editedItem.teamInfo.possession" label="Possession"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-text-field v-model="editedItem.guestTeamInfo.possession" label="Guest Possession"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-text-field v-model="editedItem.teamInfo.shots" label="Shots"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-text-field v-model="editedItem.guestTeamInfo.shots" label="Guest Shots"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-text-field v-model="editedItem.teamInfo.shots_on_target" label="Shots on target"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-text-field v-model="editedItem.guestTeamInfo.shots_on_target" label="Guest Shots on target"></v-text-field>
                        </v-col>
                         <v-col cols="12" sm="6" md="6">
                          <v-text-field v-model="editedItem.teamInfo.passes" label="Passes"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-text-field v-model="editedItem.guestTeamInfo.passes" label="Guest Passes"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-text-field v-model="editedItem.teamInfo.pass_accuracy" label="Pass Accuracy"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-text-field v-model="editedItem.guestTeamInfo.pass_accuracy" label="Guest Pass Accuracy"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-text-field v-model="editedItem.teamInfo.fouls" label="Fouls"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-text-field v-model="editedItem.guestTeamInfo.fouls" label="Guest Fouls"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-text-field v-model="editedItem.teamInfo.yellow_card" label="Yellow Card"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-text-field v-model="editedItem.guestTeamInfo.yellow_card" label="Guest Yellow Card"></v-text-field>
                        </v-col>
                        
                        <v-col cols="12" sm="6" md="6">
                          <v-text-field v-model="editedItem.teamInfo.red_card" label="Red Card"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-text-field v-model="editedItem.guestTeamInfo.red_card" label="Guest Red Card"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-text-field v-model="editedItem.teamInfo.corners" label="Corners"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-text-field v-model="editedItem.guestTeamInfo.corners" label="Guest Corners"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-text-field v-model="editedItem.teamInfo.offsides" label="Offsides"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-text-field v-model="editedItem.guestTeamInfo.offsides" label="Guest Offsides"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-text-field v-model="editedItem.teamInfo.goals" label="Goals"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-text-field v-model="editedItem.guestTeamInfo.goals" label="Guest Goals"></v-text-field>
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
                                      v-model="editedItem.date"
                                      label="Match Date"
                                      prepend-icon="mdi-calendar-range"
                                      readonly
                                      v-on="on"
                                    ></v-text-field>
                                  </template>
                                  <v-date-picker
                                    v-model="editedItem.date"
                                    :max="new Date().toISOString().substr(0, 10)"
                                    min="1950-01-01"
                                    @change="saveDate"
                                  ></v-date-picker>
                                </v-menu>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                           <v-menu
                                  ref="menu1"
                                  v-model="menu1"
                                  :close-on-content-click="false"
                                  transition="scale-transition"
                                  offset-y
                                  full-width
                                  min-width="290px"
                                >
                                  <template v-slot:activator="{ on }">
                                    <v-text-field
                                      v-model="editedItem.time"
                                      label="Match Time"
                                      prepend-icon="mdi-calendar-range"
                                      readonly
                                      v-on="on"
                                    ></v-text-field>
                                  </template>
                                  <v-time-picker
                                    v-model="editedItem.time"
                                    @change="saveTime"
                                  ></v-time-picker>
                                </v-menu>
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
      menu1: false,
      options:{
        itemsPerPage:10,
        page:1
      },
      showCurrentPage: true,
      itemsPerPageOptions:[10],
      teams: [],
      nameKeyTeam: {},
      idKeyTeam: {},
      totalItems: 0,
      headers: [
        {
          text: 'Team',
          align: 'left',
          sortable: false,
          value: 'teamInfo.team',
        },
        { text: 'Goals', value: 'teamInfo.goals' },
        { text: 'Guest Team', value: 'guestTeamInfo.team' },
        { text: 'Goals', value: 'guestTeamInfo.goals' },
        { text: 'Date', value: 'date' },
        { text: 'Time', value: 'time' },
        { text: 'Actions', value: 'action', sortable: false },
      ],
      loading: true,
      items: [],
      editedIndex: -1,
      editedItem: {
        id: 0,
        team: 0,
        teamInfo: {
          team: 0,
          possession: 0,
          shots: 0,
          shots_on_target: 0,
          passes: 0,
          pass_accuracy: 0,
          fouls: 0,
          yellow_card: 0,
          red_card: 0,
          corners: 0,
          offsides: 0,
          goals: 0,
          id: 0
        },
        guest_team: 0,
        guestTeamInfo: {
          team: 0,
          possession: 0,
          shots: 0,
          shots_on_target: 0,
          passes: 0,
          pass_accuracy: 0,
          fouls: 0,
          yellow_card: 0,
          red_card: 0,
          corners: 0,
          offsides: 0,
          goals: 0,
          id: 0
        },
        date: '',
        time: ''
      },
      idKeyTeamsStats: {},
      defaultItem: {
         id: 0,
        team: 0,
        teamInfo: {
          team: 0,
          possession: 0,
          shots: 0,
          shots_on_target: 0,
          passes: 0,
          pass_accuracy: 0,
          fouls: 0,
          yellow_card: 0,
          red_card: 0,
          corners: 0,
          offsides: 0,
          goals: 0,
          id: 0
        },
        guest_team: 0,
        guestTeamInfo: {
          team: 0,
          possession: 0,
          shots: 0,
          shots_on_target: 0,
          passes: 0,
          pass_accuracy: 0,
          fouls: 0,
          yellow_card: 0,
          red_card: 0,
          corners: 0,
          offsides: 0,
          goals: 0,
          id: 0
        },
        date: '',
        time: ''
      },
    }),

    computed: {

      formTitle () {
        return this.editedIndex === -1 ? 'New Match' : 'Edit Match'
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

    mounted() {
      this.initialize()
      this.readTeamNameWithID()
      this.readTeamStats()
      this.readTeamName()
    },

    methods: {

      saveDate (date) {
        this.$refs.menu.save(date)
      },

      saveTime (time) {
        this.$refs.menu1.save(time)
      },

      getTeamID(teamName){
        return this.nameKeyTeam[teamName]
      },

      getTeamName(teamID){
        return this.idKeyTeam[teamID]
      },

      getTeamStatsById(teamStatsID){
        return this.idKeyTeamsStats[teamStatsID]
      },

      readTeamNameWithID(){
        let params = {'params':{ 'limit' : 100, 'fields' : 'name,id'}}
        let endPoint = 'http://127.0.0.1:8000/api/teams/'
        axios.get(endPoint, params)
        .then(response =>{
           for (let index in response.data.results) {
             this.nameKeyTeam[response.data.results[index]['name']] = response.data.results[index]['id']
             this.idKeyTeam[response.data.results[index]['id']] = response.data.results[index]['name']
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
        let endPoint = 'http://127.0.0.1:8000/api/matches/'
        axios.get(endPoint, params)
        .then(response =>{
          this.items = response.data.results
          this.totalItems = response.data.count
          for(let index in response.data.results){
            let teamStatsID = this.items[index].team
            this.items[index].teamInfo = this.getTeamStatsById(teamStatsID)
            teamStatsID = this.items[index].guest_team
            this.items[index].guestTeamInfo = this.getTeamStatsById(teamStatsID)
            this.items[index].teamInfo.team = this.getTeamName(this.items[index].teamInfo.team)
            this.items[index].guestTeamInfo.team = this.getTeamName(this.items[index].guestTeamInfo.team)
            }
          this.loading = false
        });
      },

      readTeamStats(){
        let params = {'params':{ 'limit' : 100}}
          let endpoint = 'http://127.0.0.1:8000/api/team-stats/'
            axios.get(endpoint, params)
            .then(response => {
              // let tmp  = response.data.results
              // this.items[index].teamInfo.team = this.getTeamName(this.items[index].teamInfo.team);
              for (let index in response.data.results) {
             this.idKeyTeamsStats[response.data.results[index]['id']] = response.data.results[index]
             }
            }); 
        },

      deleteMatch(matchID){
        let config = this.authConfig();
        let endPoint = 'http://127.0.0.1:8000/api/matches/' + matchID + '/';
        axios.delete(endPoint, config)
        .then(response => {
          if (response.id == matchID){
            this.initialize()
          }
          this.initialize()
        });
      },

      updateMatch(match){
        let config = this.authConfig()
        const okState = 200
        // config['params'] = {'fields': 'id'}
        match.teamInfo.team = this.getTeamID(match.teamInfo.team)
        match.guestTeamInfo.team = this.getTeamID(match.guestTeamInfo.team)

        let endPoint = 'http://127.0.0.1:8000/api/team-stats/' + match.teamInfo.id + '/'
        axios.put(endPoint, match.teamInfo, config)
        .then(response => {
          if(response.status == okState){
            endPoint = 'http://127.0.0.1:8000/api/team-stats/' + match.guestTeamInfo.id + '/'
            axios.put(endPoint, match.guestTeamInfo, config)
            .then(response => {
              if(response.status == okState){
                endPoint = 'http://127.0.0.1:8000/api/matches/' + match.id + '/'
                axios.put(endPoint, match, config)
                .then(response => {
                  if (response.status == okState){
                    this.initialize()
                  }
                });
              }
            });
          }
        });
      },

      createMatch(match){
        let config = this.authConfig()
        const createdState = 201
        // config['params'] = {'fields': 'id'}
        match.teamInfo.team = this.getTeamID(match.teamInfo.team)
        match.guestTeamInfo.team = this.getTeamID(match.guestTeamInfo.team)

        let endPoint = 'http://127.0.0.1:8000/api/team-stats/'
        axios.post(endPoint, match.teamInfo, config)
        .then(response => {
          if(response.status == createdState){
            match.teamInfo.id = response.data.id
            match.team = response.data.id
            axios.post(endPoint, match.guestTeamInfo, config)
            .then(response => {
              if(response.status == createdState){
                match.guestTeamInfo.id = response.data.id
                match.guest_team = response.data.id
                endPoint = 'http://127.0.0.1:8000/api/matches/'
                axios.post(endPoint, match, config)
                .then(response => {
                  if (response.status == createdState){
                    this.initialize()
                  }
                });
              }
            });
          }
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
        if(confirm('Are you sure you want to delete '+ item.teamInfo.team + ' vs ' + item.guestTeamInfo.team +' match ?')){
          this.deleteMatch(item.id)
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
          this.updateMatch(this.editedItem)
        } else {
          this.createMatch(this.editedItem)
        }
        this.close()
      },
    },
  }
</script>
