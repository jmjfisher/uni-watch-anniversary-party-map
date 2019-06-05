function initializeMap() {
    
    var barHeight = $('#bar').height();
    var windowHeight = $(window).innerHeight();
    
    var mapHeight = (windowHeight-barHeight)-16;
    
    $('#map').height(mapHeight);
    $('#map').css({top:(barHeight+16)+'px'});
    
    var map = L.map('map', {
        center: [40.638908, -73.968429],
        zoom: 5
    });
    
    var CartoDB_Voyager = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',{
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> and <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(map);
    
    var selection = L.control({position: 'topright'});
    
    selection.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'selector');
        div.innerHTML = '<select id="zoom-select"><option value="zoom">Zoom to...</option></select>';
        return div;
    };
    
    selection.addTo(map);
    
    var getURL = 'https://fisherjohnmark.carto.com/api/v2/sql?format=GeoJSON&q=';
    var sql = 'SELECT the_geom, city, location, time FROM fisherjohnmark.uniwatch&api_key=default_public';

    $.getJSON(getURL+sql, function(data){
        
        var features = data.features;
        
        var zoomDict = {};
        var allParties = [];
        
        var parties = L.geoJSON(features, {
            
            pointToLayer: function (feature, latlng) {
                
                allParties.push(latlng);
                zoomDict[feature.properties.city] = latlng;
                return customPoints(feature,latlng);
                
            },
            
            onEachFeature: partyData
            
        }).addTo(map);
        
        var allBounds = L.latLngBounds(allParties);
        
        fillZoomTo(map,zoomDict,allBounds);

    });

}; // end initializeMap

function fillZoomTo(map,zoomDict,allBounds) {
    
    var cities = [];
    
    for (var city in zoomDict) {
        cities.push(city);
    };
    
    cities.sort();
    cities.push("All Parties!");
    
    for (var i=0; i<cities.length; i++) {
        $('#zoom-select').append('<option value="'+cities[i]+'">'+cities[i]+'</option>');
    }
    
    $('#zoom-select').change(function(){
        
        if ($('#zoom-select').val() == "All Parties!") {
            
            map.flyToBounds(allBounds, {
                duration: 1
            });
            $('#zoom-select').val("zoom")
            
        } else {
            
            var key = $('#zoom-select').val()
            coords = zoomDict[key];
            map.setView(coords,12);
            $('#zoom-select').val("zoom")
            
        };
    });
    
}; // end fillZoomTo

function customPoints(feature,latlng) {
    
    if (feature.properties.city == "Brooklyn, NY (HQ)") {
        
        var greenMarker = {
            radius: 7,
            color: "#156736",
            fillOpacity: 0.75
        };
        
        var yelloMarker = {
            radius: 10,
            color: "#fdc526",
            fillOpacity: 0
        };
        
        var redMarker = {
            radius: 13,
            color: "#7a3041",
            fillOpacity: 0
        };
        
        var redCircle = L.circleMarker(latlng,redMarker);
        var yellowCircle = L.circleMarker(latlng,yelloMarker);
        var greenCircle = L.circleMarker(latlng,greenMarker);

        return L.featureGroup([redCircle,yellowCircle,greenCircle]);

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