<template>
    <v-container v-if="userId===adminId">
        <v-layout row v-if="error">
            <v-flex>
                <app-alert @dismissed="onDismissed" :text="error.message"></app-alert>
            </v-flex>
        </v-layout>
        <v-layout row mb-2>
            <v-card style="width:100%">
                <v-layout row d-inline>
                    <v-list >
                        <v-list-tile v-for="(item, index) in workersInfo" :key="index" >
                            <v-list-tile-content >
                                <v-btn @click="identifyWorker(index, item['.key'])" outline active-class="pactive" :class="{ pactive: selectedWorkerArrN===index}">
                                {{item.name}}
                                </v-btn>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list>
                    <v-flex class="text-xs-right aligned">
                        <input v-model="renamer" class="text-xs-left forname" type="text">
                        <v-btn type="submit" @click="rename">Change Name</v-btn>
                    </v-flex>
                </v-layout>
            </v-card>
        </v-layout>
        <v-layout row>
            <v-flex md8 mr-2>
                <v-card>
                    <v-card-title>
                        <h3 pa-2 v-if="currentWorkerName">
                            Info of {{currentWorkerName}} for {{month|toMonths}} {{year}}
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
                                label="Select another month"
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
                    <v-card-text class="text-xs-center">
                        <h3>Set hourly rate for selected worker</h3>
                    </v-card-text>
                        <v-menu
                        lazy
                        :close-on-content-click="false"
                        v-model="hourlyRateMenu"
                        transition="scale-transition"
                        offset-y
                        full-width
                        :nudge-right="40"
                        max-width="290px"
                        min-width="290px"
                        >
                            <v-text-field
                            slot="activator"
                            label="Select which month rate you want to set"
                            v-model="monthOfSelectedRate"
                            prepend-icon="event"
                            readonly
                            ></v-text-field>
                            <v-date-picker color="teal darken-4" type="month" v-model="monthOfSelectedRate" no-title scrollable actions autosave>
                                <template slot-scope="{ cancel }">
                                    <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn flat color="primary" @click="cancel">Cancel</v-btn>
                                    </v-card-actions>
                                </template>
                            </v-date-picker>
                        </v-menu>
                        Rate: <input v-model="hourlyRate" class="text-xs-center" type="number">
                        <v-btn small @click="onSetHourlyRate">Set Hourly Rate</v-btn>
                </v-card>
                <v-divider></v-divider>
                <v-card class="text-xs-center">
                    <v-card-text>
                        <h3>Selected month info</h3>
                    </v-card-text>
                    <v-layout row d-inline>
                        <v-flex>
                            <h4>Total hours</h4>
                            <p>{{monthTotalWork | toDigits}}</p>
                        </v-flex>
                        <v-flex>
                            <h4>Earned</h4>
                            <p>
                                {{earnedThisMonth}}£
                            </p>
                        </v-flex>
                    </v-layout>
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
                            <h4>Total hours worked</h4>
                            <p>{{selectedYearHours|toDigits}}</p>
                        </v-flex>
                        <v-flex>
                            <h4>Total earned</h4>
                            <p>{{selectedYearTotalEarnings}}£</p>
                        </v-flex>
                    </v-layout>
                    <v-layout>
                        <v-expansion-panel  v-if="currentWorkerName!==''">
                            <v-expansion-panel-content>
                                <div slot="header">Monthly information</div>
                                <v-card-text v-for="(item, index) in selectedYearEarnings" :key="index">
                                    <b>{{item.month|toMonths}}</b> Total work hours - {{item.totalWorkTime|toDigits}} | Total earned: {{item.totalEarned|toDecim}}£ | Rate: {{item.rate}}£
                                </v-card-text>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-layout>
                </v-card>
                <v-layout v-if="currentWorkerName!==''" d-block>
                    <v-divider></v-divider>
                    <v-flex class="text-xs-center">
                        <h2>Payments</h2>
                    </v-flex>
                    <v-layout>
                        <v-flex d-block>
                            <v-card >
                                <v-card-text class="text-xs-left">
                                    <div class="spaced">
                                        Amount: <input block v-model="monthlyPayment" class="text-xs-left extend" type="number"> £
                                    </div>
                                    <div class="spaced">
                                        Description: <input block v-model="paymentDescription" class="text-xs-left extend" type="text">
                                    </div>
                                    <v-btn block type="submit" @click="addPayment">Add Payment</v-btn>
                                </v-card-text>
                            </v-card>
                        </v-flex>
                    </v-layout>
                    <v-divider></v-divider>
                    <v-card>
                        <v-layout>
                            <v-flex>
                                <v-card-text class="text-xs-center">
                                    <h3>
                                        Payment information of {{currentWorkerName}} for {{year}}
                                    </h3>
                                </v-card-text>
                            </v-flex>
                        </v-layout>
                        <v-layout>
                            <v-flex>
                                <v-expansion-panel>
                                    <v-expansion-panel-content>
                                        <div slot="header">Total: {{selectedYearPayments}}£</div>
                                        <v-list>
                                            <v-list-tile class="nofloat" v-for="(item, key) in selectedYearSeparatePayments" :key="key">
                                                <v-list-tile-content class="smaled">
                                                    <p>
                                                    {{item.amount}}£ - {{item.description}}
                                                    <v-btn small color="warning" @click="removePayment(key)">Remove</v-btn>
                                                    </p>
                                                </v-list-tile-content>
                                            </v-list-tile>
                                        </v-list>
                                    </v-expansion-panel-content>
                                </v-expansion-panel>
                            </v-flex>
                        </v-layout>
                    </v-card>
                    <v-divider></v-divider>
                        <v-card>
                            <v-card-text>
                                <h2>Current Balance <span class="tk" :class="{ redtext: currentBalance<0}">{{currentBalance}}£</span></h2>
                            </v-card-text>
                        </v-card>
                </v-layout>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import {db} from '../firebase'
