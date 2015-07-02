var $ = require("jquery");

var mapElement = document.querySelector("leaflet-map");
var map = mapElement.map;
var L = mapElement.leaflet;

var deferred = $.Deferred();

var request = $.ajax({
  url: "./assets/carlton-complex.geojson",
  dataType: "json"
});
request.done(data => {
  var allLayers = [];
  var samples = {};

  var geojson = L.geoJson(data, {
    onEachFeature(feature, layer) {
      var props = feature.properties;
      var dateSplit = props.date.split("/").map(Number);
      var time = String(props.time || "0000");
      var hours = time.slice(0, 2) * 1;
      var minutes = time.slice(2) * 1;
      var date = new Date(dateSplit[0], dateSplit[1] - 1, dateSplit[2], hours, minutes);
      var timestamp = date.getTime();
      if (!samples[timestamp]) samples[timestamp] = {
        date,
        timestamp,
        layers: [],
        area: 0
      };
      samples[timestamp].layers.push(layer);
      samples[timestamp].area += props.acres;
      allLayers.push(layer);
      layer.setStyle({ stroke: 0, fillColor: "blue" });
    }
  });

  var timestamps = Object.keys(samples).map(Number).sort();
  var values = timestamps.map(t => samples[t].area);
  var bounds = {
    x: {
      min: Math.min(...timestamps),
      max: Math.max(...timestamps)
    },
    y: {
      min: 0,
      max: Math.max(...values)
    }
  };

  geojson.addTo(map);

  deferred.resolve({
    samples,
    allLayers,
    bounds,
    timestamps,
    values
  });

});

module.exports = deferred.promise();