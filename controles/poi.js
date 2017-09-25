var mysql=require('mysql');
var formidable = require('formidable');
var fs = require('fs');
var mv = require('mv');
var path = require('path');

//funcion que almacena un poi en la BBDD
function guardarBBDD(res, poi, latitud, longitud, id){
  var config =require('.././database/config');
  var db=mysql.createConnection(config);
  console.log("funcion almacenar BBDD");
  db.connect();
  db.query('insert into POI SET ?' ,poi, function(err,rows,fields){
    if(err){
      // throw err;
      console.log(err);
      res.status(500);
      res.render('maps/point_of_interest',{latitud: latitud, longitud:longitud, error: 'Imposible acceder a la BBDD para almacenar el Punto de interes, intentelo de nuevo.', id: id});
      res.end();
    }else{
      db.end();
      res.render('maps/point_of_interest',{latitud: latitud, longitud:longitud, info: 'Se ha creado el poi', id: id});
    }
  });
}
//funcion que actualiza un poi en la BBDD
function actualizarPOIBBDD(res, poi, id, nombre, id_poi){
  console.log("actualizamos la BBDD");
  var config =require('.././database/config');
  var db=mysql.createConnection(config);
  db.connect();
  db.query('update POI SET ? where ?' ,[poi,{idPOI: id_poi}], function(err,rows,fields){
    if(err){
      // throw err
      console.log(err);
      errorModificar(res,id,nombre)
    }
    else{
      db.end();
      res.redirect('/verPOI?id='+ id +'&nombre='+ nombre);
    }
  });
}

