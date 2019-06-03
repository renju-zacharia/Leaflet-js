// Create a map object
var light = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
});
  
var dark = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.dark",
  accessToken: API_KEY
});

// Store API query variables
var baseURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

function getColor(mag){

  if (mag >= 5 ){
    return "darkred";
  } else if (mag >= 4 ){
    return "red";
  } else if ( mag >= 3 ){
    return "orange";
  } else if (mag >= 2 ){
    return "lime";
  } else if (mag >= 1 ) {
    return "yellow";
  } else {
    return "lightyellow";
  }

}

function getRadius(mag){

  if (mag > 5 ){
    return (mag  * 60000);
  } else if (mag >= 4 ){
    return (mag  * 50000);
  } else if ( mag >= 3 ){
    return (mag  * 40000);
  } else if (mag >= 2 ){
    return (mag  * 30000);
  } else if (mag >= 1 ) {
    return (mag  * 20000);
  } else {
    return (mag  * 10000);
  }

}

var cityMarkers = [];

// Grab the data with d3
d3.json(baseURL, function(response) {

  // Create a new marker cluster group
  var markers = L.markerClusterGroup();

  // Loop through data
  for (var i = 0; i < response.features.length; i++) {

    var lat = +(response.features[i].geometry.coordinates[1]);
    var lng = +(response.features[i].geometry.coordinates[0]);
    var mag = +(response.features[i].properties.mag);
    var location = [lat, lng];
    
    if ( lat & lng & ( mag >0 | mag < 100 ) ){      

        // Add circles to map
        // cityMarkers.push(
          L.circle( location,{
          fillOpacity: 0.75,
          color: "black",
          weight: ".50",
          fillColor: getColor(mag),
          // Adjust radius
          radius: getRadius(mag)
          }).bindPopup("<h1>" + location + "</h1> <hr> <h3>Magnitide: " + mag + "</h3>").addTo(myMap)
                      // );

    }
 
  }   
  // Set up the legend
  var legend = L.control({ position: "bottomright" });
 
  legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
    grades = [0,1,2,3,4,5];
    labels = ['0-1', '1-2', '2-3', '3-4', '4-5', '>5'];
    var colors = ['lightyellow','yellow', 'lime', 'orange', 'red', 'darkred'];

    // loop through our density intervals and generate a label with a colored square for each interval
    // div.innerHTML = "<h2>Magnitude</h2>"
    
    for (var i = 0; i < grades.length; i++) {        
        div.innerHTML +=
            '<i style="background-color:' + colors[i] + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

  return div;
  };

// Adding legend to the map
legend.addTo(myMap);

});  

var baseMaps = {
  Light: light,
  Dark: dark
};

var cityLayer = L.layerGroup(cityMarkers);

var myMap = L.map("map", {
  center: [15.5994, -28.6731],
  zoom: 3,
  layers: [light]
});  

// Pass our map layers into our layer control
// Add the layer control to the map
L.control.layers(baseMaps).addTo(myMap); 