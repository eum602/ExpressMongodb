var express =require('express');
var app = express();

//

var logger = (req,res,next)=>{
    var url = req.url;
    var date =   new Date();
    console.log('Received request for ' + url + 'at' + date);
    next();
    };

var bodyParser = require('body-parser');///////////////////////////////////////


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

app.use (bodyParser.urlencoded({extended: true}));

app.use('/handleForm', (req,res)=>{ //en el html///////////////////////////////

    var name = req.body.username;

    var animals = [].concat(req.body.animal); //se concatena un array vacio con
    //el array animal sea cual fuere su tamaño, de modo que si solo se selecciono
    //un animal entonces el array vacio luego tendra solo un elemento en otro caso
    //el array tendra el tamaño del array animal que viene desde el form.
    res.type('html').status(200);//se define el tipo a html, osea lo que se va a enviar 
    //de regreso sera contenido html, adicional el status es 200.
    res.write('Hello,  ' + name + ', nice to meet you.' );
    res.write('<p>Here are the animals you like: ');
    res.write('<ul>');
    animals.forEach((animal)=>{
        res.write('<li>' + animal + '</li>' );
    });
    res.write('</ul>');
    res.write("<a href='/formularios'>" + "Back to Form</a>" );
    res.end();

});

app.use('/visitantes/name/:userName/location/:userLocation',logger,(req,res)=>{
    var params = req.params;
    name = params.userName;
    res.write('Hello ' + name + ' hemos hecho esto con request object parameters');    
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
