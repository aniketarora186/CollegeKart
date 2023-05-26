var express = require('express');
var router = express.Router();
const connection = require('./pool');
const bcrypt = require('bcrypt');
const saltRounds = 10;
var nodemailer = require('nodemailer');
var upload= require('./multer')

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: '9893107186annu@gmail.com',
    pass: 'dtdxlwxacrcjgkcl'
  }
});



/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/employeeinterface', function(req,res) {
  var dat = req.body;
 
  
  connection.query("SELECT * FROM student WHERE enrollment = ?",[dat.userid],function(err,res1){
    
    if(err){
    
    res.render('errorpage');}
    else
    {console.log(res1);
     
    console.log(res1[0].password);
    console.log(res1[0].sname);
  }
    
    bcrypt.compare(dat.pwd,res1[0].password, function(err, result) {
       
  if (result == true) 
  {console.log("Password Matched");
   res.render('user',{result:res1});}
  
  else {
  console.log("wrong password");
  res.render('errorpage');
  }
});  
  })   

  
});


router.post('/userinterface', upload.single('image'),function(req, res) {
  var data= req.body;
 
  bcrypt.hash(data.password, saltRounds, (err, hash) => {
  connection.query("insert into student( enrollment, sname, course, courseyear, password, mobile, email,image ) values(?,?,?,?,?,?,?,?)",[data.eid,data.name,data.course,data.courseyear,hash, data.mobile, data.email,req.file.filename],function(error, result){

  if(error)
  {
    res.render('errorpage');
  }
  else
  {
    res.render('Login')
    
  }
})
});


  
});



router.get('/forgetPassword', function(req,res){
  res.render('forget',{visible:0});
})

router.get('/getEmail', function(req,res){
  var data= req.query.eid;
  
  let OTP ='';
  connection.query('select email from student where enrollment=?',[req.query.eid],function(err,result){
    if(err){
    
    res.render('errorpage');}
    else
    console.log(result[0].email);
    
  
      var digits= '0123456789';
      
      for(let i=0;i<6;i++){
        OTP+= digits[Math.floor(Math.random()*10)];
      }
    var mailOptions = {
      to: result[0].email,
      subject: 'Forget Password',
      text: OTP
    };
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    res.render('forget',{visible:1,cotp:OTP,eid:req.query.eid})
 

  })
  
})

router.post('/getEmail',function(req,res){
  var data = req.body;
  
  if(data.otp === data.cotp){
    res.render('forgetpass',{visible: false, eid:data.eid})
  }
  else{
    res.render('errorpage');
  }
  
});

router.post('/updatePassword', function(req,res){
  var data = req.body;
 
  bcrypt.hash(data.pass, saltRounds, (err, hash) => {
  connection.query('update student set password=? where enrollment=?',[hash,data.enrollment], function(error,result){
    if(error){
   
    res.render('errorpage');}
    else
    console.log(result);
  })
})
  res.render('forgetpass',{visible:true,eid:data.enrollment})
});

router.post('/AddProduct',function(req,res){
  var data= req.body;
  
  res.render('addproduct',{sid:data.sid});
});

router.get('/AddProduct',function(req,res){
  var data= req.query;
 
  res.render('addproductuser',{sid:data.sid});
});

router.post('/AddProductToDatabase',upload.single('fileToUpload'), function(req,res){
  var data= req.body;
 
  connection.query('insert into product (pname,price,pdesc,pimg,sid) values(? ,? ,? ,? ,?)',[data.name,parseInt(data.price),data.desc,req.file.filename ,parseInt(data.sid)],function(err,result){
    if(err){
    
    res.render('errorpage');}
    else
    {
    res.render('productadded');}
  })
  
})

router.post('/viewproduct',function(req,res){
  
  connection.query('select pname,pimg,pdesc,price,sname from product natural join student where sid=?',[parseInt(req.body.sid)], function(err,result){
    if(err){
    
    res.render('errorpage');}
    else
   
    res.render('yourproducts', {result:result});
  })
  
})

router.post('/feedback',function(req,res){
  data=req.body;
 
  connection.query('insert into suggestion (name,email,suggestion) values (?, ?, ?)',[data.name,data.email,data.suggestion],function(error,result){
    if(error){
      res.render('errorpage');
    }
    else{
      var mailOptions = {
        to: data.email,
        subject: 'Greetings from CollegeKart!!',
        text: "Feedback Received"
      };
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    
      res.redirect('/homepage')
    }
    
  })
  })

  router.get('/faqu',function(err,res){
    res.render('faq');
  })


router.get('/ViewAllProduct',function(req,res){
  connection.query('select * from student natural join product', function(err,result){
    if(err){
      res.render('errorpage');
    }
    else{
      res.render('allproduct',{result:result});
    }
  })
})

router.get('/MyProducts',function(req,res){
  var data=req.query;
  connection.query('select * from product where sid=?',[data.sid],function(err,result){
    if(err){
      res.render('errorpage');
    }

    
    else{
      
      res.render('myproduct',{result:result,data:data.sid});
    }
  })
})

router.post('/UpdatePicture',upload.single('pimg'), function(req,res){
  var data= req.body;
  
  connection.query('update product set pimg=?  where pid=?',[req.file.filename ,parseInt(data.id)],function(err,res){
    if(err){
      res.render('errorpage');
    }
    
    else
    console.log("Data Updated");
  })
   res.render('imageupdated')
 
})

router.get('/deleteProduct',function(req, res){
  console.log(req.query.pid);
  
  connection.query("delete from product where pid=?",[req.query.pid],function(error,result){
    if(error){
      
      res.render('errorpage');
      
    }
    else{
      console.log(result);
      
    }
  
  });
  res.render('productdelete')
  })

  router.get('/fillProductData', function(req, res) {
    var data= req.query;
    
    connection.query('select * from product where pid=?',[data.id],function(err,result){
      if(err){
      console.log(err);
      res.render('errorpage');}
      else
      console.log(result);
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
    
    res.render('productupdated');
  });











module.exports = router;