import {adminID} from '../admin';

export default {
    data(){
        return{
            adminId:adminID,
            userId:this.$store.getters.user.id,
            workersInfo:{},
            menu:false,
            hourlyRateMenu:false,
            selectedMonth:null,
            selectedWorkerId:null,
            selectedWorkerArrN:null,
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
            hourlyRate:6,
            monthlyPayment:0,
            year:new Date().getFullYear(),
            month:new Date().getMonth(),
            paymentDescription:'',
            renamer:'',
            monthOfSelectedRate:null
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
        selectedMonthInfo(){
            if(!this.selectedWorkerId){
                return []
            }
            let data=this.workersInfo[this.selectedWorkerArrN][this.year][this.month]
            if(data){
                let info=Object.values(data)
                info.sort((a,b)=>{
                    return a.day-b.day
                })
                return info
            }
            else return []
        },
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
            if(!this.workersInfo){
                return 0
            }
            if(!this.workersInfo[this.selectedWorkerArrN]) {
                return 0
            }
            if(!this.workersInfo[this.selectedWorkerArrN][this.year]){
                return 0
            }
            let exists=this.workersInfo[this.selectedWorkerArrN][this.year]['rates']
            if(exists&&this.workersInfo[this.selectedWorkerArrN]['.key']==this.selectedWorkerId){
                let m=this.month
                while(m>=0){
                    let data=this.workersInfo[this.selectedWorkerArrN][this.year]['rates'][m]
                    if(data){
                        return (data*this.monthTotalWork/60).toFixed(2)
                    } m--
                }
            }
            else return 0
        },
        selectedYearHours(){
            if(!this.selectedWorkerId){
                return 0
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
                return hoursByMonth.reduce((a,b)=>a+b,0)
            } else return 0
        },
        selectedYearEarnings(){
            if(!this.workersInfo){
                return 0
            }
            if(!this.workersInfo[this.selectedWorkerArrN]) {
                return 0
            }
            if(!this.workersInfo[this.selectedWorkerArrN][this.year]){
                return 0
            }
            let exists=this.workersInfo[this.selectedWorkerArrN][this.year]['rates']
            if(exists&&this.workersInfo[this.selectedWorkerArrN]['.key']==this.selectedWorkerId){
                let initial=this.workersInfo[this.selectedWorkerArrN][this.year]

                let {rates, payments, ...initial2}=initial

                initial = Object.keys(initial).reduce((obj, key) => {
                    if(key !== 'rates'&& key !=='payments'){
                        obj[key] = initial[key]
                    }
                    return obj;
                }, {});
                let initialArr=Object.values(initial)

                let finalInfo=[]
                initialArr.forEach(el=>{
                    let Arrayed=Object.values(el)
                    let monthWork=[]
                    Arrayed.forEach(elem=>{
                        monthWork.push(elem.totalTime)
                    })
                    monthWork=monthWork.reduce((a,b)=>a+b,0)
                    let monthOfThisEl=Arrayed[0].month
                    let m=monthOfThisEl
                    let rateOfThisMonthEl
                    while(m>=0&&!rateOfThisMonthEl){
                        let data=this.workersInfo[this.selectedWorkerArrN][this.year]['rates'][m]
                        if(data){
                            rateOfThisMonthEl=data
                        } m--
                    }
                    let earning=rateOfThisMonthEl*monthWork/60
                    finalInfo.push({month:monthOfThisEl, totalWorkTime:monthWork, rate:rateOfThisMonthEl, totalEarned:earning})
                })
                return finalInfo
            }
            else return 0
        },
        selectedYearTotalEarnings(){
            if(!this.selectedYearEarnings||!this.selectedYearHours){
                return 0
            } else {
                let totalEarnings=[]
                this.selectedYearEarnings.forEach(el=>{
                    totalEarnings.push(el.totalEarned)
                })
                totalEarnings=totalEarnings.reduce((a,b)=>a+b,0)
                return totalEarnings.toFixed(2)
            }
        },
        selectedYearPayments(){
            if(!this.selectedWorkerId){
                return 0
            }
            if(!this.workersInfo[this.selectedWorkerArrN][this.year]){
                return 0
            }
            let paymentInfo=(this.workersInfo[this.selectedWorkerArrN][this.year].payments)
            if(!paymentInfo){
                return 0
            } else {
                paymentInfo=Object.values(paymentInfo)
                let arr=[]
                let arr2=[]
                paymentInfo.forEach(el=>{
                    arr.push(el)
                })
                arr.forEach(el=>{
                    arr2.push(parseInt(el.amount))
                })
                return arr2.reduce((a,b)=>a+b,0)
            }
        },
        selectedYearSeparatePayments(){
            if(!this.selectedWorkerId){
                return {}
            }
            if(!this.workersInfo[this.selectedWorkerArrN][this.year]){
                return {}
            }
            let paymentInfo=(this.workersInfo[this.selectedWorkerArrN][this.year].payments)
            if(!paymentInfo){
                return {}
            }
            else return paymentInfo
        },
        currentBalance(){
            if(!this.selectedYearTotalEarnings){
                return 0
            }
            return this.selectedYearPayments-this.selectedYearTotalEarnings
        },
        currentWorkerName(){
            if(!this.selectedWorkerId){
                return null
            }
            if(this.workersInfo[this.selectedWorkerArrN]['.key']==this.selectedWorkerId){
                return this.workersInfo[this.selectedWorkerArrN].name
            }
            return null
        },
        error(){
            return this.$store.getters.error
        }
    },
    methods:{
        onMonthSelection(){
            this.menu=false
            if(!this.selectedWorkerId){
                this.$store.dispatch('setError', {message:'Are you sure you have selected worker?'})
                return
            }

            if(this.selectedMonth){
                this.year=new Date(this.selectedMonth).getFullYear()
                this.month=new Date(this.selectedMonth).getMonth()
            }
        },
        addPayment(){
            if(!this.selectedWorkerId){
                this.$store.dispatch('setError', {message:'Are you sure you have selected worker?'})
                return
            }
            const newPayment={
                workerId:this.selectedWorkerId,
                amount:{amount:this.monthlyPayment, description:this.paymentDescription},
                month:this.month,
                year:this.year
            }
            this.$store.dispatch('saveNewPayment', newPayment)
            this.monthlyPayment=0
            this.paymentDescription=''
        },
        removePayment(a){
            const load={
                year:this.year,
                workerId:this.selectedWorkerId,
                paymentId:a
            }
            this.$store.dispatch('removePayment', load)
        },
        identifyWorker(v,d){
            this.selectedWorkerArrN=v
            this.selectedWorkerId=d
        },
        rename(){
            if(!this.selectedWorkerId){
                this.$store.dispatch('setError', {message:'Are you sure you have selected worker?'})
                return
            }
            const newName = {
                id:this.selectedWorkerId,
                load:{name:this.renamer}
            }
            this.$store.dispatch('changeName', newName)
            this.renamer=''
        },
        onSetHourlyRate(){
            if(!this.selectedWorkerId||!this.monthOfSelectedRate){
                this.$store.dispatch('setError', {message:'Are you sure you have selected worker and month?'})
                return
            }
            let month=new Date(this.monthOfSelectedRate).getMonth()
            let load={
                worker:this.selectedWorkerId,
                year:new Date(this.monthOfSelectedRate).getFullYear(),
                rate:{[month]:parseFloat(this.hourlyRate)}
            }
            this.$store.dispatch('setHourlyRate', load)
        },
        onDismissed (){
            this.$store.dispatch('clearError')
        }
    },
    created(){
        this.$store.dispatch('clearError')
    }
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
        background-color: yellowgreen;
    }
    .forname{
        width:10rem;
    }
    .aligned{
        align-self: center;
    }
    .nofloat{
        float:none;
    }
    .spaced{
        margin:1rem;
    }
    .extend{
        width:75%;
    }
    .tk{
        color:green;
    }
    .redtext{
        color:red;
    }
    .smaled{
        font-size:1rem;
    }
    .flright{
        float:right;
    }
</style>
