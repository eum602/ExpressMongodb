var express =require('express');
var app = express();
app.use('/', (req,res)=>{
    var name = req.query.name;//se pide el nombre desde el HTTP request query 
    //esta consulta(query) puede o no ser incluida en el request 
    //ejm: /?name=devesh "?":indica el inicio de la query; name: key ; devesh:value
    //podemos acceder al valor del key con req.query.name (logicamente en vez de name
    //debe ir el key correspondiente)
    res.status(200);
    res.type('html');
    if(name){
        res.write('Hi, ' +  name + ", it is nice to see you");
    }//si la URL incluye un tipo de query con el key name entonces...
    else {//si el name es undefined...
        res.write('Welcome guest');
    }    
    res.end();
});
app.listen(3000,()=>{
    console.log('Listening on port 3000');
});
