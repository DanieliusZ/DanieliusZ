export default (value)=>{
    let modified
    if(value.toString().length==1){
        modified='0'+value.toString()
    }
    else{
        modified=value
    }
    return modified
}