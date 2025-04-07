const express = require("express");
const mysql = require('mysql2');
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const { faker } = require("@faker-js/faker");

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
connection.end();
app.use(express.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.listen("8080", ()=>{
    console.log("server started...");
});