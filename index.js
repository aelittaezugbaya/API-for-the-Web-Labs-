let map;
let centerV ;
let zoomV = 8;
function initMap() {
    centerV = new google.maps.LatLng(-34.397,150.644);
    map = new google.maps.Map(document.getElementById('map'), {
        center: centerV ,
        zoom: zoomV
    });
}