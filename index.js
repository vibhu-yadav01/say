const express = require("express");
const mysql = require('mysql2');
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const { faker } = require("@faker-js/faker");
const { count } = require("console");

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'anonymous',
    password: ''// your
});

let getRandomUser= ()=>{
    return[
        faker.string.uuid(),
        faker.internet.username(),
        faker.internet.email(),
        faker.internet.password(),
    ]
}
//one time code for entry the data
// let data = [];
// for (let index = 1; index <= 100; index++) {
//     data.push(getRandomUser());
    
// }
// let q = "INSERT INTO user(id, username, email, password) VALUES ?";
// try{
//     connection.query(q,[data],(err, result)=>{
//         if(err) throw err;
//         console.log(result);
//       });

//     }catch(err){
//      console.log(err);
//      res.send("some error in DB");
//     }
// connection.end();




//home route
app.get("/",(req, res)=>{
  let q = `SELECT count(*) FROM user`;
  try{
  connection.query(q,(err, result)=>{
      if(err) throw err;
      let count = result[0]["count(*)"];
      res.render("home.ejs", { count});
    });

  }catch(err){
   console.log(err);
   res.send("some error in DB");
  }
});

  //show route
  app.get("/user", (req, res)=>{
    let q = `SELECT * FROM user`;
    try{
      connection.query(q,(err, users)=>{
          if(err) throw err;
          res.render("showuser.ejs",{ users});
        });
  
      }catch(err){
       console.log(err);
       res.send("some error in DB");
      }
  })


//ADD
app.get("/user/add/form", (req,res)=>{
  res.render("add.ejs");
});

//adding
app.post("/user/add", (req, res) => {
  let current_id = faker.string.uuid();
  let { email: emailUser, username: usernameC, password: formPass } = req.body;

  console.log(emailUser);

  let q = `INSERT INTO user(id, username, email, password) VALUES (?, ?, ?, ?)`;
  let values = [current_id, usernameC, emailUser, formPass];

  try {
    connection.query(q, values, (err, result) => {
      if (err) throw err;
      res.redirect("/user");
    });
  } catch (err) {
    console.log(err);
    res.send("Some error in DB");
  }
});

//EDIT ROUTE
app.get("/user/:id/edit", (req, res)=>{
  let {id} = req.params;
  let q = `SELECT * FROM user WHERE id = '${id}'`
  try{
    connection.query(q,(err, result)=>{
        if(err) throw err;
        let user = result[0];
        res.render("edit.ejs", {user});
      });

    }catch(err){
     console.log(err);
     res.send("some error in DB");
    }
});

//UPDATE
app.patch("/user/:id", (req, res)=>{
  let {id} = req.params;
  let { password: formPass, username: newUsername } = req.body;
  let q = `SELECT * FROM user WHERE id = '${id}'`
  try{
    connection.query(q,(err, result)=>{
        if(err) throw err;
        let user = result[0];
        if(formPass != user.password){
          res.send("wrong password");
        }else{
          let q2 = `UPDATE user SET username = '${newUsername}' WHERE id = '${id}'`;
          connection.query(q2, (err, result) =>{
            if(err) throw err;
            res.redirect("/user");
          })
        }
      });
 
    }catch(err){
     console.log(err);
     res.send("some error in DB");
    }
});

//delete
app.get("/user/:id/delete", (req, res)=>{
    let {id} = req.params;
    let q = `SELECT * FROM user WHERE id = '${id}'`
    try{
      connection.query(q,(err, result)=>{
          if(err) throw err;
          let user = result[0];
          res.render("delete.ejs", {user});
        });
  
      }catch(err){
       console.log(err);
       res.send("some error in DB");
      }
  });
  
  //delete form
  app.delete("/user/:id", (req, res)=>{
    let { id } = req.params;
    let { email: userEmail, password: userPass} = req.body;
    let q = `SELECT * FROM user WHERE id = '${id}'`
    try{
      connection.query(q,(err, result)=>{
          if(err) throw err;
          let user = result[0];
          if(userEmail != user.email || userPass != user.password){
            res.send("INVALID DATA");
          }
          else{
            let q2 = `DELETE FROM user WHERE id = '${ id }'`;
            connection.query(q2, (err, result) =>{
              if(err) throw err;
              res.redirect("/user");
            })
          }
        });
   
      }catch(err){
       console.log(err);
       res.send("some error in DB");
      }
  })

app.listen("8080", ()=>{
    console.log("server started...");
});