<template>
  <v-container>
    <v-layout row v-if="error">
      <v-flex>
        <app-alert @dismissed="onDismissed" :text="error.message"></app-alert>
      </v-flex>
    </v-layout>
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
                <v-data-table
                    :headers="headers"
                    :items="currentMonthInfo"
                    hide-actions
                    class="elevation-1"
                    >
                    <template slot="items" slot-scope="props">
                    <td>{{ props.item.day }}</td>
                    <td class="text-xs-right">{{ props.item.workstartedh }}:{{props.item.workstartedm | minutes}}</td>
                    <td class="text-xs-right">{{props.item.workendedh}}:{{props.item.workendedm | minutes}}</td>
                    <td class="text-xs-right">{{ props.item.break }}</td>
                    </template>
                </v-data-table>
                <v-card>
                    <v-card-text>
                        <h3>
                            Total work hours this month: {{currentMonthTotalHours | toDigits }}
                        </h3>
                        <h3>
                            Total earned:{{currentMonthTotalEarned}}£
                        </h3>
                    </v-card-text>
                </v-card>
              </v-flex>
              <v-flex md6>
                  <v-card>
                      <v-card-title>
                        <h3 pa-2>
                            Previous month information
                        </h3>
                      </v-card-title>
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
                                    <v-btn flat color="primary" @click="onMonthSelection">OK</v-btn>
                                    </v-card-actions>
                                </template>
                                </v-date-picker>
                            </v-menu>
                  </v-card>
                <v-data-table
                    :headers="headers"
                    :items="previousMonthInfo"
                    hide-actions
                    class="elevation-1"
                    >
                    <template slot="items" slot-scope="props">
                    <td>{{ props.item.day }}</td>
                    <td class="text-xs-right">{{ props.item.workstartedh }}:{{props.item.workstartedm | minutes}}</td>
                    <td class="text-xs-right">{{props.item.workendedh}}:{{props.item.workendedm | minutes}}</td>
                    <td class="text-xs-right">{{ props.item.break }}</td>
                    </template>
                </v-data-table>
                <v-card>
                    <v-card-text>
                        <h3>
                            Total work selected month: {{previousMonthTotalHours | toDigits }}
                        </h3>
                        <!-- rate:{{previousMonthRate}} -->
                        <h3>
                            Total earned:{{previousMonthTotalEarned}}
                        </h3>
                    </v-card-text>
                </v-card>
              </v-flex>
      </v-layout>
  </v-container>
</template>

