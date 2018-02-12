/* global google */
/* global $ */
/* eslint no-unused-vars: "off" */
let map;
let centerV;
const zoomV = 14;
let lat = -34.397;
let lng = 150.644;
let markers = [];
const imageContainer = $('#imageContainer');
let globalImage;

function flickr(data) {
    console.log(data);
}

function getLocation(id) {
    let geo;
    return window.fetch(
        `https://api.flickr.com/services/rest/?method=flickr.photos.geo.getLocation&api_key=85f72008301a7415984e2616c379c2af&photo_id=${id}&format=json&nojsoncallback=1`,
        {
            method: 'GET',
            headers: {
                'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            },
        }
    ).then((res) => res.json())
    .then((data) => ({
        lat: Number(data.photo.location.latitude),
        lon: Number(data.photo.location.longitude),
    }));
}

$('#flickr').click(() => {
    console.log('click');
    window.fetch(
        `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=85f72008301a7415984e2616c379c2af&lat=${map.getCenter().lat()}&lon=${map.getCenter().lng()}&format=json&nojsoncallback=1`,
        {
            method: 'GET',
            headers: {
                'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            },
        }
    )
    .then((res) => res.json())
    .then((data) => {
        console.log(data.photos.photo);
        const locations = [];
        data.photos.photo.forEach((photo) => {
            getLocation(photo.id)
            .then((geo) => {
                console.log(geo);
                const marker = new google.maps.Marker({
                    position: {lat: geo.lat, lng: geo.lon},
                    map: map,
                    title: photo.title,
                });

                google.maps.event.addListener(marker, 'click', function() {
                    addImage(`https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`);
                });
            });
        });
    });
});
function addImage(url) {
    const img = $('<img>');
    img.attr('src', url);
    imageContainer.append(img);
    !img.is(':first-child') ? img.hide() : '';
    return img;
}

const img1 = addImage('http://img.avatv.fi/mn_kuvat/mtv3/helmi/minisaitit/kapalakerho/kissat/2012/03/1356549.jpg');
const img2 = addImage('http://img.avatv.fi/mn_kuvat/mtv3/helmi/minisaitit/kapalakerho/kissat/2012/05/1406247.jpg');
const img3 = addImage('https://baconmockup.com/300/200/');
globalImage = imageContainer.children()[0];

function showImage(img) {
    let currentImage = globalImage;
    currentImage = $(currentImage);
    currentImage.hide();
    globalImage = img;
    img.show();
}

function clearImages() {
    imageContainer.empty();
}

$('#prev').click(() => {
    globalImage = $(globalImage);
    globalImage.prev().length == 0 ?
        showImage(imageContainer.children().last()) :
        showImage(globalImage.prev());
});

$('#next').click(() => {
    globalImage = $(globalImage);
    if (globalImage.next().length == 0) {
        showImage(imageContainer.children().first());
    } else {
        showImage(globalImage.next());
    }
});

$('#clear').click(() => {
    clearImages();
});

function initMap() {
    centerV = new google.maps.LatLng(lat, lng);
    map = new google.maps.Map(document.getElementById('map'), {
        center: centerV,
        zoom: zoomV,
    });
}
initMap();
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
