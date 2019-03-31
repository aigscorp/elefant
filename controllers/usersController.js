let url = require('url');

exports.showUserReg = function(req, res){
  let logged = req.session.userId.logged;
  console.log('session=', logged);
  let auth = {logged: false, login: ''};
  if(logged){
    let collection = req.app.locals.collection;
    auth.login = 'Register';
    auth.logged = true;

    collection.findOne({id: req.session.userId.id}, (err, result)=>{
      if(err) return console.log('Error showUserReg:', err);
      // console.log('result:',result);
      if(result != undefined){
        auth.login = result.login;
        console.log('login=',result.login);
      }
      res.status(200).render('reg.html.twig', auth);
    }); 
       
    return;  
  }

  res.status(200).render('reg.html.twig', auth);
};

exports.addUserReg = function(req, res){
  // console.log(req.body);
  // let login = req.body.login;
  let session = req.session.userId.id;
  let logged = req.session.userId.logged;
  // console.log('register user now: ', logged);
  if(logged){
    res.render('reg.html.twig', {show: true, msg: 'Выйдете из текущего логина'});
    return;
  }
  // , id: session
  let user = {login: req.body.login, pass: req.body.pass, id: session};
  let collection = req.app.locals.collection;
  // let tasks = req.app.locals.tasks;
  // console.log(collection, tasks);
  console.log('user:', user);
  collection.findOne({login: req.body.login}, function(err, log){
    if(err) return console.log('Find Error:', err);
    // console.log('login:', log);
    // if(log.login != undefined)
    if(log != undefined){
      res.render('reg.html.twig', {show: true, msg: 'Такой логин существует'});
    }else{
      collection.insertOne(user, (err, result)=>{
        if(err) return console.log('Insert Error: ', err);
        // res.redirect(303, '/');
        res.redirect(url.format({
          pathname: '/',
          query: {value: 'Успешная регистрация', show: 'reg'}
        }));
      });
    }
    
  });
  // res.status(200).end('user added');

};