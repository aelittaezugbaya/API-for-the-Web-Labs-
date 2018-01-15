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

var form = document.getElementById('form1');
form.addEventListener('submit',function(event){
    event.preventDefault();
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': document.getElementById('text').value}, function(results,status){
        if(status=='OK'){
            map.setCenter(results[0].geometry.location);
        }else{
            console.error('some mistake')
        }
    })
})