/*Funciones JQuery y Javascript relacionadas con los mapas*/
/*validar el los campos de crear el mapa antes de enviarlos al servidor*/
$('#btn-crearMapa').click(function(e){
  e.preventDefault();
  var nombre = document.getElementById("map-name").value;
  var pais = document.getElementById("map-country").value;
  var icono = document.getElementById("map-icon").value;
  var result_name = validate(text_expression,nombre);
  var result_country = validate(text_expression,pais);
  if(result_name){
    if(result_country){
      var geocoder = new google.maps.Geocoder();
      var direccion = nombre + ", " + pais;
      console.log(direccion);
      geocoder.geocode({address: direccion}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          var myResult = results[0].geometry.location;
          console.log(myResult.lat() + " " + myResult.lng());
          document.getElementById("latitud").value=myResult.lat()
          document.getElementById("longitud").value=myResult.lng();
          $('#create-map').submit();
        }else {
          console.log("The Geocode was not successful for the following reason: " + status);
        }
      });
    }else{
      showMessage(map_name_error,'#country-group','helpBlockcountry');
    }
  }
  else{
    showMessage(map_name_error,'#name-group','helpBlockname');
  }
});
/*Funcion que se encarga de eliminar el mapa seleccionado previa confirmación
por parte del usuario y en caso de ser el unico mapa de la lista oculta la lista
mostrando un mensaje con la posibilidad de crear un nuevo mapa*/
$('#tbl-mapas #btn-eliminar').click(function(e){
  e.preventDefault();
  var elemento =$(this);
  var id= elemento.parent().parent().find('#id_mapa').text();
  console.log("el id es " + id);
  bootbox.confirm({
    message: "¿Desea Eliminar el mapa seleccionado junto con los POI asociados?",
    buttons: {
      confirm: {
        label: 'Si',
        className: 'btn-success'
      },
      cancel: {
        label: 'No',
        className: 'btn-danger'
      }
    },
    callback: function (result) {

      if(result)
      {
        $.ajax({
          url:'https://tfgmaps-1617.herokuapp.com/eliminarmapa',
          method: 'post',
          data : {id : id},
          success : function(res){
            console.log("el resultado es: " + res.res);
            if(res.res){
              elemento.parent().parent().remove();
              if ($.trim($('#tbl-mapas tbody').text())=="") {
                $('#tbl-mapas').hide();
                $('#message').show();
              }
            }
          },
          error: function(res){
            $('#message-error').show();
          }
        });
      }
    }
  });
});

/*Función que se encarga de gestionar el boton de añadir un POI en el listado de
mapas*/
$('#tbl-mapas #btn-anadirPOI').click(function(e){
  e.preventDefault();
  var elemento =$(this);
  var id= elemento.parent().parent().find('#id_mapa').text();
  var latitud = elemento.parent().parent().find('#latitud').text();
  var longitud = elemento.parent().parent().find('#longitud').text();
  location.href = 'https://tfgmaps-1617.herokuapp.com/anadirPOI?id=' + id +'&latitud=' + latitud + '&longitud=' + longitud;
});

/*Función que se encarga de gestionar el boton de ver los POIs de un mapa en el
listado de mapas*/
$('#tbl-mapas #btn-verPOIs').click(function(e){
  e.preventDefault();
  var elemento =$(this);
  var id= elemento.parent().parent().find('#id_mapa').text();
  var nombre= elemento.parent().parent().find('#nombre_mapa').text();
  var latitud= elemento.parent().parent().find('#latitud').text();
  var longitud= elemento.parent().parent().find('#longitud').text();
  location.href = 'https://tfgmaps-1617.herokuapp.com/verPOI?id=' + id +'&nombre=' + nombre +'&latitud=' + latitud + '&longitud=' + longitud;
});
