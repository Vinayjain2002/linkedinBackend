var config= require('../config/index')
var neo4j= require('neo4j-driver');

try{
    // here bolt: is a format for the communication with the graph.js
    var driver= neo4j.driver('bolt://'+ config.neo4j.uri+':'+config.neo4j.port, neo4j.auth.basic(config.neo4j.username, config.neo4j.password));
    var session= driver.session();
}catch(err){
    console.log(err);
}

module.exports= session;