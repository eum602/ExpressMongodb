//Este archivo es el punto de entrada para nuestra aplicacion
//import express from "express";//notacion ES6
var express =require('express');
//se incluye el paquete Express
var app = express();//permite crear nuestra aplicacion express, la cual esta
//representada por la variable app
app.use('/', (req,res)=>{//configurando la app, poniendo un event handler or call back
    //function
    //se usa la funcion use, luego se especificará la funcion que va a disparar este evento
    //en este caso el trigger será un slash '/' (the default page)
    //ahora la funcion que llamará (la call back function): (req,res)=>{....
    //esta funcion tiene como parametro de entrada 'req': osea el objeto request(todo request
    //es pasado a express como un objeto al callback function)
    //y el 'res': response object
    res.send('Hello World');//se usa el response object y su funcion send para enviar
    //Hello world
});
app.listen(3000,()=>{//se configura la app para que escuche desde el puerto 3000
    //el cual podemos acceder via nuestro buscador
    console.log('Listening on port 3000');//se define una callback function que sera
    //llamada una vez que la app empiece a escuchar (listening)
});
