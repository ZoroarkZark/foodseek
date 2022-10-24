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
        this.issue = createIssue(code,msg);
    }

    // just return the string version of this object
    package(){
        return JSON.stringify(this);
    }
    
}

module.exports = {
    res_obj: res_obj
}

