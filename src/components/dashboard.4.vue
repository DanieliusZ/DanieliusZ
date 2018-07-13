<template>
  <v-container>
      <v-layout row>
          <v-flex d-inline-flex>
              <v-layout row>
                  <v-card class="text-xs-center" style="width:100%">
                    <form @submit.prevent="onSaveInfo" class="my-3 pa-3">
                        <p class="text-xs-center">Work start</p>
                        <div d-inline-flex>
                            <input type="number" min=8 max=23 class="text-xs-center" v-model="sth" required> : <input type="number" class="text-xs-center" min=0 max=59 v-model="stm" required>
                        </div>
                        <p class="text-xs-center">Work end</p>
                        <div d-inline-flex>
                            <input type="number" min=8 max=23 class="text-xs-center" v-model="endh" required> : <input type="number" class="text-xs-center" min=0 max=59 v-model="endm" required>
                        </div>
                        <p class="text-xs-center">Break duration</p>
                        <input type="number" min=0 class="text-xs-center" v-model="breakdur" required>
                        <div>
                            <v-btn dark color="teal darken-4" type="submit">Save</v-btn>
                        </div>
                    </form>
                  </v-card>
              </v-layout>
              <v-date-picker class="picker" landscape color="teal darken-4" v-model="date" first-day-of-week=1 locale="lt-LT" autosave></v-date-picker>
          </v-flex>
      </v-layout>
      <v-layout row d-inline mt-2>
              <v-flex md6>
                  <v-card>
                      <v-card-title>
                        <h3 pa-2>
                            Current month information
                        </h3>
                      </v-card-title>
                  </v-card>
                <table class="text-xs-center">
                    <tr>
                        <th>
                            Day
                        </th>
                        <th>
                            Work started
                        </th>
                        <th>Work ended</th>
                        <th>Break duration</th>
                    </tr>
                    <tr v-for="item in currentMonthInfo" :key="item.id">
                        <td>{{item.day}}</td>
                        <td>{{item.workstartedh}}:{{item.workstartedm}}</td>
                        <td>{{item.workendedh}}:{{item.workendedm}}</td>
                        <td>{{item.break}}</td>
                    </tr>
                </table>
              </v-flex>
              <v-flex md6>
                  <v-card>
                      <v-card-title>
                        <h3 pa-2>
                            Previous month information
                        </h3>
                      </v-card-title>
                  </v-card>

                <!-- <v-layout row d-inline>
                    <v-select
                    :items="selectableYear"
                    label="Year"
                    v-model="pickedYear"
                    single-line
                    bottom
                    ></v-select>
                    <v-select
                    :items="selectableMonth"
                    label="Month"
                    v-model="pickedMonth"
                    single-line
                    bottom
                    ></v-select>
                    <v-btn dark color="teal darken-4">Retrieve data</v-btn>
                </v-layout> -->
      <v-menu
        lazy
        :close-on-content-click="false"
        v-model="menu"
        transition="scale-transition"
        offset-y
        full-width
        :nudge-right="40"
        max-width="290px"
        min-width="290px"
      >
        <v-text-field
          slot="activator"
          label="Select month you want to view"
          v-model="selectedMonth"
          prepend-icon="event"
          readonly
        ></v-text-field>
        <v-date-picker color="teal darken-4" type="month" v-model="selectedMonth" no-title scrollable actions>
          <template slot-scope="{ save, cancel }">
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn flat color="primary" @click="cancel">Cancel</v-btn>
              <v-btn flat color="primary" @click="save">OK</v-btn>
            </v-card-actions>
          </template>
        </v-date-picker>
      </v-menu>
                <v-data-table
                    :headers="headers"
                    :items="previousMonth"
                    hide-actions
                    class="elevation-1"
                    >
                    <template slot="items" slot-scope="props">
                    <td>{{ props.item.day }}</td>
                    <td class="text-xs-right">{{ props.item.workstartedh }}:{{props.item.workstartedm}}</td>
                    <td class="text-xs-right">{{props.item.workendedh}}:{{props.item.workendedm}}</td>
                    <td class="text-xs-right">{{ props.item.break }}</td>
                    </template>
                </v-data-table>
              </v-flex>
      </v-layout>
  </v-container>
</template>

<script>
import * as firebase from 'firebase'
export default {
    data(){
        return{
            date:new Date().toISOString(),
            sth:8,
            stm:0,
            endh:9,
            endm:0,
            breakdur:0,
            currentMonthInfo:null,
            headers: [
              {
                text: 'Day',
                align: 'left',
                sortable: false
              },
              { text: 'Work started', sortable: false},
              { text: 'Work ended', sortable: false},
              { text: 'Break duration', sortable: false}
            ],
            menu: false,
            // pickedYear: null,
            // pickedMonth:null,
            previousMonth:null,
            // selectableMonth:[{text:"January", value:0},{text:"February", value:1},{text:"March", value:2},{text:"April", value:3},],
            selectedMonth:null
            }
    },
    computed:{
        totalWork(){
            return (Number.parseInt(this.endh)*60+Number.parseInt(this.endm))-(Number.parseInt(this.sth)*60+Number.parseInt(this.stm)+Number.parseInt(this.breakdur))
            // let mins=totalmin%60
            // let hourinmins=totalmin-mins
            // return hours+' : '+mins
        },
        // selectableYear(){
        //     let currentYear=Number.parseInt(new Date().getFullYear())
        //     const selectionArr=[]
        //     for (let i=0; i<3; i++){
        //         selectionArr.push(Number.parseInt(currentYear-i))
        //     }
        //     return selectionArr
        // }
    },
    methods:{
        onSaveInfo(){
            const workInfo={
                workstartedh:Number.parseInt(this.sth),
                workstartedm:Number.parseInt(this.stm),
                workendedh:Number.parseInt(this.endh),
                workendedm:Number.parseInt(this.endm),
                break:Number.parseInt(this.breakdur),
                saveTime:new Date().toISOString(),
                year:new Date(this.date).getFullYear(),
                month:new Date(this.date).getMonth(),
                day:new Date(this.date).getDate(),
                totalTime:this.totalWork
                 
            }
            this.$store.dispatch('saveWorkTime', workInfo)
        }
    },
    created(){
        const year=new Date().getFullYear()
        const month=new Date().getMonth()
        const user = this.$store.getters.user
        firebase.database().ref('/workers/'+user.id+'/'+year+'/'+month).orderByChild("day").once('value')
            .then((data)=>{
                this.currentMonthInfo=data.val()
                this.previousMonth=Object.values(data.val())
            })
            .catch(error=>{
                console.log(error)
            })
     
    }
}
</script>

<style scoped>
p{
    margin:0;
}
input{
    border:1px solid black;
    width:3rem;
}
table{
    width:100%;
}
</style>
