var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    methodOverride  = require("method-override"),
    mongoose        = require('mongoose'),
    server = require('http').createServer(app)
    ,io = require('socket.io').listen(server);

// Connection to DB
mongoose.connect('mongodb://localhost/tvshows', function(err, res) {
  if(err) throw err;
  console.log('Connected to Database');
});

app.use(express.static(__dirname + '/public'));
// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());

// Import Models and controllers
var models     = require('./models/tvshow')(app, mongoose);
var TVShowCtrl = require('./controllers/tvshows');

// Example Route
var router = express.Router();
router.get('/', function(req, res) {
  res.send("Hello world!");
});
app.use(router);

// API routes
var tvshows = express.Router();

tvshows.route('/tvshows')
  .get(TVShowCtrl.findAllTVShows)
  .post(TVShowCtrl.addTVShow);

tvshows.route('/tvshows/:id')
  .get(TVShowCtrl.findById)
  .put(TVShowCtrl.updateTVShow)
  .delete(TVShowCtrl.deleteTVShow);

app.use('/api', tvshows);

// Start server
// app.listen(3000, function() {
//   console.log("Node server running on http://localhost:3000");
// });

io.sockets.on('connection', function(socket) {

  socket.on('senMessage', function(data){
    console.log(data);
    socket.broadcast.emit('msg', data);
  });

});

console.log("Server start on 3000");
server.listen(3000);
