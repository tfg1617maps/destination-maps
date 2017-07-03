/*Variables globales de validacion*/

var text_expression = /^[\w\s.,;:ñÑÇçáÁéÉíÍóÓúÚ\(\)-]+$/;
var numeric_expresion = /^-?\d+\.?\d*$/;

var map_name_error = "Introduce un nombre adecuado para el mapa";
var map_country_error = "Introduce un pais adecuado para el mapa";
var title_error = "Introduce un titulo valido para el POI";
var latitud_error = "Introduce una Latitud numerica para el POI";
var longitud_error = "Introduce una Longitud numerica para el POI";
var direccion_error = "Introduce una direccion para el POI"
var descripcion_error = "Introduce una descripcion adecuada para el POI";
var ar_error = "selecciona si el POI va a disponer de realidad aumentada o no";
var arvideo_error = "El formato del video debe se mp4 revisa que hayas elegido el archivo correcto"
var arimage_error = "El formato de la imagen debe ser: jpg, jpeg, bmp o png revisa que hayas elegido el archivo correcto"
var armissing_error = "Debes añadir al menos una imagen o un video si quieres que el POI disponga de experiencia aumentada";
var length_error = "El texto introducido es demasiado largo el numero maximo de caracteres es: "
var ardistance_error = "Debes introducir la distancia minima para visualizar la AR"
var tamanio_error= "Debes indicar el tamaño del objeto aumentado"

validate = function(regexp, cadena) {
  var result = regexp.test(cadena);
  return result;
}

showMessage = function(cadena,group,block) {
  $(group).addClass("has-error");
  $('#'+block).css("font-weight","Bold").show();
  document.getElementById(block).innerHTML = cadena;
}
/*validar nombre del mapa*/
//on focus
$('#map-name').focus(function() {
  console.log("focus");
  $('#name-group').removeClass("has-error");
  $('#helpBlockname').hide();
});
//on lose focus
$('#map-name').blur(function() {
  var nombre = document.getElementById("map-name").value;
  if(!validate(text_expression,nombre)){
    showMessage(map_name_error,'#name-group','helpBlockname');
  }
});
/*validar pais del mapa*/
//on focus
$('#map-country').focus(function() {
  console.log("focus");
  $('#country-group').removeClass("has-error");
  $('#helpBlockcountry').hide();
});
//on lose focus
$('#map-country').blur(function() {
  var pais = document.getElementById("map-country").value;
  if(!validate(text_expression,pais)){
    showMessage(map_country_error,'#country-group','helpBlockcountry');
  }
});
/*validar titulo del poi*/
//on focus
$('#titulo').focus(function() {
  $('#titulo-group').removeClass("has-error");
  $('#helpBlockTitulo').hide();
});
//on lose focus
$('#titulo').blur(function() {
  var titulo = document.getElementById("titulo").value;
  if(!validate(text_expression,titulo)){
    showMessage(title_error,'#titulo-group','helpBlockTitulo');
  }
});
/*validar latitud del poi*/
//on focus
$('#latitud').focus(function() {
  $('#latitud-group').removeClass("has-error");
  $('#helpBlockLatitud').hide();
});
//on lose focus
$('#latitud').blur(function() {
  var latitud = document.getElementById("latitud").value;
  if(!validate(numeric_expresion,latitud)){
    showMessage(latitud_error,'#latitud-group','helpBlockLatitud');
  }
});
/*validar longitud del poi*/
$('#longitud').focus(function() {
  $('#longitud-group').removeClass("has-error");
  $('#helpBlockLongitud').hide();
});
//on lose focus
$('#longitud').blur(function() {
  var longitud = document.getElementById("longitud").value;
  if(!validate(numeric_expresion,longitud)){
    showMessage(longitud_error,'#longitud-group','helpBlockLongitud');
  }
});
/*validar direccion del poi*/
//on focus
$('#completeAddress').focus(function() {
  $('#completeAddress-group').removeClass("has-error");
  $('#helpBlockCompleteAddress').hide();
});
//on lose focus
$('#completeAddress').blur(function() {
  var direccion = document.getElementById("latitud").value;
  if(!validate(text_expression,direccion)){
    showMessage(direccion_error,'#completeAddress-group','helpBlockCompleteAddress');
  }
});
/*validar descripcion del poi*/
$('#descripcion').focus(function() {
  console.log("focus");
  $('#descripcion-group').removeClass("has-error");
  $('#helpBlockDescripcion').hide();
});
//on lose focus
$('#descripcion').blur(function() {
  console.log("clear focus descripcion");
  var descripcion = document.getElementById("descripcion").value;
  console.log(descripcion);
  console.log("el tamaño es: " + descripcion.length);
  if(!validate(text_expression,descripcion)){
    showMessage(descripcion_error,'#descripcion-group','helpBlockDescripcion');
  }else if(descripcion.length>=4096){
    var text = length_error + 4096 + " y has inroducido: " + descripcion.length + " caracteres";
    showMessage(text,'#descripcion-group','helpBlockDescripcion');
  }
});
/*validar distancia*/
$('#distancia').focus(function() {
  $('#distancia-group').removeClass("has-error");
  $('#helpBlockDistancia').hide();
});
//on lose focus
$('#distancia').blur(function() {
  var distancia = document.getElementById("distancia").value;
  if(!validate(numeric_expresion,distancia)){
    showMessage(ardistance_error,'#distancia-group','helpBlockDistancia');
  }
});

