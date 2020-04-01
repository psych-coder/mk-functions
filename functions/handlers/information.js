const { db } = require("../util/admin");
const { reduceInfoDetails } = require("../util/validators");

//get limited infomations
exports.getInformations = (req, res) => {
  console.log(req.body.startAfter);
  db.collection("information")
    .orderBy("createdAt", "desc")
    .get()
    .then(data => {
      let information = [];
      console.log(data.size);
      data.forEach(doc =>
        information.push({
          informationId: doc.id,
          title: doc.data().title,
          body: doc.data().body,
          cardImage: doc.data().cardImage,
          commentCount: doc.data().commentCount,
          likeCount: doc.data().likeCount,
          createdAt: doc.data().createdAt,
          shortDesc: doc.data().shortDesc,
          tags: doc.data().tags,
          topic: doc.data().topic,
          editorpick: doc.data().editorpick,
          userhandle: doc.data().userhandle
        })
      );
      return res.json(information);
    })
    .catch(err => {
      console.error(err);
    });
};

//get editior picked informations
exports.getEditoredInformations = (req, res) => {
  db.collection("information")
    .where("editorpick", "==", true)
    .orderBy("createdAt", "desc")
    .limit(20)
    .get()
    .then(data => {
      let information = [];
      data.forEach(doc =>
        information.push({
          informationId: doc.id,
          body: doc.data().body,
          cardImage: doc.data().cardImage,
          commentCount: doc.data().commentCount,
          likeCount: doc.data().likeCount,
          createdAt: doc.data().createdAt,
          shortDesc: doc.data().shortDesc,
          tags: doc.data().tags,
          topic: doc.data().topic,
          editorpick: doc.data().editorpick,
          userhandle: doc.data().userhandle
        })
      );
      return res.json(information);
    })
    .catch(err => {
      console.error(err);
    });
};

//get All information
exports.getAllInformation = (req, res) => {
  db.collection("information")
    .orderBy("createdAt", "desc")
    .get()
    .then(data => {
      let information = [];
      data.forEach(doc =>
        information.push({
          informationId: doc.id,
          body: doc.data().body,
          cardImage: doc.data().cardImage,
          commentCount: doc.data().commentCount,
          likeCount: doc.data().likeCount,
          createdAt: doc.data().createdAt,
          shortDesc: doc.data().shortDesc,
          tags: doc.data().tags,
          topic: doc.data().topic,
          editorpick: doc.data().editorpick,
          userhandle: doc.data().userhandle
        })
      );
      return res.json(information);
    })
    .catch(err => {
      console.error(err);
    });
};

// getTopics,
exports.getTopics = (req, res) => {
  db.collection("topics")
    .limit(20)
    .get()
    .then(data => {
      let topics = [];
      data.forEach(doc =>
        topics.push({
          topicId: doc.id,
          editorpick: doc.data().editorpick,
          subtopics: doc.data().subtopics,
          topic: doc.data().topic
        })
      );
      return res.json(topics);
    })
    .catch(err => {
      console.error(err);
    });
};

//get Editor Picked Topics
exports.getEditoredTopics = (req, res) => {
  db.collection("topics")
    .where("editorpick", "==", true)
    .limit(20)
    .get()
    .then(data => {
      let topics = [];
      data.forEach(doc =>
        topics.push({
          topicId: doc.id,
          editorpick: doc.data().editorpick,
          subtopics: doc.data().subtopics,
          topic: doc.data().topic
        })
      );
      return res.json(topics);
    })
    .catch(err => {
      console.error(err);
    });
};

