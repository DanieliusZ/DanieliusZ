<template>
    <v-container>
        <v-layout row mb-2>
            <v-card style="width:100%">
                <v-list >
                    <v-list-tile v-for="(item, index) in workersInfo" :key="index" >
                        <v-list-tile-content >
                            <v-btn @click="identifyWorker(index, item['.key'])" outline active-class="pactive" :class="{ pactive: selectedWorkerArrN===index}">
                            {{item.name}}                                
                            </v-btn>
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list>                
            </v-card>

        </v-layout>
        <v-layout row>
            <v-flex md8 mr-2>
                <v-card>
                    <v-card-title>
                        <h3 pa-2>
                            Info of {{currentWorkerName}}
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
                    <td class="text-xs-right">{{ props.item.workstartedh }}:{{props.item.workstartedm | minutes}}</td>
                    <td class="text-xs-right">{{props.item.workendedh}}:{{props.item.workendedm | minutes}}</td>
                    <td class="text-xs-right">{{ props.item.break }}</td>
                    <td class="text-xs-right">{{ props.item.totalTime | toDigits}}</td>
                    <td class="text-xs-right">{{ props.item.saveTime | date}}</td>
                    </template>
                </v-data-table>                
            </v-flex>
            <v-flex md4>     
                    <v-card class="text-xs-center">
                        <h3>Selected month info</h3>
                        <v-layout row d-inline>
                            <v-flex>
                                <v-card-text>
                                    <h4>Total hours</h4>
                                </v-card-text>
                                <v-card-text v-model="monthWork">{{monthTotalWork | toDigits}}</v-card-text>
                            </v-flex>
                            <v-flex>
                                <v-card-text>
                                    <h4>Rate</h4>
                                </v-card-text>
                                <v-card-text>
                                    <input v-model="hourlyRate" class="text-xs-center" type="number"> 
                                </v-card-text>
                            </v-flex>
                            <v-flex>
                                <v-card-text>
                                    <h4>Earned</h4>
                                </v-card-text>
                                <v-card-text>
                                    {{earnedThisMonth}}£
                                </v-card-text>     
                            </v-flex>
                        </v-layout>   
                    </v-card>
                <v-card class="text-xs-center">
                </v-card>
                <v-divider ></v-divider>
                <v-card class="text-xs-center">
                    <v-card-text>
                        <h3>
                            Selected year information
                        </h3>
                    </v-card-text>
                    <v-layout row d-inline>
                    <v-flex>
                        <h4>Payments</h4>
                        <v-card-text>
                            Total: {{selectedYearPayments}}£
                        </v-card-text>
                    </v-flex>
                    <v-flex>
                        <h4>Total hours worked</h4>
                        <v-card-text>
                            {{selectedYearHours|toDigits}}
                        </v-card-text>
                    </v-flex>
                    <v-flex>
                        <h4>Total earned</h4>
                        <v-card-text>
                            {{selectedYearEarnings}}£
                        </v-card-text>
                    </v-flex>
                    </v-layout>
                </v-card>
                    <v-divider></v-divider>
                    <v-layout row>
                        <v-flex d-inline>
                            <v-card >
                                <v-card-text class="text-xs-center">
                                    <input v-model="monthlyPayment" class="text-xs-center" type="number">£
                                    <v-btn type="submit" @click="addPayment">Add Payment</v-btn>                                    
                                </v-card-text>                             
                            </v-card>  
                        </v-flex>                     
                    </v-layout>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import * as firebase from 'firebase'
import {db} from '../firebase'
export default {
    data(){
        return{
            workersInfo:{},
            currentWorkerName:'',
            menu:false,
            selectedMonth:null,
            selectedWorkerId:null,
            selectedWorkerArrN:null,
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
            monthWork:0,
            hourlyRate:6,
            monthlyPayment:0,
            year:new Date().getFullYear(),
            month:new Date().getMonth(),
            selectedYearHours:0,
            selectedYearPayments:0
        }
    },
    firebase: {
        workersInfo: {
            source:db.ref('/workers'),
            // asObject:true,
            cancelCallback(err) {
                console.error(err);
            }
        }
    },
    computed:{
        monthTotalWork(){
            let totalMinutes=[]
            if(this.selectedMonthInfo){
                this.selectedMonthInfo.forEach((element)=>{
                let tt=element.totalTime
                totalMinutes.push(tt)               
            })
            }
            return totalMinutes.reduce((a,b)=>a+b,0)
        },
        earnedThisMonth(){
            return this.monthTotalWork*this.hourlyRate/60
        },
        selectedYearEarnings(){
            return Math.round(this.selectedYearHours*this.hourlyRate/60*100)/100
        },
    },
    methods:{
        onMonthSelection(){
            this.menu=false
            let info
            if(this.selectedMonth){
                this.year=new Date(this.selectedMonth).getFullYear()
                this.month=new Date(this.selectedMonth).getMonth()
            }
            this.currentWorkerName=this.workersInfo[this.selectedWorkerArrN].name

            let data=this.workersInfo[this.selectedWorkerArrN][this.year][this.month]
            if(data){
                info=Object.values(data)
                info.sort((a,b)=>{
                return a.day-b.day
                })
                this.selectedMonthInfo=info   
            }
            else if(!data){
                this.selectedMonthInfo=[]
            }

            let paymentInfo=(this.workersInfo[this.selectedWorkerArrN][this.year].payments)
            if(paymentInfo){
                paymentInfo=Object.values(paymentInfo)
                let arr=[]
                paymentInfo.forEach(el=>{
                    arr.push(parseInt(el))
                })
                this.selectedYearPayments=arr.reduce((a,b)=>a+b,0)
            }else{
                this.selectedYearPayments=0
            }

            let hoursByMonth=[]
            let hoursData=this.workersInfo[this.selectedWorkerArrN][this.year]
            if(hoursData){
                hoursData=Object.values(hoursData)
                hoursData.forEach((element)=>{
                    element=Object.values(element)
                    element.forEach(el=>{
                        if(el.hasOwnProperty('totalTime'))
                        hoursByMonth.push(el.totalTime)
                    })                    

                })
                this.selectedYearHours=hoursByMonth.reduce((a,b)=>a+b,0)
            }else this.selectedYearHours=0


        },
        addPayment(){
            if(!this.selectedWorkerId){
                return
            }
            const newPayment={
                workerId:this.selectedWorkerId,
                amount:this.monthlyPayment,
                month:this.month,
                year:this.year
            }
            this.$store.dispatch('saveNewPayment', newPayment)
            this.monthlyPayment=0
            let paymentInfo=(this.workersInfo[this.selectedWorkerArrN][this.year].payments)
            if(paymentInfo){
                paymentInfo=Object.values(paymentInfo)
                let arr=[]
                paymentInfo.forEach(el=>{
                    arr.push(parseInt(el))
                })
                this.selectedYearPayments=arr.reduce((a,b)=>a+b,0)
            }
        },
        identifyWorker(v,d){
            this.selectedWorkerArrN=v
            this.selectedWorkerId=d
        }
    },
}
</script>

<style scoped>
    h4{
        width:100%;
    }
    input[type=number]::-webkit-inner-spin-button, 
    input[type=number]::-webkit-outer-spin-button { 
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    margin: 0; 
    }
    input{
    border:1px solid teal;
    border-radius:2px;
    width:3rem;
    }
    li{
        float:left;
    }
    .pactive{
        color:teal;
    }
</style>
