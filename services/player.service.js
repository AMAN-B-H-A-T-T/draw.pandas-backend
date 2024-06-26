const Player = require("../models/player.model");
const Room = require('../models/room.model')
async function createPlayer(model,callback){
    try{
        const new_player = new Player(model)
        new_player.save()
        .then((response)=>{
            return callback(null,response)
        })
        .catch((error)=>{
            return callback({"status_code":500,"error":error.message})
        })
    }
    catch(error){
        return callback({"status_code":500,"error":error.message})
    }
}

async function roomcreationservices(model,callback){
    try{
        const new_room = new Room(model)
        const room_details = await new_room.save()
        const filter = {_id:model.players[0]}
        const player_details = await Player.findOne(filter)
        return callback(null,{room_details,player_details})
        
        
    }
    catch(error){
        return callback({"status_code":500,"error":error.message})
    }
}

async function addPlayersToRoomService(roomId,playerId,callback){
    try{
        const filter = {room_id : roomId}
        const result = await Room.updateOne(filter,{$push : {players:playerId}})
        if(result.modifiedCount == 0){
            await Player.deleteOne({_id:playerId})
            return callback({"status_code":404,"error":"Room details not Found"})
        }
        const room_details = await Room.findOne(filter)
        const player_details = await Player.findOne({_id:playerId})
        return callback(null,{room_details:room_details,player_details:player_details})
        
    }
    catch(error){
        return callback({"status_code":500,"error":error.message})
    }
}
async function deletePlayer(playerId,callback){
    try{
        Player.deleteOne({_id:playerId})
        .then(response => (callback(null,response)))
        .catch(error => (callback({"status_code":500,"error":error.message})))
    }
    catch(error){
        return callback({"status_code":500,"error":error.message})
    }
}
module.exports = {
    createPlayer,
    roomcreationservices,
    addPlayersToRoomService,
    deletePlayer
}