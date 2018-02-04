var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

var clients = {};

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
   console.log('one user connected: ' + socket.id);
   
   socket.on('chat message', function(msg){
     io.emit('chat message', msg);
     console.log('message from ', msg + " " + socket.id);
   });

   socket.on('handshake phone', function(num){
   	clients[num] = socket;
   });

 });


http.listen(port, function(){
  console.log('listening on port %d', port);
});


function doSomeLogging() {
	console.log(Object.keys(clients));

	for(num in clients) {
     	 clients[num].emit('chat message', 'Hello there, I have your number: ' 
    	+ num);
     }
}

var interval = setInterval(doSomeLogging, 2000);

    
