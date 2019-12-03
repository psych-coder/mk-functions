const {db} = require('../util/admin')

//create question and answers

//getting QA with quiz id

//getting QA with

//getting QA with topics
exports.getQA = (req,res) =>{
    //Get Topic
    const topicRef = db
   .collection('topics')
   .where('topic','==', req.body.topic)
   .doc()

   console.log(topicRef);
    //Get QA related to that topics
    db
   .collection('QA')
   .where('topicid','==', topicRef)
   .get()
   .then(data =>{
       res.json(data);
   })
}
