var express =require('express');
var app = express();
app.set('view engine','ejs');


var logger = (req,res,next)=>{
    var url = req.url;
    var date =   new Date();
    console.log('Received request for ' + url + 'at' + date);
    next();
    };

var bodyParser = require('body-parser');
app.use (bodyParser.urlencoded({extended: true}));


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
var Person = require('./Person.js');


  app.use('/public',logger, express.static('public'));


  app.use('/create', (req,res)=>{

    var newPerson = new Person({//defined in Person.js
    name : req.body.name,
    age : req.body.age,
});

///////colocando ahora la data en nuestra base de datos MongoDB/////////////////////
    newPerson.save((err)=>{
    if(err){
        res.type('html').status(500); //500 es el status code cuando hay un error
        res.send('Error ' + err);
    }
    else {
        res.render('created',{person : newPerson}); //created es el nombre del ejs file
        //que vamos a crear dentro de la carpeta views
        //person es la propiedad y newPerson  es el objeto a pasar.
    }
});
});

app.use('/all',(req,res)=>{
    Person.find((err,allPeople)=>{//Person es una instancia de personSchema
        //definida en Person.js;  find permite encontrar todos los documentos y objetos
        //en la base de datos
        //err: son los errores que pueden haber ocurrido
        //allPeople es la data (objetos) de la base de datos
        if (err){
            res.type('html').status(500);//tipo de contenido html, y el status error (500)
            res.send('Error '+ err);
        }
        else if (allPeople.length==0){
            res.type('html').status(200);
            res.send('There are no people');
        }
        else {
            res.render('showAll',{people:allPeople});//si todo esta bien entonces
            //mostrare toda la data, para ello usaremos el archivo showAll.ejs
            //para ello se le envia allPeople en la variable people
        }
    });
});

/*---------Este es el codigo de showAll.ejs

Here are all the people:
<ul>
    <% people.forEach((person)=>{%>
        <li><a href="/person?name=<%=person.name%>"> //aqui se busca crear una referencia
        //al crear una direccion cuando se hace click en uno de los nombres
        <%=person.name%></a>:
        <%=person.age%>
        </li>
                
    <% }); %>
</ul>
<br> <a href="/public/files/mongoform1.html">Create a new person</a>

*/

app.use('/person',(req,res)=>{
    var searchName = req.query.name;//la query.name contiene el nombre de la persona a 
    //buscar, que se activa cuando hacemos click al nombre
    Person.findOne({name:searchName},(err,person)=>{ //findOne es una funcion que permite
        //encontrar solo una persona.
        //(err,person) es la callback funcion que sera llamada despues de realizar la query
        //person es el resultado de la busqueda de findOne
        if(err){
            res.type('html');
            res.send('Error: '+ err);
        }
        else if (!person){
            res.type('html');
            res.send('No person named: ' + searchName);
        }
        else{
            res.render('personInfo',{person:person});
        }
    });
});

/*

<form action="/update" method="POST">
    Name: <%= person.name%> <br>
    <input name="username" value="<%= person.name%>" hidden> //este campo no se muestra,
    //solo es un truco para almacenar el valor del nombre en caso se requiera un update
    //debido a un cambio de edad
    Age:  <input name="age" value="<%= person.age%>">
    <input type="submit" value="update">
</form>

<br><a href="/public/files/mongoform1.html">Create New person</a>
<br><a href="/all">Show all</a>



*/

app.use('/update',(req,res)=>{
    var updateName = req.body.username;
    Person.findOne({name:updateName},(err,person)=>{//retornara un objeto
        //cuyo valor de name sea el valor que contiene updateName
        if(err){
            res.type('html').status(500);
            res.send('Error: ' + err );
        }
        else if (!person){
            res.type('html').status(200);
            res.send('No person named ' + updateName);
        }
        else {
            person.age = req.body.age; //actualizando el objeto global person de este programa
            person.save( (err)=>{ //guardando (write) en la base de datos con el comando save 
                if(err){
                    res.type('html').status(500);
                    res.send('Error: ' + err );
                }
                else 
                    res.render('updated',{person:person});
            } );
            
        }
    });
});

/*

<!--This is views/updated.ejs-->

Updated <%= person.name %> 's age to <%= person.age %>
<br><a href="/public/files/mongoform1.html">Create New Person</a>
<br><a href="/all">Show All</a>

*/

app.use('/formularios',logger, express.static('files/formulario.html'));

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
app.use('/',logger, (req,res)=>{
    res.redirect('public/files/mongoform1.html');
    res.end();    
});

app.listen(3000,()=>{
    console.log('Listening on port 3000');
});