/*validar tamanio1*/
$('#tamanio1').focus(function() {
  $('#tamanio1-group').removeClass("has-error");
  $('#helpBlockTamanio1').hide();
});
//on lose focus
$('#tamanio1').blur(function() {
  var tamanio = document.getElementById("tamanio1").value;
  if(!validate(numeric_expresion,tamanio)){
    showMessage(tamanio_error,'#tamanio1-group','helpBlockTamanio1');
  }
});

/*validar tamanio1*/
$('#tamanio2').focus(function() {
  $('#tamanio2-group').removeClass("has-error");
  $('#helpBlockTamanio2').hide();
});
//on lose focus
$('#tamanio2').blur(function() {
  var tamanio = document.getElementById("tamanio2").value;
  if(!validate(numeric_expresion,tamanio)){
    showMessage(tamanio_error,'#tamanio2-group','helpBlockTamanio2');
  }
});

/*validar tamanio1*/
$('#tamanio3').focus(function() {
  $('#tamanio3-group').removeClass("has-error");
  $('#helpBlockTamanio3').hide();
});
//on lose focus
$('#tamanio3').blur(function() {
  var tamanio = document.getElementById("tamanio3").value;
  if(!validate(numeric_expresion,tamanio)){
    showMessage(tamanio_error,'#tamanio3-group','helpBlockTamanio3');
  }
});

function validarAR(){
  var tamaño = $("input[name='optradio']:checked").length
  if(tamaño == 0){
    return false
  }else{
    return true
  }
}

$( document ).ready(function() {
  if(validarAR()){
    checkRadioButtonAr();
    if(validarElemento("optradio_element1")){
      checkRadioButtonElement('#arelement1-group','#helpBlockArelement1','optradio_element1','#transparentelement1')
    }
    if(validarElemento("optradio_element2")){
      checkRadioButtonElement('#arelement2-group','#helpBlockArelement2','optradio_element2','#transparentelement2')
    }
    if(validarElemento("optradio_element3")){
      checkRadioButtonElement('#arelement3-group','#helpBlockArelement3','optradio_element3','#transparentelement3')
    }
  }else{
    $('#arexperience').hide()
  }
});

function validarElemento(elemento){
  var tamaño = $("input[name='"+elemento+"']:checked").length
  if(tamaño == 0){
    return false
  }else{
    return true
  }
}

function checkRadioButtonAr(){
  var option = document.querySelector('input[name = "optradio"]:checked').value;
  if(option== 'si'){
    //mostrar bloque imagen
    $('#arexperience').show();
  }else if(option == 'no'){
    //mostrar bloque video
    $('#arexperience').hide()
    $('#transparent').hide();
  }
}

/*comprobar el uso de realidad aumentada*/
$("input[name='optradio']").on('change', function() {
  $('#ar-group').removeClass("has-error");
  $('#helpBlockAr').hide();
  checkRadioButtonAr();
});

