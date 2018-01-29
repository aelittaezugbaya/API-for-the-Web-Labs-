/* global google */
/* global $ */
/* eslint no-unused-vars: "off" */
let map;
let centerV;
const zoomV = 14;
let lat = -34.397;
let lng = 150.644;
let markers = [];
function initMap() {
    centerV = new google.maps.LatLng(lat, lng);
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
                console.log(map.getCenter().lat());
                lat = map.getCenter().lat();
                lng = map.getCenter().lng();
            } else {
                console.error('some mistake');
            }
        }
    );
});

const wiki = document.getElementById('wikipedia');
wiki.addEventListener('click', () => {
    markers.forEach((marker) => {
        marker.setMap(null);
    });
    markers.length = 0;
    $.ajax({
        url: 'http://api.geonames.org/findNearbyWikipediaJSON',
        dataType: 'json',
        data: {
            lat: lat,
            lng: lng,
            username: 'aelittae',
        },
      }).done(function(data) {
        console.log(data);
        data.geonames.forEach((place) => {
            const marker = new google.maps.Marker({
                    position: {lat: place.lat, lng: place.lng},
                    map: map,
                    title: place.summary,
                  });
            const infowindow = new google.maps.InfoWindow({
                content: '<h3>' + place.title + '</h3>' +
                        '<p>' + place.summary + '</p>' +
                        '<a href="http://' + place.wikipediaUrl + '" target="_blank">Wikipedia</a>',
              });
            marker.addListener('click', () => {
                infowindow.open(map, marker);
            });
            markers.push(marker);
        });
      });
});
