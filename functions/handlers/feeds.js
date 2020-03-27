const {db} = require('../util/admin')
const {reduceInfoDetails} = require('../util/validators')

//get limited infomations
exports.getFeeds = (req,res) =>{
    
  const CORS_PROXY = "https://cors-anywhere.herokuapp.com/"
  let Parser = require('rss-parser');
      let parser = new Parser();
      let newsFeed=[];
      (async () => {
      
        
      let feed = await parser.parseURL('http://www.bbc.co.uk/tamil/index.xml');
      console.log(" feed =  " + feed.title);
      
      feed.items.forEach(item => {
          console.log(item.title)
          newsFeed.push({
            "title": item.title,
            "link": item.link
          }) 
          
      });
      console.log("ending")
      return newsFeed;
      })().catch(err => {
        console.error(err)
    })


     
     

}
