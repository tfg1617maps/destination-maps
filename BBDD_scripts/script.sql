CREATE DATABASE maps /*!40100 DEFAULT CHARACTER SET latin1 */;
use maps;
CREATE TABLE mapas (
  id_mapa int(11) NOT NULL AUTO_INCREMENT,
  nombre varchar(255) NOT NULL,
  icono varchar(255) NOT NULL,
  fecha_creacion varchar(255) DEFAULT NULL,
  latitud varchar(255) NOT NULL,
  longitud varchar(45) NOT NULL,
  PRIMARY KEY (id_mapa)
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=latin1;

CREATE TABLE POI (
  id_mapa int(11) NOT NULL,
  idPOI int(11) NOT NULL AUTO_INCREMENT,
  titulo varchar(255) NOT NULL,
  latitud varchar(255) NOT NULL,
  longitud varchar(255) NOT NULL,
  direccion varchar(1024) NOT NULL,
  categoria varchar(45) NOT NULL,
  descripcion varchar(4096) DEFAULT NULL,
  enlace varchar(255) DEFAULT NULL,
  contenido varchar(45) NOT NULL,
  distancia varchar(45) DEFAULT NULL,
  elemento1 varchar(45) DEFAULT NULL,
  archivo1 varchar(255) DEFAULT NULL,
  tamanio1 varchar(45) DEFAULT NULL,
  altura1 int(11) DEFAULT NULL,
  transparent1 varchar(45) DEFAULT NULL,
  elemento2 varchar(45) DEFAULT NULL,
  archivo2 varchar(255) DEFAULT NULL,
  tamanio2 varchar(45) DEFAULT NULL,
  posicion2 varchar(45) DEFAULT NULL,
  altura2 int(11) DEFAULT NULL,
  transparent2 varchar(45) DEFAULT NULL,
  elemento3 varchar(45) DEFAULT NULL,
  archivo3 varchar(255) DEFAULT NULL,
  tamanio3 varchar(45) DEFAULT NULL,
  posicion3 varchar(45) DEFAULT NULL,
  altura3 int(11) DEFAULT NULL,
  transparent3 varchar(45) DEFAULT NULL,
  PRIMARY KEY (idPOI),
  KEY id_mapa_idx (id_mapa),
  CONSTRAINT id_mapa FOREIGN KEY (id_mapa) REFERENCES mapas (id_mapa) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=latin1;
