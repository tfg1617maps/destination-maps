/*Funciones JQuery y Javascript relacionadas con los POIs*/

/*Funcion que se encarga de eliminar un POI*/
$('#tbl-pois #btn-borrarPOI').click(function(e){
  e.preventDefault();
  var elemento =$(this);
  var id= elemento.parent().parent().find('#id_poi').text();
  bootbox.confirm({
    message: "¿Desea Eliminar el POI seleccionado?",
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
          url:'/eliminarpoi',
          method: 'post',
          data : {id : id},
          success : function(res){
            if(res.res){
              elemento.parent().parent().remove();
              if ($.trim($('#tbl-pois tbody').text())=="") {
                $('#tbl-pois').hide();
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

/*Funcion que maneja el boton de modificar un POI
de la lista de POIs de un mapa*/
$('#tbl-pois #btn-editarPOI').click(function(e){
  e.preventDefault();
  var elemento =$(this);
  var id= elemento.parent().parent().find('#id_poi').text();
  var nombre=document.getElementById("nombre_mapa").innerHTML;
  console.log('el valor del id es: ' + id);
  location.href = '/modificarpoi?id=' + id +'&nombre='+nombre;
});
/*validar el los campos de crear el poi antes de enviarlos al servidor*/
$('#btn-crearPOI').click(function(e){
  e.preventDefault();
  if(validarPOI()){
    $('#create-poi').submit();
  }
});
/*validar el los campos de modificar el poi antes de enviarlos al servidor*/
$('#btn-modificarPOI').click(function(e){
  e.preventDefault();
  console.log("validamos antes de enviar los datos al servidor");
  if(validarModificarPOI()){
    $('#create-poi').submit();
  }
});
/*Funcion que se encarga de redirigir a crear un nuevo POI de un mapa dado
en caso de no disponer de POIs*/
openPage = function(id, latitud, longitud) {
  location.href = "/anadirPOI?id="+id+"&latitud="+latitud+"&longitud="+longitud;
}
