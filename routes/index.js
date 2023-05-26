var express = require('express');
const app = require('../app');

var router = express.Router();
const bodyParser = require('body-parser');
const connection = require('./pool');
const bcrypt = require('bcrypt');
const saltRounds = 10;
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get('/homepage', function(req, res) {
  res.render('index');
});

router.get('/showStudent',function(req,res){
    connection.query("select * from student", function(error, result){

      if(error){
        res.render('errorpage');
        
      }
      else{
        res.render('viewstudents',{result:result})
      }
    })
  })

  

module.exports = router;
