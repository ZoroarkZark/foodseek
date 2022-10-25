// Response Object
/* 
{
    success = 1 or 0 
    data : { 
        object 
    } or null,
    issue: {
        object 
    } or null
}
*/

function createIssue(code, msg){
    return ({
        error: code,
        message: msg
    })
}

class res_obj {
    // defualt constructor
    // all fields set to uninitilized

    constructor(){
        this.success = 0;
        this.data = null;
        this.issues = null;
    }


    // only call one of these

    // on success 
    // set the returned data 
    setData(data){
        this.success = 1;
        this.data = data;
    }

    // on failure of operation
    // set the returned issue
    setIssues(issues){
        this.success = 0;
        this.issues = issues;
    }

    setIssue(code, msg){
        this.success = 0;
        this.issue = {
            error: code,
            message: msg
        }
    }

    // just return the string version of this object
    package(){
        return JSON.stringify(this);
    }
    
}

class food_card{
    constructor(foodData){
        this.id = foodData.id; // probably will change to be generated as a rand key or that rand key is set here
        this.image = foodData.image;
        this.vendor = foodData.vendor;
        this.favorite = foodData.favorite;
        this.cuisine = foodData.cuisine;
        this.item = foodData.item;
        this.travel = foodData.travel;  
        this.reserved = foodData.reserved;
    }
}

function validate(fields, object){
    for(x in fields){
        if(fields[x] in object){
            continue
        }else{
            return false;
        }
    }
    return true;
}

module.exports = {
    res_obj: res_obj,
    food_card: food_card,
    validate: validate
}


