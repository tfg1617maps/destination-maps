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
		console.log("el archivo es: " + name);
		res.download(dirname+name);
	}
}
