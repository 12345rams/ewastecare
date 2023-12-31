const { NlpManager } = require('node-nlp');
var express = require('express');
var dashBoard =require("../model/dashBoardModel")
var router = express.Router();
const manager = new NlpManager({ languages: ['en'], forceNER: true });
manager.addDocument('en', 'goodbye for now', 'greetings.bye');
manager.addDocument('en', 'bye bye take care', 'greetings.bye');
manager.addDocument('en', 'okay see you later', 'greetings.bye');
manager.addDocument('en', 'bye for now', 'greetings.bye');
manager.addDocument('en', 'i must go', 'greetings.bye');
manager.addDocument('en', 'hello', 'greetings.hello');
manager.addDocument('en', 'hi', 'greetings.hello');
manager.addDocument('en', 'howdy', 'greetings.hello');

// Train also the NLG
manager.addAnswer('en', 'greetings.bye', 'Till next time');
manager.addAnswer('en', 'greetings.bye', 'see you soon!');
manager.addAnswer('en', 'greetings.hello', 'Hey there!');
manager.addAnswer('en', 'greetings.hello', 'Greetings!');
(async() => {
    await manager.train();
    manager.save();
   
     router.post('/',async(req,res)=>{
        const response = await manager.process('en',req.body.message );
        
        res.send(response.answer||"Please ask me some other question");
     })
})();
module.exports=router