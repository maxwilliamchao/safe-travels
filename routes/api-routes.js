var db = require("../models");

module.exports = function(app) {
  app.get("/", function(req, res) {
  res.render("login_signup");
  });

  app.get("/search", function(req, res) {
    res.render("index");
  });

  app.post("/api/users", function(req, res) {
    console.log(req.body);
    //go through a series of account info validations and send the response back to client if any issue(s)
    var isPasswordUnique;
    var isUserNameUnique;
    var isEmailUnique;
    var arePasswordsEqual;

    //run a query to check if the user already exists in the database
    db.User.findOne({
      where : {
        $or : {
          userName : req.body.UserName,
          password : req.body.password,
          email : req.body.email
        } 
      }
    }).then(function(dbUser) {
      //console.log(dbUser);

      //first check if the passwords entered are exactly same
      if (req.body.password !== req.body.passConfirm) {
        console.log("passwords do not match!");
        res.json({
          passwordIssue : true});
      }
      //else if there is no data in the db
      else if (!dbUser) {
        console.log("new user added to account!");
        //go ahead and insert new account into database
        db.User.create({
          firstName : req.body.firstName,
          lastName : req.body.lastName,
          email: req.body.email,
          userName: req.body.userName,
          password: req.body.password
        }).then(function(result){
          //just send the same response as in the above if in order for the client-side validation logic to work
          res.json({
            outcome : "success"
          });
        });
      } 
      //else it means there is data, and need to respond with an object
      else if (dbUser) {
        console.log("the account into already exists in the db!")
        console.log(dbUser);
        res.json(dbUser);
      }
    }); //end of findOne method
  }); //end of app.post("/api/users")

}; //end of module export
