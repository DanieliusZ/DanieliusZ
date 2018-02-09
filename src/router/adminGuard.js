import {store} from '../store'

export default(to, from, next)=>{
    if(store.getters.user.id==='pSMXNyec1AfD666QYpxFXxpkv3I2'){
        next()
    }
    else{
        next('/')
    }
}