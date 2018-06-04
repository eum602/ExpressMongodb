var express =require('express');
var app = express();

var logger = (req,res,next)=>{
    var url = req.url;
    var date =   new Date();
    console.log('Received request for ' + url + 'at' + date);
    next();
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

var consulta =(req,res,next)=>{//hare una middleware para la query con name y location
    var query = req.query;//se jala la propiedad query del request
    //Ejm:http://localhost:3000/usuarios/?name=erick&location=peru
    //como se observa aqui hay dos consultas dentro de la query
    console.log(query);
    var name = query.name;//Lydia
    //se accede a la propiedad name que para la request es la key en la url    
    var location = query.location;//United States
    var length = Object.keys(query).length; //  En el ejemplo haré una consulta
    //con dos key (name and location) por lo tanto length sera dos.
    res.write('Hello '+ name +' you have send '+ length + ' key values and you are from ' 
    + location);
    next();//Next es muy importante sino se quedará pegado aqui
    
}
//////////COMMON ROUTE//////////////////////////////////////
var commonRoute = express.Router(); //permite establecer una ruta o subruta compuesta 
//de funciones middleware   
commonRoute.use(greeter,logger,calculo);

///////////////////RUTAS////////////////////////////////////
app.use('/usuarios',consulta,(req,res)=>{
    res.end();
});

//app.use('/welcome',nameFinder,greeter,logger,calculo, (req,res)=>{//una ruta
app.use('/welcome',nameFinder,commonRoute, (req,res)=>{//una ruta
//EJM: http://localhost:3000/welcome/?name=erick
//http://localhost:3000/welcome
    res.end();
})//one route that uses three midleware functions,


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
