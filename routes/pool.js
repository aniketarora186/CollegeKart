const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  port:3306,
  user: 'root',
  password: 'root123',
  database: 'collegekart',
  multipleStatements: true,
  
  
  
});

connection.connect((err) => {
    if (err) {
      console.error('Error connecting to database: ' + err.stack);
      return;
    }
    console.log('Connected to database as ID ' + connection.threadId);
  });


module.exports= connection;
  