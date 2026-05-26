const db = require('../config/db')

exports.createUser = async (req, res) => {

  try {

    const {
      name,
      mobile,
      weight,
      feet,
      inch,
      record_date
    } = req.body;
    console.log(res.body);
    const [checkUser] = await db.execute(
      "SELECT * FROM users WHERE mobile=?",
      [mobile]
    );

    if (checkUser.length > 0) {

      return res.status(400).json({
        success: false,
        message: "Mobile already exists"
      });
    }

    const insertUserSql = `
INSERT INTO users(name,mobile)
VALUES(?,?)
`;

    const [userResult] = await db.execute(
      insertUserSql,
      [name, mobile]
    );

    const userId = userResult.insertId;

    const totalInch = (feet * 12) + inch;

    const heightInCm = totalInch * 2.54;

    const heightMeter = heightInCm / 100;

    const bmi = (
      weight / (heightMeter * heightMeter)
    ).toFixed(2);

    let bmiStatus = "";

    if (bmi < 18.5) {
      bmiStatus = "UnderWeight";
    }
    else if (bmi < 25) {
      bmiStatus = "Normal";
    }
    else if (bmi < 30) {
      bmiStatus = "OverWeight";
    }
    else {
      bmiStatus = "Obese";
    }

    const recordSql = `
INSERT INTO bmi_records
(
user_id,
weight,
feet,
inch,
height_in_cm,
bmi,
bmi_status,
record_date
)
VALUES(?,?,?,?,?,?,?,?)
`;

    await db.execute(recordSql, [
      userId,
      weight,
      feet,
      inch,
      heightInCm,
      bmi,
      bmiStatus,
      record_date
    ]);

    return res.status(200).json({
      success: true,
      message: "User Created",
      bmi,
      bmiStatus
    });

  }
  catch (err) {

    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
}

exports.addBmiRecord = async (req, res) => {

  try {

    const user_id = req.params.user_id;

    const {
      weight,
      feet,
      inch,
      record_date
    } = req.body;

    const [user] = await db.execute(
      "SELECT * FROM users WHERE id=?",
      [user_id]
    );

    if (user.length === 0) {

      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    const [already] = await db.execute(
      'SELECT * FROM bmi_records WHERE user_id=? AND record_date=?',
      [user_id, record_date]
    );

    if (already.length > 0) {
      return res.status(400).json({
        success: false,
        message: "BMI already added for this date"
      });
    }
    const totalInch = (feet * 12) + inch;

    const heightInCm = totalInch * 2.54;

    const heightMeter = heightInCm / 100;

    const bmi = (
      weight / (heightMeter * heightMeter)
    ).toFixed(2);

    let bmiStatus = "";

    if (bmi < 18.5) {
      bmiStatus = "UnderWeight";
    }
    else if (bmi < 25) {
      bmiStatus = "Normal";
    }
    else if (bmi < 30) {
      bmiStatus = "OverWeight";
    }
    else {
      bmiStatus = "Obese";
    }

    const sql = `
INSERT INTO bmi_records
(
user_id,
weight,
feet,
inch,
height_in_cm,
bmi,
bmi_status,
record_date
)
VALUES(?,?,?,?,?,?,?,?)
`;

    await db.execute(sql, [
      user_id,
      weight,
      feet,
      inch,
      heightInCm,
      bmi,
      bmiStatus,
      record_date
    ]);

    return res.status(200).json({
      success: true,
      message: "New BMI Record Added",
      bmi,
      bmiStatus
    });

  }
  catch (err) {

    console.log(err);

    return res.status(500).json({
      success: false,
      message: err
    });
  }
}

exports.getAllUser = async (req, res) => {
  try {
    const sql = `SELECT
                       u.id,
                       u.name,
                       u.mobile,
                       b.weight,
                       b.height_in_cm,
                       b.bmi,
                       b.bmi_status,
                       b.record_date
                   FROM users u
                   LEFT JOIN bmi_records b
                   ON b.id = (
                       SELECT id
                       FROM bmi_records
                       WHERE user_id = u.id
                       ORDER BY record_date DESC, id DESC
                       LIMIT 1
                   )`
    const [userList] = await db.query(sql);

    console.log(userList)
    if (userList.length === 0) {
      return res.status(200).json({
        success: false,
        message: "Empty List"
      })
    }
    return res.status(200).json({
      success: true,
      message: "Fetched Successfully",
      data: userList
    })

  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    })
  }
}

exports.updateUser = async (req, res) => {
  try {
    const id = req.params.id
    const { name, mobile } = req.body;
    const sql = "select * from users where id =?";
    const [row] = await db.query(sql, [id]);

    if (row.length === 0) {
      return res.status(400).json({
        success: false,
        message: "User not found"
      })
    }

    const checkSql = "Select * from users where mobile=? and id!=?";

    const [checkNum] = await db.query(checkSql, [mobile, id]);
    if (checkNum.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Mobile number already exist"
      })
    }


    const updatesql = "update users set name=? , mobile=? where id =?";
    await db.execute(updatesql, [name, mobile, id]);

    return res.status(200).json({
      success: true,
      message: "Updated"
    })


  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    })
  }
}

exports.getHistory=async(req,res)=>{
try{
  const id = req.params.id;

  const sql = `select u.id,u.name,b.weight,b.height_in_cm,b.bmi,b.bmi_status,b.record_date
from users u left join bmi_records b on u.id=b.user_id
where u.id=? order by record_date desc`;

const [row]=await db.query(sql,[id])

  console.log(row)
    if (row.length === 0) {
      return res.status(200).json({
        success: false,
        message: "Empty List"
      })
    }
return res.status(200).json({
  success:true,
  message:"Data Got!!!",
  data:row
})

}catch(err){
  console.log(err);
  return res.status(500).json({
    success:false,
    message:err.message
  })
}
}
// exports.deleteById = async (req, res) => {
//   try {

//     const id = req.params.id;

//     const sql = 'DELETE FROM bmi_records WHERE id = ?';

//     const [result] = await db.execute(sql, [id]);

//     if (result.affectedRows === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'Record not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Deleted successfully'
//     });

//   } catch (error) {

//     console.log(error);

//     res.status(500).json({
//       success: false,
//       message: 'Internal server error'
//     });
//   }
// };