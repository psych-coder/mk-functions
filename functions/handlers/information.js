const { admin, db } = require("../util/admin");
const { reduceInfoDetails, getHashTags,youtube_parser } = require("../util/validators");



//const config = require("../util/config");

const runtimeOpts = {
  timeoutSeconds: 300,
  memory: '1GB'
}

//Get an info
exports.getPost = (req, res) => {
  console.log(req.params.informationId);

  const document = db.doc(`/information/${req.params.informationId}`);

  document
    .get()
    .then((doc) => {
      let information;
      console.log(doc);
      if (!doc.exists) {
        return res.status(400).json({ error: "Information not found" });
      } else {
        information = {
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
          userhandle: doc.data().userhandle,
          youtubid: doc.data().youtubid,
        };
      }
      return res.json(information);
    })
    .catch((err) => {
      console.error(err);
    });
};

//get limited infomations
exports.getInformations = (req, res) => {
  //console.log(req.body.startAfter);
   
  db.collection("information")
   .orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      let information = [];
      console.log(data.size);
      data.forEach((doc) =>
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
          userhandle: doc.data().userhandle,
          youtubid: doc.data().youtubid,
        })
      );
      return res.json(information);
    })
    .catch((err) => {
      console.error(err);
    });
};

exports.getTaggedInfo = (req, res) => {
  console.log(req.body.startAfter);
  db.collection("information")
    .where("tags", "array-contains", req.params.tagName)
    .orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      let information = [];
      console.log(data.size);
      data.forEach((doc) =>
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
          userhandle: doc.data().userhandle,
        })
      );
      return res.json(information);
    })
    .catch((err) => {
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
    .then((data) => {
      let information = [];
      data.forEach((doc) =>
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
          userhandle: doc.data().userhandle,
          youtubid: doc.data().youtubid,
        })
      );
      return res.json(information);
    })
    .catch((err) => {
      console.error(err);
    });
};

//get All information
exports.getAllInformation = (req, res) => {
  db.collection("information")
    .orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      let information = [];
      data.forEach((doc) =>
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
          userhandle: doc.data().userhandle,
          youtubid: doc.data().youtubid,
        })
      );
      return res.json(information);
    })
    .catch((err) => {
      console.error(err);
    });
};

// getTags,
exports.getTags = (req, res) => {
  let tags = [];
  db.collection("tags")
    .where("count", ">=", "5")
    .limit(10)
    .get()
    .then((data) => {
      if (data.size > 0) {
        data.forEach((doc) =>
          tags.push({
            tagid: doc.id,
            tag: doc.data().tag,
            count: doc.data().count,
          })
        );
        return res.status(200).json(tags);
      } else {
        //console.log("inside");
        db.collection("tags")
          .limit(10)
          .get()
          .then((data1) => {
            data1.forEach((doc) =>
              tags.push({
                tagid: doc.id,
                tag: doc.data().tag,
                count: doc.data().count,
              })
            );
            return res.status(200).json(tags);
          })
          .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: "Error while getting tags" });
          });
      }
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: "Error while getting tags" });
    });
};

