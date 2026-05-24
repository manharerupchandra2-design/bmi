const mysql = require('mysql2/promise')

const db = mysql.createPool(
 process.env.MYSQL_URL
);


console.log("MYSQL URL =", process.env.MYSQL_URL);

//const db = mysql.createPool({
//    host:"localhost",
//    user:"root",
//    password:"Rup1432@",
//    database:"data"
//})

async function checkDB(){
try{
    const conn=await db.getConnection();
    console.log("DB Connected");

    conn.release();
    }
   catch(err){
   console.log("DB Error",err)
   }
}
checkDB();
module.exports = db;