var express = require('express');
var router = express.Router();

var controllers =require('.././controles');
/*Rutas para mapas*/
//pagina inicial
router.get('/', controllers.home.index);
//buscador de mapas
router.get('/searhmapas', controllers.home.search);
//categoria
router.get('/categoria', controllers.home.categoria);
router.get('/categoryfilter', controllers.home.poiByCategory);
//descargar contenido aumentado
router.get('/downloads',controllers.home.download);
//pagina crear nuevo mapa
router.get('/nuevomapa', controllers.maps.getNuevoMapa);
//almacenar mapa
router.post('/crearmapa', controllers.maps.postNuevoMapa);
//listado de mapas
router.get('/mapas', controllers.maps.getMapas);
//eliminar un mapa junto con todos sus POI
router.post('/eliminarmapa', controllers.maps.EliminarMapa);
/*Rutas para POI*/
//pagina crear POI a un mapa dado
router.get('/anadirPOI', controllers.poi.getNuevoPoi);
//almacenar el POI en la BBDD
router.post('/crearpoi', controllers.poi.postNuevoPoi);
//listado de POI de un mapa dado
router.get('/verPOI', controllers.poi.getPois);
//eliminar un POI
router.post('/eliminarpoi', controllers.poi.EliminarPoi);
//modificar los datos del POI
router.get('/modificarpoi', controllers.poi.getModificarPoi);
//almacenar la modificacion del POI
router.post('/editar', controllers.poi.postModificarPoi);
//exportar todas las rutas para ser utilizadas
module.exports = router;