function checkRadioButtonElement(clase, bloqueError, elemento, transparente){
  var option = document.querySelector('input[name = "'+ elemento +'"]:checked').value;
  console.log("seleccionado: " + option);
  $(clase).removeClass("has-error");
  $(bloqueError).hide();
  if(option=='video'){
    $(transparente).show();
  }else{
    $(transparente).hide();
  }
}

$("input[name='optradio_element1']").on('change', function() {
  checkRadioButtonElement('#arelement1-group','#helpBlockArelement1','optradio_element1','#transparentelement1')
});
$("input[name='optradio_element2']").on('change', function() {
  checkRadioButtonElement('#arelement2-group','#helpBlockArelement2','optradio_element2','#transparentelement2')
});
$("input[name='optradio_element3']").on('change', function() {
  checkRadioButtonElement('#arelement3-group','#helpBlockArelement3','optradio_element3','#transparentelement3')
});

function validarImagen(file,clase,error){
  if(file==""){
    showMessage(armissing_error,clase,error)
    return false
  }else{
    var ext = getExtension(file);
    if(ext=="jpg"||ext=="jpeg"||ext=="bmp"||ext=="png"){
      $(clase).removeClass("has-error");
      $('#'+error).hide();
      return true;
    }else{
      //error formato no valido
      showMessage(arimage_error,clase,error)
      return false;
    }
  }
}

function validarVideo(file,clase,error){
  if(file==""){
    showMessage(armissing_error,clase,error)
    return false
  }else{
    var ext = getExtension(file);
    if(ext=="mp4"){
      $(clase).removeClass("has-error");
      $('#'+error).hide();
      return true;
    }else{
      //error formato no valido
      showMessage(arvideo_error,clase,error)
      return false;
    }
  }
}

function getExtension(filename){
  var extension = filename.split('.').pop()
  return extension
}

