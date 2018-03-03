//dependencias requeridas para el funcionamiento
var express=require('express');
var cors=require('cors');
var bodyParsere=require('body-parse')
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
