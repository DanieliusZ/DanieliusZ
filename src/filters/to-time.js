export default (value)=>{
    let mins=value%60
    let hrs=(value-mins)/60
    if(mins.toString().length==1){
        mins='0'+mins.toString()
    }
    else{
        mins=mins
    }
    return hrs+':'+mins
}