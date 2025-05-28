// import {Server} from "socket.io";
// import http from "http";
// import express from "express";

// const app = express();

// const server = http.createServer(app);
// const io = new Server(server, {
//     cors:{
//         origin:['http://localhost:3000'],
//         methods:['GET', 'POST'],
//     },
// });

// export const getReceiverSocketId = (receiverId) => {
//     return userSocketMap[receiverId];
// }

// const userSocketMap = {}; // {userId->socketId}


// io.on('connection', (socket)=>{
//     const userId = socket.handshake.query.userId
//     if(userId !== undefined){
//         userSocketMap[userId] = socket.id;
//     } 

//     io.emit('getOnlineUsers',Object.keys(userSocketMap));

//     socket.on('disconnect', ()=>{
//         delete userSocketMap[userId];
//         io.emit('getOnlineUsers',Object.keys(userSocketMap));
//     })

// })

// export {app, io, server};

import { Server } from "socket.io";

const users = new Map(); // Stores connected users (socketId -> userId)

export const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: { origin: "http://localhost:3000", credentials: true }
    });

    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);

        // Store userId with socketId
        socket.on("join", (userId) => {
            users.set(socket.id, userId);
            console.log(`${userId} joined`);
        });

        // Listen for new messages
        socket.on("sendMessage", (message) => {
            console.log("Message received:", message);
            io.emit("receiveMessage", message); // Broadcast to all users
        });

        // Handle user disconnect
        socket.on("disconnect", () => {
            users.delete(socket.id);
            console.log("User disconnected:", socket.id);
        });
    });

    return io;
};
