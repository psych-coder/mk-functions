const {db} = require('../util/admin')

//create question and answers

//getting QA with quiz id
exports.getQuizQA = (req,res) =>{

    db
   .collection('QA')
   .where('quizid','array-contains', req.params.quizid)
   .limit(10)
   .get()
   .then(data =>{
    let qa = [];
    data.forEach((doc) => {
    //console.log(doc.data().question);
        qa.push({
            qaid : doc.id,
            question : doc.data().question,
            answer: doc.data().answer,
            tags: doc.data().tags
            })
            return res.json(qa);
        })     
   })
   .catch(err => {
    console.log(err)
    return  res.status(400).json(err)
})
   
}

//getting QA with topics
exports.getQA = (req,res) =>{

    let topicId;
    //Get Topic
    db
   .collection('topics')
   .where('topic','==', req.params.topic)
   .limit(1)
   .get()
   .then(data =>{
        data.forEach((doc) => {
            //topicId = `/topics/${doc.id}`;
            topicId = doc.ref;
        });
      return topicId;
     })
     .then(ref =>{
        return db
        .collection('QA')
        .where('topicid','==',ref)
        .limit(10)
        .get()
     })
     .then(data =>{
        let qa = [];
         data.forEach((doc) => {
            //console.log(doc.data().question);
            qa.push({
                qaid : doc.id,
                question : doc.data().question,
                answer: doc.data().answer,
                tags: doc.data().tags
            })
        });
        return res.json(qa);
     })
   .catch(err => {
       console.log(err)
       return  res.status(400).json(err)
   })

    //Get QA related to that topics

}
