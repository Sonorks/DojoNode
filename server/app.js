//dependencias requeridas para el funcionamiento
var express=require('express');
var cors=require('cors');
var bodyParser=require('body-parser')
var app=express();
var server=require('http').Server(app);
var io=require('socket.io').listen(server);
//vector de palabras para la historia
var storyParts=[];
//importando el mongoose
var mongoose=require('mongoose');
//Importando el modelo
var Word=require('./Model/word');
//Uri para acceder a mongodb
const dbMongo='mongodb://localhost:27017/dbStory';
const port=8085;
//Palabra de la sesión específica
var currentWord="";
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cors());

mongoose.connect(dbMongo,function(err,res){
    if (err) {
        //`` se usa para llamar a argumentos de la funcion
        console.log(`Error al conectarse a la bd ${err}`);
    } else {
        console.log("conexion exitosa");
    }
});

server.listen(port,function(){
    console.log("corriendo por el puerto: "+port);
});

app.post('/api/setWord', function(req,res){
    let word = new Word();
    word.word = req.param('inputWord');
    word.save(function(err, storedWord){
        if (err) {
            res.status(500)
            res.send({message:`Error al guardar palabra ${err}`})

        } else {
            res.status(200)
            res.redirect('/');
            res.end();
        }
    });
});

function randomWord(callback){
    Word.find({}, function(err,words){
        if (err) {
            console.log(`Error al buscar palabras ${err}`);   
        } else {
            var number = Math.floor(Math.random()*words.length);
            currentWord = words[number].word;
            callback(0,currentWord); 
        }
    });
}

io.on('connection',function(socket){
    console.log("Alguien se ha conectado con sockets");
    socket.emit('story', storyParts);
    socket.emit('new-word',currentWord);
    socket.on('sent-story', function(data){
        storyParts.push(data);
        io.sockets.emit('story', storyParts);
        randomWord(function(err,data){
            io.emit('new-word', data);
        });
    })

});