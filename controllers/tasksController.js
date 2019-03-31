let url = require('url');

exports.showTask = function(req, res){
  let logged = req.session.userId.logged;
  // console.log('Task session=', logged);
  let auth = {logged: false, login: ''};
  if(logged){
    let collection = req.app.locals.collection;
    auth.logged = true;
    
    collection.findOne({id: req.session.userId.id}, (err, result)=>{
      if(err) return console.log('Error showUserReg:', err);
      // console.log('result:',result);
      if(result != undefined){
        auth.login = result.login;
        // console.log('login=',result.login);
      }
      res.status(200).render('addtask.html.twig', auth);
    }); 
    return;  
  }
  res.status(200).render('addtask.html.twig', auth);
};

exports.addTask = function(req, res){
  // console.log(req.body);
  let logged = req.session.userId.logged;
  if(!logged){
    console.log('Залогиньтесь');
    res.status(200).render('addtask.html.twig');
    return;
  } 
  let task = {
    numb: 0,
    user: '',
    theme: '',
    text: '',
    create: ''
  };

  // console.log(req.body);

  let collection = req.app.locals.collection;

  collection.findOne({id: req.session.userId.id}, (err, found)=>{
    if(err) return console.log('Error task Add:', err);
    if(found != undefined){
      let login = found.login;
      let tasks = req.app.locals.tasks;
      task.numb = +req.body.numb;
      task.user = login;
      task.theme = req.body.theme;
      task.text = req.body.task_text;
      task.status = false;
      let d = new Date();
      let str = d.toLocaleDateString() + " " + d.toLocaleTimeString();
      task.create = str;
      tasks.findOne({user: login, numb: +req.body.numb}, (err, result)=>{
        if(err) return console.log('Error add task too:', err);
        if(result != undefined){
          res.redirect(url.format({
            pathname: '/',
            query: {value: 'Такая задача уже существует', show: 'task'}
          }));
        }else{
          tasks.insertOne(task, (err, result)=>{
            if(err) return console.log('Error add task:', err);
            res.redirect(url.format({
              pathname: '/',
              query: {value: 'Задача успешно добалена', show: 'task'}
            }));
          });
        }

      });
    }else{
      res.end('Add task');
    }
   
  });
};

exports.editTask = function(req, res){
  // console.log('task_id=', req.body.task_id, ' user=', req.body.user_id);
  let tasks = req.app.locals.tasks;
  tasks.findOne({numb: +req.body.task_id, user: req.body.user_id}, (err, result)=>{
    if(err) return console.log('Error edit task:', err);
    console.log('result task=', result);
    if(result != undefined){
      // task_id = result.numb;
      // task_text = result.text;
      res.render('edit.html.twig', {task_id: result.numb, task_text: result.text, user_id: result.user});
    }else{
      res.end('Not found');
    }
    
  });
};

exports.saveTask = function(req, res){
  // console.log('task_id=', req.body.task_id, ' user=', req.body.user_id, ' text=', req.body.task_text);
  let tasks = req.app.locals.tasks;
  tasks.findOneAndUpdate({numb: +req.body.task_id, user: req.body.user_id},{$set: {text: req.body.task_text}},(err, result)=>{
    if(err) return console.log('Error update task', err);
    res.redirect(303, '/');
  });
  // res.end('save');
};
