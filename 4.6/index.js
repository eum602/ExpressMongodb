var express =require('express');
var app = express();
app.set('view engine','ejs');//se configura por default el motor de vista EJS


var logger = (req,res,next)=>{
    var url = req.url;
    var date =   new Date();
    console.log('Received request for ' + url + 'at' + date);
    next();
    };

var bodyParser = require('body-parser');///////////////////////////////////////
app.use (bodyParser.urlencoded({extended: true}));//////////////////////////////////


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
var Person = require('./Person.js');//////////////////////////////////////////


  app.use('/public',logger, express.static('public'));//la carpeta public
  //a la que se refiere la funcion static, debe tener el archivo a abrir 
  //con el nombre index.html, todo esto solo pasa con public
    

//app.use('/formularios',logger, express.static('files/formulario.html'));
app.use('/create', (req,res)=>{////////////////////////////////////////////////

    var newPerson = new Person({//defined in Person.js
    name : req.body.name,//name: se definio asi en el formulario (form)
    age : req.body.age,
});
///////colocando ahora la data en nuestra base de datos MongoDB
    newPerson.save((err)=>{//el argumento de la funcion save sera una callback function
    //que sera invocada despues de intentar guadar la data, es dir en este paso
    //se esta guardando la data en la base de datos mongoDB
    //el parametro es err(error)
    if(err){
        res.type('html').status(500); //500 es el status code cuando hay un error
        res.send('Error ' + err);//se imprime el tipo de error
    }
    else {
        res.render('created',{person : newPerson}); //created es el nombre del ejs file
        //que vamos a crear dentro de la carpeta views
        //person es la propiedad y newPerson  es el objeto a pasar.
    }
});
});




//app.use('/formularios',logger, express.static('files/formulario.html'));



app.use('/handleForm', (req,res)=>{

    var name = req.body.username;

    var animals = [].concat(req.body.animal);
    res.render('showAnimals',{name:name,animals:animals});
   // res.end();

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


 
//app.use(/*default*/ (req,res)=>{
  //  res.status(404).sendFile(__dirname + '/404.html');

//});
app.use('/',logger, (req,res)=>{////////////////////////////////////////////////
//La ultima funcion de default debe ir al final de lo contrario como el codigo es secencial
//y lo pongo mas arrioba entonces lo que este debajo de esta ruta ya no correra.
    res.redirect('public/files/mongoform1.html');
    res.end();    
});

app.listen(3000,()=>{
    console.log('Listening on port 3000');
});
