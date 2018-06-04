var express =require('express');
var app = express();
app.use('/', (req,res)=>{//el response siempre es pasado como un parametro
    // en la funcion que maneja los eventos (eventHandler)
    //funciones y propiedades de los objetos request
    var method = req.method;//esta propiedad es el verbo (ejm:get or post) 
    //del HTTP request object
    var url = req.url;//este es el objeto que esta siendo requerido del objeto request
    var agent = req.headers['user-agent'];//la propiedad headers del objeto request
    agent = req.get('User-Agent')//es un array que contiene todos lo headers
    //Es recomendable usar la funcion GET para obtener un header especifico, GET funcion
    //es insensitivo es decir será lo mismo poner user-agent or USER-agEnt or otros.
    res.status(200);//codigo de estatus de respuesta mediante la funcion estatus
    res.type('html');//configurando el tipo de contenido
    
    //res.send('Hello World');//res:Response del servidor!!, response es un objeto en Express
    //send function envia el hello world de respuesta, este sera visualizado por el cliente
    //en su web browser
    //La funcion Send envia una cadena entera HTML o un mensaje, sin embargo la respuesta
    //(response) debe ser un flujo donde deberiamos poder enviar continuamente informacion
    //sobre ese flujo, de modo que se envie de a pocos, usando para ello el write function:
    res.write('Hello World!');
    res.write('<p>');//se envia el tag paragraph:salto de linea
    res.write('<b>Have a nice day!!</b>');//mensaje en negrita
    res.end();//cuando hemos terminado de preparar todo para enviarm entonces se usara el
    //end function para ENVIAR la RESPONSE y CERRAR LA CONECTION.
});
app.listen(3000,()=>{
    console.log('Listening on port 3000');
});
