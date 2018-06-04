var express =require('express');
var app = express();
app.set('view engine','ejs');///////////////////////////////////////////////////////
var bodyParser = require('body-parser');////////////////////////////////////////////
app.use (bodyParser.urlencoded({extended: true}));//////////////////////////////////
var Person = require('./Person.js');

var Book = require('./book.js');//importando el modelo o la clase Book.js que tiene la forma
//de los archivos a guardar en la base de datos
//Esto es muy importante: CADA ESQUEMA (PERSON Y BOOK) REPRESENTAN UNA COLECCION DIFERENTE
//DENTRO DE UNA MISMA BASE DE DATOS EN MONGODB

var logger = (req,res,next)=>{
    var url = req.url;
    var date =   new Date();
    console.log('Received request for ' + url + 'at' + date);
    next();
    };

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

  app.use('/querysearch',logger,express.static('files/books.html')); 
  app.use('/api',logger,(req,res)=>{//buscando con la logica and
    var query={};
    
    if(req.query.title) query.title = {$regex:req.query.title};//con regular expression (regex)
    if(req.query.year)  query.year =req.query.year;
    if(req.query.name){
        query['authors.name'] = {$regex:req.query.name};//query del req.query se refiere a
        //la consulta que realiza el usuario desde su browser      
    }
    console.log(query);

    if(Object.keys(query).length !=0){//se busca en la variable local query, si hay 
        //elementos entonces entra en este if.
        Book.find(query,(err,books)=>{//books es el array que producto de la busqueda
            //la funcion find puede ser usado con o sin argumentos, cuando es con argumentos
            //me devuelve un array producto de la busqueda con criterios especificados
            if(!err){
                res.json(books);//se envía un array de libros al cliente en formato
                //JSON (represetacion de un objeto javascript en forma de string)
            }
            else {
                console.log(err);
                res.json({});//al haber un error se envia un paquete vacio al cliente
            }
        }).sort({'title':'asc'});//sort permite ordenar los elementos por title de manera
        //asc(ascendente); 

        
    }

    else res.json({});//mientras no se envíe nada al servidor entonces se enviará un paquete
    //vacio al cliente
    

     
  });

  app.use('/bookform',logger,express.static('files/bookForm.html'));

  app.use('/createbook',(req,res)=>{/////////////////////////////
      console.log(req.body);
      var newBook = new Book(req.body);//guardo de frente  el request body en newBook
      //porque en mi html mi formulario coincide con el esquema Libro.
      //veremos en consola el tipo de request que recibe el
      //servidor despues de enviar el formulario
      newBook.save((err)=>{//usando una callback function despues de haber guardado la data.
          if(err){
              res.type('html').status(500);
              res.send('Error: ' + err );
          }
          else{
              res.render('createdBook',{book:newBook});//created.ejs mostrará el objeto newBook.
          }
      });

  });

  app.use('/searchBook',logger,express.static('files/searchBook.html'));
  app.use('/search',(req,res)=>{
      if(req.body.which=='all'){//en este caso se busca con la logica and
        //es decir la busqueda debe tener todos los criterios de bussqueda
          searchAll(req,res);
      }
      else if(req.body.which=='any'){//en este casi se busca con la logica or
        //es decir la busqueda debe cumplir con al menos uno de los requisitos.
          searchAny(req,res);
      }
      else {
          searchAll(req,res);
      }
  });

app.use('/public',logger, express.static('public'));


  app.use('/create', (req,res)=>{

    var newPerson = new Person({//defined in Person.js
    name : req.body.name,
    age : req.body.age,
});

///////colocando ahora la data en nuestra base de datos MongoDB/////////////////////
    newPerson.save((err)=>{
    if(err){
        res.type('html').status(500);
        res.send('Error ' + err);
    }
    else {
        res.render('created',{person : newPerson});
    }
});
});


app.use('/all',(req,res)=>{
    Person.find((err,allPeople)=>{
        if (err){
            res.type('html').status(500);
            res.send('Error '+ err);
        }
        else if (allPeople.length==0){
            res.type('html').status(200);
            res.send('There are no people');
        }
        else {
            res.render('showAll',{people:allPeople});
        }
    });
});

app.use('/person',(req,res)=>{
    var searchName = req.query.name;
    Person.findOne({name:searchName},(err,person)=>{

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

app.use('/update',(req,res)=>{
    var updateName = req.body.username;
    Person.findOne({name:updateName},(err,person)=>{
        if(err){
            res.type('html').status(500);
            res.send('Error: ' + err );
        }
        else if (!person){
            res.type('html').status(200);
            res.send('No person named ' + updateName);
        }
        else {
            person.age = req.body.age;
            person.save( (err)=>{
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

function searchAll(req,res){
    var query={};
    //if(req.body.title) query.title = req.body.title;
    if(req.body.title) query.title = {$regex:req.body.title};//con regular expression (regex)
    if(req.body.year)  query.year =req.body.year;
    if(req.body.name){
        query[authors.name] = req.body.name;        
    }
    console.log(query);
    //Ejemplo: {'authors.name':'Chris Murphy', year:'2017'}

    Book.find(query,(err,books)=>{//books es el array que producto de la busqueda
        //la funcion find puede ser usado con o sin argumentos, cuando es con argumentos
        //me devuelve un array producto de la busqueda con criterios especificados
        if(err){
            res.type('html').status(500);
            res.send('Error: ' + err );
        }
        else {
            res.render('books',{books:books});
        }
    }).sort({'title':'asc'});//sort permite ordenar los elementos por title de manera
    //asc(ascendente);
}

function searchAny(req,res){
    var terms=[];
    if(req.body.title)
    //terms.push({title:req.body.title});
    terms.push({title:{$regex:req.body.title}});//se creara un objeto que permitira
    //realizar una busqueda que contenga este fragmento, y no será una busqueda exacta    
    if(req.body.year)
    terms.push({year:req.body.year});
    if(req.body.name)
    terms.push({'authors.name':req.body.name});

    var query = {$or:terms};//se crea un objeto cuya propiedad se llama $or 
    //{ '$or': [ { title: 'Administración de Operaciones' }, { year: '2017' } ] }
    //{ '$or': [ { title: [Object] } ] } //esto es con el regular expression de title
    //como se observa el objeto tiene un array, donde cada una de ellas es una busqueda
    //independiente, osea se busca con la logica OR

    console.log(query);

    Book.find(query,(err,books)=>{
        if(err){
            res.type('html').status(500);
            res.send('Error: ' + err );
        }
        else {
            res.render('books',{books:books});
        }
    }).sort({'title':'asc'});//sort permite ordenar los elementos por title de manera
    //asc(ascendente)


};
