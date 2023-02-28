const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
//
const socketServer = require('ws').Server;//npm install ws
const PORT = 3001;
//建立express物件，綁定監聽port
const server = express().listen(PORT,()=>{
  console.log('listen')
});
// 將express交給socketServer來開啟websocket服務
const wss = new socketServer({server});
// client進行連線
wss.on('connection',(ws)=>{
  console.log('Client connected');
  ws.on('message',(message)=>{
    //回傳為buffer格式
    data = message.toString();
    console.log(data);
    //傳遞給client
    ws.send(data)
    let clients = wss.clients;//取得所有的client
    //聯絡所有連接的client
    clients.forEach((client)=>client.send(data));
    ws.on('close',()=>console.log('close connection'));//關閉所有的client
  })
});
//
const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
