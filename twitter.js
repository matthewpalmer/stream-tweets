var app = require('http').createServer(handler),
fs = require('fs');

var twitter = require('ntwitter');
var credentials = require('./credentials.js');
var io = require('socket.io').listen(app);

app.listen(8888);

var t = new twitter({
	consumer_key : credentials.consumer_key,
	consumer_secret : credentials.consumer_secret,
	access_token_key : credentials.access_token_key,
	access_token_secret : credentials.access_token_secret
	
});


function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}
io.sockets.on('connection', function (socket) {
	t.stream(
		'statuses/filter',
		{
			track:['a','e','i','o']
		},function(stream) {
			stream.on('data',function(tweet) {
				console.log(tweet.text);
				socket.emit('news', tweet.text);
			});
		}
	);
  
  socket.on('my other event', function (data) {
    console.log(data);
  });
});