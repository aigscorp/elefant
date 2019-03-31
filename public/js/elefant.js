window.onload = function(){
  // let colors = ['red','green','orange','blue','lime','navy','olive','brown','yellow',''];
  let colors = ['#007bff','#6610f2','#6f42c1','#e83e8c','#dc3545',
                '#fd7e14','#FFFF00','#28a745','#20c997','#17a2b8',
                '#DAA520','#343a40','#007bff','#0000CD','#7CFC00',
                '#17a2b8','#ffc107','#BDB76B','#F0E68C','#dc3545'];
  // blue, indigo, purple, pink, red, orange, yellow, green, teal, cyan, gray, gray-dark, 
  // primary, secondary, success, info, warning, danger, light, dark
  let elefant = [];
  
  let svg = document.getElementById('svg');
  let svgdoc = svg.contentDocument;
  
  let elemg = svgdoc.getElementsByTagName('g');
  let len = elemg.length;
  
  for(let i = 0; i < len; i++){
    let part = {};
    let path = elemg[i].getElementsByTagName('path');
    elemg[i].addEventListener('click', (ev)=>{
      // console.log(elefant[i].num);
      let data = {numb: elefant[i].num};
      let xhr = new XMLHttpRequest();
      xhr.addEventListener('readystatechange', ()=>{
        if(xhr.readyState == 4){
          // console.log(JSON.parse(xhr.response));
          let tasks = JSON.parse(xhr.response);
          // console.log('tasks=',tasks);
          // let popup = document.createElement('div');
          // console.log("№=", data.numb);
          let lens = tasks.length;
          let str_users = '';
          let str_theme = '';

          let txt = [];
          for(let i = 0; i < lens; i++){
            let str_txt = {date: '', user: '', txt: ''};
            str_txt.date = tasks[i].create;
            str_txt.user = tasks[i].user;
            str_txt.txt = tasks[i].text;
            if(lens - 1 == i){
              str_users += tasks[i].user;
              str_theme += tasks[i].theme;
            }else{
              str_users += tasks[i].user + ', ';
              str_theme += tasks[i].theme + ', ';
            }
            txt.push(str_txt);
          }

          let modal_header = document.getElementsByClassName('modal-header')[0];
          modal_header.innerHTML = 'Задача № ' + data.numb;
          let users = document.getElementById('users');
          users.innerHTML = "Пользователи: " + str_users;
          let theme = document.getElementById('theme');
          theme.innerHTML = "Тема: " + str_theme;
          let head_txt = document.getElementById('head-txt');
          head_txt.innerText = 'Текст';
          for(let i = 0; i < txt.length; i++){
            let tagp = document.createElement('p');
            let stcolor = 'color:' + colors[data.numb-1];
            tagp.innerHTML = `<span class="mod-color" style="${stcolor}">` + "Создано " + txt[i].date + ", пользователем " +  txt[i].user + "</span><br>" + txt[i].txt;
            head_txt.appendChild(tagp);
            let temp = `222332`;
          }
          // console.log(xhr.response);
          /////////////////////////////////////////////////////////////////////////////

          $('#exampleModalCenter').modal({
            keyboard: false
          })
          /////////////////////////////////////////////////////////////////////////////




        }
      });

      xhr.open('POST', '/elefant'); //http://localhost:5000/
      xhr.setRequestHeader('cache-control', 'no-cache');
      xhr.setRequestHeader('content-type','application/json;charset=utf-8');
      xhr.send(JSON.stringify(data));

    });
    for(let j = 0, lens = path.length; j < lens; j++){
      let main = path[j].getAttribute('main');
      if(main){
        path[j].style.fill = colors[i];
        // path[j].style.stroke = colors[i];
        part.num = +main;
        part.color = colors[i];
      }
      if(path[j].getAttribute('num')){
        path[j].style.fill = 'black';
      }
      if(path[j].getAttribute('circle')){
        path[j].style.fill = colors[i]; //'rgb(240,240,240)';
      }
      if(path[j].getAttribute('spot')){
        path[j].style.fill = 'black';
      }
      if(path[j].getAttribute('paw')){
        path[j].style.fill = 'wheat'; //colors[i];
      }
    }
    elefant.push(part);
  }

  // svgdoc.addEventListener('mousedown', (ev)=>{
  //   console.log(ev.clientX, ev.clientY);
  //   // point.x = ev.clientX;
  //   // point.y = ev.clientY;
  // });
};


// index.html, reg.html