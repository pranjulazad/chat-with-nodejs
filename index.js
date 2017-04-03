var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

connected = [];
users = [];

app.set('view engine', 'ejs');
app.use(express.static('./assets'));

app.get("/chat", function (req, res) {
    res.render('index');
});

io.sockets.on('connection', function (socket) {
    connected.push(socket);
    console.log('connected : %s clients connected', connected.length);

    socket.on('disconnect', function (data) {
        connected.splice(connected.indexOf(socket), 1);
        users.splice(users.indexOf(socket.username), 1);
        updateUserName();
        console.log('Disconnected : %s clients connected', connected.length);
    });

    socket.on('user connected', function (data, callback) {
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateUserName();
    });

    function updateUserName() {
        io.sockets.emit('new User', users);
    }

    socket.on('send message', function (person, data,sendto) {
        //console.log(sendto);
        io.sockets.emit('new message', {name:person, msg:data,recv:sendto});
    });

});

server.listen(process.env.PORT || 3000, function () {
    console.log('Server is running at port number 3000');
});