function validarPOI(){
  var titulo = document.getElementById("titulo").value;
  var latitud = document.getElementById("latitud").value;
  var longitud = document.getElementById("longitud").value;
  var direccion = document.getElementById("completeAddress").value;
  var descripcion = document.getElementById("descripcion").value;
  var distancia = document.getElementById("distancia").value;
  var tamanio1 = document.getElementById("tamanio1").value;
  var tamanio2 = document.getElementById("tamanio2").value;
  var tamanio3 = document.getElementById("tamanio3").value;
  var resultTitulo = validate(text_expression,titulo);
  var resultLatitud = validate(numeric_expresion,latitud);
  var resultLongitud= validate(numeric_expresion,longitud);
  var resultDireccion= validate(text_expression,direccion)
  var resultDescripcion = validate(text_expression,descripcion);
  var resultDistancia = validate(numeric_expresion,distancia);
  var resultTamanio1 = validate(numeric_expresion,tamanio1);
  var resultTamanio2 = validate(numeric_expresion,tamanio2);
  var resultTamanio3 = validate(numeric_expresion,tamanio3);
  window.scrollTo(0,0);
  if(resultTitulo){
    if(resultLatitud){
      if(resultLongitud){
        if(resultDireccion){
          if(resultDescripcion){
            if(validarAR()){
              var option = document.querySelector('input[name = "optradio"]:checked').value;
                if(option== 'si'){
                  if(resultDistancia){
                    if(resultTamanio1){
                      if(validarElemento("optradio_element1")){
                        var element1 = document.querySelector('input[name = "optradio_element1"]:checked').value;
                        var file1 = $('#file1').val()
                        if(element1=="imagen"){
                          if(validarImagen(file1,'#filearelement1-group','helpBlockArfile1')){
                            console.log("imagen 1 validada");
                            console.log("comprobamos elemento 2");
                            if(validarElemento("optradio_element2")){
                              if(resultTamanio2){
                                var element2 = document.querySelector('input[name = "optradio_element2"]:checked').value;
                                var file2 = $('#file2').val()
                                if(element2=="imagen"){
                                  if(validarImagen(file2,'#filearelement2-group','helpBlockArfile2')){
                                    console.log("imagen 2 validada");
                                    console.log("comprobamos elemento 3");
                                    if(validarElemento("optradio_element3")){
                                      if(resultTamanio3){
                                        var element3 = document.querySelector('input[name = "optradio_element3"]:checked').value;
                                        var file3 = $('#file3').val()
                                        if(element3=="imagen"){
                                          if(validarImagen(file3,'#filearelement3-group','helpBlockArfile3')){
                                            console.log("imagen 3 validada");
                                            return true;
                                          }else{
                                            return false
                                          }
                                        }else if(element3=="video"){
                                          if(validarVideo(file3,'#filearelement3-group','helpBlockArfile3')){
                                            console.log("video 3 validado");
                                            return true;
                                          }else{
                                            return false;
                                          }
                                        }
                                      }else{
                                        showMessage(tamanio_error,'#tamanio3-group','helpBlockTamanio3')
                                      }
                                    }else{
                                      console.log("no hemos introducido elemento 3");
                                      return true;
                                    }
                                  }else{
                                    return false
                                  }
                                }else if(element2=="video"){
                                  if(validarVideo(file2,'#filearelement2-group','helpBlockArfile2')){
                                    console.log("video 2 validado");
                                    console.log("comprobamos elemento 3");
                                    if(validarElemento("optradio_element3")){
                                      if(resultTamanio3){
                                        var element3 = document.querySelector('input[name = "optradio_element3"]:checked').value;
                                        var file3 = $('#file3').val()
                                        if(element3=="imagen"){
                                          if(validarImagen(file3,'#filearelement3-group','helpBlockArfile3')){
                                            console.log("imagen 3 validada");
                                            return true
                                          }else{
                                            return false
                                          }
                                        }else if(element3=="video"){
                                          if(validarVideo(file3,'#filearelement3-group','helpBlockArfile3')){
                                            console.log("video 3 validado");
                                            return true
                                          }else{
                                            return false;
                                          }
                                        }
                                      }else{
                                        showMessage(tamanio_error,'#tamanio3-group','helpBlockTamanio3')
                                      }
                                    }else{
                                      console.log("no hemos introducido elemento 3");
                                      return true;
                                    }
                                  }else{
                                    return false;
                                  }
                                }
                              }else{
                                showMessage(tamanio_error,'#tamanio2-group','helpBlockTamanio2')
                              }
                            }else{
                              console.log("no hemos introducido elemento 2");
                              return true;
                            }
                          }else{
                            return false
                          }
                        }else if(element1=="video"){
                          if(validarVideo(file1,'#filearelement1-group','helpBlockArfile1')){
                            console.log("video 1 validado");
                            console.log("comprobamos elemento 2");
                            if(validarElemento("optradio_element2")){
                              if(resultTamanio2){
                                var element2 = document.querySelector('input[name = "optradio_element2"]:checked').value;
                                var file2 = $('#file2').val()
                                if(element2=="imagen"){
                                  if(validarImagen(file2,'#filearelement2-group','helpBlockArfile2')){
                                    console.log("imagen 2 validada");
                                    console.log("comprobamos elemento 3");
                                    if(validarElemento("optradio_element3")){
                                      if(resultTamanio3){
                                        var element3 = document.querySelector('input[name = "optradio_element3"]:checked').value;
                                        var file3 = $('#file3').val()
                                        if(element3=="imagen"){
                                          if(validarImagen(file3,'#filearelement3-group','helpBlockArfile3')){
                                            console.log("imagen 3 validada");
                                            return true
                                          }else{
                                            return false
                                          }
                                        }else if(element3=="video"){
                                          if(validarVideo(file3,'#filearelement3-group','helpBlockArfile3')){
                                            console.log("video 3 validado");
                                            return true;
                                          }else{
                                            return false;
                                          }
                                        }
                                      }else{
                                        showMessage(tamanio_error,'#tamanio3-group','helpBlockTamanio3')
                                      }
                                    }else{
                                      console.log("no hemos introducido elemento 3");
                                      return true;
                                    }
                                  }else{
                                    return false
                                  }
                                }else if(element2=="video"){
                                  console.log("pasamos por aqui");
                                  if(validarVideo(file2,'#filearelement2-group','helpBlockArfile2')){
                                    console.log("video 2 validado");
                                    console.log("comprobamos elemento 3");
                                    if(validarElemento("optradio_element3")){
                                      if(resultTamanio3){
                                        var element3 = document.querySelector('input[name = "optradio_element3"]:checked').value;
                                        var file3 = $('#file3').val()
                                        if(element3=="imagen"){
                                          if(validarImagen(file3,'#filearelement3-group','helpBlockArfile3')){
                                            console.log("imagen 3 validada");
                                            return true;
                                          }else{
                                            return false
                                          }
                                        }else if(element3=="video"){
                                          if(validarVideo(file3,'#filearelement3-group','helpBlockArfile3')){
                                            console.log("video 3 validado");
                                            return true;
                                          }else{
                                            return false;
                                          }
                                        }
                                      }else{
                                        showMessage(tamanio_error,'#tamanio3-group','helpBlockTamanio3')
                                      }
                                    }else{
                                      console.log("no hemos introducido elemento 3");
                                      return true;
                                    }
                                  }else{
                                    return false;
                                  }
                                }
                              }else{
                                showMessage(tamanio_error,'#tamanio2-group','helpBlockTamanio2')
                              }
                            }else{
                              console.log("no hemos introducido elemento 2");
                              return true;
                            }
                          }else{
                            return false;
                          }
                        }
                      }else{
                        showMessage(armissing_error,'#arelement1-group','helpBlockArelement1')
                        return false;
                      }
                    }else{
                      showMessage(tamanio_error,'#tamanio1-group','helpBlockTamanio1')
                      return false;
                    }
                  }
                  else{
                    showMessage(ardistance_error,'#distancia-group','helpBlockDistancia')
                    return false;
                  }
                }else if(option == 'no'){
                  return true;
                }
            }else{
              showMessage(ar_error,'#ar-group','helpBlockAr')
              return false;
            }
          }
          else{
            showMessage(descripcion_error,'#descripcion-group','helpBlockDescripcion');
            return false;
          }
        }else{
          showMessage(direccion_error,'#completeAddress-group','helpBlockCompleteAddress');
          return false;
        }
      }else{
        showMessage(longitud_error,'#longitud-group','helpBlockLongitud');
        return false;
      }
    }
    else{
      showMessage(latitud_error,'#latitud-group','helpBlockLatitud');
      return false;
    }
  }else{
    showMessage(title_error,'#titulo-group','helpBlockTitulo');
    return false;
  }
}

