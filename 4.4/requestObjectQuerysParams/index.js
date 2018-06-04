var express =require('express');
var app = express();

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
