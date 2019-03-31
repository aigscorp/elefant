// let express = require('express');
// let pool = require('../db/pool');


exports.main = function (req, res) {
  // console.log('QUERY = ', req.query);
  try {
    // console.log(req.app.locals.collection);
    let collection = req.app.locals.collection;
    let task = req.app.locals.tasks;

    collection.find().toArray(function(err, result){
      // console.log(result[0]);
      // let auth = {logged: false, msg: ''};
      let logged = false; 
      let login = '';
      if(req.session.userId.logged){
        logged = true;
        login = 'Аттестован';
        // console.log('results:', result);
        let len = result.length;
        for(let i = 0; i < len; i++){
          if(result[i].id == req.session.userId.id){
            login = result[i].login;
            break;
          }
        }

      }
      let mess = {};
      // mess.result = result;
      mess.logged = logged;
      mess.login = login;
      if(req.query.show == 'task'){
        mess.newtask = req.query.value;
      }
      if(req.query.show == 'reg'){
        mess.newuser == req.query.value;
      }

      task.find().toArray(function(err, resultTask){
        if(err) return console.log('Error find Task:', err);
        mess.result = resultTask;
        let lens = mess.result.length;
        for(let i = 0; i < lens; i++){
          if(mess.result[i].user == login){
            mess.result[i].logged = true;
          }
        }
        // mess.logged = req.session.userId.logged;
        // console.log('mess=', mess);
        res.status(200).render('listtask.html.twig', mess);
      });

      // {result: result, newuser: value, logged: logged, msg: msg}
      // res.status(200).render('listtask.html.twig', mess);
    });
    
  }catch (e) {
    throw new Error(e);
  }
};

exports.login = function(req, res){
  let collection = req.app.locals.collection;
  let tasks = req.app.locals.tasks;
  // let user = req.session.userId;
  collection.findOne({login: req.body.user}, (err, result)=>{
    if(err) return console.log(err);
    let auth = {logged: false, login: ''};
    if(result != undefined){
      // console.log(result);
      if(result.pass != req.body.pass.trim()){
        auth.login = 'Неверный пароль';
      }else{
        auth.logged = true;
        auth.login = req.body.user;
        req.session.userId.logged = true;
      }
    }else{
      // console.log('Not found');
      auth.login = 'Нет такого логина';
    }

    tasks.find().toArray((err, results)=>{
      if(err) return console.log('Error find tasks:',err);
      auth.result = results;
      console.log('auth before update', auth);
      if(auth.logged){
        collection.updateOne(
          {login: req.body.user},
          {$set: {id: req.session.userId.id}},
          function(err, result){
            if(err) return console.log('Error updateOne:',err);
            res.redirect(303, '/');   
          });
      }else{
        res.status(200).render('listtask.html.twig', auth);
      }
    });
    
  });  
  
};

exports.logout = function(req, res){
  req.session.userId.logged = false;
  req.session.destroy();
  res.redirect(303, '/');
};

exports.query = function (req, res){
  let tasks = req.app.locals.tasks;
  tasks.find({numb: req.body.numb}, {projection: {_id: 0}}).toArray((err, result)=>{
    if(err) return console.log('Error ajax:', err);
    let data = '';
    if(result != undefined){
      data = result;
    }
    res.json(data);
  });
};