function initializeMap() {
    
    var barHeight = $('#bar').height();
    var windowHeight = $(window).innerHeight();
    
    var mapHeight = (windowHeight-barHeight)-16;
    
    $('#map').height(mapHeight);
    $('#map').css({top:(barHeight+16)+'px'});
    
    var map = L.map('map', {
        center: [40.638908, -73.968429],
        zoom: 13
    });
    
    var CartoDB_Voyager = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',{
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> and <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(map);
    
    var selection = L.control({position: 'topright'});
    
    selection.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'selector');
        div.innerHTML = '<select id="zoom-select"><option>Zoom to...</option></select>';
        return div;
    };
    
    selection.addTo(map);
    
    var getURL = 'https://fisherjohnmark.carto.com/api/v2/sql?format=GeoJSON&q=';
    var sql = 'SELECT the_geom, city, location, time FROM fisherjohnmark.uniwatch&api_key=default_public';
/*
    $.getJSON(getURL+sql, function(data){
        
        var features = data.features;
        
        var allParties = [];
        
        var parties = L.geoJSON(features, {
            pointToLayer: function (feature, latlng) {
                allParties.push(latlng);
                return customPoints(feature,latlng);
            },
            onEachFeature: partyData
        }).addTo(map);
        
        var bounds = L.latLngBounds(allParties);
        
        function flyBounds(){
            map.flyToBounds(bounds);
        };
        
        setTimeout(flyBounds, 2000)

    });
*/
}; // end initializeMap

function customPoints(feature,latlng) {
    
    if (feature.properties.city == "Brooklyn, NY") {
        
        var greenIcon = L.icon({
            iconUrl: 'img/confetti.svg',
            shadowUrl: 'img/confettishadow.svg',
            iconSize: [38, 95],
            shadowSize: [40, 97]
        });
        
        return L.marker(latlng, {icon: greenIcon});
        
    } else {
        
        var partyMarker = {
            radius: 7,
            color: "#156736",
            fillOpacity: 0.75
        };

        return L.circleMarker(latlng,partyMarker);
    };

}; // end customPoints

function partyData(feature,layer){
    
    if (feature.properties.time !== ''){
        
        var popupContent = "CITY: "+feature.properties.city+"<br>LOCATION: "+feature.properties.location+"<br>TIME: "+feature.properties.time;
        
    } else {
        
        var popupContent = "CITY: "+feature.properties.city+"<br>LOCATION: "+feature.properties.location;
        
    };
    
    layer.bindTooltip(popupContent, {
        className: 'popupPlayer'});
    
}; // end of partyData

$(document).ready(initializeMap);