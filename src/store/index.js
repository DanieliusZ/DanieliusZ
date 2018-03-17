import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'
import {db} from '../firebase'
// import VueFire from 'vuefire'

Vue.use(Vuex)
// Vue.use(VueFire)

export const store = new Vuex.Store({
    state:{
        user:null,
        error:null,
        loading:null
    },

    mutations:{
        setUser (state, payload){
            state.user=payload
        },
        setError(state, payload){
            state.error=payload
        },
        clearError(state){
            state.error=null
        },
        setLoading(state, payload){
            state.loading=payload
        },
    },
    actions:{
        // namingYourself({commit, getters}, payload){
        //     const userid=getters.user.id
        //     db.ref('/workers/'+userid).once('value')
        //         .then((data)=>{
        //             if(!data.val()){
        //                 db.ref('/workers/'+userid).push(payload)
        //             }
        //             else{
        //                 const key=Object.keys(data.val())
        //                 // console.log(key)
        //                 db.ref('/workers/'+userid).update(payload)
        //             }
        //         })
        //         .then(()=>{
        //             console.log('you are saved')
        //         })
        //         .catch(error=>{
        //             console.log(error)
        //         })
        // },
        saveWorkTime({commit, getters}, payload){
            const user=getters.user
            db.ref('/workers/'+user.id+'/'+payload.year+'/'+payload.month).orderByChild("day").equalTo(payload.day).once('value')
                .then((data)=>{
                    if(!data.val()){
                        db.ref('/workers/'+user.id+'/'+payload.year+'/'+payload.month).push(payload)
                    }
                    else{
                        const key=Object.keys(data.val())
                        db.ref('/workers/'+user.id+'/'+payload.year+'/'+payload.month).child(key[0]).update(payload)
                    }
                })
                .then(()=>{
                    console.log('you are saved')
                })
                .catch(error=>{
                    console.log(error)
                })
        },
        saveNewPayment({commit,getters}, payload){
            let userid=payload.workerId
            db.ref('/workers/'+[userid]+'/'+payload.year+'/payments').push(payload.amount)
        },
        removePayment({},payload){
            db.ref('/workers/'+[payload.workerId]+'/'+payload.year+'/payments').child(payload.paymentId).remove()
        },
        changeName({commit}, payload){
            // console.log(payload)
            db.ref('/workers/'+[payload.id]+'/').update(payload.load)
        },
        setHourlyRate({}, payload){
            db.ref('/workers/'+[payload.worker]+'/'+payload.year+'/rates').update(payload.rate)
        },
        signUserUp({commit, getters},payload){
            commit('clearError')
            firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
                .then(
                    user=>{
                        const newUser={
                            id:user.uid,
                            email:user.email
                        }
                        commit('setUser', newUser)
                    }
                )
                .then(()=>{
                    let userId=getters.user.id
                    db.ref('/workers/'+[userId]).set({name:payload.email})
                }
                )
                .catch(
                    error=>{
                        commit('setError', error)
                        console.log(error)
                    }
                )
        },
        signUserIn({commit},payload){
            commit('clearError')
            firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
                .then(
                    user=>{
                        const newUser={
                            id:user.uid,
                            email:user.email
                        }
                        commit('setUser', newUser)
                    }
                )
                .catch(
                    error=>{
                        commit('setError', error)
                        console.log(error)
                    }
                )
        },
        autoSignIn({commit}, payload){
            commit('setUser',{id:payload.uid, email:payload.email})
        },
        logout({commit}){
            firebase.auth().signOut()
            commit('setUser', null)
        },
        clearError({commit}){
            commit('clearError')
        },
        setError({commit}, payload){
            commit('setError', payload)
        }
    },
    getters:{   
        user (state){
            return state.user
        },
        error (state){
            return state.error
        },
        loading (state){
            return state.loading
        }
    }
})