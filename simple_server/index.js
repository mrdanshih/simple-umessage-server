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

   socket.on('web to sms handler', function(data){
   	console.log("WebApp to SMS, sending " + data.msg + " through " + data.originNumber);
   	
   	if(data.originNumber in clients) {
   		console.log('Number is in clients dict, sending...');
   		clients[data.originNumber].emit('web to sms', {'destNumber': data.destNumber, 'msg': data.msg});
   	} else {
      socket.emit('sms send error', 'Could not send text - sender number not online... must open uMessage app');
    }
   });

   socket.on('disconnect', function(){
    console.log("Disconnected: " + socket.id);
      for(phone in clients) {
        if(clients[phone].id == socket.id) {
          delete clients[phone];
        }
      }
   });
 });

http.listen(port, function(){
  console.log('listening on port %d', port);
});


function doSomeLogging() {
	console.log(Object.keys(clients));
	// for(num in clients) {
 //     	 clients[num].emit('chat message', 'Hello there, I have your number: ' 
 //    	+ num);
 //     }
}

var interval = setInterval(doSomeLogging, 5000);

    
