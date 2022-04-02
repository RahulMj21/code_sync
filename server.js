"use strict";
exports.__esModule = true;
var express_1 = require("express");
var http_1 = require("http");
var path_1 = require("path");
var socket_io_1 = require("socket.io");
var PORT = process.env.PORT || 5000;
var app = (0, express_1["default"])();
var server = (0, http_1.createServer)(app);
app.use(express_1["default"].static("build"));
app.use(function (req, res, next) {
    res.sendFile(path_1["default"].join(__dirname, "build", "index.html"));
});
var io = new socket_io_1.Server(server, {
    cors: {
        origin: "*"
    }
});
var socketUserMapping = {};
io.on("connection", function (socket) {
    console.log("socket connected..", socket.id);
    socket.on("join", function (_a) {
        var roomId = _a.roomId, username = _a.username;
        if (!(socket.id in socketUserMapping)) {
            socketUserMapping[socket.id] = username;
            socket.join(roomId);
            var clients_1 = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
            clients_1.forEach(function (client) {
                io.to(client).emit("joined", {
                    socketId: socket.id,
                    username: username,
                    clients: clients_1.map(function (singleClient) {
                        return {
                            socketId: singleClient,
                            username: socketUserMapping[singleClient]
                        };
                    })
                });
            });
        }
    });
    socket.on("code_change", function (_a) {
        var roomId = _a.roomId, code = _a.code;
        socket["in"](roomId).emit("code_change", { code: code });
    });
    socket.on("code_sync", function (_a) {
        var socketId = _a.socketId, code = _a.code;
        io.to(socketId).emit("code_change", { code: code });
    });
    var handleLeave = function () {
        var rooms = socket.rooms;
        rooms.forEach(function (roomId) {
            socket["in"](roomId).emit("disconnected", {
                socketId: socket.id,
                username: socketUserMapping[socket.id]
            });
            socket.leave(roomId);
        });
        delete socketUserMapping[socket.id];
    };
    // listning for leave room
    socket.on("leave", handleLeave);
    // lintining for tab or browser close
    socket.on("disconnecting", handleLeave);
});
server.listen(PORT, function () { return console.log("server listning on port --->", PORT); });
