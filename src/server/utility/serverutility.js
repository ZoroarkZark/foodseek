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
module.exports = class res_obj {
    // defualt constructor
    // all fields set to uninitilized

    constructor(){
        this.success = 0;
        this.data = null;
        this.issues = null;
    }


    // only call one of these

    // on success 
    setData(data){
        this.success = 1;
        this.data = data;
    }

    // on failure of operation
    setIssues(issues){
        this.success = 0;
        this.issues = issues;
    }

    // just return the string version of this object
    package(){
        return JSON.stringify(this);
    }
    
}

