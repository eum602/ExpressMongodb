/*This is book.js*/
var mongoose = require('mongoose'); //se requiere la libreria mogoose

//note:  your host/port number  may be different!
mongoose.connect('mongodb://localhost:27017/myDatabase');//usar la misma base datos
//en todos los esquemas!!!!!!!!!!!!
//myDatabaseLibros es un nombre arbitrario elegido para ser nombre de la base de datos del ejemplo


var Schema = mongoose.Schema;   //se jalan la propiedades del objeto esquema de la libreria
//mongoose

var authorSchema = new Schema({ //creando una nueva instancia de la clase Schema
    //llamada authorSchema
    name:String, 
    //age: Number
    affiliation:String
    
});

var bookSchema = new Schema({
    title:{type:String , required:true , unique:true },
    year:Number,
    authors:[authorSchema] //authors es un array de los objetos authorSchema.
    //required indica que la propiedad name debe ser obligatoriamente requerida
    //unique indica que el nombre sea unico, es decir no pueden haber dos documentos 
    //con el mismo nombre
});

 module.exports = mongoose.model('Book',bookSchema);//se exporta este modelo
 //Book será una instancia de bookSchema.
 //notar que solo se exporta el esquema bookSchema, porque en esta aplicacion se usara 
 //solo esta