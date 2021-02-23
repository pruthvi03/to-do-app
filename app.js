const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const ToDoTask = require('./models/ToDoTask');

const dotenv = require('dotenv');
dotenv.config();

app.set("view engine","ejs");
app.set('views',path.join(__dirname,'views'));
app.use("/static",express.static("public"));
app.use(express.urlencoded({extended:true}));

mongoose.set('useFindAndModify',false);
mongoose.connect(process.env.DB_CONNECT,
    {
        useCreateIndex:true,
        useUnifiedTopology:true,
        useNewUrlParser:true
    },
    ()=>{console.log("connected to db!");}
);

app.get("/",(req,res)=>{
    ToDoTask.find({})
    .then(todolist=>{res.render('todo.ejs',{todolist});})
    .catch(err=>{console.log(err);});
    
});

app.post("/remove",(req,res)=>{
    ToDoTask.deleteOne({_id:req.body.id})
    .then(emp => {
        res.redirect("/");
    })
    .catch(err=>{
        console.log(err);
    });
});

app.post("/edit",(req,res)=>{
    const id = req.body.id;
    ToDoTask.find({})
    .then(todolist=>{
        res.render("todoedit.ejs",{todolist,id});
    })
    .catch(err=>{
        console.log(err);
    });
});

app.post("/edited",(req,res)=>{
    ToDoTask.updateOne({_id:req.body.id},{$set:{
        content: req.body.edit_text
    }})
    .then(todolist=>{
        res.redirect("/");
    })
    .catch(err=>{
        console.log(err);
    });
});
app.post("/",async (req,res)=>{
    const todolist = new ToDoTask({
        content: req.body.todo_task
    });
    ToDoTask.create(todolist)
    .then(todolist=>{
        console.log("sucessfull");
        res.redirect("/");
    }
    ).catch(err=>{
        console.log(err);
        res.redirect("/");
    }

    );
    
});

app.listen(3000,()=>{
    console.log("Server is running on port 3000");
});