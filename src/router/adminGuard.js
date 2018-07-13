import {store} from '../store'
import {adminID} from '../admin';

export default(to, from, next)=>{
    if(store.getters.user.id===adminID){
        next()
    }
    else{
        next('/')
    }
}
