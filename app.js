   const express = require('express');
   const mysql = require('mysql2');
   const bodyParser = require('body-parser');
   const app = express();
   app.use(bodyParser.json());

   
   const db = mysql.createConnection({
     host: process.env.DB_HOST,         // 读取环境变量 host: 'rm-bp1pjf0zpp941a4h51o.mysql.rds.aliyuncs.com',
     user: process.env.DB_USER,         // 读取环境变量 user: 'athlimate_user',
     password: process.env.DB_PASSWORD, // 读取环境变量 password: '',
     database: process.env.DB_NAME      // 读取环境变量 database: 'athlimate_db'
   });

   app.post('/register', (req, res) => {
     const { phone, passwordHash, nickname } = req.body;
     db.query('SELECT * FROM users WHERE phone = ?', [phone], (err, results) => {
       if (results.length > 0) {
         return res.json({ code: 1, msg: '手机号已注册' });
       }
       db.query('INSERT INTO users (phone, passwordHash, nickname) VALUES (?, ?, ?)', [phone, passwordHash, nickname], (err) => {
         if (err) return res.json({ code: 2, msg: '数据库错误' });
         res.json({ code: 0, msg: '注册成功' });
       });
     });
   });

   app.post('/login', (req, res) => {
     const { phone, passwordHash } = req.body;
     db.query('SELECT * FROM users WHERE phone = ? AND passwordHash = ?', [phone, passwordHash], (err, results) => {
       if (results.length === 0) {
         return res.json({ code: 1, msg: '手机号或密码错误' });
       }
       res.json({ code: 0, msg: '登录成功', user: results[0] });
     });
   });

   app.post('/delete', (req, res) => {
     const { phone } = req.body;
     db.query('DELETE FROM users WHERE phone = ?', [phone], (err) => {
       if (err) return res.json({ code: 1, msg: '数据库错误' });
       res.json({ code: 0, msg: '注销成功' });
     });
   });

   app.listen(3000, () => console.log('Server running'));