//createAInformation
exports.createAInformation = (req, res) => {
  if (req.method !== "POST") {
    res.status(400).json({ error: "Method not supported" });
  }

  if (req.body.body.trim() === "") {
    return res.status(400).json({ body: "Body must not be empty" });
  }
  const shortDesc = req.body.body.substring(0, 300) + "...";

  const cardImage = req.body.cardImage !== undefined ? req.body.cardImage : "";

  console.log(req.user.handle);
  let isAdmin = false;
  db
  .collection("users")
  .where("handle", "==", req.user.handle)
  .limit(1).get().then(data => {
	  
	  if (data.size < 0 ) {
        return res.status(400).json({ error: "Unauthorized access" });
      }
      
      data.forEach((doc) => {
          console.log(doc.data().role)
        if (doc.data().role == "admin") {
            const newInformation = {
                title: req.body.title,
                body: req.body.body,
                userHandle: req.user.handle,
                cardImage: cardImage,
                shortDesc: shortDesc,
                tags: req.body.tags,
                topic: req.body.topic,
                editorpick: req.body.editorpick,
                createdAt: new Date().toISOString(),
                likeCount: 0,
                commentCount: 0
              };
              db.collection("information")
                .add(newInformation)
                .then(doc => {
                  const resInfo = newInformation;
                  resInfo.informationId = doc.id;
                  res.json(resInfo);
                  //res.json({message: `document.${doc.id} created succesfully`});
                })
                .catch(err => {
                  res.status(500).json({ error: "Something went wrong" });
                  console.error(err);
                });
            
          } else {
            return res.status(403).json({ error: "Unauthorized access" });
          }
        })
  })
    
      
  
};

//update Information
exports.updateInformation = (req, res) => {
  let information = reduceInfoDetails(req.body);

  console.log(req.params.informationId);
  db.doc(`/information/${req.params.informationId}`)
    .update(information)
    .then(() => {
      res.json("Information update successfully");
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err });
    });
};
//delete information
exports.deleteInformation = (req, res) => {
  const document = db.doc(`/information/${req.params.informationId}`);

  document
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(400).json({ error: "Information not found" });
      }
      if (doc.data().userHandle !== req.user.handle) {
        return res.status(403).json({ error: "Unauthorized access" });
      } else {
        document.delete();
      }
    })
    .then(() => {
      res.status(200).json({ message: "Information deleted successfully" });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

//Like a information
exports.likeInformation = (req, res) => {
  const likeDocument = db
    .collection("information")
    .where("userHandle", "==", req.user.handle)
    .where("informationId", "==", req.params.informationId)
    .limit(1);

  const infoDocument = db.doc(`/information/${req.params.informationId}`);

  let infoData;

  infoDocument
    .get()
    .then(doc => {
      if (doc.exists) {
        infoData = doc.data();
        infoData.informationId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: "information not found" });
      }
    })
    .then(data => {
      if (data.empty) {
        return db
          .collection("iLikes")
          .add({
            informationId: req.params.informationId,
            userHandle: req.user.handle
          })
          .then(() => {
            infoData.likeCount++;
            return infoDocument.update({ likeCount: infoDocument.likeCount });
          })
          .then(() => {
            return res.json(infoDocument);
          });
      } else {
        return res.status(400).json({ error: "information already liked" });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: error.code });
    });
};

//UnLike a scream
exports.unlikeInformation = (req, res) => {
  const likeDocument = db
    .collection("likes")
    .where("userHandle", "==", req.user.handle)
    .where("informationId", "==", req.params.informationId)
    .limit(1);

  const infoDocument = db.doc(`/information/${req.params.informationId}`);

  let infoData;

  infoDocument
    .get()
    .then(doc => {
      if (doc.exists) {
        infoData = doc.data();
        infoData.informationId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: "information not found" });
      }
    })
    .then(data => {
      if (data.empty) {
        return res.status(400).json({ error: "information not liked" });
      } else {
        return db
          .doc(`/iLikes/${data.docs[0].id}`)
          .delete()
          .then(() => {
            infoData.likeCount--;
            return infoDocument.update({ likeCount: infoData.likeCount });
          })
          .then(() => {
            return res.json(infoData);
          });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};
