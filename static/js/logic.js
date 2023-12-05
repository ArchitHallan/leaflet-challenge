// earthquake data url from USGS
var earthquakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// get request to the query url
d3.json(earthquakeUrl).then(function(data) {
    console.log(data.features);
    // createFeatures function
    createFeatures(data.features);
}
);

// function for determining the color on the basis of earthquake depth

function getColor(depth) {
    if (depth<10) {
        return "#00ff00";
    }
    else if (depth<30) {
        return "#ffff00";
    }
    else if (depth<50) {
        return "#ffbf00";
    }
    else if (depth<70) {
        return "#ff8000";
    }
    else if (depth<90) {
        return "#ff4000";
    }
    else {
        return "#ff0000";
    }
}

// function for marker size on the basis of earthquake magnitude

function markerSize(magnitude) {
    return magnitude * 5;
}

// function to create markers
function createMarkers(feature, latlng) {
    var markerOptions = {
        radius: markerSize(feature.properties.mag),
        fillColor: getColor(feature.geometry.coordinates[2]),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };
    return L.circleMarker(latlng, markerOptions);
}


// function to create features

function createFeatures(earthquakeData) {
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
            "</h3><hr><p>" + new Date(feature.properties.time) +
            "</p><hr><p> Magnitude: " + feature.properties.mag + "</p>");
    }
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: createMarkers
    });
    createMap(earthquakes);
}

// function to create map

function createMap(earthquakes) {
    // base layers
    let streetmaps = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'})

    let myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [streetmaps, earthquakes]
    });
    // base maps
    let baseMaps = {
        "Street Map": streetmaps
    };
    // overlay maps
    let overlayMaps = {
        Earthquakes: earthquakes
    };
    // layer control

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    // legend
    let legend = L.control({position: 'bottomright'});
    legend.onAdd = function(myMap) {
        let div = L.DomUtil.create('div', 'info legend'),
            depth = [-10, 10, 30, 50, 70, 90],
            labels = [];
        for (let i = 0; i < depth.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(depth[i] + 1) + '"></i> ' +
                depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
        }
        return div;
    }
          

    legend.addTo(myMap);

}


