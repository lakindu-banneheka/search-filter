const express=require('express');
const morgan=require('morgan');
const { result } = require('lodash');
const {Client} = require('pg');
const bodyParser=require('body-parser');
const fileupload=require('express-fileupload');
const multer = require('multer');
const path =require('path');
const fs = require('fs');
const getobject=require('./get');
const postobject=require('./post');
const baseobject=require('./base');
//databse

const client = new Client({
    
    host:"localhost",
    user:"postgres",
    port:5432,
    password:"20011002nimeth",
    database:"sql_demo"
 })
 client.connect();

//database connect over here
const app=express();



app.set('view engine','ejs');
app.use(express.urlencoded({extended:true}));
app.listen(5000);

app.use(morgan('tiny'));

app.use('/assets',express.static('assets'));


app.get('/',(req,res)=>{

    const blogs=[
        {title:'dogdh dho hdo ' ,snippet:'hallo hallo hallo'},
        {title:'dogdh dho hdo ' ,snippet:'hallo hallo hallo'},
        {title:'dogdh dho hdo ' ,snippet:'hallo hallo hallo'},
    ];
    
    res.render('index', { title1: 'Home' ,blogs});

});


const storage_ProfileImg = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'images');
     },
    filename: function (req, file, cb) {
        cb(null ,'sl'+ path.extname(file.originalname));
        itype=path.extname(file.originalname);
    }
});
const upload_profileImg = multer({ storage: storage_ProfileImg });

app.post('/blogs',(req,res)=>{

    
    console.log(req.body);
    const mem=req.body;
    const agef=parseInt(mem.age);
    const telf=parseInt(mem.tel);
  
  //  var sql=`INSERT INTO member VALUES($1,$2,$3,$4,$5)`,[mem.name,agef,mem.country,telf,mem.gender] ;
 client.query(`INSERT INTO member VALUES($1,$2,$3,$4,$5)`,[mem.name,agef,mem.country,telf,mem.gender],(err,result)=>{
    if(!err){
    console.log(result.rows)
    //console.log("got it")
   
    }
    else{
        console.log(err.message);
    }
    client.end;
})
res.send(req.body);

})


app.post('/pic',upload_profileImg.single('image'),(req,res) => {  
   //res.redirect('create')
 // console.log('hell')
  // console.log(req.body.memnumber);
   var mid=req.body.memberid;
   var imgtype=req.body.imgtype;
   var imgnumber=req.body.imgnumber;

 //  var munmstring = toString(mnum);
//var iname=path.extname(req.body.image);
   console.log(itype); 
 
var ol='./images/sl'+itype;
var nl='./'+imgtype+'/'+mid+'_'+imgnumber+itype;
fs.rename(ol,nl,renameCallback);
function renameCallback(error){
if(error){
    console.log(error.message)
    console.log('test wrong');
    res.render('about');
}
else{
    console.log('good');
    res.redirect('create')
}

}


});

app.get('/about',(req,res)=>{
   res.render('about');
});

app.get('/create',(req,res) =>{
    res.render('create');
})
app.use((req,res)=>{
 res.render('404',{ title1: 'hoow'});
});


