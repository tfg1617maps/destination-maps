/*se encarga de cargar todas los archivos de la carpeta controles para poder ser utilizados los controladores en el routeado*/
var fs= require('fs');
var path=require('path');
var files =fs.readdirSync(__dirname);

files.forEach(function(file){
  var fileName =path.basename(file, '.js');
  if(fileName !=='index')
  {
  	exports[fileName]=require('./'+fileName);
  }
});
