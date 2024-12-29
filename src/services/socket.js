const mongoose = require('mongoose')
const {conversationSchema} = require('../models/conversation')

module.exports = (io)=>{
    console.log(io);
    
    io.on('connection', (socket)=>{
        socket.emit('news', {"hello": 'world'})

        socket.on('my other event', function (data){
            console.log(data);
        });

        // creating a private chat handler
        socket.on('create_room', async(data)=>{
            let strid= data['data'];
            socket.join(strid, function(){
                console.log('Client has joined room: ' + strid);
            });
        });

        socket.on('private_chat_handler', async(data)=>{
            socket.broadcast.to(room).emit('message_posted', data);
            const threadId= data['thread'];
            const senderId= data['senderId'];
            const messageSend= data['sentAt'];
            const thread= await conversationSchema.findById(threadId).exec();

            const message= {
                sender: senderId,
                body: messageSend
            }
            thread.history.push(message);
            await thread.save();
        })
    })
}

