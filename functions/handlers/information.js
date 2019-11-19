const {db} = require('../util/admin')

//get limited infomations
exports.getInformations = (req,res) =>{
    console.log( req.body.startAfter );
    db
    .collection("information")
    .orderBy('createdAt','desc')
    .startAfter(req.body.startAfter)
    .limit(15)
    .get()
    .then(data => {
        let information=[];
        data.forEach((doc) =>(
            information.push({
                informationId : doc.id,
                body : doc.data().body,
                cardImage: doc.data().cardImage,
                commentCount:doc.data().commentCount,
                likeCount:doc.data().likeCount,
                createdAt:doc.data().createdAt,
                shortDesc:doc.data().shortDesc,
                tags:doc.data().tags,
                topic:doc.data().topic,
                editorpick:doc.data().editorpick,
                userhandle:doc.data().userhandle
            })
        ))
        return res.json(information);
    })
    .catch(err => {
        console.error(err)
    })
}

//get editior picked informations
exports.getEditoredInformations = (req,res) =>{
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
                body : doc.data().body,
                cardImage: doc.data().cardImage,
                commentCount:doc.data().commentCount,
                likeCount:doc.data().likeCount,
                createdAt:doc.data().createdAt,
                shortDesc:doc.data().shortDesc,
                tags:doc.data().tags,
                topic:doc.data().topic,
                editorpick:doc.data().editorpick,
                userhandle:doc.data().userhandle
            })
        ))
        return res.json(information);
    })
    .catch(err => {
        console.error(err)
    })
}

//get All information
exports.getAllInformation = (req,res) =>{
    db
    .collection("information")
    .orderBy('createdAt','desc')
    .get()
    .then(data => {
        let information=[];
        data.forEach((doc) =>(
            information.push({
                informationId : doc.id,
                body : doc.data().body,
                cardImage: doc.data().cardImage,
                commentCount:doc.data().commentCount,
                likeCount:doc.data().likeCount,
                createdAt:doc.data().createdAt,
                shortDesc:doc.data().shortDesc,
                tags:doc.data().tags,
                topic:doc.data().topic,
                editorpick:doc.data().editorpick,
                userhandle:doc.data().userhandle
            })
        ))
        return res.json(information);
    })
    .catch(err => {
        console.error(err)
    })
}

// getTopics,
exports.getTopics = (req,res) =>{
    db
    .collection("topics")
    .limit(20)
    .get()
    .then(data => {
        let topics=[];
        data.forEach((doc) =>(
            topics.push({
                topicId : doc.id,
                editorpick : doc.data().editorpick,
                subtopics : doc.data().subtopics,
                topic: doc.data().topic,
            })
        ))
        return res.json(topics);
    })
    .catch(err => {
        console.error(err)
    })
}

//get Editor Picked Topics
exports.getEditoredTopics = (req,res) =>{
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
                editorpick : doc.data().editorpick,
                subtopics : doc.data().subtopics,
                topic: doc.data().topic,
            })
        ))
        return res.json(topics);
    })
    .catch(err => {
        console.error(err)
    })
}

//createAInformation
exports.createAInformation = (req,res) =>{
    if(req.method !== 'POST'){
        res.status(400).json({error: "Method not supported"});
    }

    if (req.body.body.trim() === '') {
        return res.status(400).json({ body: 'Body must not be empty' });
        }
    const newInformation = {
        body :req.body.body,
        userHandle : req.user.handle,
        //cardImage: req.body.cardImage,
        //commentCount:req.body.commentCount,
        //likeCount:req.body.likeCount,
       //shortDesc:req.body.shortDesc,
        //tags:req.body.tags,
        //topic:req.body.topic,
        //userhandle:req.body.userhandle,
        editorpick:req.body.editorpick,
        createdAt : new Date().toISOString(),
        //likeCount:0,
        //commentCount:0
    };
    db
    .collection('information')
    .add(newInformation)
    .then((doc) => {
        const resInfo = newInformation;
        resInfo.informationId = doc.id;
        res.json(resInfo); 
        //res.json({message: `document.${doc.id} created succesfully`});
    })
    .catch((err) => {
        res.status(500).json({error: 'Something went wrong'});
        console.error(err);
    })
}