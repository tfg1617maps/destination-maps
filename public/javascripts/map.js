var map;
var marker;

function initialize(lat, long,drawMarker) {
  var latLng = new google.maps.LatLng(lat,long);
  var mapOptions = {
    center: latLng,
    zoom: 13,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
  if(drawMarker){
    createMarker(latLng)
  }

  map.addListener('click', function(event) {
    document.getElementById('latitud').value = event.latLng.lat()
    document.getElementById('longitud').value = event.latLng.lng()
    address(event.latLng)
    createMarker(event.latLng)
  });
}
$( document ).ready(function() {
    var latitud;
    var longitud;
    var drawMarker;
    if(document.getElementById('latitud-mapa')==null){
      latitud = document.getElementById('latitud').value;
      longitud = document.getElementById('longitud').value;
      drawMarker = true;
      google.maps.event.addDomListener(window, "load", initialize(latitud, longitud,drawMarker));
    }else{
      latitud = document.getElementById('latitud-mapa').value;
      longitud = document.getElementById('longitud-mapa').value;
      drawMarker=false;
      google.maps.event.addDomListener(window, "load", initialize(latitud, longitud));
    }

});

function searchAddress() {

  var addressInput = document.getElementById('address').value;

  var geocoder = new google.maps.Geocoder();

  geocoder.geocode({address: addressInput}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      var myResult = results[0].geometry.location;
      document.getElementById('completeAddress').value = results[0].formatted_address
      createMarker(myResult);
      document.getElementById('latitud').value = myResult.lat()
      document.getElementById('longitud').value = myResult.lng()
      map.setCenter(myResult);
      map.setZoom(17);
    }else {
      alert("The Geocode was not successful for the following reason: " + status);
    }
  });
}
function address(latlng){
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({latLng: latlng}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      document.getElementById('completeAddress').value = results[0].formatted_address
    }else {
      alert("The Geocode was not successful for the following reason: " + status);
    }
  });
}

function createMarker(latlng) {
   if(marker != undefined && marker != ''){
    marker.setMap(null);
    marker = '';
  }
   marker = new google.maps.Marker({
      map: map,
      position: latlng
   });

}
