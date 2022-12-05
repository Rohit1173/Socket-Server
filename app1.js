const express = require('express'); //requires express module
const socket = require('socket.io'); //requires socket.io module
const fs = require('fs');
const app = express();
var PORT = process.env.PORT || 3000;
const server = app.listen(PORT); //tells to host server on localhost:3000


//Playing variables:
app.use(express.static('public')); //show static files in 'public' directory
console.log('Server is running');
const io = socket(server);



const users = {}
const rooms={}

//Socket.io Connection------------------
io.on('connection', (socket) => {
    
    console.log("New socket connection: " + socket.id)
    // var username =''
    // var roomname=''    
    socket.on('user',(userdata)=>{
     const data =JSON.parse(userdata);
    // username =data.name
     users[socket.id]=data.name
    // roomname =data.room
     rooms[socket.id]=data.room
     console.log(data.name)
     socket.join(`${rooms[socket.id]}`)
     console.log(`${users[socket.id]} has joined the room : ${rooms[socket.id]}`)
    io.to(`${rooms[socket.id]}`).emit('user',JSON.stringify(users[socket.id]));
    io.to(`${rooms[socket.id]}`).emit('connection',users[socket.id]+" has joined the chat")
    })
        socket.on('chat message', (msg)  => {
          const mydata = JSON.parse(msg)
          const chat = mydata.chat

          const send = {
            username:users[socket.id],
            chat:chat
          }
          socket.broadcast.to(`${rooms[socket.id]}`).emit('chat message', JSON.stringify(send))
          console.log('FROM : '+users[socket.id]+'-'+rooms[socket.id]+' : '+chat)
        })
        socket.on('chat image',(img)=>{
          const img_data = Json.parse(img)
          const my_img = img_data.chat
          const send ={
            username:users[socket.id],
            chat:my_img
          }
          socket.broadcast.to(`${rooms[socket.id]}`).emit('chat image',Json.stringify(send))
          console.log('Image URL: '+rooms[socket.id]+"-"+ users[socket.id]+" : "+chat)
        })

        socket.on('dis',() => {
          socket.broadcast.to(`${rooms[socket.id]}`).emit('dis',users[socket.id])
          console.log(users[socket.id]+" disconnected")
          socket.disconnect(true)
          //delete users[socket.id]
        })
      
    
})