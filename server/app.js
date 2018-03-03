var express=require('express');
var cors=require('cors');
var bodyParsere=require('body-parse')
var app=express();
var server=require('http').Server(app);
var io=require('socket.io').listen(server);

var storyParts=[];

var mongoose=require('mongoose');




