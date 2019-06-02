function initializeMap() {
    
    var map = L.map('map');
    
    var barHeight = $('#bar').height();
    var windowHeight = $(window).innerHeight();
    
    var mapHeight = (windowHeight-barHeight)-16;
    
    $('#map').height(mapHeight);
    
    var CartoDB_Voyager = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',{
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> and <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(map);
    
    var getURL = 'https://fisherjohnmark.carto.com/api/v2/sql?format=GeoJSON&q=';
    var sql = 'SELECT the_geom, city, location, time FROM fisherjohnmark.uniwatch&api_key=default_public';
    
    var partyMarker = {
        radius: 7,
        color: "#156736",
        fillOpacity: 0.75
    };

    $.getJSON(getURL+sql, function(data){
        
        var features = data.features;
        console.log(features)
        
        var allParties = [];
        
        var parties = L.geoJSON(features, {
            pointToLayer: function (feature, latlng) {
                allParties.push(latlng);
                return L.circleMarker(latlng,partyMarker);
            },
            onEachFeature: playerData
        }).addTo(map);
        
        var bounds = L.latLngBounds(allParties);
        
        map.fitBounds(bounds);

    });

}; // end initializeMap

function playerData(feature,layer){
    
    var popupContent = "CITY: "+feature.properties.city+"<br>LOCATION: "+feature.properties.location+"<br>TIME: "+feature.properties.time;
    
    layer.bindTooltip(popupContent, {
        offset: [0,-7],
        direction: 'top',
        className: 'popupPlayer'});
    
    $('#zoom-select').append($('<option></option>').attr('value', feature.properties.city).text(feature.properties.city));
    
}; // end of playerData

$(document).ready(initializeMap);