var mysql=require('mysql');
var path = require('path');
//home controller
module.exports={
	/*funciones del controlador*/
	//funcion index que se encarga de servir la pagina inical
	index : function(req, res, next){
		res.render('index');
	},
	//funcion buscador busca por nombre de mapa en la base de datos
	search : function(req, res, next){
		var config =require('.././database/config');
	  var db=mysql.createConnection(config);
		db.connect();
		var name = req.query.search;
		var mapas = null;
		db.query('SELECT * FROM  mapas where nombre = ?',name, function(err,rows,fields){
				if(err){
					throw err;
				}
				else{
					mapas=rows;
					db.end();
					res.render('maps/mapas',{ListMapas: mapas,nombre_mapa: name});
				}
		});
  },
	download: function(req,res,next){
		var name=req.query.name
		var dirname = path.join(__dirname, '..', 'public/uploads/');
		res.download(dirname+name);
	},
	categoria: function(req,res,next){
		var config =require('.././database/config');
	  var db=mysql.createConnection(config);
		var id = req.query.id_mapa;
		var categorias=null
		db.connect();
		db.query('select categoria from POI where id_mapa=? GROUP BY categoria ORDER BY categoria ASC',id, function(err,rows,fields){
				if(err){
					throw err;
				}
				else{
					categorias = rows
					db.end();
					res.writeHead(200, {"Content-Type": "application/json"});
					var json = JSON.stringify({
						categoria: categorias
					});
					res.end(json);
				}
		});
	},
	poiByCategory: function(req,res,next){
		var config =require('.././database/config');
	  var db=mysql.createConnection(config);
		var id = req.query.id_mapa;
		var categoria = req.query.categoria;
		var poiList = null;
		if(categoria!=null && id!=null){
			db.connect();
			db.query('select * from POI where id_mapa=? AND categoria=?',[id,categoria], function(err,rows,fields){
					if(err){
						throw err;
					}
					else{
						poiList = rows
						db.end();
						res.writeHead(200, {"Content-Type": "application/json"});
						var json = JSON.stringify({
							poiList: poiList
						});
						res.end(json);
					}
			});
		}else{
			res.status(400);
      res.send('parametros no validos');
      res.end();
		}

	}
}
