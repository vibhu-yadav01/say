const express = require("express");
const mysql = require('mysql2');
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const { faker } = require("@faker-js/faker");
const { count } = require("console");

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'anonymous',
    password: '#V@ibh@v#2503#'
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
app.use(express.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));



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

//show user
app.get("/user", (req, res)=>{
    let q = `SELECT * FORM user`;
    try {
        connection.query(q,(err, result)=>{
            if(err) throw err;
            res.render("showuser.ejs",{user})
        })
    } catch (error) {
        console.log(err);
        res.send("some error in DB");
    }
})

app.listen("8080", ()=>{
    console.log("server started...");
});