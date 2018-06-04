//node routing and middleware
var express =require('express');
var app = express();//express function to create our app

app.use('/public', express.static('files'));//cualquier URI
//que esté en la carpeta public debe servir contenido estatico
//usaremos la funcion middleware llamada express.static y dentro
//se le especifica la carpeta llamada (files) en donde se tiene
//el contenido a mostrar(por ejemplo htmls y otros)
//para entrar a la carpeta tipeé en el url lo siguiente:
//http://localhost:3000/public/
//puse dos archivos, uno con el nombre index.html y el otro
//con cualquier nombre, el servidor solo mostró el archivo con nombre
//index.html

app.use(/*default*/ (req,res)=>{//enviando un archivo especifico
    //en vez de enviar un mensaje not found(res.status(404).send('Not found!'))
    //se le enviará un archivo especifico, y que podria incluir un mensaje
    res.status(404).sendFile(__dirname + '/404.html');//usando la funcion sendfile para retornar un archivo.
    //__dirname:especifica la ubicacion en donde se ha instalado la app de node (nuestra aplicacion)
   // __dirname + '/404.html' será la direccion absoluta del archivo que se quiere mostrar
});

app.listen(3000,()=>{
    console.log('Listening on port 3000');
});
