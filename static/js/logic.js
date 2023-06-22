var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

var myMap = L.map("map", {
    center: [23.63, -102.55],
    zoom: 4,
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);
//title layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

d3.json(queryUrl).then(function (data) {
    function mapStyle(feature) {
        return {
            opacity: 80,
            fillOpacity: 80,
            fillColor: mapColor(feature.geometry.coordinates[2]),
            color: "white",
            radius: mapRadius(feature.properties.mag),
            weight: 2
        };
    }
    function mapColor(depth) {
        switch (true) {
            case depth > 100: 
                return "black";
            case depth > 75:
                return "grey";
            case depth > 50:
                return "blue"; 
            case depth > 25:
                return "red";
            case depth > 10:
                return "yellow";
            default:
                return "lightgreen";
        }
    }
    function mapRadius(mag) {
        if (mag === 0) {
            return 1;
        }

        return mag * 3;
    }

    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },

        style: mapStyle,
        onEachFeature: function (feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place + "<br>Depth: "+ feature.geometry.coordinates[2]);
        }
    }).addTo(myMap);

var legend = L.control({position: "topright"});
legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend"),
    depth = [0, 10, 25, 50, 75,100];

    for (var i=0; i < depth.length; i++) {
        div.innerHTML +=
        '<i style="background:' + mapColor(depth[i] + 1) + '"></i> ' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
    }
    return div; 
};
legend.addTo(myMap)
});