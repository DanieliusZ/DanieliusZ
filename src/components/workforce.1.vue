<template>
    <v-container>
        <v-layout row>
            <v-flex md2>
                <v-list>
                    <v-list-tile v-for="(item, index) in workersInfo" :key="item.id">
                        <v-list-tile-content>
                            <v-btn @click="selectedWorkerId=index" style="width:100%">
                            {{item.email}}                                
                            </v-btn>
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list>
            </v-flex>
            <v-flex md7>
                <v-card>
                    <v-card-title>
                        <h3 pa-2>
                            Worker info
                        </h3>
                    </v-card-title>
                        <!-- <v-select
                            :items="workersList"
                            v-model="selectedWorker"
                            label="Select"
                            single-line
                            bottom
                        ></v-select> -->
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
                                    <v-btn flat color="primary" @click="menu=false">Cancel</v-btn>
                                    <v-btn flat color="primary" @click="onMonthSelection">OK</v-btn>
                                    </v-card-actions>
                                </template>
                                </v-date-picker>
                            </v-menu>
                </v-card>
                <v-data-table
                    :headers="headers"
                    :items="selectedMonthInfo"
                    hide-actions
                    class="elevation-1"
                    >
                    <template slot="items" slot-scope="props">
                    <td>{{ props.item.day }}</td>
                    <td class="text-xs-right">{{ props.item.workstartedh }}:{{props.item.workstartedm}}</td>
                    <td class="text-xs-right">{{props.item.workendedh}}:{{props.item.workendedm}}</td>
                    <td class="text-xs-right">{{ props.item.break }}</td>
                    <td class="text-xs-right">{{ props.item.totalTime }}</td>
                    <td class="text-xs-right">{{ props.item.saveTime |date}}</td>
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
            workersInfo:null,
            menu:false,
            selectedMonth:null,
            selectedWorkerId:null,
            selectedMonthInfo:[],
            headers: [
              {
                text: 'Day',
                align: 'left',
                sortable: false
              },
              { text: 'Work started', sortable: false},
              { text: 'Work ended', sortable: false},
              { text: 'Break duration', sortable: false},
              { text: 'Total work time', sortable: false},
              { text: 'Last Modified', sortable: false}

            ],
        }
    },
    // computed:{
    //     workersList(){
    //         let list=[]
    //         for(let i=0; i<this.workersInfo.length; i++){
    //             list.push(this.workersInfo[i].email)
    //         }
    //         return list
    //     }
    // },
    methods:{
        onMonthSelection(){
            this.menu=false
            let year, month, info
            if(this.selectedMonth){
                year=new Date(this.selectedMonth).getFullYear()
                month=new Date(this.selectedMonth).getMonth()
            }
            else{
                year=new Date().getFullYear()
                month=new Date().getMonth()
            }
            let user=this.selectedWorkerId
            // let info=Object.values(this.workersInfo[user][year][month])
            console.log(typeof this.workersInfo[user][year][month])
                if(typeof this.workersInfo[user][year][month]==undefined){
                    this.selectedMonthInfo=null
                }
                else{
                    info=Object.values(this.workersInfo[user][year][month])
                    console.log('shouldnt get it')
                    info.sort((a,b)=>{
                        return a.day-b.day
                    })
                    this.selectedMonthInfo=info
                }
            // firebase.database().ref('/workers/'+userid+'/'+year+'/'+month).orderByChild('day').once('value')
            // .then((data)=>{
            //     if(!data.val()){
            //         this.selectedMonthInfo=[]
            //     }
            //     else this.selectedMonthInfo=Object.values(data.val())
            // })
            // .catch(error=>{
            //     console.log(error)
            // })  
        },
        // selectWorker(){
        //     return
        //     this.selectedWorkerId=item.id
        //     console.log(this.selectedWorkerId)
        // }
    },
    created(){
        firebase.database().ref('/workers').once('value')
            .then(data=>{
                this.workersInfo=data.val()
                console.log(this.workersInfo)
            })
            .catch(error=>{
                console.log(error)
            })
    }
}
</script>

