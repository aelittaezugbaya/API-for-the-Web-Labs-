/* global google */
/* eslint no-unused-vars: "off" */
let map;
let centerV;
const zoomV = 11;
function initMap() {
    centerV = new google.maps.LatLng(-34.397, 150.644);
    map = new google.maps.Map(document.getElementById('map'), {
        center: centerV,
        zoom: zoomV,
    });
}

const form = document.getElementById('form1');
form.addEventListener('submit', (event)=>{
    event.preventDefault();
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': document.getElementById('text').value},
        (results, status)=>{
            if (status=='OK') {
                map.setCenter(results[0].geometry.location);
            } else {
                console.error('some mistake');
            }
        }
    );
});
