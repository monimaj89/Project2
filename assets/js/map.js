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

