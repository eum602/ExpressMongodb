/*This is Person.js*/
var mongoose = require('mongoose');

//note:  your host/port number  may be different!
mongoose.connect('mongodb://localhost:27017/myDatabase');
//myDatabase es un nombre arbitrario elegido para ser nombre de la base de datos del ejemplo


var Schema = mongoose.Schema;

var personSchema = new Schema({
    name: {type:String, required:true, unique:true}, age: Number
    //required indica que la propiedad name debe ser obligatoriamente requerida
    //unique indica que el nombre sea unico, es decir no pueden haber dos documentos 
    //con el mismo nombre
});

 module.exports = mongoose.model('person',personSchema);//se exporta este modelo
 //person será una instancia de personSchema.