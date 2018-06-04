//node routing and middleware
var express =require('express');
var app = express();//express function to create our app

var logger = (req,res,next)=>{ //creando una funcion llamada logger que toma la request
// la respuesta de otra funcion y la siguiente funcion a invocar
var url = req.url; //obteniendo la url que ha sido requerida
var date =   new Date(); //creando un nuevo objeto que especifica la actial fecha y hora
console.log('Received request for ' + url + 'at' + date);//mostrando en consola la fecha y hora 
//en que se ha recibido la requisicion
next(); //lo mas importante es que se invoca la siguiente middleware funcion en la cadena 
};

//app.use(logger);//significa que la funcion middleware que hemos creado llamada logger 
//será invocada en cualquier http request realizado.
//sim embargo lo he comentado porque para este ejemplo lo voy a poner en el public, de otra
//forma el logger seria invocado hasta en el default, lo que en este ejemplo no quiero.

app.use('/public',logger, express.static('files')); //el middleware logger aparecerá en la 
//carpeta public nada mas.
//esto significa que podemos tener muchas funciones middleware en esta funcion USE que usa 
//el directorio public, cuando estemos creando una ruta para esta requision http particular.

app.use(/*default*/ (req,res)=>{
    res.status(404).sendFile(__dirname + '/404.html');//se muestra el archivo 404.html por
    //default 
});
app.listen(3000,()=>{
    console.log('Listening on port 3000');
});