<script>
import {db} from '../firebase'
export default {
    data(){
        return{
            date:new Date().toISOString(),
            year:new Date().getFullYear(),
            month:new Date().getMonth(),
            sth:8,
            stm:0,
            endh:9,
            endm:0,
            breakdur:0,
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
            previousMonth:null,
            yearOfPreviousMonth:null,
            selectedMonth:null,
            userId:this.$store.getters.user.id,          
            darbInfo:{},
            }
    },
    firebase: {
        darbInfo: {
            source:db.ref('/workers'),
            asObject:true,
            cancelCallback(err) {
                console.error(err);
            }
        }
    },
    computed:{
        totalWork(){
            return (Number.parseInt(this.endh)*60+Number.parseInt(this.endm))-(Number.parseInt(this.sth)*60+Number.parseInt(this.stm)+Number.parseInt(this.breakdur))
        },
        currentMonthInfo(){
            if(!this.darbInfo){
                return []
            }
            if(!this.darbInfo[this.userId]) {
                return []
            }

            let exists=this.darbInfo[this.userId][this.year]
            if(exists){
                let data=this.darbInfo[this.userId][this.year][this.month]
                    if(data){
                        let cmdata=Object.values(data).sort(function(a,b){
                            return a.day-b.day
                        })
                        return cmdata
                    } else return []
            }
            else return []
        },
        previousMonthInfo(){
            if(!this.darbInfo){
                return []
            }
            if(!this.darbInfo[this.userId]) {
                return []
            }

            let exists=this.darbInfo[this.userId][this.yearOfPreviousMonth]
            if (exists) {
                let data=this.darbInfo[this.userId][this.yearOfPreviousMonth][this.previousMonth]
                    if(data){
                        let pmdata=Object.values(data).sort(function(a,b){
                            return a.day-b.day
                        })
                        return pmdata                    
                    }else return []
            }
            else return []
        },
        currentMonthTotalHours(){
            if(!this.darbInfo){
                return 0
            }
            if(!this.darbInfo[this.userId]) {
                return 0
            }
            let exists=this.darbInfo[this.userId][this.year]
            if(exists){
                let data=this.darbInfo[this.userId][this.year][this.month]
                    if(data){
                        let total=[]
                        let cmdata=Object.values(data)
                        cmdata.forEach(element => {
                            total.push(element.totalTime)
                        });
                        total=total.reduce((a,b)=>a+b,0)
                        return total
                    } else return 0
            }
            else return 0
        },
        previousMonthTotalHours(){
            if(!this.darbInfo){
                return 0
            }
            if(!this.darbInfo[this.userId]) {
                return 0
            }
            let exists=this.darbInfo[this.userId][this.yearOfPreviousMonth]
            if (exists) {
                let data=this.darbInfo[this.userId][this.yearOfPreviousMonth][this.previousMonth]
                    if(data){
                        let total=[]
                        let cmdata=Object.values(data)
                        cmdata.forEach(element => {
                            total.push(element.totalTime)
                        });
                        total=total.reduce((a,b)=>a+b,0)
                        return total
                    } else return 0
            }
            else return 0
        },
        currentMonthRate(){
            if(!this.darbInfo){
                return 0
            }
            if(!this.darbInfo[this.userId]) {
                return 0
            }
            if(!this.darbInfo[this.userId][this.year]){
                return 0
            }
            let exists=this.darbInfo[this.userId][this.year]['rates']
            if(exists){
                let m=this.month
                while(m>=0){
                    let data=this.darbInfo[this.userId][this.yearOfPreviousMonth]['rates'][m]
                    if(data){
                        return data
                    } m--
                }
            }
            else return 0
        },          
        previousMonthRate(){
            if(!this.darbInfo){
                return 0
            }
            if(!this.darbInfo[this.userId]) {
                return 0
            }
            if(!this.darbInfo[this.userId][this.yearOfPreviousMonth]){
                return 0
            }
            let exists=this.darbInfo[this.userId][this.yearOfPreviousMonth]['rates']
            if(exists){
                let m=this.previousMonth
                while(m>=0){
                    let data=this.darbInfo[this.userId][this.yearOfPreviousMonth]['rates'][m]
                    if(data){
                        return data
                    } m--
                }
            }
            else return 0
        },
        currentMonthTotalEarned(){
            if(!this.currentMonthTotalHours||!this.currentMonthRate){
                return 0
            }
            return this.currentMonthTotalHours*this.currentMonthRate/60
        },
        previousMonthTotalEarned(){
            if(!this.previousMonthTotalHours||!this.previousMonthRate){
                return 0
            }
            return this.previousMonthTotalHours*this.previousMonthRate/60
        },
        error(){
            return this.$store.getters.error
        }
    },
    methods:{
        onSaveInfo(){
            console.log(new Date(this.date).getDate())
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
            if(this.totalWork>0) {
                this.$store.dispatch('saveWorkTime', workInfo)
            } else {
                this.$store.dispatch('setError', {message:'Are you sure you entered correct hours?'})
            }
            
        },
        onMonthSelection(){
            this.menu=false
            this.yearOfPreviousMonth=new Date(this.selectedMonth).getFullYear()
            this.previousMonth=new Date(this.selectedMonth).getMonth()
            // let data=this.darbInfo[this.userId][this.yearOfPreviousMonth][this.previousMonth]
            //     if(data){
            //         this.previousMonthInfo=Object.values(data).sort(function(a,b){
            //             return a.day-b.day
            //         })
               
            //     }else this.previousMonthInfo=[]
        },
        onDismissed (){
            this.$store.dispatch('clearError')
        }
    },
    created(){      
        if(this.month>0){
            this.previousMonth=this.month-1
        }else {this.previousMonth=11}

        if(this.month>0){
            this.yearOfPreviousMonth=this.year
        } else {this.yearOfPreviousMonth=this.year-1}

        this.$store.dispatch('clearError')
    }
}
</script>

<style scoped>
p{
    margin:0;
}
input{
    border:1px solid teal;
    border-radius:2px;
    width:3rem;
}
table{
    width:100%;
}
</style>
