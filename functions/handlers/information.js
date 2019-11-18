import { db } from '../util/admin';

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
    .then(data => {
        let topics=[];
        data.forEach((doc) =>(
            topics.push({
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

//getTags,

exports.getTags = (reg,res) =>{

}

//createAInformation
exports.createAInformation = (reg,res) =>{

}