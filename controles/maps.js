var mysql=require('mysql');
var dateFormat = require('dateformat');

/*Controlador relacionados con los MAPAS*/
module.exports={
	/*funciones del controlador*/
	//sirve la pagina para crear un nuevo mapa
	getNuevoMapa : function(req, res, next){
    res.render('maps/crearmapa')
  },
	//almacena el mapa en la base de datos
  postNuevoMapa : function(req, res, next){
		var config =require('.././database/config');
	  var db=mysql.createConnection(config);
		var fechaactual = new Date();
	  var fecha = dateFormat(fechaactual,'dd-mm-yyyy');
		var mapa = {
	   	nombre: req.body.nombre,
	   	icono: req.body.icono,
	   	fecha_creacion: fecha,
			latitud: req.body.latitud,
			longitud: req.body.longitud,
	   }
	  db.connect();
	  db.query('insert into  mapas SET ?' ,mapa, function(err,rows,fields){
			if(err){
				res.status(500);
				res.render('maps/crearmapa',{error: 'Error al almacenar el mapa en el servidor'});
				res.end();
				db.end();

			}
			else{
				res.render('maps/crearmapa',{info: 'El mapa se ha almacenado con exito'});
				db.end();
			}
		});
	},
	//obtiene el listado de mapas
	getMapas : function(req, res, next){
		var config =require('.././database/config');
	  var db=mysql.createConnection(config);
		db.connect();
		db.query('SELECT * FROM  mapas', function(err,rows,fields){
				if(err){
					res.status(500);
					res.render('maps/mapas',{error: "Imposible obtener los mapas del servidor, prueba de nuevo en unos instantes"});
					res.end();
				}
				else{
					mapas=rows;
					db.end();
					if(req.query.app=="true"){
						res.writeHead(200, {"Content-Type": "application/json"});
	  				var json = JSON.stringify({
	    				mapList: mapas
	  				});
	  				res.end(json);
					}else{
						res.render('maps/mapas',{ListMapas: mapas});
					}
				}
		});
	},
	//elimina el mapa dado a traves de la clave primaria de la bbdd
	EliminarMapa : function(req, res, next){
	  var id = req.body.id;
	  var config =require('.././database/config');
	  var db=mysql.createConnection(config);
	  var respuesta={res:false};
	  db.connect();
		db.query('delete from POI where id_mapa = ?',id, function(err,rows,fields){
			if(err){
				respuesta.res=false;
				db.end();
				res.status(500);
				res.json(respuesta);
				res.end();
			}else{
				db.query('delete from mapas where id_mapa = ?',id, function(err,rows,fields){
					if(err){
						respuesta.res=false;
						db.end();
						res.status(500);
						res.json(respuesta);
						res.end();
	 				}
	 				else{
						respuesta.res=true;
						db.end();
						res.json(respuesta);
					}
 				});
			}
		});
	},
}
