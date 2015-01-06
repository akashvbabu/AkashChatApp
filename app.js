var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var users = require('./routes/users');
var app = express();
var http=require('http');
var server = http.createServer(app);
server.listen(3000,'0.0.0.0');
var io = require('socket.io').listen(server);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
/*if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});*/
 io.sockets.on('connection',function(socket){
		// inform other users that the user joined this room and can chat
		socket.on('informRoom', function(username){
			socket.username = username;
			socket.room='room1';
			socket.emit('chatConn','You');
			socket.broadcast.emit('chatConn',socket.username)
		});
		
		socket.on('postMessage',function(message){
			socket.emit('updateChat','You',message);
			socket.broadcast.emit('updateChat',socket.username,message);
			//io.sockets.emit('updateChat',socket.username,message);
		});	
		
		socket.on('disconnect', function(){
			socket.broadcast.emit('userLeft',socket.username);
			socket.leave(socket.room);
		});
	
 });
module.exports = app;
