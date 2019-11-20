const functions = require('firebase-functions');
const app = require('express')();
const {db} = require("./util/admin");

const FBAuth = require('./util/FBAuth');

const cors = require('cors');
app.use(cors());

const {
    getAllScreams,
    postOneScream,
    getScream,
    deleteScream,
    commentOnScream,
    likeScream,
    unlikeScream,
} = require('./handlers/screams');
const {
    signup,
    login,
    uploadImage,
    addUserDetails,
    getAuthenticatedUser,
    getUserDetails,
    markNotificationsRead
} = require('./handlers/users')

const {
    getInformations,
    getEditoredInformations,
    getAllInformation,
    getTopics,
    getEditoredTopics,
    createAInformation,
    updateInformation,
    deleteInformation
} = require('./handlers/information')



const firebase = require('firebase');
//Information  routes
app.get("/informations",getInformations);
app.get("/getEditorInfo",getEditoredInformations);
app.get("/getAllInfo",getAllInformation);
app.get("/topics",getTopics);
app.get("/getEditoredTopics",getEditoredTopics);
app.post("/information",FBAuth,createAInformation);
app.put("/information/:informationId",FBAuth,updateInformation);
app.delete("/information/:informationId",FBAuth,deleteInformation);


//scream routes
app.get('/screams', getAllScreams); 
app.post('/scream', FBAuth, postOneScream );
app.get('/scream/:screamId', FBAuth, getScream);
app.delete('/scream/:screamId', FBAuth, deleteScream);
app.post('/scream/:screamId/comment',FBAuth,commentOnScream);
app.get('/scream/:screamId/like',FBAuth,likeScream);
app.get('/scream/:screamId/unlike',FBAuth,unlikeScream);

//users routes
app.post('/signup',signup);
app.post('/login',login)
app.post('/user/image', FBAuth, uploadImage );
app.post('/user', FBAuth, addUserDetails);
app.get('/user', FBAuth, getAuthenticatedUser);
app.get('/user/:handle', getUserDetails );
app.post('/notifications',FBAuth, markNotificationsRead);


exports.api = functions.region('asia-east2').https.onRequest(app);

exports.createNotificationOnLike = functions
  .region('asia-east2')
  .firestore.document('likes/{id}')
  .onCreate(async (snapshot) => {
    try {
          const doc = await db
              .doc(`/screams/${snapshot.data().screamId}`)
              .get();
          if (doc.exists &&
              doc.data().userHandle !== snapshot.data().userHandle) {
              return db.doc(`/notifications/${snapshot.id}`).set({
                  createdAt: new Date().toISOString(),
                  recipient: doc.data().userHandle,
                  sender: snapshot.data().userHandle,
                  type: 'like',
                  read: false,
                  screamId: doc.id
              });
          }
      }
      catch (err) {
          return console.error(err);
      }
  });
  

exports.deleteNotificationsOnUnlike = functions.region('asia-east2').firestore
.document('likes/{id}')
.onDelete(async (snapshot) =>{
    try {
        await db.doc(`/notifications/${snapshot.id}`).delete();
        return;
    }
    catch (err) {
        console.error(err);
        return;
    }
})
exports.createNotificationOnComment = functions.region('asia-east2').firestore
.document('comments/{id}')
.onCreate(async (snapshot) =>{
    try {
        const doc = await db.doc(`/screams/${snapshot.data().screamId}`).get();
        if (doc.exists &&
            doc.data().userHandle !== snapshot.data().userHandle) {
            return db.doc(`/notifications/${snapshot.id}`).set({
                createdAt: new Date().toISOString(),
                recipient: doc.data().userHandle,
                sender: snapshot.data().userHandle,
                type: 'comment',
                read: 'false',
                screamId: doc.id
            });
        }
        return;
    }
    catch (err) {
        console.error(err);
        return;
    }
})

exports.onUserImageChange = functions
  .region('europe-west1')
  .firestore.document('/users/{userId}')
  .onUpdate((change) => {
    console.log(change.before.data());
    console.log(change.after.data());
    if (change.before.data().imageUrl !== change.after.data().imageUrl) {
      console.log('image has changed');
      const batch = db.batch();
      return db
        .collection('screams')
        .where('userHandle', '==', change.before.data().handle)
        .get()
        .then((data) => {
          data.forEach((doc) => {
            const scream = db.doc(`/screams/${doc.id}`);
            batch.update(scream, { userImage: change.after.data().imageUrl });
          });
          return batch.commit();
        });
    } else return true;
  });

exports.onScreamDelete = functions
  .region('europe-west1')
  .firestore.document('/screams/{screamId}')
  .onDelete(async (snapshot, context) => {
    const screamId = context.params.screamId;
    const batch = db.batch();
    try {
          const data = await db
              .collection('comments')
              .where('screamId', '==', screamId)
              .get();
          data.forEach((doc) => {
              batch.delete(db.doc(`/comments/${doc.id}`));
          });
          const data_1 = await db
              .collection('likes')
              .where('screamId', '==', screamId)
              .get();
          data_1.forEach((doc) => {
              batch.delete(db.doc(`/likes/${doc.id}`));
          });
          const data_2 = await db
              .collection('notifications')
              .where('screamId', '==', screamId)
              .get();
          data_2.forEach((doc) => {
              batch.delete(db.doc(`/notifications/${doc.id}`));
          });
          return batch.commit();
      }
      catch (err) {
          return console.error(err);
      }
  });