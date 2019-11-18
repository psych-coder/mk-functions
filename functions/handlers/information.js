import { db } from '../util/admin';

//get limited infomations
exports.getInformations = (reg,res) =>{
    db
    .collection("information")
    .orderBy('createdAt','desc')
    .startAfter(reg.body.startAfter)
    .limit(10)
    .get()
    .then(data => {
        let information=[];
        data.forEach((doc) =>(
            information.push({
                informationId : doc.id,
                body : doc.body,
                cardImage: doc.cardImage,
                commentCount:doc.commentCount,
                likeCount:doc.likeCount,
                createdAt:doc.createdAt,
                shortDesc:doc.shortDesc,
                tags:doc.tags,
                topic:doc.topic,
                userhandle:doc.userhandle
            })
        ))
        return res.json(information);
    })
    .catch(err => {
        console.error(err)
    })
}

//get editior picked informations
exports.getEditoredInformations = (reg,res) =>{
    db
    .collection("information")
    .where('editorpick','==',true)
    .orderBy('createdAt','desc')
    .limit(20)
    .get()
    .then(data => {
        let information=[];
        data.forEach((doc) =>(
            information.push({
                informationId : doc.id,
                body : doc.body,
                cardImage: doc.cardImage,
                commentCount:doc.commentCount,
                likeCount:doc.likeCount,
                createdAt:doc.createdAt,
                shortDesc:doc.shortDesc,
                tags:doc.tags,
                topic:doc.topic,
                userhandle:doc.userhandle
            })
        ))
        return res.json(information);
    })
    .catch(err => {
        console.error(err)
    })
}

//get All information
exports.getAllInformation = (reg,res) =>{
    db
    .collection("information")
    .orderBy('createdAt','desc')
    .get()
    .then(data => {
        let information=[];
        data.forEach((doc) =>(
            information.push({
                informationId : doc.id,
                body : doc.body,
                cardImage: doc.cardImage,
                commentCount:doc.commentCount,
                likeCount:doc.likeCount,
                createdAt:doc.createdAt,
                shortDesc:doc.shortDesc,
                tags:doc.tags,
                topic:doc.topic,
                userhandle:doc.userhandle
            })
        ))
        return res.json(information);
    })
    .catch(err => {
        console.error(err)
    })
}

// getTopics,
exports.getTopics = (reg,res) =>{
    db
    .collection("topics")
    .get()
    .limit(20)
    .then(data => {
        let topics=[];
        data.forEach((doc) =>(
            topics.push({
                topicId : doc.id,
                editorpick : doc.editorpick,
                subtopics : doc.subtopics,
                topic: doc.topic,
            })
        ))
        return res.json(topics);
    })
    .catch(err => {
        console.error(err)
    })
}

//get Editor Picked Topics
exports.getEditoredTopics = (reg,res) =>{
    db
    .collection("topics")
    .where('editorpick','==',true)
    .limit(20)
    .get()
    .then(data => {
        let topics=[];
        data.forEach((doc) =>(
            topics.push({
                topicId : doc.id,
                editorpick : doc.editorpick,
                subtopics : doc.subtopics,
                topic: doc.topic,
            })
        ))
        return res.json(topics);
    })
    .catch(err => {
        console.error(err)
    })
}
//getTags,

exports.getTags = (reg,res) =>{

}

//createAInformation
exports.createAInformation = (reg,res) =>{

}