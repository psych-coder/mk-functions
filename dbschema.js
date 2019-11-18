let db = {
    users :[
        {
            userId : 'Hc6HlXLh5DOpYNjiapJhbAeqGM73',
            email: 'new2@email.com',
            handle: 'new2',
            createdAt: '2019-10-09T11:27:07.348Z',
            imageUrl : '/image/img',
            bio: 'Hello, My name is New',
            website : 'http://bygokul.blogspot.com',
            location: 'Chennai, India'
        }
    ],
    screams : [
        {
            userHandle: "user",
            body: "Description of the user",
            createdAt: "2019-10-03T11:23:48.377Z",
            likeCount: 5,
            commentCount: 2
        }
    ],
    comments: [
        {
            userHandle : 'user',
            screamId : 'slfksdlfj123q',
            body : "Nice one gokul",
            createdAt : '2019-10-03T11:23:48.377Z'
        }
    ],
    notifications:[
        {
            recipient: 'user',
            sender: 'Gokul',
            read: 'true|false',
            screamId: 'sldf13sd1jkdsfd',
            type: 'like|comment',
            createdAt: '2019-10-03T11:23:48.377Z'
        }
    ],
    information : [
        {
            body : "First post",
            cardImage: "",
            commentCount:0,
            createdAt:'2019-10-03T11:23:48.377Z',
            likeCount:0,
            shortDesc:'',
            tags:'tags,tag',
            topic:'topic',
            userhandle:'sdf23324df'
        }
    ]
    
}

const userDetails = {
    credentials : {
        userId : 'Hc6HlXLh5DOpYNjiapJhbAeqGM73',
        email: 'new2@email.com',
        handle: 'new2',
        createdAt: '2019-10-09T11:27:07.348Z',
        imageUrl : '/image/img',
        bio: 'Hello, My name is New',
        website : 'http://bygokul.blogspot.com',
        location: 'Chennai, India'
    },
    likes : [
        {
            userHandle: 'user',
            screamId :'lkjsd213211sdf'
        },
        {
            userHandle: 'user',
            screamId :'ad   sd221313211sdf'
        }
    ]
}