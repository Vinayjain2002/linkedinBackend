'use strict'

const mongoose= require('mongoose')

const messageSchema= new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    body: {
        type: String,
        required: true
    }
},{
    timestamps: true
});

// one to one chat is used and in converstaion Schema storing muliple messages
const conversationSchema= new mongoose.Schema({
    first_participant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    second_participant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    history: {
        type: [messageSchema]
    },
    intialized: {
        type: Boolean
    }
},{
    timestamps: true
});

conversationSchema.method({
    transform(){
        const transformed={}
        const fields= ['first_participant', 'second_participant', 'history','initialized']
        fields.forEach((field)=>{
            transformed[field]= this[field]
        });

        return transformed;
    }
})


const Conversation= mongoose.model('Conversation', conversationSchema)
module.exports= {
    conversationSchema, Conversation
}