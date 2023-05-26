var express = require('express');
const app = require('../app');
var router = express.Router();
const bodyParser = require('body-parser');
const connection = require('./pool');
var upload= require('./multer');
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: '9893107186annu@gmail.com',
    pass: 'dtdxlwxacrcjgkcl'
  }
});

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/adminpage', function(req, res) {
  res.render('adminpage',{ adminid: req.query.adminid, adminpwd: req.query.adminpwd })
});

router.post('/adminpage', function(req, res) {
  var data= req.body;
  console.log(data);
  res.render('adminpage',{data:data});
});
router.get('/deleteUser',function(req, res){
  console.log(req.query.sid);
  
  connection.query("delete from student where sid=?",[req.query.sid],function(error,result){
    if(error){
     
      res.render('errorpage');
    }
    else{
      
      res.redirect('/showStudent');
    }
  
  });
  
  })

router.get('/fillUserData', function(req, res) {
  var data= req.query;
  console.log(data.id);
  connection.query('select * from student where sid=?',[data.id],function(err,result){
    if(err){
   
    res.render('errorpage')}
    else
    
    res.render('updateuser',{res:result})
  })
 
});

router.post('/updateInfo', function(req,res){
  
  var data= req.body;
  


  connection.query("update  student set sname=?,course=?, courseyear=?, email=?, mobile=?, enrollment=? where sid =?",[data.name,data.course,parseInt(data.courseyear), data.email,parseInt(data.number),data.enrollment,parseInt(data.sid)], function(error, result){

    if(error){
      
      res.render('errorpage');
    }
  
  })
  
  res.redirect('/showStudent');
});


router.get('/viewproduct',function(req,res){
  connection.query('select * from product natural join student', function(err,result){
    if(err){
   res.render('errorpage');
     }
    else
    
    res.render('viewproducts', {result:result});
  })
  
})

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

router.get('/deleteProduct',function(req, res){

  
  connection.query("delete from product where pid=?",[req.query.pid],function(error,result){
    if(error){
     
      res.render('errorpage');
    }
    else{
      
      res.redirect('viewproduct');
    }
  
  });
  
  })

  router.get('/fillProductData', function(req, res) {
    var data= req.query;
    
    connection.query('select * from product where pid=?',[data.id],function(err,result){
      if(err){
    
      res.render('errorpage');}
      else
      
      res.render('updateproduct',{res:result})
    })
   
  });
  
  router.post('/updateProduct' ,function(req,res){
    
    var data= req.body;
    
   
  
  
    connection.query("update  product set pname=?,pdesc=?, price=? where pid =?",[data.name,data.desc,parseInt(data.price),parseInt(data.pid)], function(error, result){
  
      if(error){
        
        res.render('errorpage');
      }
    
    })
    
    res.redirect('viewproduct');
  });

  router.post('/UpdatePicture',upload.single('pimg'), function(req,res){
    var data= req.body;
   
    connection.query('update product set pimg=?  where pid=?',[req.file.filename ,parseInt(data.id)],function(err,res){
      if(err){
      
      res.render('errorpage');}
      else
      console.log("Data Updated");
    })
    res.redirect('viewproduct');
  })


router.get('/viewsuggestions',function(req,res){
  connection.query('select fid,name,email,suggestion from suggestion',function(error,result){
    if(error){
     
      res.render('errorpage');
    }
    else{
      res.render('suggestion',{result:result});
    }
  })
  
})

router.post('/sendresponse',function(req,res){
  var data=req.body;
 
  
  connection.query('select email from suggestion where fid=?',[data.fid],function(err,result){
    if(err){
      
      res.render('errorpage');
    }
    else{
      

      var mailOptions = {
        to: result[0].email,
        subject: 'Greetings From CollegeKart!!',
        text: data.txt
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

    }
  })
  res.redirect('viewsuggestions');
})

router.post('/UpdateStudentPicture',upload.single('img'), function(req,res){
  var data= req.body;
 
  connection.query('update student set image=?  where sid=?',[req.file.filename ,parseInt(data.student_id)],function(err,res){
    if(err){
    
    res.render('errorpage');}
    else
    console.log("Data Updated");
  })
  res.redirect('showStudent');
})
  




module.exports = router;