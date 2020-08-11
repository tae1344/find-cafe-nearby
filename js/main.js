'use strict';
const searchCafe = document.querySelector('.find-cafe');
const searchBakery = document.querySelector('.find-bakery');
const listView = document.querySelector('.list-view');
let map;
let service;
let infoWindow;
let markers = [];
//let latitude, longitude;
searchCafe.addEventListener("click", searchCafeBtn); //버튼 이벤트
searchBakery.addEventListener("click", searchBakeryBtn);

// Google Map init
function initMap() {
  infoWindow = new google.maps.InfoWindow();
  map = new google.maps.Map(document.getElementById('map'), { zoom: 15, center: { lat: 35.865492, lng: 128.593394 } });

  // Get Current Location
  if (!navigator.geolocation) {
    handleLocationError(false, infoWindow, map.getCenter());
  } else {
    navigator.geolocation.getCurrentPosition((position) => {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      infoWindow.setPosition(pos);
      infoWindow.setContent('My Location');
      infoWindow.open(map);
      map.setCenter(pos);

    }, () => handleLocationError(true, infoWindow, map.getCenter()));

  }
}


//Find Cafe button
function searchCafeBtn() {
  let request = {
    location: map.center,
    radius: '2000',
    type: ['cafe']
  };

  service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, callback);
}

//Find Bakery button
function searchBakeryBtn() {
  let request = {
    location: map.center,
    radius: '2000',
    type: ['bakery']
  };

  service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, callback);

}

// Handling error
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}

// Create Marker
function createMarker(place) {
  let marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location,

  });
  markers.push(marker);

  google.maps.event.addListener(marker, "click", function () {
    infoWindow.setContent(place.name);
    infoWindow.open(map, this);
  });

}

// Remove markers
function removeMarkers() {

  for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];

}

// nearbySearch Callback Func
function callback(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    if (markers.length != 0) {
      removeMarkers();
    }
    results.forEach((place) => createMarker(place));
    createList(results);
    //console.log(results);
  }
}

// Create Cafe List
function createList(places) {

  let list = document.getElementById('places');
  let output = '';


  places.forEach((data) => {

    output += `
      <li class="list-item">
        <h3>${data.name}</h3>
        <span>${ratingStars(data)} ${data.vicinity}</span>
      </li>
    `;
  });
  list.innerHTML = output;
}

// Create Rating Stars
function ratingStars(value) {
  let ratings = Math.round(value.rating);
  let out = '';

  if (value.rating == null) {
    for (let i = 0; i < 5; i++) {
      out += `<i class="fas fa-star rating" style="color:#eee"></i>`
    }
    return out + `(0)`;
  } else {
    for (let i = 0; i < ratings; i++) {
      out += `<i class="fas fa-star rating" style="color:yellow"></i>`;
    }
    return out + `(${value.rating})`;
  }
}
