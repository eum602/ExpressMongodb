//node routing and middleware
var express =require('express');
var app = express();//express function to create our app

app.use('/about', (req,res)=>{//la url /about llamará la callback funcion (req,res)=>{...}
    res.send('This is the about page.');
});

app.use('/login', (req,res)=>{//creando otra ruta (route) mas
    res.send('This is the login page.');    
    });

app.use(/*default*/ (req,res)=>{//si ninguna de las invocaciones anteriores se da, entonces
    //se enviara el status 404
    res.status(404).send('Not found!');  
    });

app.listen(3000,()=>{
    console.log('Listening on port 3000');
});