//get Editor Picked Topics
exports.getEditoredTopics = (req, res) => {
  db.collection("topics")
    .where("editorpick", "==", true)
    .limit(20)
    .get()
    .then((data) => {
      let topics = [];
      data.forEach((doc) =>
        topics.push({
          topicId: doc.id,
          editorpick: doc.data().editorpick,
          subtopics: doc.data().subtopics,
          topic: doc.data().topic,
        })
      );
      return res.json(topics);
    })
    .catch((err) => {
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
  //const shortDesc = req.body.body.substring(0, 300) + "...";

  const cardImage = req.body.cardImage !== undefined ? req.body.cardImage : "";
  const imageName = req.body.imageName !== undefined ? req.body.imageName : "";

  const tags = getHashTags(req.body.body).toString();
  const youtubid = youtube_parser(req.body.body);
  //const tags = req.body.tags;

  console.log( " youtubid = " + youtubid );
  const newInformation = {
    title: req.body.title,
    body: req.body.body,
    userHandle: req.user.handle,
    cardImage: cardImage,
    shortDesc: req.body.shortDesc,
    tags: tags.split(","),
    //topic: req.body.topic,
    editorpick: req.body.editorpick,
    createdAt: new Date().toISOString(),
    likeCount: 0,
    commentCount: 0,
    imageName: imageName,
    youtubid: youtubid,
  };

  //console.log(req.user.handle);

  db.collection("users")
    .where("handle", "==", req.user.handle)
    .limit(1)
    .get()
    .then((data) => {
      // console.log(data);
      //console.log(data.docs[0].data());

      data.forEach((doc) => {
        if (doc.data().role == "admin") {
          db.collection("information")
            .add(newInformation)
            .then((d) => {
              const resInfo = newInformation;
              resInfo.informationId = d.id;
              res.json(resInfo);
              //cls
              res.status.json({
                message: `document.${doc.id} created succesfully`,
              });
            })
            .catch((err) => {
              res.status(500).json({ error: "Something went wrong" });
              console.error(err);
            });
        } else {
          return res.status(403).json({ error: "Unauthorized access" });
        }
      });
    });
};

//update Information
exports.updateInformation = (req, res) => {
  
  let information = req.body;

  if (req.method !== "POST") {
    res.status(400).json({ error: "Method not supported" });
  }

  if (req.body.body.trim() === "") {
    return res.status(400).json({ body: "Body must not be empty" });
  }

  console.log(req.params.informationId);

  const document = db.doc(`/information/${req.params.informationId}`);

  document
    .get()
    .then((doc) => {
      console.log(doc.exists);
    })

  db.doc(`/information/${req.params.informationId}`)
    .update(information)
    .then(() => {
      //console.log(doc);
      res.json("Information update successfully");
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err });
    }); 
};
//delete information
exports.deleteInformation = (req, res) => {
  const document = db.doc(`/information/${req.params.informationId}`);

  //admin check

  db.collection("users")
    .where("handle", "==", req.user.handle)
    .limit(1)
    .get()
    .then((data) => {
      if ((data.docs[0].data().role = "admin")) {
        document
          .get()
          .then((doc) => {
            console.log(doc.data());

            if (!doc.exists) {
              return res.status(400).json({ error: "Information not found" });
            } else {
              document.delete();
            }
            /*  if (doc.data().userHandle !== req.user.handle) {
              return res.status(403).json({ error: "Unauthorized access" });
            } else {
              document.delete();
            } */
          })
          .then(() => {
            res
              .status(200)
              .json({ message: "Information deleted successfully" });
          })
          .catch((err) => {
            console.error(err);
            res.status(500).json({ error: err.code });
          });
      } else {
        return res.status(403).json({ error: "Unauthorized access" });
      }
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
    .then((doc) => {
      if (doc.exists) {
        infoData = doc.data();
        infoData.informationId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: "information not found" });
      }
    })
    .then((data) => {
      if (data.empty) {
        return db
          .collection("iLikes")
          .add({
            informationId: req.params.informationId,
            userHandle: req.user.handle,
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
    .catch((err) => {
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
    .then((doc) => {
      if (doc.exists) {
        infoData = doc.data();
        infoData.informationId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: "information not found" });
      }
    })
    .then((data) => {
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
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

exports.uploadImg = (req, res) => {
  const BusBoy = require("busboy");
  const path = require("path");
  const os = require("os");
  const fs = require("fs");

  const busboy = new BusBoy({ headers: req.headers });

  let imageFileName;
  let imageToBeUploaded;

  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
      return res.status(400).json({ error: "Wrong file format" });
    }

    const imageExtension = filename.split(".")[filename.split(".").length - 1];
    imageFileName = `${Math.round(
      Math.random() * 100000000000
    )}.${imageExtension}`;
    console.log(" imageFileName ======= " + imageFileName);

    const filePath = path.join(os.tmpdir(), imageFileName);
    imageToBeUploaded = { filePath, mimetype };

    file.pipe(fs.WriteStream(filePath));
  });

  busboy.on("finish", () => {
    admin
      .storage()
      .bucket()
      .upload(imageToBeUploaded.filePath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageToBeUploaded.mimetype,
          },
        },
      })
      .then(() => {
        const fileinfo = {
          filename: imageFileName,
          infoid: "",
        };
        db.collection("fileinfo")
          .add(fileinfo)
          .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
          });
      })
      .then(() => {
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
        return res
          .status(200)
          .json({ imageURl: imageUrl, filename: imageFileName });
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: err.code });
      });
  });
  busboy.end(req.rawBody);
};

exports.deleteImg = (req, res) => {
  admin
    .storage()
    .bucket()
    .file(req.body.filename)
    .delete()
    .then(() => res.status(200).json({ message: "file deleted" }))
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
