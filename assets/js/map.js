let map, places;
let markers = [];
let autocomplete;

const MARKER_PATH =
    "https://developers.google.com/maps/documentation/javascript/images/marker_green";

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: {
            lat: 51.509865,
            lng: -0.118092
        },
        zoom: 13,
        mapTypeControl: false,
        panControl: false,
        zoomControl: false,
        streetViewControl: false,
    });

    // Create the autocomplete object and associate it with the UI input control.
    autocomplete = new google.maps.places.Autocomplete(
        document.getElementById("searchBox"), {
            types: ["(cities)"],
        });
    places = new google.maps.places.PlacesService(map);
    autocomplete.addListener("place_changed", onPlaceChanged);
}

function onPlaceChanged() {
    const place = autocomplete.getPlace();

    if (place.geometry && place.geometry.location) {
        map.panTo(place.geometry.location);
        map.setZoom(15);
        search();
    } else {
        document.getElementById("searchBox");
    }
}

// Search for hotels in the selected city, within the viewport of the map.
function search() {
    const search = {
        bounds: map.getBounds(),
        types: ["lodging"],
    };
    places.nearbySearch(search, (results, status, pagination) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            clearResults();
            clearMarkers();

            // Create a marker for each hotel found, and
            // assign a letter of the alphabetic to each marker icon.
            for (let i = 0; i < results.length; i++) {
                const markerLetter = String.fromCharCode("A".charCodeAt(0) + (i % 26));
                const markerIcon = MARKER_PATH + markerLetter + ".png";

                // Use marker animation to drop the icons incrementally on the map.
                markers[i] = new google.maps.Marker({
                    position: results[i].geometry.location,
                    animation: google.maps.Animation.DROP,
                    icon: markerIcon,
                });
                // If the user clicks a hotel marker, show the details of that hotel
                // in an info window.
                // @ts-ignore TODO refactor to avoid storing on marker
                markers[i].placeResult = results[i];
                google.maps.event.addListener(markers[i], "click", showInfoWindow);
                setTimeout(dropMarker(i), i * 100);
                addResult(results[i], i);
            }
        }
    });
}

function dropMarker(i) {
    return function () {
      markers[i].setMap(map);
    };
  }

function showInfoWindow() {
    // @ts-ignore
    const marker = this;
  
    places.getDetails(
      { placeId: marker.placeResult.place_id },
      (place, status) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK) {
          return;
        }
        buildIWContent(place);
      }
    );
  } 

  function addResult(result, i) {
    const results = document.getElementById("results");
    const markerLetter = String.fromCharCode("A".charCodeAt(0) + (i % 26));
    const markerIcon = MARKER_PATH + markerLetter + ".png";
    const tr = document.createElement("tr");
  
    tr.style.backgroundColor = i % 2 === 0 ? "#F0F0F0" : "#FFFFFF";
    tr.onclick = function () {
      google.maps.event.trigger(markers[i], "click");
    };
  
    const iconTd = document.createElement("td");
    const nameTd = document.createElement("td");
    const icon = document.createElement("img");
  
    icon.src = markerIcon;
    icon.setAttribute("class", "placeIcon");
    icon.setAttribute("className", "placeIcon");
  
    const name = document.createTextNode(result.name);
  
    iconTd.appendChild(icon);
    nameTd.appendChild(name);
    tr.appendChild(iconTd);
    tr.appendChild(nameTd);
    results.appendChild(tr);
  }

function clearMarkers() {
    for (let i = 0; i < markers.length; i++) {
      if (markers[i]) {
        markers[i].setMap(null);
      }
    }
  
    markers = [];
  }

  function clearResults() {
    const results = document.getElementById("results");
  
    while (results.childNodes[0]) {
      results.removeChild(results.childNodes[0]);
    }
  }

