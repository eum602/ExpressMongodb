var express =require('express');
var app = express();

var logger = (req,res,next)=>{ //creando una funcion llamada logger que toma la request
    // la respuesta de otra funcion y la siguiente funcion a invocar
    var url = req.url; //obteniendo la url que ha sido requerida
    var date =   new Date(); //creando un nuevo objeto que especifica la actial fecha y hora
    console.log('Received request for ' + url + 'at' + date);//mostrando en consola la fecha y hora 
    //en que se ha recibido la requisicion
    next(); //lo mas importante es que se invoca la siguiente middleware funcion en la cadena 
    };


var nameFinder =(req,res,next)=>{
    var name = req.query.name;//takes the request query to get the name
    //query is part of the url that follows the URI and provides information that is been
    //passed by the browser 
    if(name) req.username = name.toUpperCase();
    else req.username = 'Guest';
    next();//next llama a la siguiente funcion que es greeter
}

var greeter = (req,res,next)=>{
    res.status(200).type('html');
    res.write('Hello, ' + req.username);
    next();
}


var adminName =(req,res,next)=>{//middleware function
    req.username = 'admin';
    next();
}

var calculo =(req,res,next)=>{//middleware function
    next();
}
//////////COMMON ROUTE//////////////////////////////////////
var commonRoute = express.Router(); //permite establecer una ruta o subruta compuesta 
//de funciones middleware   
commonRoute.use(greeter,logger,calculo);

///////////////////RUTAS////////////////////////////////////

//app.use('/welcome',nameFinder,greeter,logger,calculo, (req,res)=>{//una ruta
app.use('/welcome',nameFinder,commonRoute, (req,res)=>{//una ruta
//EJM: http://localhost:3000/welcome/?name=erick
//http://localhost:3000/welcome
    res.end();
})//one route that uses three midleware functions,
//one middleware funtion mwill modify the request, so that can be used by another
// middleware function later on.
//'/welcome': se define la ruta para '/welcome' uri.
//se llamarán las siguientes middleware functions:
//1. nameFinder
//2. greeter
//3. una funcion anonima que cierra la conexion.
//4. le puse tambien el logger para que me muestre los datos en console log

//notar que puse una commonnRoute que engloba tres middlewares


app.use('/admin',adminName,commonRoute, (req,res)=>{//otra ruta 
        res.end();
//http://localhost:3000/admin
});


app.use('/public',logger, express.static('files')); //otra ruta

app.use(/*default*/ (req,res)=>{//en default no quise ponerle logger
    res.status(404).sendFile(__dirname + '/404.html');

});
app.listen(3000,()=>{
    console.log('Listening on port 3000');
});
