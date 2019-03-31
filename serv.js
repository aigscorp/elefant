let express = require('express');
let fs = require('fs');
let path = require('path');
let session = require('express-session');
let bodyParser = require('body-parser');
let port = process.env.PORT || 5000;

let MongoClient = require('mongodb').MongoClient;
// const url = 'mongodb://localhost:27017/';
// const url = 'mongodb://andrey25:Sk009bMz@ds229186.mlab.com:29186/tecama';
const url = 'mongodb://developer:sk009bmz@ds229186.mlab.com:29186/tecama';
const mongoClient = new MongoClient(url, {useNewUrlParser: true});
let curClient;
let dbname = 'tecama';

let app = express();

mongoClient.connect(function(err, client){
  if(err) {
    console.log(err);
    return;
  }
  curClient = client;
  let db = client.db(dbname);
  app.locals.collection = db.collection('users');
  app.locals.tasks = db.collection('tasks');
  console.log('Connected mongodb');
  app.listen(port, function(){
    console.log('Listening port:', port);
  });
});

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let tasksRouter = require('./routes/tasks');

app.use(session({
  secret: 'tecama',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000*60*30
  },
  key: 'key'
}));

app.use(function(req, res, next){
  if(!req.session.userId){
    let str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let userId = '';
    for(let i = 0, len = str.length; i < 20; i++){
      userId = userId + str[Math.floor(len * Math.random())];
    }
    req.session.userId = {id: userId, logged: false};
    // req.session.logged = false;  
  }
  // req.session.view = req.session.view++;
  let id = req.session.userId;
  // view++;
  // console.log('userId=',id);
  // req.session.view = view;
  next();
});

// app.use(bodyParser.json());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');
app.use(express.static(path.join(__dirname, 'public')));

// app.use(express.bodyParser({ keepExtensions: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// app.listen(port, ()=>{
//   console.log('Server on running on port: '+port);
// });

app.get('/elefant', function(req, res){
  fs.createReadStream(__dirname + '/index.html').pipe(res);
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/task', tasksRouter);

// app.post('/', function(req, res){
//   let index = +req.body.value;
//   res.status(200).json(chart_data[index]);
// });

// path='/users/reg'
// path='/task/add'
// path='/elefant'
// path='/'
// main page index.html method get path='/' список всех задач
// registration reg.html method post path='/users/reg' окно рег-ции пользователя логин, пароль
// task task.html method post path='/task/add' добавит задачу (текст, номер задачи)
// slon elefant.html method get path='/elefant' отобразить слона  