const {admin,db } = require('../util/admin')
const firebase = require('firebase');


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const config = {
    apiKey: "AIzaSyDJ-shuAvt3Q202f8HnP2CAN80yKOpISX0",
    authDomain: "manithakurangu-338c3.firebaseapp.com",
    databaseURL: "https://manithakurangu-338c3.firebaseio.com",
    projectId: "manithakurangu-338c3",
    storageBucket: "manithakurangu-338c3.appspot.com",
    messagingSenderId: "513036373625",
    appId: "1:513036373625:web:689e0389769f9baf490ea8",
    measurementId: "G-VZJZSWMJ5F"
  };

//const config = require('../util/config')
firebase.initializeApp(config);

const {validateSignup,validateLoginData,reduceUserDetails} = require('../util/validators')

exports.signup = (req,res)=>{
    const newUser = {
        email : req.body.email,
        password : req.body.password,
        confirmPassword : req.body.confirmPassword,
        handle : req.body.handle,
    };

    const {valid, errors } = validateSignup(newUser)
    if(!valid) return res.status(400).json(errors);

    const noImg = 'no-img.png'

    let token,userId;
    db.doc(`/users/${newUser.handle}`).get()
        .then((doc) =>{
            if(doc.exists){
                return res.status(400).json({ handle : "This handle is already taken"});
            }
            else{
                return firebase
                .auth().createUserWithEmailAndPassword(newUser.email,newUser.password);
            }
        })
        .then(data =>{
            userId = data.user.uid;
            return data.user.getIdToken();
        })
        .then(idToken =>{
            token = idToken;
            const userCredentials = {
                handle : newUser.handle,
                email: newUser.email,
                createdAt: new Date().toISOString(),
                imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`,
                userId
            };
            return db.doc(`/users/${newUser.handle}`).set(userCredentials);
        })
        .then((data) =>{
            return res.status(201).json({token});
        })
         .catch(err => {
            console.error(err);
            if(err.code === 'auth/email-already-in-use'){
                return res.status(400).json({error: "Email is already in use"});
            }
            else{
                return res.status(500).json({general : 'Something went wrong, please try again' });
            }
        }) 
  
}

exports.login = (req,res)=>{

    const user={
        email: req.body.email,
        password: req.body.password
    }

    console.log("login")
   
    const {valid, errors } = validateLoginData(user);
    if(!valid) return res.status(400).json(errors);

    firebase
    .auth()
    .signInWithEmailAndPassword(user.email,user.password)
    .then((data) => {
        return data.user.getIdToken();
    })
    .then((token) => {
        return res.json({token})
    })
    .catch((err) => {
        console.log( "error")
        console.error(err)
        //if(err.code === 'auth/wrong-password' || err.code === 'auth/invalid-email' ){
        return res.status(403).json({general: 'Wrong credentials, please try again'})
        //}
        //else  return res.status(500).json({error : err.code});
    })

} 

//Add profile details
exports.addUserDetails = (req,res) =>{
    let userDetails= reduceUserDetails(req.body);

    db.doc(`/users/${req.user.handle}`).update(userDetails)
    .then(() =>{
        res.json("User profile update successfully");
    })
    .catch(err => {
        console.error(err)
        res.status(500).json({error : err });
    });
}

//get own user details
exports.getAuthenticatedUser = (req,res) => {
    let userData = {};
    db.doc(`/users/${req.user.handle}`)
    .get()
    .then((doc) => {
        if(doc.exists){
            userData.credentials = doc.data();
            return db.collection('likes').where('userHandle', "==", req.user.handle).get();
        }
    })
    .then((data) => {
        userData.likes = [];
        data.forEach((doc) => {
            userData.likes.push(doc.data());
        })
        return db.collection('notifications').where('recipient','==',req.user.handle)
                .orderBy('createdAt','desc').limit(10).get();
    })
    .then((data) =>{
        userData.notifications = [];
        data.forEach((doc) => {
            userData.notifications.push({
                recipient: doc.data().recipient,
                sender: doc.data().sender,
                read: doc.data().read,
                screamId: doc.data().screamId,
                type: doc.data().type,
                createdAt: doc.data.createdAt,
                notificationId : doc.id
            });
        });
        return res.json(userData);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).json({error : err.code} );
    })
}

//get user details
exports.getUserDetails = (req,res) =>{
    let userData = {};
    db.doc(`/users/${req.params.handle}`)
        .get()
        .then((doc) => {
            if(doc.exists){
                userData = doc.data()
                return db.collection('screams')
                        .where('userHandle','==',req.params.handle)
                        .orderBy('createdAt','desc')
                        .get();
                //return res.status(200).json(doc.data());
            }
            else{
                return res.status(404).json({error : 'No user found'})
            }
        })
        .then((data) => {
            userData.screams = [];
            data.forEach((doc) => {
                userData.screams.push({
                    body: doc.data().body,
                    createdAt: doc.data().createdAt,
                    userHandle: doc.data().handle,
                    userImage: doc.data().userImage,
                    likeCount: doc.data().likeCount,
                    commentCount: doc.data().commentCount,
                    screamId : doc.id
                });
            });
            return res.json(userData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error : err.code })
        });
}

//Mark notifications as read
exports.markNotificationsRead = (req, res) => {
    let batch = db.batch();
    console.log(req.body);

    req.body.forEach((notificationId) => {
      const notification = db.doc(`/notifications/${notificationId}`);
      batch.update(notification, { read: true });
    });
    batch
      .commit()
      .then(() => {
        return res.json({ message: 'Notifications marked read' });
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: err.code });
      });
  };
//Upload profile image
exports.uploadImage = (req,res) =>{
    const BusBoy = require('busboy');
    const path = require('path');
    const os  = require('os');
    const fs = require('fs');

    const busboy = new BusBoy({headers : req.headers });

    let imageFileName;
    let imageToBeUploaded;

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        if(mimetype !== 'image/jpeg' && mimetype !== 'image/png'){
            return res.status(400).json({error :'Wrong file format'})
        }

        const imageExtension = filename.split('.')[filename.split('.').length - 1 ];
        imageFileName = `${Math.round(Math.random() * 100000000000)}.${imageExtension}`;
        console.log( " imageFileName ======= " + imageFileName );

        const filePath = path.join(os.tmpdir(),imageFileName);
        imageToBeUploaded = {filePath, mimetype };
        
        file.pipe(fs.WriteStream(filePath));
    });
    console.log( " imageFileName ======= " + imageFileName );

    busboy.on('finish', () => {

        admin.storage().bucket().upload(imageToBeUploaded.filePath, {
            resumable : false,
            metadata:{
                metadata : {
                    contentType : imageToBeUploaded.mimetype
                }
            }  
        })
        .then(() =>{
            const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media` 
            return db.doc(`/users/${req.user.handle}`).update({imageUrl} );
        })
        .then(()=>{
            return res.json({message : 'Image uploaded successfully '})
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({error :err.code})
        })
    });
    busboy.end(req.rawBody);    
}