//funcion que maneja el error al almacenar elemento multimedia
function errorAlmacenar(res,latitud_mapa,longitud_mapa,id){
  res.status(500);
  res.render('maps/point_of_interest',{latitud: latitud_mapa, longitud:longitud_mapa, error: 'Imposible acceder a la BBDD para almacenar el archivo, intentelo de nuevo.', id: id});
  res.end();
}
//funcion que maneja el error al modificar elemento multimedia
function errorModificar(res,id,nombre){
  res.status(500);
  res.redirect('/verPOI?id='+ id +'&nombre='+ nombre);
  res.end();
}
//funcion que crea un nombre aleatorio para almacenar elemento multimedia
function createRandomName(){
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for( var i=0; i < 10; i++ )
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

//funcion que se encarga de almacenar elemento multimedia 1
function almacenarElementoMultimedia1(res,files,fields,poi,dirname,randomName,path,name,tipo,transparente,latitud_mapa,longitud_mapa,id){
  var oldPathElement1 = path;
  var elementName1 = randomName + name
  var newPathElement1 = dirname + elementName1;
  mv(oldPathElement1, newPathElement1, function(err) {
    if (err) {
      errorAlmacenar(res,latitud_mapa,longitud_mapa,id);
    }
    else{
      console.log('almacenado ' + tipo + ' correctamente');
      poi.archivo1 = elementName1
      poi.elemento1 = tipo
      if(transparente!=null){
        poi.transparent1 = transparente;
      }
      //comprobamos elemento2
      console.log("comprobamos elemento2");
      if(fields.optradio_element2=='imagen'){
        console.log("recibida imagen2");
        almacenarElementoMultimedia2(res,files,fields,poi,dirname,randomName,files.filetoupload2.path,files.filetoupload2.name,'imagen',fields.tamanio2,null,latitud_mapa,longitud_mapa,id)
      }
      else if(fields.optradio_element2=='video'){
        almacenarElementoMultimedia2(res,files,fields,poi,dirname,randomName,files.filetoupload2.path,files.filetoupload2.name,'video',fields.tamanio2,fields.transparent2,latitud_mapa,longitud_mapa,id)
      }
      else{
        //almacenar elemento BBDD
        poi.elemento2 = null
        poi.archivo2 = null
        poi.transparent2 = null
        poi.tamanio2 = null
        poi.elemento3 = null
        poi.archivo3 = null
        poi.transparent3 = null
        poi.tamanio3 = null
        guardarBBDD(res, poi, latitud_mapa, longitud_mapa, id)
      }
    }
  })
}
//funcion que se encarga de almacenar elemento multimedia 2
function almacenarElementoMultimedia2(res,files,fields,poi,dirname,randomName,path,name,tipo,tamanio,transparente,latitud_mapa,longitud_mapa,id){
  var oldPathElement2 = path;
  var elementName2 = randomName + name
  var newPathElement2 = dirname + elementName2;
  mv(oldPathElement2, newPathElement2, function(err) {
    if (err) {
      errorAlmacenar(res,latitud_mapa,longitud_mapa,id)
    }
    else{
      console.log('almacenado ' + tipo + ' correctamente');
      poi.archivo2 = elementName2
      poi.elemento2 = tipo
      poi.tamanio2=tamanio
      if(transparente!=null){
        poi.transparent2 = transparente;
      }
      //comprobamos elemento3
      console.log("comprobamos elemento3");
      if(fields.optradio_element3=='imagen'){
        console.log("recibida imagen3");
        almacenarElementoMultimedia3(res,files,fields,poi,dirname,randomName,files.filetoupload3.path,files.filetoupload3.name,'imagen',fields.tamanio3,null,latitud_mapa,longitud_mapa,id)
      }
      else if(fields.optradio_element3=='video'){
        console.log("recibido video3");
        almacenarElementoMultimedia3(res,files,fields,poi,dirname,randomName,files.filetoupload3.path,files.filetoupload3.name,'video',fields.tamanio3,fields.transparent3,latitud_mapa,longitud_mapa,id)
      }
      else{
        //almacenar elemento BBDD
        poi.elemento3 = null
        poi.archivo3 = null
        poi.transparent3 = null
        poi.tamanio3 = null
        guardarBBDD(res, poi, latitud_mapa, longitud_mapa, id)
      }
    }
  })
}
//funcion que se encarga de almacenar elemento multimedia 3
function almacenarElementoMultimedia3(res,files,fields,poi,dirname,randomName,path,name,tipo,tamanio,transparente,latitud_mapa,longitud_mapa,id){
  var oldPathElement3 = files.filetoupload3.path;
  var elementName3 = randomName + files.filetoupload3.name
  var newPathElement3 = dirname + elementName3;
  mv(oldPathElement3, newPathElement3, function(err) {
    if (err) {
      errorAlmacenar(res,latitud_mapa,longitud_mapa,id)
    }else{
      console.log('almacenado ' + tipo + ' correctamente');
      poi.archivo3 = elementName3
      poi.elemento3 = tipo
      poi.tamanio3=tamanio
      console.log("el archivo1 es: " + poi.archivo1);
      console.log("el archivo2 es: " + poi.archivo2);
      console.log("el archivo3 es: " + poi.archivo3);
      //almacenamos en la bbdd
      console.log("almacenamos en la BBDD");
      guardarBBDD(res, poi, latitud_mapa, longitud_mapa, id)
    }
  })
}

//funcion que se encarga de eleminar un elemento multimedia
function eliminarElementoMultimedia(elemento,nombre,posicion){
  if(elemento!=undefined && elemento !=""){
    fs.unlink(dirname+nombre,function(err){
      if(err) return console.log(err);
      console.log('elemento ' + posicion + ' borrado satisfactoriamente');
    })
  }
}

//funcion que se encarga de modificar elemento multimedia 1
function modificarAlmacenarElementoMultimedia1(res,files,fields,poi,dirname,randomName,path,name,tipo,transparente,id,nombre,id_poi){
  var oldPathElement1 = path;
  var elementName1 = randomName + name
  var newPathElement1 = dirname + elementName1;
  if(name!=""){
    console.log("modificar: elemento: " + tipo + "1 nuevo");
    mv(oldPathElement1, newPathElement1, function(err) {
      if (err) {
        errorModificar(id,nombre);
      }
      else{
        console.log('modificar: almacenado' + tipo + 'correctamente');
        poi.elemento1 = tipo
        poi.archivo1 = elementName2
        poi.transparent1 = transparente
        eliminarElementoMultimedia(fields.old_file1,fields.old_field1,1);
        //comprobamos elemento2
        console.log("modificar comprobamos elemento2");
        comprobarElemento2(res,files,fields,poi,dirname,randomName,files.filetoupload2.path,files.filetoupload2.name,fields.optradio_element2,fields.transparent2,id,nombre,id_poi)
      }
    })
  }
  else{
    console.log("modificar: elemento " + tipo + " 1 antiguo");
    //comprobamos elemento2
    console.log("modificar comprobamos elemento2");
    comprobarElemento2(res,files,fields,poi,dirname,randomName,files.filetoupload2.path,files.filetoupload2.name,fields.optradio_element2,fields.transparent2,id,nombre,id_poi)
  }
}
//funcion que comprueba el elemento 2
function comprobarElemento2(res,files,fields,poi,dirname,randomName,path,name,tipo,transparente,id,nombre,id_poi){
  if(tipo=='imagen'){
    console.log("recibida imagen2");
    modificarAlmacenarElementoMultimedia3(res,files,fields,poi,dirname,randomName,files.filetoupload2.path,files.filetoupload2.name,'imagen',null,id,nombre,id_poi)
  }
  else if(tipo=='video'){
    console.log("recibido video2");
    modificarAlmacenarElementoMultimedia3(res,files,fields,poi,dirname,randomName,files.filetoupload2.path,files.filetoupload2.name,'video',fields.transparent2,id,nombre,id_poi)
  }
  else{
    //actualizar BBDD editarPOI
    poi.elemento2 = null
    poi.archivo2 = null
    poi.transparent2 = null
    poi.tamanio2 = null
    poi.elemento3 = null
    poi.archivo3 = null
    poi.transparent3 = null
    poi.tamanio3 = null
    actualizarPOIBBDD(res, poi, id, nombre, id_poi)
  }
}
//funcion que se encarga de modificar elemento multimedia 2
function modificarAlmacenarElementoMultimedia2(res,files,fields,poi,dirname,randomName,path,name,tipo,transparente,id,nombre,id_poi){
  var oldPathElement2 = path;
  var elementName2 = randomName + name
  var newPathElement2 = dirname + elementName2;
  if(name!=""){
    console.log("modificar: elemento: " + tipo + "2 nuevo");
    mv(oldPathElement2, newPathElement2, function(err) {
      if (err) {
        errorModificar(id,nombre);
      }
      else{
        console.log('modificar: almacenado' + tipo + 'correctamente');
        poi.elemento2 = tipo
        poi.archivo2 = elementName2
        poi.transparent2 = transparente
        eliminarElementoMultimedia(fields.old_file2,fields.old_field2,2);
        //comprobamos elemento3
        console.log("modificar comprobamos elemento3");
        comprobarElemento3(res,files,fields,poi,dirname,randomName,files.filetoupload3.path,files.filetoupload3.name,fields.optradio_element3,fields.transparent3,id,nombre,id_poi)
      }
    })
  }
  else{
    console.log("modificar: elemento " + tipo + " 2 antiguo");
    //comprobamos elemento3
    console.log("modificar comprobamos elemento3");
    comprobarElemento3(res,files,fields,poi,dirname,randomName,files.filetoupload3.path,files.filetoupload3.name,fields.optradio_element3,fields.transparent3,id,nombre,id_poi)
  }
}
//funcion que comprueba el elemento 3
function comprobarElemento3(res,files,fields,poi,dirname,randomName,path,name,tipo,transparente,id,nombre,id_poi){
  if(tipo=='imagen'){
    console.log("recibida imagen3");
    modificarAlmacenarElementoMultimedia3(res,files,fields,poi,dirname,randomName,files.filetoupload3.path,files.filetoupload3.name,'imagen',null,id,nombre,id_poi)
  }
  else if(tipo=='video'){
    console.log("recibido video3");
    modificarAlmacenarElementoMultimedia3(res,files,fields,poi,dirname,randomName,files.filetoupload3.path,files.filetoupload3.name,'video',fields.transparent3,id,nombre,id_poi)
  }
  else{
    //actualizar BBDD editarPOI
    poi.elemento3 = null
    poi.archivo3 = null
    poi.transparent3 = null
    poi.tamanio3 = null
    actualizarPOIBBDD(res, poi, id, nombre, id_poi)
  }
}
//funcion que se encarga de modificar elemento multimedia 3
function modificarAlmacenarElementoMultimedia3(res,files,fields,poi,dirname,randomName,path,name,tipo,transparente,id,nombre,id_poi){
  var oldPathElement3 = path;
  var elementName3 = randomName + name
  var newPathElement3 = dirname + elementName3;
  if(name!=""){
    console.log("modificar: elemento: " + tipo + "3 nuevo");
    mv(oldPathElement3, newPathElement3, function(err) {
      if (err) {
        errorModificar(id,nombre);
      }
      else{
        console.log('modificar: almacenado' + tipo + 'correctamente');
        poi.elemento3 = tipo
        poi.archivo3 = elementName3
        poi.transparent3=transparente
        eliminarElementoMultimedia(fields.old_file3,fields.old_field3,3);
        //actualizar BBDD editarPOI
        actualizarPOIBBDD(res, poi, id, nombre, id_poi)
      }
    })
  }
  else{
    console.log("modificar: " + tipo + " 3 antiguo");
    //actualizar BBDD editarPOI
    actualizarPOIBBDD(res, poi, id, nombre, id_poi)
  }
}

/*Controlador relaccionado con los puntos de interes de un MAPA*/
module.exports={
	/*funciones del controlador*/
  //sirve la pagina para crear un POI de un mapa dado
  getNuevoPoi : function(req, res, next){
    var id = req.query.id;
    var latitud = req.query.latitud;
    var longitud = req.query.longitud;
    res.render('maps/point_of_interest',{id: id, latitud: latitud, longitud: longitud})
  },
  //obtiene los POI de un mapa dado a traves de su id
  getPois : function(req, res, next){
		var id = req.query.id;
		var nombre = req.query.nombre;
    var latitud = req.query.latitud;
    var longitud = req.query.longitud;
		var config =require('.././database/config');
	  var db=mysql.createConnection(config);
    var pois=null;
    if(id!=undefined){
      db.connect();
  		db.query('SELECT * FROM  POI where id_mapa = ? ORDER BY categoria ASC',id, function(err,rows,fields){
  				if(err){
            // throw err;
            if(req.query.app=="true"){
              res.status(500);
              res.end();
            }else{
              res.status(500);
              res.render('maps/pois',{error: "Se ha producido un error con la BBDD, vuelva a intentarlo", nombre_mapa: nombre, id_mapa: id, latitud: latitud, longitud: longitud});
              res.end();
            }
          }
          else{
            pois=rows;
            if(req.query.app=="true"){
  						res.writeHead(200, {"Content-Type": "application/json"});
  	  				var json = JSON.stringify({
  	    				poiList: pois
  	  				});
  	  				res.end(json);
  					}else{
  						res.render('maps/pois',{Listpois: pois, nombre_mapa: nombre, id_mapa: id, latitud: latitud, longitud: longitud});
  					}
            db.end();
          }
  		});
    }else{
      console.log("no es un id valido");
      res.status(400);
      res.send('id de mapa invalido');
      res.end();
    }

	},
  //almacena un POI dado en la BBDD
  postNuevoPoi : function(req, res, next){
    var poi
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      var id = fields.id_mapa;
      var latitud_mapa= fields.latitud_mapa
      var longitud_mapa=fields.longitud_mapa
      var poi = {
        id_mapa: fields.id_mapa,
        titulo: fields.titulo,
        latitud: fields.latitud,
        longitud: fields.longitud,
        direccion: fields.direccion,
        categoria: fields.categoria,
        enlace: fields.enlace,
        descripcion: fields.descripcion,
        contenido: fields.optradio,
        distancia: fields.distancia,
        elemento1:null,
        archivo1:null,
        tamanio1:fields.tamanio1,
        altura1:fields.altura1,
        transparent1:null,
        elemento2:null,
        archivo2:null,
        tamanio2:null,
        transparent2:null,
        altura2:fields.altura2,
        posicion2:fields.optradio_position2,
        elemento3:null,
        archivo3:null,
        tamanio3:null,
        transparent3:null,
        altura3:fields.altura3,
        posicion3:fields.optradio_position3,
      }
      //comprobamos el campo altura de los elementos multimedia
      if(fields.altura1==""){
        poi.altura1 =null
      }
      if(fields.altura2==""){
        poi.altura2 =null
      }
      if(fields.altura3==""){
        poi.altura3 =null
      }
      //creamos las variables necesarias para almacenar los elementos multimedia
      var dirname = path.join(__dirname, '..', 'public/uploads/');
      var randomName = createRandomName();
      //comprobamos los elementos multimedia introducidos
      if(fields.optradio == 'si'){
        console.log("detectado contenido aumentado");
        //si hay contenido aumentado.
        if(fields.optradio_element1=='imagen'){
          console.log("recibida imagen1");
          almacenarElementoMultimedia1(res,files,fields,poi,dirname,randomName,files.filetoupload1.path,files.filetoupload1.name,'imagen',null,latitud_mapa,longitud_mapa,id);
        }
        else if(fields.optradio_element1=='video'){
          console.log("recibido video1");
          almacenarElementoMultimedia1(res,files,fields,poi,dirname,randomName,files.filetoupload1.path,files.filetoupload1.name,'video',fields.transparent1,latitud_mapa,longitud_mapa,id);
        }
      }
      else{
        //no hay contenido aumentado almacenar poi en la BBDD
        console.log("no detectado contenido aumentado");
        console.log("almacenamos en la BBDD");
        guardarBBDD(res, poi, latitud_mapa, longitud_mapa, id)
      }
    });
	},
  //elimina un POI dado a traves de su clave primaria que es el id
  EliminarPoi : function(req, res, next){
    var config =require('.././database/config');
    var db=mysql.createConnection(config);
    var id = req.body.id;
	  var respuesta={res:false};
    var archivo1= null
    var archivo2= null
    var archivo3= null

    db.connect();
    db.query('SELECT archivo1,archivo2,archivo3 FROM  POI where idPOI = ?',id, function(err,rows,fields){
      if(err){
        res.status(500);
        respuesta.res=false;
        db.end();
        res.json(respuesta);
        res.end();
      }
      else{
        //almacenamos los archivos para borrarlos tras borrar el POI
        archivo1=rows[0].archivo1
        archivo2=rows[0].archivo2
        archivo3=rows[0].archivo3
        db.query('delete from POI where idPOI = ?',id, function(err,rows,fields){
    		  if(err){
            res.status(500);
            respuesta.res=false;
            db.end();
      			res.json(respuesta);
            res.end();
          }
          else{
            respuesta.res=true;
            var dirname = path.join(__dirname, '..', 'public/uploads/');
            console.log("Borrando archivo1");
            fs.unlink(dirname+archivo1,function(err){
              if(err) return console.log(err);
              console.log('file1 deleted successfully');
            });
            console.log("Borrando archivo2");
            fs.unlink(dirname+archivo2,function(err){
              if(err) return console.log(err);
              console.log('file2 deleted successfully');
            });
            console.log("Borrando archivo3");
            fs.unlink(dirname+archivo3,function(err){
              if(err) return console.log(err);
              console.log('file3 deleted successfully');
            });
            db.end();
      			res.json(respuesta);
          }
    		});
      }
    });
	},
  //obtiene los datos del POI a modificar y los pinta en la pantalla de modificar el POI
  getModificarPoi : function(req, res, next){
    var config =require('.././database/config');;
    var db=mysql.createConnection(config);
    var id = req.query.id;
    var nombre =req.query.nombre
    var poi=null;

	  db.connect();
		db.query('SELECT * FROM  POI where idPOI = ?',id, function(err,rows,fields){
			if(err){
        // throw err;
        res.status(500);
        res.render('maps/modificar_poi',{error: "Imposible acceder a la BBDD para recuperar los datos del punto de interes, vuelva a probar de nuevo"});
        res.end();
      }else{
        poi=rows;
        db.end();
  	    res.render('maps/modificar_poi',{ListPoi: poi,nombre_mapa:nombre});
      }
		});
	},//actualiza el POI con las modificaciones añadidas en la BBDD

  postModificarPoi : function(req, res, next){
    console.log("postModificarPoi");
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      var nombre=fields.nombre_mapa;
      var id = fields.id_mapa;
      var id_poi = fields.id_poi
      var dirname = path.join(__dirname, '..', 'public/uploads/');
      var randomName = createRandomName()
      //elemento a almacenar en la BBDD
      var poi = {
  			id_mapa: fields.id_mapa,
        titulo: fields.titulo,
  	   	latitud: fields.latitud,
  	   	longitud: fields.longitud,
        direccion: fields.direccion,
  			categoria: fields.categoria,
  	   	enlace: fields.enlace,
  			descripcion: fields.descripcion,
        contenido: fields.optradio,
        distancia: fields.distancia,
        elemento1: fields.optradio_element1,
        archivo1: fields.old_file1,
        tamanio1: fields.tamanio1,
        transparent1: fields.transparent1,
        altura1: fields.altura1,
        elemento2: fields.optradio_element2,
        archivo2: fields.old_file2,
        tamanio2: fields.tamanio2,
        transparent2: fields.transparent2,
        altura2: fields.altura2,
        posicion2: fields.optradio_position2,
        elemento3: fields.optradio_element3,
        archivo3: fields.old_file3,
        tamanio3: fields.tamanio3,
        transparent3: fields.transparent3,
        altura3: fields.altura3,
        posicion3: fields.optradio_position3,
  		}
      //comprobamos la altura de los elementos aumentados
      if(fields.altura1==""){
        poi.altura1=null;
      }
      if(fields.altura2==""){
        poi.altura2=null;
      }
      if(fields.altura3==""){
        poi.altura3=null;
      }
      if(fields.optradio == 'si'){
        //si hay contenido aumentado
        if(fields.optradio_element1=='imagen'){
          console.log("modificar: recibida imagen1");
          modificarAlmacenarElementoMultimedia1(res,files,fields,poi,dirname,randomName,files.filetoupload1.path,files.filetoupload1.name,'imagen',null,id,nombre,id_poi)
        }
        else if(fields.optradio_element1=='video'){
          console.log("modificar: recibida imagen1");
          modificarAlmacenarElementoMultimedia1(res,files,fields,poi,dirname,randomName,files.filetoupload1.path,files.filetoupload1.name,'video',fields.transparent1,id,nombre,id_poi)
        }
      }
      else{
        //no hay contenido aumentado
        console.log("no hay contenido aumentado");
        eliminarElementoMultimedia(fields.old_file1,fields.old_field1,1);
        eliminarElementoMultimedia(fields.old_file2,fields.old_field2,2);
        eliminarElementoMultimedia(fields.old_file3,fields.old_field3,3);
        poi.distancia = null
        poi.elemento1 = null
        poi.archivo1 = null
        poi.tamanio1 = null
        poi.transparent1 = null
        poi.elemento2 = null
        poi.archivo2 = null
        poi.tamanio2 = null
        poi.transparent2 = null
        poi.elemento3 = null
        poi.archivo3 = null
        poi.tamanio3 = null
        poi.transparent3 = null
        actualizarPOIBBDD(res, poi, id, nombre, id_poi)
      }
    });
	}
}
