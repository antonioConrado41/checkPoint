const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const passportLocal = require("passport-local").Strategy;
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const bodyParser = require("body-parser");
const app = express();
const User = require("./user");
const Roster = require("./roster");
const { Store } = require("express-session");
const db = process.env.MONGO_URI;
const objectId  = require('mongodb').ObjectID;

mongoose.connect(
  db,       //Mongo_uri
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("Mongoose Is Connected");
  }
);

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000", // <-- location of the react app 
    credentials: true,
  })
);
app.use(
  session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(cookieParser("secretcode"));
app.use(passport.initialize());
app.use(passport.session());
require("./passportConfig")(passport);

// Routes


  app.post("/login", (req, res, next) => {
  passport.authenticate("local",(err, user, info) => {
    if (err) throw err;
    if (!user) res.send("No User Exists");
    else {
      req.logIn(user, (err) => {
        if (err) throw err;
        //res.send("Successfully Authenticated");
         var _id = req.user.id;
         res.send(JSON.stringify(_id));
        // //res.redirect(302, './roster/'+_id) //string interpolation works in ES6
        // console.log(_id);
      });
    }
  })(req, res, next);
  });

app.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }, async (err, doc) => {
    if (err) throw err;
    if (doc) res.send("User Already Exists");
    if (!doc) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const newUser = new User({
        email: req.body.email,
        password: hashedPassword,
      });
      await newUser.save();
      res.send("User Created");
    }
  });
});
app.get("/user", (req, res) => {
  res.send(req.user); // The req.user stores the entire user that has been authenticated inside of it.
});

app.get('/roster/', (req, res) => {
  const _id= req.params._id

Roster.aggregate([
    { $unwind: '$week' },
   {
       $lookup: {
         from: 'store',
         localField: 'week.store_id',
         foreignField:'_id',
         as: 'user_roster',
       },
     },
     {
       $project: {
         week: 1,
         roster: {
           $arrayElemAt: ['$user_roster', 0],
         },
       },
     }], function (err, doc){
       console.log(err)
       res.send(doc);
     })
} )

app.get('/roster/:_id', (req, res) => {
  const _id= req.params._id

Roster.aggregate([
  {
    $match: {
    userId: objectId(_id)
  }
},
    { $unwind: '$week' },
   {
       $lookup: {
         from: 'store',
         localField: 'week.store_id',
         foreignField:'_id',
         as: 'user_roster',
       },
     },
     {
       $project: {
         week: 1,
         roster: {
           $arrayElemAt: ['$user_roster', 0],
         },
       },
     }], function (err, doc){
       console.log(err)
       res.send(doc);
     })
} )

app.get('/info', (req, res) => {
  db.Users.aggregate([
    
    {
      $lookup:{
        from: 'roster',
        as: 'roster',
        let: { userId : "$_id"},
        pipeline: [
          {$match: {$expr: {$eq:['$userId', '$$userId']}}}
        ]
      }
  
    }, 
    {
      $project: {
        week: 1,
        roster: {
          $arrayElemAt: ['$user_roster', 0],
        },
      },
    }], function (err, doc){
    console.log(err)
    res.send(doc);
  })
} )

app.get('/logout', function(req, res){
  req.logout();
 // res.redirect('/');
});

app.get('/' , function(req,res){
console.log("Back to homepage!")

})

//Start Server
app.listen(4000, () => {
console.log("Server Has Started");
});
