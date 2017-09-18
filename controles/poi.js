var mysql=require('mysql');
var formidable = require('formidable');
var fs = require('fs');
var mv = require('mv');
var path = require('path');

function guardarBBDD(res, poi, latitud, longitud, id){
  console.log("almacenamos en la BBDD");
  var config =require('.././database/config');
  var db=mysql.createConnection(config);
  db.connect();
  db.query('insert into  POI SET ?' ,poi, function(err,rows,fields){
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

function actualizarPOIBBDD(res, poi, id, nombre, id_poi){
  console.log("actualizamos la BBDD");
  var config =require('.././database/config');
  var db=mysql.createConnection(config);
  db.connect();
  db.query('update   POI SET ? where ?' ,[poi,{idPOI: id_poi}], function(err,rows,fields){
    if(err){
      // throw err
      res.status(500);
      res.redirect('/verPOI?id='+ id +'&nombre='+ nombre);
      res.end();
    }
    else{
      db.end();
      res.redirect('/verPOI?id='+ id +'&nombre='+ nombre);
    }
  });
}

function createRandomName(){
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for( var i=0; i < 10; i++ )
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
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
      if(fields.altura1==""){
        poi.altura1 =null
      }
      if(fields.altura2==""){
        poi.altura2 =null
      }
      if(fields.altura3==""){
        poi.altura3 =null
      }
      var dirname = path.join(__dirname, '..', 'public/uploads/');
      var randomName = createRandomName()
      if(fields.optradio == 'si'){
        if(fields.optradio_element1=='imagen'){
          console.log("recibimos imagen1");
          var oldpathimage1 = files.filetoupload1.path;
          var imagename1 = randomName + files.filetoupload1.name
          var newpathimage1 = dirname + imagename1;
          mv(oldpathimage1, newpathimage1, function(err) {
            if (err) {
              res.status(500);
              res.render('maps/point_of_interest',{latitud: latitud_mapa, longitud:longitud_mapa, error: 'Imposible acceder a la BBDD para almacenar el archivo, intentelo de nuevo.', id: id});
              res.end();
            }else{
              console.log('image1 moved successfully');
              poi.archivo1 = imagename1
              poi.elemento1 = 'imagen'
              //comprobamos elemento 2
              if(fields.optradio_element2=='imagen'){
                console.log("recibimos imagen2");
                var oldpathimage2 = files.filetoupload2.path;
                var imagename2 = randomName + files.filetoupload2.name
                var newpathimage2 = dirname + imagename2;
                mv(oldpathimage2, newpathimage2, function(err) {
                  if (err) {
                    res.status(500);
                    res.render('maps/point_of_interest',{latitud: latitud_mapa, longitud:longitud_mapa, error: 'Imposible acceder a la BBDD para almacenar el archivo, intentelo de nuevo.', id: id});
                    res.end();
                  }else{
                    console.log('image2 moved successfully');
                    poi.archivo2 = imagename2
                    poi.elemento2 = 'imagen'
                    poi.tamanio2=fields.tamanio2
                    //comprobamos elemento 3
                    if(fields.optradio_element3=='imagen'){
                      console.log("recibimos imagen3");
                      var oldpathimage3 = files.filetoupload3.path;
                      var imagename3 = randomName + files.filetoupload3.name
                      var newpathimage3 = dirname + imagename3;
                      mv(oldpathimage3, newpathimage3, function(err) {
                        if (err) {
                          res.status(500);
                          res.render('maps/point_of_interest',{latitud: latitud_mapa, longitud:longitud_mapa, error: 'Imposible acceder a la BBDD para almacenar el archivo, intentelo de nuevo.', id: id});
                          res.end();
                        }else{
                          console.log('image3 moved successfully');
                          poi.archivo3 = imagename3
                          poi.elemento3 = 'imagen'
                          poi.tamanio3=fields.tamanio3
                          console.log("el archivo1 es: " + poi.archivo1);
                          console.log("el archivo2 es: " + poi.archivo2);
                          console.log("el archivo3 es: " + poi.archivo3);
                          guardarBBDD(res, poi, latitud_mapa, longitud_mapa, id)
                          //almacenamos en la bbdd
                        }
                      })
                    }
                    else if(fields.optradio_element3=='video'){
                      console.log("recibimos video3");
                      var oldpathvideo3 = files.filetoupload3.path;
                      var videoname3 =  randomName + files.filetoupload3.name
                      var newpathvideo3 = dirname + videoname3;
                      mv(oldpathvideo3, newpathvideo3, function(err) {
                        if (err) {
                          res.status(500);
                          res.render('maps/point_of_interest',{latitud: latitud_mapa, longitud:longitud_mapa, error: 'Imposible acceder a la BBDD para almacenar el archivo, intentelo de nuevo.', id: id});
                          res.end();
                        }else{
                          console.log('video3 moved successfully');
                          if(fields.transparent3=='yes'){
                            poi.transparent3 = fields.transparent3
                          }
                          poi.archivo3 = videoname3
                          poi.elemento3 = 'video'
                          poi.tamanio3=fields.tamanio3
                          console.log("el archivo1 es: "+poi.archivo1);
                          console.log("el archivo2 es: "+poi.archivo2);
                          console.log("el archivo3 es: "+poi.archivo3);
                          guardarBBDD(res, poi, latitud_mapa, longitud_mapa, id)
                          //almacenaremos en la bbdd
                        }
                      })
                    }
                    else{
                      //no hay elemento3
                      console.log("no hay elemento3");
                      console.log("el archivo1 es: "+ poi.archivo1);
                      console.log("el archivo2 es: "+ poi.archivo2);
                      guardarBBDD(res, poi, latitud_mapa, longitud_mapa, id)
                    }
                  }
                })
              }
              else if(fields.optradio_element2=='video'){
                console.log("recibimos video2");
                var oldpathvideo2 = files.filetoupload2.path;
                var videoname2 =  randomName + files.filetoupload2.name
                var newpathvideo2 = dirname + videoname2;
                mv(oldpathvideo2, newpathvideo2, function(err) {
                  if (err) {
                    res.status(500);
                    res.render('maps/point_of_interest',{latitud: latitud_mapa, longitud:longitud_mapa, error: 'Imposible acceder a la BBDD para almacenar el archivo, intentelo de nuevo.', id: id});
                    res.end();
                  }else{
                    console.log('video2 moved successfully');
                    if(fields.transparent2=='yes'){
                      poi.transparent2 = fields.transparent2
                    }
                    poi.archivo2 = videoname2
                    poi.elemento2 = 'video'
                    poi.tamanio2=fields.tamanio2
                    //comprobamos el elemento3
                    if(fields.optradio_element3=='imagen'){
                      console.log("recibimos imagen3");
                      var oldpathimage3 = files.filetoupload3.path;
                      var imagename3 = randomName + files.filetoupload3.name
                      var newpathimage3 = dirname + imagename3;
                      mv(oldpathimage3, newpathimage3, function(err) {
                        if (err) {
                          res.status(500);
                          res.render('maps/point_of_interest',{latitud: latitud_mapa, longitud:longitud_mapa, error: 'Imposible acceder a la BBDD para almacenar el archivo, intentelo de nuevo.', id: id});
                          res.end();
                        }else{
                          console.log('image3 moved successfully');
                          poi.archivo3 = imagename3
                          poi.elemento3 = 'imagen'
                          poi.tamanio3=fields.tamanio3
                          console.log("el archivo1 es: "+poi.archivo1);
                          console.log("el archivo2 es: "+poi.archivo2);
                          console.log("el archivo3 es: "+poi.archivo3);
                          guardarBBDD(res, poi, latitud_mapa, longitud_mapa, id)
                          //almacenamos en la BBDD
                        }
                      })
                    }
                    else if(fields.optradio_element3=='video'){
                      console.log("recibimos video3");
                      var oldpathvideo3 = files.filetoupload3.path;
                      var videoname3 =  randomName + files.filetoupload3.name
                      var newpathvideo3 = dirname + videoname3;
                      mv(oldpathvideo3, newpathvideo3, function(err) {
                        if (err) {
                          res.status(500);
                          res.render('maps/point_of_interest',{latitud: latitud_mapa, longitud:longitud_mapa, error: 'Imposible acceder a la BBDD para almacenar el archivo, intentelo de nuevo.', id: id});
                          res.end();
                        }else{
                          console.log('video3 moved successfully');
                          if(fields.transparent3=='yes'){
                            poi.transparent3 = fields.transparent3
                          }
                          poi.archivo3 = videoname3
                          poi.elemento3 = 'video'
                          poi.tamanio3=fields.tamanio3
                          console.log("el archivo1 es: "+poi.archivo1);
                          console.log("el archivo2 es: "+poi.archivo2);
                          console.log("el archivo3 es: "+poi.archivo3);
                          guardarBBDD(res, poi, latitud_mapa, longitud_mapa, id)
                          //almacenar en la bbDD.
                        }
                      })
                    }
                    else{
                      //no hay elemento 3
                      console.log("no hay elemento 3");
                      console.log("el archivo1 es: "+ poi.archivo1);
                      console.log("el archivo2 es: "+ poi.archivo2);
                      guardarBBDD(res, poi, latitud_mapa, longitud_mapa, id)
                    }
                  }
                })
              }
              else{
                console.log("no hay elemento 2");
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
        else if(fields.optradio_element1=='video'){
          console.log("recibimos video1");
          var oldpathvideo1 = files.filetoupload1.path;
          var videoname1 =  randomName + files.filetoupload1.name
          var newpathvideo1 = dirname + videoname1;
          mv(oldpathvideo1, newpathvideo1, function(err) {
            if (err) {
              res.status(500);
              res.render('maps/point_of_interest',{latitud: latitud_mapa, longitud:longitud_mapa, error: 'Imposible acceder a la BBDD para almacenar el archivo, intentelo de nuevo.', id: id});
              res.end();
            }else{
              console.log('video1 moved successfully');
              if(fields.transparent1=='yes'){
                poi.transparent1 = fields.transparent1
              }
              poi.archivo1 = videoname1
              poi.elemento1 = 'video'
              //comprobamos elemento 2
              if(fields.optradio_element2=='imagen'){
                console.log("recibimos imagen2");
                var oldpathimage2 = files.filetoupload2.path;
                var imagename2 = randomName + files.filetoupload2.name
                var newpathimage2 = dirname + imagename2;
                mv(oldpathimage2, newpathimage2, function(err) {
                  if (err) {
                    res.status(500);
                    res.render('maps/point_of_interest',{latitud: latitud_mapa, longitud:longitud_mapa, error: 'Imposible acceder a la BBDD para almacenar el archivo, intentelo de nuevo.', id: id});
                    res.end();
                  }else{
                    console.log('image2 moved successfully');
                    poi.archivo2 = imagename2
                    poi.elemento2 = 'imagen'
                    poi.tamanio2=fields.tamanio2
                    //comprobamos elemento 3
                    if(fields.optradio_element3=='imagen'){
                      console.log("recibimos imagen3");
                      var oldpathimage3 = files.filetoupload3.path;
                      var imagename3 = randomName + files.filetoupload3.name
                      var newpathimage3 = dirname + imagename3;
                      mv(oldpathimage3, newpathimage3, function(err) {
                        if (err) {
                          res.status(500);
                          res.render('maps/point_of_interest',{latitud: latitud_mapa, longitud:longitud_mapa, error: 'Imposible acceder a la BBDD para almacenar el archivo, intentelo de nuevo.', id: id});
                          res.end();
                        }else{
                          console.log('image3 moved successfully');
                          poi.archivo3 = imagename3
                          poi.elemento3 = 'imagen'
                          poi.tamanio3=fields.tamanio3
                          console.log("el archivo1 es: "+poi.archivo1);
                          console.log("el archivo2 es: "+poi.archivo2);
                          console.log("el archivo3 es: "+poi.archivo3);
                          guardarBBDD(res, poi, latitud_mapa, longitud_mapa, id)
                          //almacenamos en la bbdd
                        }
                      })
                    }
                    else if(fields.optradio_element3=='video'){
                      console.log("recibimos video3");
                      var oldpathvideo3 = files.filetoupload3.path;
                      var videoname3 =  randomName + files.filetoupload3.name
                      var newpathvideo3 = dirname + videoname3;
                      mv(oldpathvideo3, newpathvideo3, function(err) {
                        if (err) {
                          res.status(500);
                          res.render('maps/point_of_interest',{latitud: latitud_mapa, longitud:longitud_mapa, error: 'Imposible acceder a la BBDD para almacenar el archivo, intentelo de nuevo.', id: id});
                          res.end();
                        }else{
                          console.log('video3 moved successfully');
                          if(fields.transparent3=='yes'){
                            poi.transparent3 = fields.transparent3
                          }
                          poi.archivo3 = videoname3
                          poi.elemento3 = 'video'
                          poi.tamanio3=fields.tamanio3
                          console.log("el archivo1 es: "+poi.archivo1);
                          console.log("el archivo2 es: "+poi.archivo2);
                          console.log("el archivo3 es: "+poi.archivo3);
                          guardarBBDD(res, poi, latitud_mapa, longitud_mapa, id)
                          //almacenaremos en la bbdd
                        }
                      })
                    }
                    else{
                      console.log("no hay elemento 3");
                      console.log("el archivo1 es: "+poi.archivo1);
                      console.log("el archivo2 es: "+poi.archivo2);
                      guardarBBDD(res, poi, latitud_mapa, longitud_mapa, id)
                    }
                  }
                })
              }
              else if(fields.optradio_element2=='video'){
                console.log("recibimos video2");
                var oldpathvideo2 = files.filetoupload2.path;
                var videoname2 =  randomName + files.filetoupload2.name
                var newpathvideo2 = dirname + videoname2;
                mv(oldpathvideo2, newpathvideo2, function(err) {
                  if (err) {
                    res.status(500);
                    res.render('maps/point_of_interest',{latitud: latitud_mapa, longitud:longitud_mapa, error: 'Imposible acceder a la BBDD para almacenar el archivo, intentelo de nuevo.', id: id});
                    res.end();
                  }else{
                    console.log('video2 moved successfully');
                    if(fields.transparent2=='yes'){
                      poi.transparent2 = fields.transparent2
                    }
                    poi.archivo2 = videoname2
                    poi.elemento2 = 'video'
                    poi.tamanio2=fields.tamanio2
                    //comprobamos el elemento3
                    if(fields.optradio_element3=='imagen'){
                      console.log("recibimos imagen3");
                      var oldpathimage3 = files.filetoupload3.path;
                      var imagename3 = randomName + files.filetoupload3.name
                      var newpathimage3 = dirname + imagename3;
                      mv(oldpathimage3, newpathimage3, function(err) {
                        if (err) {
                          res.status(500);
                          res.render('maps/point_of_interest',{latitud: latitud_mapa, longitud:longitud_mapa, error: 'Imposible acceder a la BBDD para almacenar el archivo, intentelo de nuevo.', id: id});
                          res.end();
                        }else{
                          console.log('image3 moved successfully');
                          poi.archivo3 = imagename3
                          poi.elemento3 = 'imagen'
                          poi.tamanio3=fields.tamanio3
                          console.log("el archivo1 es: "+poi.archivo1);
                          console.log("el archivo2 es: "+poi.archivo2);
                          console.log("el archivo3 es: "+poi.archivo3);
                          guardarBBDD(res, poi, latitud_mapa, longitud_mapa, id)
                          //almacenamos en la BBDD
                        }
                      })
                    }
                    else if(fields.optradio_element3=='video'){
                      console.log("recibimos video3");
                      var oldpathvideo3 = files.filetoupload3.path;
                      var videoname3 =  randomName + files.filetoupload3.name
                      var newpathvideo3 = dirname + videoname3;
                      mv(oldpathvideo3, newpathvideo3, function(err) {
                        if (err) {
                          res.status(500);
                          res.render('maps/point_of_interest',{latitud: latitud_mapa, longitud:longitud_mapa, error: 'Imposible acceder a la BBDD para almacenar el archivo, intentelo de nuevo.', id: id});
                          res.end();
                        }else{
                          console.log('video3 moved successfully');
                          if(fields.transparent3=='yes'){
                            poi.transparent3 = fields.transparent3
                          }
                          poi.archivo3 = videoname3
                          poi.elemento3 = 'video'
                          poi.tamanio3=fields.tamanio3
                          console.log("el archivo1 es: "+poi.archivo1);
                          console.log("el archivo2 es: "+poi.archivo2);
                          console.log("el archivo3 es: "+poi.archivo3);
                          guardarBBDD(res, poi, latitud_mapa, longitud_mapa, id)
                          //almacenar en la bbDD.
                        }
                      })
                    }
                    else{
                      console.log("no hay elemento3");
                      console.log("el archivo1 es: "+poi.archivo1);
                      console.log("el archivo2 es: "+poi.archivo2);
                      guardarBBDD(res, poi, latitud_mapa, longitud_mapa, id)
                    }
                  }
                })
              }
              else{
                console.log("no hay elemento 2");
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
          })
        }
      }else{
        //no hay contenido aumentado almacenar poi en la BBDD
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
      if(fields.altura1==""){
        poi.altura1=null;
      }
      if(fields.altura2==""){
        poi.altura3=null;
      }
      if(fields.altura3==""){
        poi.altura3=null;
      }
      if(fields.optradio == 'si'){
        if(fields.optradio_element1=='imagen'){
          console.log("elemento1 imagen");
          var oldpathimage1 = files.filetoupload1.path;
          var imagename1 = randomName + files.filetoupload1.name
          var newpathimage1 = dirname + imagename1;
          if(files.filetoupload1.name!=""){
            console.log("imagen1 nueva");
            mv(oldpathimage1, newpathimage1, function(err) {
              if (err) {
                res.status(500);
                res.redirect('/verPOI?id='+ id +'&nombre='+ nombre);
                res.end();
              }else{
                console.log('image1 moved successfully');
                poi.elemento1 = 'imagen'
                poi.archivo1 = imagename1
                poi.transparent1=null
                if(fields.old_file1!=undefined && fields.old_file1!=""){
                  fs.unlink(dirname+fields.old_field1,function(err){
                    if(err) return console.log(err);
                    console.log('file1 deleted successfully');
                  });
                }
                console.log("comprobamos elemento2");
                if(fields.optradio_element2=='imagen'){
                  console.log("elemento imagen 2");
                  var oldpathimage2 = files.filetoupload2.path;
                  var imagename2 = randomName + files.filetoupload2.name
                  var newpathimage2 = dirname + imagename2;
                  if(files.filetoupload2.name!=""){
                    console.log("imagen2 nueva");
                    mv(oldpathimage2, newpathimage2, function(err) {
                      if (err) {
                        res.status(500);
                        res.redirect('/verPOI?id='+ id +'&nombre='+ nombre);
                        res.end();
                      }else{
                        console.log('image2 moved successfully');
                        poi.elemento2 = 'imagen'
                        poi.archivo2 = imagename2
                        poi.transparent2=null
                        if(fields.old_file2!=undefined && fields.old_file2!=""){
                          fs.unlink(dirname+fields.old_field2,function(err){
                            if(err) return console.log(err);
                            console.log('file2 deleted successfully');
                          });
                        }
                        console.log("comprobamos elemento3");
                        if(fields.optradio_element3=='imagen'){
                          console.log("elemento imagen 3");
                          var oldpathimage3 = files.filetoupload3.path;
                          var imagename3 = randomName + files.filetoupload3.name
                          var newpathimage3 = dirname + imagename3;
                          if(files.filetoupload3.name!=""){
                            console.log("imagen3 nueva");
                            mv(oldpathimage3, newpathimage3, function(err) {
                              if (err) {
                                res.status(500);
                                res.redirect('/verPOI?id='+ id +'&nombre='+ nombre);
                                res.end();
                              }else{
                                console.log('image3 moved successfully');
                                poi.elemento3 = 'imagen'
                                poi.archivo3 = imagename3
                                poi.transparent3=null
                                if(fields.old_file3!=undefined && fields.old_file3!=""){
                                  fs.unlink(dirname+fields.old_field3,function(err){
                                    if(err) return console.log(err);
                                    console.log('file3 deleted successfully');
                                  });
                                }
                                //actualizar BBDD editarPOI
                                actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                              }
                            })
                          }
                          else{
                            console.log("imagen 3 antigua");
                            //actualizar BBDD editarPOI
                            actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                          }
                        }
                        else if(fields.optradio_element3=='video'){
                          console.log("elemento 3 video");
                          var oldpathvideo3 = files.filetoupload3.path;
                          var videoname3 = randomName + files.filetoupload3.name
                          var newpathvideo3 = dirname + videoname3;
                          if(files.filetoupload3.name!=""){
                            console.log("video3 nuevo");
                            mv(oldpathvideo3, newpathvideo3, function(err) {
                              if (err) {
                                res.status(500);
                                res.redirect('/verPOI?id='+ id +'&nombre='+ nombre);
                                res.end();
                              }else{
                                console.log('video3 moved successfully');
                                poi.elemento3 = 'video'
                                poi.archivo3 = videoname3
                                if(fields.transparent3!='yes'){
                                  poi.transparent3=null
                                }else{
                                  poi.transparent3=fields.transparent3
                                }
                                if(fields.old_file3!=undefined && fields.old_file3!=""){
                                  fs.unlink(dirname+fields.old_field3,function(err){
                                    if(err) return console.log(err);
                                    console.log('file3 deleted successfully');
                                  });
                                }
                                //actualizar BBDD editarPOI
                                actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                              }
                            })
                          }
                          else{
                            console.log("video 3 antiguo");
                            //actualizar BBDD editarPOI
                            actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                          }
                        }
                        else{
                          console.log("no hay elemento 3");
                          //actualizar BBDD editarPOI
                          poi.elemento3 = null
                          poi.archivo3 = null
                          poi.transparent3 = null
                          poi.tamanio3 = null
                          actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                        }
                      }
                    })
                  }
                  else{
                    console.log("imagen 3 antigua");
                    console.log("comprobamos elemento3");
                    if(fields.optradio_element3=='imagen'){
                      console.log("elemento imagen 3");
                      var oldpathimage3 = files.filetoupload3.path;
                      var imagename3 = randomName + files.filetoupload3.name
                      var newpathimage3 = dirname + imagename3;
                      if(files.filetoupload3.name!=""){
                        console.log("imagen3 nueva");
                        mv(oldpathimage3, newpathimage3, function(err) {
                          if (err) {
                            res.status(500);
                            res.redirect('/verPOI?id='+ id +'&nombre='+ nombre);
                            res.end();
                          }else{
                            console.log('image3 moved successfully');
                            poi.elemento3 = 'imagen'
                            poi.archivo3 = imagename3
                            poi.transparent3=null
                            if(fields.old_file3!=undefined && fields.old_file3!=""){
                              fs.unlink(dirname+fields.old_field3,function(err){
                                if(err) return console.log(err);
                                console.log('file3 deleted successfully');
                              });
                            }
                            //actualizar BBDD editarPOI
                            actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                          }
                        })
                      }
                      else{
                        console.log("imagen 3 antigua");
                        //actualizar BBDD editarPOI
                        actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                      }
                    }
                    else if(fields.optradio_element3=='video'){
                      console.log("elemento 3 video");
                      var oldpathvideo3 = files.filetoupload3.path;
                      var videoname3 = randomName + files.filetoupload3.name
                      var newpathvideo3 = dirname + videoname3;
                      if(files.filetoupload3.name!=""){
                        console.log("video3 nuevo");
                        mv(oldpathvideo3, newpathvideo3, function(err) {
                          if (err) {
                            res.status(500);
                            res.redirect('/verPOI?id='+ id +'&nombre='+ nombre);
                            res.end();
                          }else{
                            console.log('video3 moved successfully');
                            poi.elemento3 = 'video'
                            poi.archivo3 = videoname3
                            poi.transparent3=fields.transparent3
                            if(fields.old_file3!=undefined && fields.old_file3!=""){
                              fs.unlink(dirname+fields.old_field3,function(err){
                                if(err) return console.log(err);
                                console.log('file3 deleted successfully');
                              });
                            }
                            //actualizar BBDD editarPOI
                            actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                          }
                        })
                      }
                      else{
                        console.log("video 3 antiguo");
                        //actualizar BBDD editarPOI
                        actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                      }
                    }
                    else{
                      console.log("no hay elemento 3");
                      //actualizar BBDD editarPOI
                      poi.elemento3 = null
                      poi.archivo3 = null
                      poi.transparent3 = null
                      poi.tamanio3 = null
                      actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                    }
                  }
                }
                else if(fields.optradio_element2=='video'){
                  var oldpathvideo2 = files.filetoupload2.path;
                  var videoname2 = randomName + files.filetoupload2.name
                  var newpathvideo2 = dirname + videoname2;
                  if(files.filetoupload2.name!=""){
                    console.log("video2 nuevo");
                    mv(oldpathvideo2, newpathvideo2, function(err) {
                      if (err) {
                        res.status(500);
                        res.redirect('/verPOI?id='+ id +'&nombre='+ nombre);
                        res.end();
                      }else{
                        console.log('video2 moved successfully');
                        poi.elemento2 = 'video'
                        poi.archivo2 = videoname2
                        if(fields.transparent2!='yes'){
                          poi.transparent2=null
                        }else{
                          poi.transparent2=fields.transparent2
                        }
                        if(fields.old_file2!=undefined && fields.old_file2!=""){
                          fs.unlink(dirname+fields.old_field2,function(err){
                            if(err) return console.log(err);
                            console.log('file2 deleted successfully');
                          });
                        }
                        console.log("comprobamos elemento3");
                        if(fields.optradio_element3=='imagen'){
                          console.log("elemento 3 imagen");
                          var oldpathimage3 = files.filetoupload3.path;
                          var imagename3 = randomName + files.filetoupload3.name
                          var newpathimage3 = dirname + imagename3;
                          if(files.filetoupload3.name!=""){
                            console.log("imagen3 nueva");
                            mv(oldpathimage3, newpathimage3, function(err) {
                              if (err) {
                                res.status(500);
                                res.redirect('/verPOI?id='+ id +'&nombre='+ nombre);
                                res.end();
                              }else{
                                console.log('image3 moved successfully');
                                poi.elemento3 = 'imagen'
                                poi.archivo3 = imagename3
                                poi.transparent3=null
                                if(fields.old_file3!=undefined && fields.old_file3!=""){
                                  fs.unlink(dirname+fields.old_field3,function(err){
                                    if(err) return console.log(err);
                                    console.log('file3 deleted successfully');
                                  });
                                }
                                //actualizar BBDD editarPOI
                                actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                              }
                            })
                          }
                          else{
                            console.log("imagen 3 antigua");
                            //actualizar BBDD editarPOI
                            actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                          }
                        }
                        else if(fields.optradio_element3=='video'){
                          console.log("elemento 3 video");
                          var oldpathvideo3 = files.filetoupload3.path;
                          var videoname3 = randomName + files.filetoupload3.name
                          var newpathvideo3 = dirname + videoname3;
                          if(files.filetoupload3.name!=""){
                            console.log("video3 nuevo");
                            mv(oldpathvideo3, newpathvideo3, function(err) {
                              if (err) {
                                res.status(500);
                                res.redirect('/verPOI?id='+ id +'&nombre='+ nombre);
                                res.end();
                              }else{
                                console.log('video3 moved successfully');
                                poi.elemento3 = 'video'
                                poi.archivo3 = videoname3
                                if(fields.transparent3!='yes'){
                                  poi.transparent3=null
                                }else{
                                  poi.transparent3=fields.transparent3
                                }
                                if(fields.old_file3!=undefined && fields.old_file3!=""){
                                  fs.unlink(dirname+fields.old_field3,function(err){
                                    if(err) return console.log(err);
                                    console.log('file3 deleted successfully');
                                  });
                                }
                                //actualizar BBDD editarPOI
                                actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                              }
                            })
                          }
                          else{
                            console.log("video 3 antiguo");
                            //actualizar BBDD editarPOI
                            actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                          }
                        }
                        else{
                          console.log("no hay elemento 3");
                          //actualizar BBDD editarPOI
                          poi.elemento3 = null
                          poi.archivo3 = null
                          poi.transparent3 = null
                          poi.tamanio3 = null
                          actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                        }
                      }
                    })
                  }
                  else{
                    console.log("video2 antiguo");
                    console.log("comprobamos elemento3");
                    if(fields.optradio_element3=='imagen'){
                      console.log("elemento 3 imagen");
                      var oldpathimage3 = files.filetoupload3.path;
                      var imagename3 = randomName + files.filetoupload3.name
                      var newpathimage3 = dirname + imagename3;
                      if(files.filetoupload3.name!=""){
                        console.log("imagen3 nueva");
                        mv(oldpathimage3, newpathimage3, function(err) {
                          if (err) {
                            res.status(500);
                            res.redirect('/verPOI?id='+ id +'&nombre='+ nombre);
                            res.end();
                          }else{
                            console.log('image3 moved successfully');
                            poi.elemento3 = 'imagen'
                            poi.archivo3 = imagename3
                            poi.transparent3=null
                            if(fields.old_file3!=undefined && fields.old_file3!=""){
                              fs.unlink(dirname+fields.old_field3,function(err){
                                if(err) return console.log(err);
                                console.log('file3 deleted successfully');
                              });
                            }
                            //actualizar BBDD editarPOI
                          }
                        })
                      }
                      else{
                        console.log("imagen 3 antigua");
                        //actualizar BBDD editarPOI
                        actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                      }
                    }
                    else if(fields.optradio_element3=='video'){
                      console.log("elemento 3 video");
                      var oldpathvideo3 = files.filetoupload3.path;
                      var videoname3 = randomName + files.filetoupload3.name
                      var newpathvideo3 = dirname + videoname3;
                      if(files.filetoupload3.name!=""){
                        console.log("video3 nuevo");
                        mv(oldpathvideo3, newpathvideo3, function(err) {
                          if (err) {
                            res.status(500);
                            res.redirect('/verPOI?id='+ id +'&nombre='+ nombre);
                            res.end();
                          }else{
                            console.log('video3 moved successfully');
                            poi.elemento3 = 'video'
                            poi.archivo3 = videoname3
                            if(fields.transparent3!='yes'){
                              poi.transparent3=null
                            }else{
                              poi.transparent3=fields.transparent3
                            }
                            if(fields.old_file3!=undefined && fields.old_file3!=""){
                              fs.unlink(dirname+fields.old_field3,function(err){
                                if(err) return console.log(err);
                                console.log('file3 deleted successfully');
                              });
                            }
                            //actualizar BBDD editarPOI
                            actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                          }
                        })
                      }
                      else{
                        console.log("video 3 antiguo");
                        //actualizar BBDD editarPOI
                        actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                      }
                    }
                    else{
                      console.log("no hay elemento 3");
                      //actualizar BBDD editarPOI
                      poi.elemento3 = null
                      poi.archivo3 = null
                      poi.transparent3 = null
                      poi.tamanio3 = null
                      actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                    }
                  }
                }
                else{
                  console.log("no hay elemento 2");
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
            })
          }
          else{
            console.log("comprobamos elemento2");
            if(fields.optradio_element2=='imagen'){
              console.log("elemento 2 imagen");
              var oldpathimage2 = files.filetoupload2.path;
              var imagename2 = randomName + files.filetoupload2.name
              var newpathimage2 = dirname + imagename2;
              if(files.filetoupload2.name!=""){
                console.log("imagen2 nueva");
                mv(oldpathimage2, newpathimage2, function(err) {
                  if (err) {
                    res.status(500);
                    res.redirect('/verPOI?id='+ id +'&nombre='+ nombre);
                    res.end();
                  }else{
                    console.log('image2 moved successfully');
                    poi.elemento2 = 'imagen'
                    poi.archivo2 = imagename2
                    poi.transparent2=null
                    if(fields.old_file2!=undefined && fields.old_file2!=""){
                      fs.unlink(dirname+fields.old_field2,function(err){
                        if(err) return console.log(err);
                        console.log('file2 deleted successfully');
                      });
                    }
                    console.log("comprobamos elemento3");
                    if(fields.optradio_element3=='imagen'){
                      console.log("elemento 3 imagen");
                      var oldpathimage3 = files.filetoupload3.path;
                      var imagename3 = randomName + files.filetoupload3.name
                      var newpathimage3 = dirname + imagename3;
                      if(files.filetoupload3.name!=""){
                        console.log("imagen3 nueva");
                        mv(oldpathimage3, newpathimage3, function(err) {
                          if (err) {
                            res.status(500);
                            res.redirect('/verPOI?id='+ id +'&nombre='+ nombre);
                            res.end();
                          }else{
                            console.log('image3 moved successfully');
                            poi.elemento3 = 'imagen'
                            poi.archivo3 = imagename3
                            poi.transparent3=null
                            if(fields.old_file3!=undefined && fields.old_file3!=""){
                              fs.unlink(dirname+fields.old_field3,function(err){
                                if(err) return console.log(err);
                                console.log('file3 deleted successfully');
                              });
                            }
                            //actualizar BBDD editarPOI
                            actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                          }
                        })
                      }
                      else{
                        console.log("imagen 3 antigua");
                        //actualizar BBDD editarPOI
                        actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                      }
                    }
                    else if(fields.optradio_element3=='video'){
                      console.log("elemento 3 video");
                      var oldpathvideo3 = files.filetoupload3.path;
                      var videoname3 = randomName + files.filetoupload3.name
                      var newpathvideo3 = dirname + videoname3;
                      if(files.filetoupload3.name!=""){
                        console.log("video3 nuevo");
                        mv(oldpathvideo3, newpathvideo3, function(err) {
                          if (err) {
                            res.status(500);
                            res.redirect('/verPOI?id='+ id +'&nombre='+ nombre);
                            res.end();
                          }else{
                            console.log('video3 moved successfully');
                            poi.elemento3 = 'video'
                            poi.archivo3 = videoname3
                            if(fields.transparent3!='yes'){
                              poi.transparent3=null
                            }else{
                              poi.transparent3=fields.transparent3
                            }
                            if(fields.old_file3!=undefined && fields.old_file3!=""){
                              fs.unlink(dirname+fields.old_field3,function(err){
                                if(err) return console.log(err);
                                console.log('file3 deleted successfully');
                              });
                            }
                            //actualizar BBDD editarPOI
                            actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                          }
                        })
                      }
                      else{
                        console.log("video3 antiguo");
                        //actualizar BBDD editarPOI
                        actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                      }
                    }
                    else{
                      console.log("no hay elemento 3");
                      //actualizar BBDD editarPOI
                      poi.elemento3 = null
                      poi.archivo3 = null
                      poi.transparent3 = null
                      poi.tamanio3 = null
                      actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                    }
                  }
                })
              }
              else{
                console.log("imagen 2 antigua");
                console.log("comprobamos elemento3");
                if(fields.optradio_element3=='imagen'){
                  console.log("elemento 3 imagen");
                  var oldpathimage3 = files.filetoupload3.path;
                  var imagename3 = randomName + files.filetoupload3.name
                  var newpathimage3 = dirname + imagename3;
                  if(files.filetoupload3.name!=""){
                    console.log("imagen3 nueva");
                    mv(oldpathimage3, newpathimage3, function(err) {
                      if (err) {
                        res.status(500);
                        res.redirect('/verPOI?id='+ id +'&nombre='+ nombre);
                        res.end();
                      }else{
                        console.log('image3 moved successfully');
                        poi.elemento3 = 'imagen'
                        poi.archivo3 = imagename3
                        poi.transparent3=null
                        if(fields.old_file3!=undefined && fields.old_file3!=""){
                          fs.unlink(dirname+fields.old_field3,function(err){
                            if(err) return console.log(err);
                            console.log('file3 deleted successfully');
                          });
                        }
                        //actualizar BBDD editarPOI
                        actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                      }
                    })
                  }
                  else{
                    console.log("imagen 3 antigua");
                    //actualizar BBDD editarPOI
                    actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                  }
                }
                else if(fields.optradio_element3=='video'){
                  console.log("elemento 3 video");
                  var oldpathvideo3 = files.filetoupload3.path;
                  var videoname3 = randomName + files.filetoupload3.name
                  var newpathvideo3 = dirname + videoname3;
                  if(files.filetoupload3.name!=""){
                    console.log("video3 nuevo");
                    mv(oldpathvideo3, newpathvideo3, function(err) {
                      if (err) {
                        res.status(500);
                        res.redirect('/verPOI?id='+ id +'&nombre='+ nombre);
                        res.end();
                      }else{
                        console.log('video3 moved successfully');
                        poi.elemento3 = 'video'
                        poi.archivo3 = videoname3
                        if(fields.transparent3!='yes'){
                          poi.transparent3=null
                        }else{
                          poi.transparent3=fields.transparent3
                        }
                        if(fields.old_file3!=undefined && fields.old_file3!=""){
                          fs.unlink(dirname+fields.old_field3,function(err){
                            if(err) return console.log(err);
                            console.log('file3 deleted successfully');
                          });
                        }
                        //actualizar BBDD editarPOI
                        actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                      }
                    })
                  }
                  else{
                    console.log("video 3 antiguo");
                    //actualizar BBDD editarPOI
                    actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                  }
                }
                else{
                  console.log("no hay elemento 3");
                  //actualizar BBDD editarPOI
                  poi.elemento3 = null
                  poi.archivo3 = null
                  poi.transparent3 = null
                  poi.tamanio3 = null
                  actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                }
              }
            }
            else if(fields.optradio_element2=='video'){
              console.log("elemento 2 video");
              var oldpathvideo2 = files.filetoupload2.path;
              var videoname2 = randomName + files.filetoupload2.name
              var newpathvideo2 = dirname + videoname2;
              if(files.filetoupload2.name!=""){
                console.log("video2 nuevo");
                mv(oldpathvideo2, newpathvideo2, function(err) {
                  if (err) {
                    res.status(500);
                    res.redirect('/verPOI?id='+ id +'&nombre='+ nombre);
                    res.end();
                  }else{
                    console.log('video2 moved successfully');
                    poi.elemento2 = 'video'
                    poi.archivo2 = videoname2
                    if(fields.transparent2!='yes'){
                      poi.transparent2=null
                    }else{
                      poi.transparent2=fields.transparent2
                    }
                    if(fields.old_file2!=undefined && fields.old_file2!=""){
                      fs.unlink(dirname+fields.old_field2,function(err){
                        if(err) return console.log(err);
                        console.log('file2 deleted successfully');
                      });
                    }
                    console.log("comprobamos elemento3");
                    if(fields.optradio_element3=='imagen'){
                      console.log("elemento3 imagen");
                      var oldpathimage3 = files.filetoupload3.path;
                      var imagename3 = randomName + files.filetoupload3.name
                      var newpathimage3 = dirname + imagename3;
                      if(files.filetoupload3.name!=""){
                        console.log("imagen3 nueva");
                        mv(oldpathimage3, newpathimage3, function(err) {
                          if (err) {
                            res.status(500);
                            res.redirect('/verPOI?id='+ id +'&nombre='+ nombre);
                            res.end();
                          }else{
                            console.log('image3 moved successfully');
                            poi.elemento3 = 'imagen'
                            poi.archivo3 = imagename3
                            poi.transparent3=null
                            if(fields.old_file3!=undefined && fields.old_file3!=""){
                              fs.unlink(dirname+fields.old_field3,function(err){
                                if(err) return console.log(err);
                                console.log('file3 deleted successfully');
                              });
                            }
                            //actualizar BBDD editarPOI
                            actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                          }
                        })
                      }
                      else{
                        console.log("imagen 3 antigua");
                        //actualizar BBDD editarPOI
                        actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                      }
                    }
                    else if(fields.optradio_element3=='video'){
                      console.log("elemento 3 video");
                      var oldpathvideo3 = files.filetoupload3.path;
                      var videoname3 = randomName + files.filetoupload3.name
                      var newpathvideo3 = dirname + videoname3;
                      if(files.filetoupload3.name!=""){
                        console.log("video3 nuevo");
                        mv(oldpathvideo3, newpathvideo3, function(err) {
                          if (err) {
                            res.status(500);
                            res.redirect('/verPOI?id='+ id +'&nombre='+ nombre);
                            res.end();
                          }else{
                            console.log('video3 moved successfully');
                            poi.elemento3 = 'video'
                            poi.archivo3 = videoname3
                            if(fields.transparent3!='yes'){
                              poi.transparent3=null
                            }else{
                              poi.transparent3=fields.transparent3
                            }
                            if(fields.old_file3!=undefined && fields.old_file3!=""){
                              fs.unlink(dirname+fields.old_field3,function(err){
                                if(err) return console.log(err);
                                console.log('file3 deleted successfully');
                              });
                            }
                            //actualizar BBDD editarPOI
                            actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                          }
                        })
                      }
                      else{
                        console.log("video 3 antiguo");
                        //actualizar BBDD editarPOI
                        actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                      }
                    }
                    else{
                      console.log("no hay elemento 3");
                      //actualizar BBDD editarPOI
                      poi.elemento3 = null
                      poi.archivo3 = null
                      poi.transparent3 = null
                      poi.tamanio3 = null
                      actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                    }
                  }
                })
              }
              else{
                console.log("video 2 antiguo");
                console.log("comprobamos elemento3");
                if(fields.optradio_element3=='imagen'){
                  console.log("elemento3 imagen");
                  var oldpathimage3 = files.filetoupload3.path;
                  var imagename3 = randomName + files.filetoupload3.name
                  var newpathimage3 = dirname + imagename3;
                  if(files.filetoupload3.name!=""){
                    console.log("imagen3 nueva");
                    mv(oldpathimage3, newpathimage3, function(err) {
                      if (err) {
                        res.status(500);
                        res.redirect('/verPOI?id='+ id +'&nombre='+ nombre);
                        res.end();
                      }else{
                        console.log('image3 moved successfully');
                        poi.elemento3 = 'imagen'
                        poi.archivo3 = imagename3
                        poi.transparent3=null
                        if(fields.old_file3!=undefined && fields.old_file3!=""){
                          fs.unlink(dirname+fields.old_field3,function(err){
                            if(err) return console.log(err);
                            console.log('file3 deleted successfully');
                          });
                        }
                        //actualizar BBDD editarPOI
                        actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                      }
                    })
                  }
                  else{
                    console.log("imagen 3 antigua");
                    //actualizar BBDD editarPOI
                    actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                  }
                }
                else if(fields.optradio_element3=='video'){
                  console.log("elemento 3 video");
                  var oldpathvideo3 = files.filetoupload3.path;
                  var videoname3 = randomName + files.filetoupload3.name
                  var newpathvideo3 = dirname + videoname3;
                  if(files.filetoupload3.name!=""){
                    console.log("video3 nuevo");
                    mv(oldpathvideo3, newpathvideo3, function(err) {
                      if (err) {
                        res.status(500);
                        res.redirect('/verPOI?id='+ id +'&nombre='+ nombre);
                        res.end();
                      }else{
                        console.log('video3 moved successfully');
                        poi.elemento3 = 'video'
                        poi.archivo3 = videoname3
                        if(fields.transparent3!='yes'){
                          poi.transparent3=null
                        }else{
                          poi.transparent3=fields.transparent3
                        }
                        if(fields.old_file3!=undefined && fields.old_file3!=""){
                          fs.unlink(dirname+fields.old_field3,function(err){
                            if(err) return console.log(err);
                            console.log('file3 deleted successfully');
                          });
                        }
                        //actualizar BBDD editarPOI
                        actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                      }
                    })
                  }
                  else{
                    console.log("video 3 antiguo");
                    //actualizar BBDD editarPOI
                    actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                  }
                }
                else{
                  console.log("no hay elemento 3");
                  //actualizar BBDD editarPOI
                  poi.elemento3 = null
                  poi.archivo3 = null
                  poi.transparent3 = null
                  poi.tamanio3 = null
                  actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                }
              }
            }
            else{
              console.log("no hay elemento 2");
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
        }
        else if(fields.optradio_element1=='video'){
          console.log("elemento1 video");
          var oldpathvideo1 = files.filetoupload1.path;
          var videoname1 = randomName + files.filetoupload1.name
          var newpathvideo1 = dirname + videoname1;
          if(files.filetoupload1.name!=""){
            console.log("video1 nuevo");
            mv(oldpathvideo1, newpathvideo1, function(err) {
              if (err) {
                res.status(500);
                res.redirect('/verPOI?id='+ id +'&nombre='+ nombre);
                res.end();
              }else{
                console.log('video1 moved successfully');
                poi.elemento1 = 'video'
                poi.archivo1 = videoname1
                if(fields.transparent1!='yes'){
                  poi.transparent1=null
                }else{
                  poi.transparent1=fields.transparent1
                }
                if(fields.old_file1!=undefined && fields.old_file1!=""){
                  fs.unlink(dirname+fields.old_field1,function(err){
                    if(err) return console.log(err);
                    console.log('file1 deleted successfully');
                  });
                }
                console.log("comprobamos elemento2");
                if(fields.optradio_element2=='imagen'){
                  console.log("elemento 2 imagen");
                  var oldpathimage2 = files.filetoupload2.path;
                  var imagename2 = randomName + files.filetoupload2.name
                  var newpathimage2 = dirname + imagename2;
                  if(files.filetoupload2.name!=""){
                    console.log("imagen2 nueva");
                    mv(oldpathimage2, newpathimage2, function(err) {
                      if (err) {
                        res.status(500);
                        res.redirect('/verPOI?id='+ id +'&nombre='+ nombre);
                        res.end();
                      }else{
                        console.log('image2 moved successfully');
                        poi.elemento2 = 'imagen'
                        poi.archivo2 = imagename2
                        poi.transparent2=null
                        if(fields.old_file2!=undefined && fields.old_file2!=""){
                          fs.unlink(dirname+fields.old_field2,function(err){
                            if(err) return console.log(err);
                            console.log('file2 deleted successfully');
                          });
                        }
                        console.log("comprobamos elemento3");
                        if(fields.optradio_element3=='imagen'){
                          console.log("elemento 3 imagen");
                          var oldpathimage3 = files.filetoupload3.path;
                          var imagename3 = randomName + files.filetoupload3.name
                          var newpathimage3 = dirname + imagename3;
                          if(files.filetoupload3.name!=""){
                            console.log("imagen3 nueva");
                            mv(oldpathimage3, newpathimage3, function(err) {
                              if (err) {
                                res.status(500);
                                res.redirect('/verPOI?id='+ id +'&nombre='+ nombre);
                                res.end();
                              }else{
                                console.log('image3 moved successfully');
                                poi.elemento3 = 'imagen'
                                poi.archivo3 = imagename3
                                poi.transparent3=null
                                if(fields.old_file3!=undefined && fields.old_file3!=""){
                                  fs.unlink(dirname+fields.old_field3,function(err){
                                    if(err) return console.log(err);
                                    console.log('file3 deleted successfully');
                                  });
                                }
                                //actualizar BBDD editarPOI
                                actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                              }
                            })
                          }
                          else{
                            console.log("imagen 3 antigua");
                            //actualizar BBDD editarPOI
                            actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                          }
                        }
                        else if(fields.optradio_element3=='video'){
                          console.log("elemento 3 video");
                          var oldpathvideo3 = files.filetoupload3.path;
                          var videoname3 = randomName + files.filetoupload3.name
                          var newpathvideo3 = dirname + videoname3;
                          if(files.filetoupload3.name!=""){
                            console.log("video3 nuevo");
                            mv(oldpathvideo3, newpathvideo3, function(err) {
                              if (err) {
                                res.status(500);
                                res.redirect('/verPOI?id='+ id +'&nombre='+ nombre);
                                res.end();
                              }else{
                                console.log('video3 moved successfully');
                                poi.elemento3 = 'video'
                                poi.archivo3 = videoname3
                                if(fields.transparent3!='yes'){
                                  poi.transparent3=null
                                }else{
                                  poi.transparent3=fields.transparent3
                                }
                                if(fields.old_file3!=undefined && fields.old_file3!=""){
                                  fs.unlink(dirname+fields.old_field3,function(err){
                                    if(err) return console.log(err);
                                    console.log('file3 deleted successfully');
                                  });
                                }
                                //actualizar BBDD editarPOI
                                actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                              }
                            })
                          }
                          else{
                            console.log("video3 antiguo");
                            //actualizar BBDD editarPOI
                            actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                          }
                        }
                        else{
                          console.log("no hay elemento 3");
                          //actualizar BBDD editarPOI
                          poi.elemento3 = null
                          poi.archivo3 = null
                          poi.transparent3 = null
                          poi.tamanio3 = null
                          actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                        }
                      }
                    })
                  }
                  else{
                    console.log("imagen 2 antigua");
                    console.log("comprobamos elemento3");
                    if(fields.optradio_element3=='imagen'){
                      console.log("elemento 3 imagen");
                      var oldpathimage3 = files.filetoupload3.path;
                      var imagename3 = randomName + files.filetoupload3.name
                      var newpathimage3 = dirname + imagename3;
                      if(files.filetoupload3.name!=""){
                        console.log("imagen3 nueva");
                        mv(oldpathimage3, newpathimage3, function(err) {
                          if (err) {
                            res.status(500);
                            res.redirect('/verPOI?id='+ id +'&nombre='+ nombre);
                            res.end();
                          }else{
                            console.log('image3 moved successfully');
                            poi.elemento3 = 'imagen'
                            poi.archivo3 = imagename3
                            poi.transparent3=null
                            if(fields.old_file3!=undefined && fields.old_file3!=""){
                              fs.unlink(dirname+fields.old_field3,function(err){
                                if(err) return console.log(err);
                                console.log('file3 deleted successfully');
                              });
                            }
                            //actualizar BBDD editarPOI
                            actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                          }
                        })
                      }
                      else{
                        console.log("imagen 3 antigua");
                        //actualizar BBDD editarPOI
                        actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                      }
                    }
                    else if(fields.optradio_element3=='video'){
                      console.log("elemento 3 video");
                      var oldpathvideo3 = files.filetoupload3.path;
                      var videoname3 = randomName + files.filetoupload3.name
                      var newpathvideo3 = dirname + videoname3;
                      if(files.filetoupload3.name!=""){
                        console.log("video3 nuevo");
                        mv(oldpathvideo3, newpathvideo3, function(err) {
                          if (err) {
                            res.status(500);
                            res.redirect('/verPOI?id='+ id +'&nombre='+ nombre);
                            res.end();
                          }else{
                            console.log('video3 moved successfully');
                            poi.elemento3 = 'video'
                            poi.archivo3 = videoname3
                            if(fields.transparent3!='yes'){
                              poi.transparent3=null
                            }else{
                              poi.transparent3=fields.transparent3
                            }
                            if(fields.old_file3!=undefined && fields.old_file3!=""){
                              fs.unlink(dirname+fields.old_field3,function(err){
                                if(err) return console.log(err);
                                console.log('file3 deleted successfully');
                              });
                            }
                            //actualizar BBDD editarPOI
                            actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                          }
                        })
                      }
                      else{
                        console.log("video 3 antiguo");
                        //actualizar BBDD editarPOI
                        actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                      }
                    }
                    else{
                      console.log("no hay elemento 3");
                      //actualizar BBDD editarPOI
                      poi.elemento3 = null
                      poi.archivo3 = null
                      poi.transparent3 = null
                      poi.tamanio3 = null
                      actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                    }
                  }
                }
                else if(fields.optradio_element2=='video'){
                  console.log("elemento 2 video");
                  var oldpathvideo2 = files.filetoupload2.path;
                  var videoname2 = randomName + files.filetoupload2.name
                  var newpathvideo2 = dirname + videoname2;
                  if(files.filetoupload2.name!=""){
                    console.log("video2 nuevo");
                    mv(oldpathvideo2, newpathvideo2, function(err) {
                      if (err) {
                        res.status(500);
                        res.redirect('/verPOI?id='+ id +'&nombre='+ nombre);
                        res.end();
                      }else{
                        console.log('video2 moved successfully');
                        poi.elemento2 = 'video'
                        poi.archivo2 = videoname2
                        if(fields.transparent2!='yes'){
                          poi.transparent2=null
                        }else{
                          poi.transparent2=fields.transparent2
                        }
                        if(fields.old_file2!=undefined && fields.old_file2!=""){
                          fs.unlink(dirname+fields.old_field2,function(err){
                            if(err) return console.log(err);
                            console.log('file2 deleted successfully');
                          });
                        }
                        console.log("comprobamos elemento3");
                        if(fields.optradio_element3=='imagen'){
                          console.log("elemento 3 imagen");
                          var oldpathimage3 = files.filetoupload3.path;
                          var imagename3 = randomName + files.filetoupload3.name
                          var newpathimage3 = dirname + imagename3;
                          if(files.filetoupload3.name!=""){
                            console.log("imagen3 nueva");
                            mv(oldpathimage3, newpathimage3, function(err) {
                              if (err) {
                                res.status(500);
                                res.redirect('/verPOI?id='+ id +'&nombre='+ nombre);
                                res.end();
                              }else{
                                console.log('image3 moved successfully');
                                poi.elemento3 = 'imagen'
                                poi.archivo3 = imagename3
                                poi.transparent3=null
                                if(fields.old_file3!=undefined && fields.old_file3!=""){
                                  fs.unlink(dirname+fields.old_field3,function(err){
                                    if(err) return console.log(err);
                                    console.log('file3 deleted successfully');
                                  });
                                }
                                //actualizar BBDD editarPOI
                                actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                              }
                            })
                          }
                          else{
                            console.log("imagen 3 antigua");
                            //actualizar BBDD editarPOI
                            actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                          }
                        }
                        else if(fields.optradio_element3=='video'){
                          console.log("elemento3 video");
                          var oldpathvideo3 = files.filetoupload3.path;
                          var videoname3 = randomName + files.filetoupload3.name
                          var newpathvideo3 = dirname + videoname3;
                          if(files.filetoupload3.name!=""){
                            console.log("video3 nuevo");
                            mv(oldpathvideo3, newpathvideo3, function(err) {
                              if (err) {
                                res.status(500);
                                res.redirect('/verPOI?id='+ id +'&nombre='+ nombre);
                                res.end();
                              }else{
                                console.log('video3 moved successfully');
                                poi.elemento3 = 'video'
                                poi.archivo3 = videoname3
                                if(fields.transparent3!='yes'){
                                  poi.transparent3=null
                                }else{
                                  poi.transparent3=fields.transparent3
                                }
                                if(fields.old_file3!=undefined && fields.old_file3!=""){
                                  fs.unlink(dirname+fields.old_field3,function(err){
                                    if(err) return console.log(err);
                                    console.log('file3 deleted successfully');
                                  });
                                }
                                //actualizar BBDD editarPOI
                                actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                              }
                            })
                          }
                          else{
                            console.log("video 3 antiguo");
                            //actualizar BBDD editarPOI
                            actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                          }
                        }
                        else{
                          console.log("no hay elemento 3");
                          //actualizar BBDD editarPOI
                          poi.elemento3 = null
                          poi.archivo3 = null
                          poi.transparent3 = null
                          poi.tamanio3 = null
                          actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                        }
                      }
                    })
                  }
                  else{
                    console.log("video2 antiguo");
                    console.log("comprobamos elemento3");
                    if(fields.optradio_element3=='imagen'){
                      console.log("elemento3 imagen");
                      var oldpathimage3 = files.filetoupload3.path;
                      var imagename3 = randomName + files.filetoupload3.name
                      var newpathimage3 = dirname + imagename3;
                      if(files.filetoupload3.name!=""){
                        console.log("imagen3 nueva");
                        mv(oldpathimage3, newpathimage3, function(err) {
                          if (err) {
                            res.status(500);
                            res.redirect('/verPOI?id='+ id +'&nombre='+ nombre);
                            res.end();
                          }else{
                            console.log('image3 moved successfully');
                            poi.elemento3 = 'imagen'
                            poi.archivo3 = imagename3
                            poi.transparent3=null
                            if(fields.old_file3!=undefined && fields.old_file3!=""){
                              fs.unlink(dirname+fields.old_field3,function(err){
                                if(err) return console.log(err);
                                console.log('file3 deleted successfully');
                              });
                            }
                            //actualizar BBDD editarPOI
                            actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                          }
                        })
                      }
                      else{
                        console.log("imagen 3 antigua");
                        //actualizar BBDD editarPOI
                        actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                      }
                    }
                    else if(fields.optradio_element3=='video'){
                      console.log("elemento 3 video");
                      var oldpathvideo3 = files.filetoupload3.path;
                      var videoname3 = randomName + files.filetoupload3.name
                      var newpathvideo3 = dirname + videoname3;
                      if(files.filetoupload3.name!=""){
                        console.log("video3 nuevo");
                        mv(oldpathvideo3, newpathvideo3, function(err) {
                          if (err) {
                            res.status(500);
                            res.redirect('/verPOI?id='+ id +'&nombre='+ nombre);
                            res.end();
                          }else{
                            console.log('video3 moved successfully');
                            poi.elemento3 = 'video'
                            poi.archivo3 = videoname3
                            if(fields.transparent3!='yes'){
                              poi.transparent3=null
                            }else{
                              poi.transparent3=fields.transparent3
                            }
                            if(fields.old_file3!=undefined && fields.old_file3!=""){
                              fs.unlink(dirname+fields.old_field3,function(err){
                                if(err) return console.log(err);
                                console.log('file3 deleted successfully');
                              });
                            }
                            //actualizar BBDD editarPOI
                            actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                          }
                        })
                      }
                      else{
                        console.log("video3 antiguo");
                        console.log(poi);
                        //actualizar BBDD editarPOI
                        actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                      }
                    }
                    else{
                      console.log("no hay elemento 3");
                      //actualizar BBDD editarPOI
                      poi.elemento3 = null
                      poi.archivo3 = null
                      poi.transparent3 = null
                      poi.tamanio3 = null
                      actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                    }
                  }
                }
                else{
                  console.log("no hay elemento 2");
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
            })
          }
          else{
            console.log("video 1 antiguo");
            console.log("comprobamos elemento2");
            if(fields.optradio_element2=='imagen'){
              console.log("elemento 2 imagen");
              var oldpathimage2 = files.filetoupload2.path;
              var imagename2 = randomName + files.filetoupload2.name
              var newpathimage2 = dirname + imagename2;
              if(files.filetoupload2.name!=""){
                console.log("imagen2 nueva");
                mv(oldpathimage2, newpathimage2, function(err) {
                  if (err) {
                    res.status(500);
                    res.redirect('/verPOI?id='+ id +'&nombre='+ nombre);
                    res.end();
                  }else{
                    console.log('image2 moved successfully');
                    poi.elemento2 = 'imagen'
                    poi.archivo2 = imagename2
                    poi.transparent2=null
                    if(fields.old_file2!=undefined && fields.old_file2!=""){
                      fs.unlink(dirname+fields.old_field2,function(err){
                        if(err) return console.log(err);
                        console.log('file2 deleted successfully');
                      });
                    }
                    console.log("comprobamos elemento3");
                    if(fields.optradio_element3=='imagen'){
                      console.log("elemento 3 imagen");
                      var oldpathimage3 = files.filetoupload3.path;
                      var imagename3 = randomName + files.filetoupload3.name
                      var newpathimage3 = dirname + imagename3;
                      if(files.filetoupload3.name!=""){
                        console.log("imagen3 nueva");
                        mv(oldpathimage3, newpathimage3, function(err) {
                          if (err) {
                            res.status(500);
                            res.redirect('/verPOI?id='+ id +'&nombre='+ nombre);
                            res.end();
                          }else{
                            console.log('image3 moved successfully');
                            poi.elemento3 = 'imagen'
                            poi.archivo3 = imagename3
                            poi.transparent3=null
                            if(fields.old_file3!=undefined && fields.old_file3!=""){
                              fs.unlink(dirname+fields.old_field3,function(err){
                                if(err) return console.log(err);
                                console.log('file3 deleted successfully');
                              });
                            }
                            //actualizar BBDD editarPOI
                            actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                          }
                        })
                      }
                      else{
                        console.log("imagen 3 antigua");
                        //actualizar BBDD editarPOI
                        actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                      }
                    }
                    else if(fields.optradio_element3=='video'){
                      console.log("elemento 3 video");
                      var oldpathvideo3 = files.filetoupload3.path;
                      var videoname3 = randomName + files.filetoupload3.name
                      var newpathvideo3 = dirname + videoname3;
                      if(files.filetoupload3.name!=""){
                        console.log("video3 nuevo");
                        mv(oldpathvideo3, newpathvideo3, function(err) {
                          if (err) {
                            res.status(500);
                            res.redirect('/verPOI?id='+ id +'&nombre='+ nombre);
                            res.end();
                          }else{
                            console.log('video3 moved successfully');
                            poi.elemento3 = 'video'
                            poi.archivo3 = videoname3
                            if(fields.transparent3!='yes'){
                              poi.transparent3=null
                            }else{
                              poi.transparent3=fields.transparent3
                            }
                            if(fields.old_file3!=undefined && fields.old_file3!=""){
                              fs.unlink(dirname+fields.old_field3,function(err){
                                if(err) return console.log(err);
                                console.log('file3 deleted successfully');
                              });
                            }
                            //actualizar BBDD editarPOI
                            actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                          }
                        })
                      }
                      else{
                        console.log("video3 antiguo");
                        //actualizar BBDD editarPOI
                        actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                      }
                    }
                    else{
                      console.log("no hay elemento 3");
                      //actualizar BBDD editarPOI
                      poi.elemento3 = null
                      poi.archivo3 = null
                      poi.transparent3 = null
                      poi.tamanio3 = null
                      actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                    }
                  }
                })
              }
              else{
                console.log("imagen 2 antigua");
                console.log("comprobamos elemento3");
                if(fields.optradio_element3=='imagen'){
                  console.log("elemento 3 imagen");
                  var oldpathimage3 = files.filetoupload3.path;
                  var imagename3 = randomName + files.filetoupload3.name
                  var newpathimage3 = dirname + imagename3;
                  if(files.filetoupload3.name!=""){
                    console.log("imagen3 nueva");
                    mv(oldpathimage3, newpathimage3, function(err) {
                      if (err) {
                        res.status(500);
                        res.redirect('/verPOI?id='+ id +'&nombre='+ nombre);
                        res.end();
                      }else{
                        console.log('image3 moved successfully');
                        poi.elemento3 = 'imagen'
                        poi.archivo3 = imagename3
                        poi.transparent3=null
                        if(fields.old_file3!=undefined && fields.old_file3!=""){
                          fs.unlink(dirname+fields.old_field3,function(err){
                            if(err) return console.log(err);
                            console.log('file3 deleted successfully');
                          });
                        }
                        //actualizar BBDD editarPOI
                        actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                      }
                    })
                  }
                  else{
                    console.log("imagen 3 antigua");
                    //actualizar BBDD editarPOI
                    actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                  }
                }
                else if(fields.optradio_element3=='video'){
                  console.log("elemento 3 video");
                  var oldpathvideo3 = files.filetoupload3.path;
                  var videoname3 = randomName + files.filetoupload3.name
                  var newpathvideo3 = dirname + videoname3;
                  if(files.filetoupload3.name!=""){
                    console.log("video3 nuevo");
                    mv(oldpathvideo3, newpathvideo3, function(err) {
                      if (err) {
                        res.status(500);
                        res.redirect('/verPOI?id='+ id +'&nombre='+ nombre);
                        res.end();
                      }else{
                        console.log('video3 moved successfully');
                        poi.elemento3 = 'video'
                        poi.archivo3 = videoname3
                        if(fields.transparent3!='yes'){
                          poi.transparent3=null
                        }else{
                          poi.transparent3=fields.transparent3
                        }
                        if(fields.old_file3!=undefined && fields.old_file3!=""){
                          fs.unlink(dirname+fields.old_field3,function(err){
                            if(err) return console.log(err);
                            console.log('file3 deleted successfully');
                          });
                        }
                        //actualizar BBDD editarPOI
                        actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                      }
                    })
                  }
                  else{
                    console.log("video 3 antiguo");
                    //actualizar BBDD editarPOI
                    actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                  }
                }
                else{
                  console.log("no hay elemento 3");
                  //actualizar BBDD editarPOI
                  poi.elemento3 = null
                  poi.archivo3 = null
                  poi.transparent3 = null
                  poi.tamanio3 = null
                  actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                }
              }
            }
            else if(fields.optradio_element2=='video'){
              console.log("elemento 2 video");
              var oldpathvideo2 = files.filetoupload2.path;
              var videoname2 = randomName + files.filetoupload2.name
              var newpathvideo2 = dirname + videoname2;
              if(files.filetoupload2.name!=""){
                console.log("video2 nuevo");
                mv(oldpathvideo2, newpathvideo2, function(err) {
                  if (err) {
                    res.status(500);
                    res.redirect('/verPOI?id='+ id +'&nombre='+ nombre);
                    res.end();
                  }else{
                    console.log('video2 moved successfully');
                    poi.elemento2 = 'video'
                    poi.archivo2 = videoname2
                    if(fields.transparent2!='yes'){
                      poi.transparent2=null
                    }else{
                      poi.transparent2=fields.transparent2
                    }
                    if(fields.old_file2!=undefined && fields.old_file2!=""){
                      fs.unlink(dirname+fields.old_field2,function(err){
                        if(err) return console.log(err);
                        console.log('file2 deleted successfully');
                      });
                    }
                    console.log("comprobamos elemento3");
                    if(fields.optradio_element3=='imagen'){
                      console.log("elemento 3 imagen");
                      var oldpathimage3 = files.filetoupload3.path;
                      var imagename3 = randomName + files.filetoupload3.name
                      var newpathimage3 = dirname + imagename3;
                      if(files.filetoupload3.name!=""){
                        console.log("imagen3 nueva");
                        mv(oldpathimage3, newpathimage3, function(err) {
                          if (err) {
                            res.status(500);
                            res.redirect('/verPOI?id='+ id +'&nombre='+ nombre);
                            res.end();
                          }else{
                            console.log('image3 moved successfully');
                            poi.elemento3 = 'imagen'
                            poi.archivo3 = imagename3
                            poi.transparent3=null
                            if(fields.old_file3!=undefined && fields.old_file3!=""){
                              fs.unlink(dirname+fields.old_field3,function(err){
                                if(err) return console.log(err);
                                console.log('file3 deleted successfully');
                              });
                            }
                            //actualizar BBDD editarPOI
                            actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                          }
                        })
                      }
                      else{
                        console.log("imagen 3 antigua");
                        //actualizar BBDD editarPOI
                        actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                      }
                    }
                    else if(fields.optradio_element3=='video'){
                      console.log("elemento3 video");
                      var oldpathvideo3 = files.filetoupload3.path;
                      var videoname3 = randomName + files.filetoupload3.name
                      var newpathvideo3 = dirname + videoname3;
                      if(files.filetoupload3.name!=""){
                        console.log("video3 nuevo");
                        mv(oldpathvideo3, newpathvideo3, function(err) {
                          if (err) {
                            res.status(500);
                            res.redirect('/verPOI?id='+ id +'&nombre='+ nombre);
                            res.end();
                          }else{
                            console.log('video3 moved successfully');
                            poi.elemento3 = 'video'
                            poi.archivo3 = videoname3
                            if(fields.transparent3!='yes'){
                              poi.transparent3=null
                            }else{
                              poi.transparent3=fields.transparent3
                            }
                            if(fields.old_file3!=undefined && fields.old_file3!=""){
                              fs.unlink(dirname+fields.old_field3,function(err){
                                if(err) return console.log(err);
                                console.log('file3 deleted successfully');
                              });
                            }
                            //actualizar BBDD editarPOI
                            actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                          }
                        })
                      }
                      else{
                        console.log("video 3 antiguo");
                        //actualizar BBDD editarPOI
                        actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                      }
                    }
                    else{
                      console.log("no hay elemento 3");
                      //actualizar BBDD editarPOI
                      poi.elemento3 = null
                      poi.archivo3 = null
                      poi.transparent3 = null
                      poi.tamanio3 = null
                      actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                    }
                  }
                })
              }
              else{
                console.log("video2 antiguo");
                console.log("comprobamos elemento3");
                if(fields.optradio_element3=='imagen'){
                  console.log("elemento3 imagen");
                  var oldpathimage3 = files.filetoupload3.path;
                  var imagename3 = randomName + files.filetoupload3.name
                  var newpathimage3 = dirname + imagename3;
                  if(files.filetoupload3.name!=""){
                    console.log("imagen3 nueva");
                    mv(oldpathimage3, newpathimage3, function(err) {
                      if (err) {
                        res.status(500);
                        res.redirect('/verPOI?id='+ id +'&nombre='+ nombre);
                        res.end();
                      }else{
                        console.log('image3 moved successfully');
                        poi.elemento3 = 'imagen'
                        poi.archivo3 = imagename3
                        poi.transparent3=null
                        if(fields.old_file3!=undefined && fields.old_file3!=""){
                          fs.unlink(dirname+fields.old_field3,function(err){
                            if(err) return console.log(err);
                            console.log('file3 deleted successfully');
                          });
                        }
                        //actualizar BBDD editarPOI
                        actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                      }
                    })
                  }
                  else{
                    console.log("imagen 3 antigua");
                    //actualizar BBDD editarPOI
                    actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                  }
                }
                else if(fields.optradio_element3=='video'){
                  console.log("elemento 3 video");
                  var oldpathvideo3 = files.filetoupload3.path;
                  var videoname3 = randomName + files.filetoupload3.name
                  var newpathvideo3 = dirname + videoname3;
                  if(files.filetoupload3.name!=""){
                    console.log("video3 nuevo");
                    mv(oldpathvideo3, newpathvideo3, function(err) {
                      if (err) {
                        res.status(500);
                        res.redirect('/verPOI?id='+ id +'&nombre='+ nombre);
                        res.end();
                      }else{
                        console.log('video3 moved successfully');
                        poi.elemento3 = 'video'
                        poi.archivo3 = videoname3
                        if(fields.transparent3!='yes'){
                          poi.transparent3=null
                        }else{
                          poi.transparent3=fields.transparent3
                        }
                        if(fields.old_file3!=undefined && fields.old_file3!=""){
                          fs.unlink(dirname+fields.old_field3,function(err){
                            if(err) return console.log(err);
                            console.log('file3 deleted successfully');
                          });
                        }
                        //actualizar BBDD editarPOI
                        actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                      }
                    })
                  }
                  else{
                    console.log("video3 antiguo");
                    console.log(poi);
                    //actualizar BBDD editarPOI
                    actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                  }
                }
                else{
                  console.log("no hay elemento 3");
                  //actualizar BBDD editarPOI
                  poi.elemento3 = null
                  poi.archivo3 = null
                  poi.transparent3 = null
                  poi.tamanio3 = null
                  actualizarPOIBBDD(res, poi, id, nombre, id_poi)
                }
              }
            }
            else{
              console.log("no hay elemento 2");
              poi.elemento2 = null
              poi.archivo2 = null
              poi.transparent2 = null
              poi.tamanio2 = null
              poi.elemento3 = null
              poi.archivo3 = null
              poi.transparent3 = null
              poi.tamanio3 = null
              //actualizar BBDD editarPOI
              actualizarPOIBBDD(res, poi, id, nombre, id_poi)
            }
          }
        }
      }else if(fields.optradio == 'no'){
        if(fields.old_file1!=undefined && fields.old_file1!=""){
          fs.unlink(dirname+fields.old_field1,function(err){
            if(err) return console.log(err);
            console.log('file1 deleted successfully');
          });
        }
        if(fields.old_file2!=undefined && fields.old_file2!=""){
          fs.unlink(dirname+fields.old_field2,function(err){
            if(err) return console.log(err);
            console.log('file2 deleted successfully');
          });
        }
        if(fields.old_file3!=undefined && fields.old_file3!=""){
          fs.unlink(dirname+fields.old_field3,function(err){
            if(err) return console.log(err);
            console.log('file3 deleted successfully');
          });
        }
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
