var express =require('express');
var app = express();

var logger = (req,res,next)=>{
    var url = req.url;
    var date =   new Date();
    console.log('Received request for ' + url + 'at' + date);
    next();
    };

var bodyParser = require('body-parser');
//estamos requieriendo la libreria body parser, recordar que 
//hay que instalarlo con npm install body-parser



var nameFinder =(req,res,next)=>{
    var name = req.query.name;
    if(name) req.username = name.toUpperCase();
    else req.username = 'Guest';
    next();
}

var greeter = (req,res,next)=>{
    res.status(200).type('html');
    res.write('Hello, ' + req.username);
    next();
}


var adminName =(req,res,next)=>{
    req.username = 'admin';
    next();
}

var calculo =(req,res,next)=>{
    next();
}

var consulta =(req,res,next)=>{
    var query = req.query;
    console.log(query);
    var name = query.name;       
    var location = query.location;
    var length = Object.keys(query).length;    
    res.write('Hello '+ name +' you have send '+ length + ' key values and you are from ' 
    + location);
    next();    
}

//////////COMMON ROUTE//////////////////////////////////////
var commonRoute = express.Router();
commonRoute.use(greeter,logger,calculo);

///////////////////RUTAS////////////////////////////////////

app.use('/formularios',logger, express.static('files/formulario.html'));
//aqui puse mi formulario que será llenado por el cliente
/*
<html>
    <body>
        <form action="/handleForm" method = "post">
            <!--action es la url que va a ser requerida cuando el usuario
            envie el formulario
            el metodo es POST: significa que la informacion del formulario es
            incluida en el cuerpo de la requisicion http-->
        Name: <input name = "username">
        <p></p>
        I like: <br>
        <input type="checkbox" name="animal" value="dogs">"Dogs" <br>
        <input type="checkbox" name="animal" value="cats">"Cats" <br>
        <input type="checkbox" name="animal" value="birds">"Birds" <br>
        <p></p>
        <input type="submit" value="submit formm!">
        </form>
    </body>
</html>
*/

app.use (bodyParser.urlencoded({extended: true}));
//urlencoded es una middleware function que nos permitira manejar
//forms que son enviados usando el metodo post.
//Este sera invocado por cada ruta

app.use('/handleForm', (req,res)=>{ //en el html
    //en el form que creamos la accion a hacer es usar el
    //handleform, entonces se llamará esta ruta
    var name = req.body.username;
    //se obtiene la propiedad llamada username desde el cuerpo del request
    //recordar que username es el nombre que le pusimos en el input
    var animals = req.body.animal; //este es un array de todos los 
    //animales seleccionados en el form
    //res.send('thank you');
    res.write('thanks ' + name);
    res.end();//si pongo res.send('thank you'); entonces no necesito el end.

});


app.use('/visitantes/name/:userName/location/:userLocation',logger,(req,res)=>{
    //http://localhost:3000/visitantes/name/erick/location/peru
    //se han cogido las propiedades por medio de object paremeters
    var params = req.params;
    name = params.userName;
    res.write('Hello ' + name + ' hemos hecho esto con request object parameters');
    //res.status(200).sendFile(__dirname + '/index.html');
    res.end();
});


app.use('/usuarios',consulta,(req,res)=>{
    res.end();
});


app.use('/welcome',nameFinder,commonRoute, (req,res)=>{
    res.end();
});

app.use('/admin',adminName,commonRoute, (req,res)=>{
        res.end();
});


app.use('/public',logger, express.static('files'));

app.use(/*default*/ (req,res)=>{
    res.status(404).sendFile(__dirname + '/404.html');

});

app.listen(3000,()=>{
    console.log('Listening on port 3000');
});