function validarModificarImagen(file,oldFile,clase,error){
  if(file==""){
     if(oldFile!=""){
       return true
     }else{
      return false
     }
  }else{
    var ext = getExtension(file);
    if(ext=="jpg"||ext=="jpeg"||ext=="bmp"||ext=="png"){
      $(clase).removeClass("has-error");
      $('#'+error).hide();
      return true;
    }else{
      //error formato no valido
      showMessage(arimage_error, clase, error)
      return false;
    }
  }
}

function validarModificarVideo(file,oldFile,clase,error){
  if(file==""){
    if(oldFile!=""){
      return true
    }else{
     return false
    }
  }else{
    var ext = getExtension(file);
    if(ext=="mp4"){
      $(clase).removeClass("has-error");
      $('#'+error).hide();
      return true;
    }else{
      //error formato no valido
      showMessage(arvideo_error, clase, error)
      return false;
    }
  }
}

function validarModificarPOI(){
  var titulo = document.getElementById("titulo").value;
  var latitud = document.getElementById("latitud").value;
  var longitud = document.getElementById("longitud").value;
  var descripcion = document.getElementById("descripcion").value;
  var resultTitulo = validate(text_expression,titulo);
  var distancia = document.getElementById("distancia").value;
  var tamanio1 = document.getElementById("tamanio1").value;
  var tamanio2 = document.getElementById("tamanio2").value;
  var tamanio3 = document.getElementById("tamanio3").value;
  var resultLatitud = validate(numeric_expresion,latitud);
  var resultLongitud= validate(numeric_expresion,longitud);
  var resultDescripcion = validate(text_expression,descripcion);
  var resultDistancia = validate(numeric_expresion,distancia);
  var resultTamanio1 = validate(numeric_expresion,tamanio1);
  var resultTamanio2 = validate(numeric_expresion,tamanio2);
  var resultTamanio3 = validate(numeric_expresion,tamanio3);
  window.scrollTo(0,0);
  if(resultTitulo){
    if(resultLatitud){
      if(resultLongitud){
        if(resultDescripcion){
          if(validarAR()){
            var option = document.querySelector('input[name = "optradio"]:checked').value;
            if(option=='si'){
              if(resultDistancia){
                if(resultTamanio1){
                  if(validarElemento("optradio_element1")){
                    var element1 = document.querySelector('input[name = "optradio_element1"]:checked').value;
                    var file1 = $('#file1').val()
                    var oldFile1 = $('#old-file1').val();
                    if(element1 =='imagen'){
                      if(validarModificarImagen(file1,oldFile1,'#filearelement1-group','helpBlockArfile1')){
                        console.log("imagen 1 validada");
                        console.log("comprobamos elemento 2");
                        if(validarElemento("optradio_element2")){
                          if(resultTamanio2){
                            var element2 = document.querySelector('input[name = "optradio_element2"]:checked').value;
                            var file2 = $('#file2').val()
                            var oldFile2 = $('#old-file2').val()
                            if(element2 =='imagen'){
                              if(validarModificarImagen(file2,oldFile2,'#filearelement2-group','helpBlockArfile2')){
                                console.log("imagen 2 validada");
                                console.log("comprobamos elemento 3");
                                if(validarElemento("optradio_element3")){
                                  if(resultTamanio3){
                                    var element3 = document.querySelector('input[name = "optradio_element3"]:checked').value;
                                    var file3 = $('#file3').val()
                                    var oldFile3 = $('#old-file3').val()
                                    if(element3 =='imagen'){
                                      if(validarModificarImagen(file3,oldFile3,'#filearelement3-group','helpBlockArfile3')){
                                        console.log("imagen 3 validada");
                                        return true;
                                      }
                                      else{
                                        return false;
                                      }
                                    }
                                    else if(element3 =='video'){
                                      if(validarModificarVideo(file3,oldFile3,'#filearelement3-group','helpBlockArfile3')){
                                        console.log("video 3 validado");
                                        return true
                                      }
                                      else{
                                        return false;
                                      }
                                    }
                                  }
                                  else{
                                    showMessage(tamanio_error,'#tamanio3-group','helpBlockTamanio3')
                                    return false;
                                  }
                                }
                                else{
                                  console.log("no hemos añadido elemento3");
                                  return true;
                                }
                              }
                              else{
                                return false;
                              }
                            }
                            else if(element2 =='video'){
                              if(validarModificarVideo(file2,oldFile2,'#filearelement2-group','helpBlockArfile2')){
                                console.log("video 2 validado");
                                console.log("comprobamos elemento 3");

                                if(validarElemento("optradio_element3")){
                                  if(resultTamanio3){
                                    var element3 = document.querySelector('input[name = "optradio_element3"]:checked').value;
                                    var file3 = $('#file3').val();
                                    var oldFile3 = $('#old-file3').val();
                                    if(element3 =='imagen'){
                                      if(validarModificarImagen(file3,oldFile3,'#filearelement3-group','helpBlockArfile3')){
                                        console.log("imagen 3 validada");
                                        return true;
                                      }
                                      else{
                                        return false;
                                      }
                                    }
                                    else if(element3 =='video'){
                                      if(validarModificarVideo(file3,oldFile3,'#filearelement3-group','helpBlockArfile3')){
                                        console.log("video 3 validado");
                                        return true;
                                      }
                                      else{
                                        return false;
                                      }
                                    }
                                  }
                                  else{
                                    showMessage(tamanio_error,'#tamanio3-group','helpBlockTamanio3')
                                    return false;
                                  }
                                }
                                else{
                                  console.log("no hemos añadido elemento3");
                                  return true;
                                }
                              }
                              else{
                                return false;
                              }
                            }
                          }
                          else{
                            showMessage(tamanio_error,'#tamanio2-group','helpBlockTamanio2')
                            return false;
                          }
                        }
                        else{
                          console.log("no hemos añadido elemento2");
                          return true;
                        }
                      }
                      else{
                        return false;
                      }
                    }
                    else if(element1 =='video'){
                      if(validarModificarVideo(file1,oldFile1,'#filearelement1-group','helpBlockArfile1')){
                        console.log("video 1 validado");
                        console.log("comprobamos elemento 2");
                        if(validarElemento("optradio_element2")){
                          if(resultTamanio2){
                            var element2 = document.querySelector('input[name = "optradio_element2"]:checked').value;
                            var file2 = $('#file2').val();
                            var oldFile2 = $('#old-file2').val();
                            if(element2 =='imagen'){
                              if(validarModificarImagen(file2,oldFile2,'#filearelement2-group','helpBlockArfile2')){
                                console.log("imagen 2 validada");
                                console.log("comprobamos elemento 3");
                                if(validarElemento("optradio_element3")){
                                  if(resultTamanio3){
                                    var element3 = document.querySelector('input[name = "optradio_element3"]:checked').value;
                                    var file3 = $('#file3').val();
                                    var oldFile3 = $('#old-file3').val();
                                    if(element3 =='imagen'){
                                      if(validarModificarImagen(file3,oldFile3,'#filearelement3-group','helpBlockArfile3')){
                                        console.log("imagen 3 validada");
                                        return true;
                                      }
                                      else{
                                        return false;
                                      }
                                    }
                                    else if(element3 =='video'){
                                      if(validarModificarVideo(file3,oldFile3,'#filearelement3-group','helpBlockArfile3')){
                                        console.log("video 3 validado");
                                        return true;
                                      }
                                      else{
                                        return false;
                                      }
                                    }
                                  }
                                  else{
                                    showMessage(tamanio_error,'#tamanio3-group','helpBlockTamanio3')
                                    return false;
                                  }
                                }
                                else{
                                  console.log("no hemos añadido elemento3");
                                  return true;
                                }
                              }
                              else{
                                return false;
                              }
                            }
                            else if(element2 =='video'){
                              if(validarModificarVideo(file2,oldFile2,'#filearelement2-group','helpBlockArfile2')){
                                console.log("video 2 validado");
                                console.log("comprobamos elemento 3");
                                if(validarElemento("optradio_element3")){
                                  if(resultTamanio3){
                                    var element3 = document.querySelector('input[name = "optradio_element3"]:checked').value;
                                    var file3 = $('#file3').val();
                                    var oldFile3 = $('#old-file3').val();
                                    if(element3 =='imagen'){
                                      if(validarModificarImagen(file3,oldFile3,'#filearelement3-group','helpBlockArfile3')){
                                        console.log("imagen 3 validada");
                                        return true;
                                      }
                                      else{
                                        return false;
                                      }
                                    }
                                    else if(element3 =='video'){
                                      if(validarModificarVideo(file3,oldFile3,'#filearelement3-group','helpBlockArfile3')){
                                        console.log("video 3 validado");
                                        return true;
                                      }
                                      else{
                                        return false;
                                      }
                                    }
                                  }
                                  else{
                                    showMessage(tamanio_error,'#tamanio3-group','helpBlockTamanio3')
                                    return false;
                                  }
                                }
                                else{
                                  console.log("no hemos añadido elemento3");
                                  return true;
                                }
                              }
                              else{
                                return false;
                              }
                            }
                          }
                          else{
                            showMessage(tamanio_error,'#tamanio2-group','helpBlockTamanio2')
                            return false;
                          }
                        }
                        else{
                          console.log("no hemos añadido elemento2");
                          return true;
                        }
                      }
                      else{
                        return false;
                      }
                    }
                  }
                  else{
                    showMessage(armissing_error,'#arelement1-group','helpBlockArelement1')
                    return false;
                  }
                }else{
                  showMessage(tamanio_error,'#tamanio1-group','helpBlockTamanio1')
                  return false;
                }
              }else{
                showMessage(ardistance_error,'#distancia-group','helpBlockDistancia')
                return false;
              }
            }else if(option=='no'){
              return true;
            }
          }else{
            showMessage(ar_error,'#ar-group','helpBlockAr')
            return false;
          }
        }
        else{
          showMessage(descripcion_error,'#descripcion-group','helpBlockDescripcion');
          return false;
        }
      }else{
        showMessage(longitud_error,'#longitud-group','helpBlockLongitud');
        return false;
      }
    }
    else{
      showMessage(latitud_error,'#latitud-group','helpBlockLatitud');
      return false;
    }
  }else{
    showMessage(title_error,'#titulo-group','helpBlockTitulo');
    return false;
  }
}
