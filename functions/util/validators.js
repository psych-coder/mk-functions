
const isEmpty = (string) =>{
    if(string.trim() === '')  return true; 
    else return false;
}
const isEmail = (email) => {
    const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(email.match(emailRegEx)) return true;
    else return false;

}

const isNotNull= (string) => {
    if(string === null) return ''
}

exports.validateSignup = (data) =>{
    let errors = {};
    if(isEmpty(data.email)){
        errors.email = 'Must not be empty'
    }else if(!isEmail(data.email)){
        errors.email='Must be a valid email address'
    }

    if(isEmpty(data.password)) errors.password = 'Must not be empty';
    if(data.password !== data.confirmPassword) errors.confirmPassword = 'Password must match';
    if(isEmpty(data.handle)) errors.handle = 'Must not be empty';

    return {
        errors,
        valid : Object.keys(errors).length === 0 ? true : false
    }
}

exports.validateLoginData = (data) => {
    
    let errors = {}
   
    if(isEmpty(data.email)) errors.email = "Must not be empty"; 
    if(isEmpty(data.password)) errors.password = "Must not be empty";
    
   return {
        errors,
        valid : Object.keys(errors).length === 0 ? true : false
    }

}

exports.reduceUserDetails = (data) => {

    let userDetails  = {};
    if(!isEmpty(data.bio.trim())) userDetails.bio = data.bio;
    if(!isEmpty(data.website.trim())){
        if(data.website.trim().substring(0,4) !== 'http'){
            userDetails.website = `http://${data.website.trim()}`
        }else userDetails.website = data.website;
    }
    if(!isEmpty(data.location.trim())) userDetails.location = data.location;
    return userDetails;
}
exports.reduceInfoDetails = (data) => {

    let infoDetails  = {};
    if(!isEmpty(data.shortDesc.trim())) infoDetails.shortDesc = data.shortDesc;
    if(!isEmpty(data.tags.trim())) infoDetails.tags = data.tags;
    if(!isEmpty(data.topic.trim())) infoDetails.topic = data.topic;
    return infoDetails;
}

exports.getHashTags = (inputText) => {  
    var regex = /(?:#)([a-zA-Z\d\_\-\u0B80-\u0BFF]+)/gm;
    var matches = [];
    var match;

    while ((match = regex.exec(inputText))) {
        matches.push(match[1]);
    }

    console.log(matches)
    return matches;
}