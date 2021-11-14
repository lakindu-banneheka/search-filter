const express=require('express');
const cors=require('cors');
const app=express();
const pool=require('./db')

//middleware
app.use(cors());
app.use(express.json());


app.post("/todo",async(req,res)=>{
try {
    console.log(req.body)
    const {discription}=req.body;
    const newtodo=await pool.query("insert into pern_todo(discription) values ($1) returning *;",[discription]);
    res.json(newtodo.rows[0]);
  
}

 catch (err) {
   console.error(err.message) 
}

})
app.get('/todo',async(req,res)=>{
    try {
        const tb="pern_todo"
        const alltodo= await pool.query(`select * from ${tb}`);
        //res.json(alltodo.rows);
       // const homedbstudent=await pool.query("SELECT count(*) FROM teacher");
        console.log("gpt it")
        res.json(alltodo);
    } catch (err) {
        console.error(err.message)
    }
})

app.get('/todo/:id',async(req,res)=>{
    try {
      console.log(req.params)
      const {id}=req.params
      const atodo= await pool.query("select * from pern_todo where todo_id=$1",[id]) 
      res.json(atodo.rows[0]);
    } catch (err) {
        console.error(err.message) 
    }
})
app.put('/todo/:id',async(req,res)=>{
    try {
        const { id }=req.params;
        const{ discription }=req.body
        //const dis="discription"
        const uptodo= await pool.query('UPDATE pern_todo SET discription=$1  WHERE todo_id=$2',[discription,id]) 
        res.json("todo is updated")
    } catch (err) {
        console.error(err.message) 
    }
})
app.delete('/todo/:id',async(req,res)=>{
    try {
        const {id}=req.params;
        const deltodo= await pool.query("delete from pern_todo where todo_id=$1",[id])
        res.json("deleted todo");
    } catch (err) {
        console.error(err.message) 
    }
})

const PORT = process.env.PORT || 5008;
app.listen(PORT,()=>{
    console.log(`sever is listened ${PORT}`);
});





///////////AVAX//////////////
app.get('/homestudent',async(req,res)=>{
    try {
       
        const homedbstudent=await pool.query("SELECT count(*) FROM student");
        console.log("gpt student")
        res.json(homedbstudent.rows[0].count);
        console.log( homedbstudent.rows[0].count)
    } catch (err) {
        console.error(err.message)
    }
})

app.get('/hometeacher',async(req,res)=>{
    try {
       
        const homedbteacher=await pool.query("SELECT count(*) FROM teacher");  
        console.log("gpt teacher")
        res.json(homedbteacher.rows[0].count);
        console.log(homedbteacher.rows[0].count);
    } catch (err) {
        console.error(err.message)
    }
})
app.get('/classesteachers',async(req,res)=>{
    try {
        const classteacher=await pool.query("SELECT * FROM teacher");
        res.json(classteacher.rows);
       
    } catch (err) {
        console.error(err.message)
}

})
app.get('/classesstudents',async(req,res)=>{
    try {
        const classstudent=await pool.query("SELECT * FROM student");
        res.json(classstudent);
        console.log(classstudent);
    } catch (err) {
        console.error(err.message)
}

})
app.get('/classsearch/:id',async(req,res)=>{
    try {

         var sqlarray=[];  //to store data in sql query
         var q=0;         // to find how many values for include number of "and" in sql query   
         var sqlquery='select * from teacher where '; //basic sql query
         var t=0;       //to out the "sqlarray" elements on time
         const column=["type","district","rate"];  // all column in sql table wich using for searching 
        const searchdata=req.params.id        
        const searcharray=searchdata.split(","); //to store split searchdata 
        //console.log(searcharray);
        for(var i in searcharray){
            if(searcharray[i] != ''){
            q=q+1;
            }
            
        }
        for(var i in searcharray){          
           // console.log(searcharray[i]);
            if(searcharray[i] != ''){
                t=t+1;
                if(q>1){
                    sqlquery=sqlquery+column[i]+'=$'+t+' and ';
                    q=q-1;
                    sqlarray.push(searcharray[i]);
                }
                else{
                    sqlquery=sqlquery+column[i]+'=$'+t;
                    sqlarray.push(searcharray[i]);
                }
            }
        }
        //console.log(sqlarray)
       // console.log(sqlquery);
       // const sqlvar=[searcharray[0],searcharray[1],searcharray[2]]
        //const sql='select * from teacher where '+ data[0] + '= $1 and '+ data[1] +'=$2 and '+ data[2]+'=$3'
        const classsearch=await pool.query(sqlquery,sqlarray)
        res.json(classsearch.rows);
       // console.log(classsearch.rows);
       
    } catch (err) {
        console.error(err.message)
    }
})