// require("./lib/social");
// require("./lib/ads");
// var track = require("./lib/tracking");

var $ = require("jquery");
require("component-responsive-frame/child");
require("component-leaflet-map");

var mapElement = document.querySelector("leaflet-map");
var map = mapElement.map;
var L = mapElement.leaflet;

var samples = {};
var allLayers = [];
var geojson;

var request = $.ajax({
  url: "./assets/carlton-complex.geojson",
  dataType: "json"
});
request.done(data => {
  geojson = L.geoJson(data, {
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

  geojson.addTo(map);

  render();

});

var canvas = document.querySelector("canvas.graph");
var context = canvas.getContext("2d");
var dataBounds;

var render = function(selected) {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  var timestamps = Object.keys(samples).map(Number).sort();
  var values = timestamps.map(t => samples[t].area);
  var bounds = dataBounds = {
    x: {
      min: Math.min(...timestamps),
      max: Math.max(...timestamps)
    },
    y: {
      min: 0,
      max: Math.max(...values)
    }
  };

  var scaleX = v => (v - bounds.x.min) / (bounds.x.max - bounds.x.min);
  var scaleY = v => (v - bounds.y.min) / (bounds.y.max - bounds.y.min);

  context.beginPath();
  timestamps.forEach(function(time, i) {
    var val = values[i];
    var x = scaleX(time);
    var y = scaleY(val);
    context[i ? "lineTo" : "moveTo"](x * canvas.width, canvas.height - y * canvas.height);
  });
  context.stroke();

  if (selected) {

    var lineX = scaleX(selected.timestamp) * canvas.width;
    context.beginPath();
    context.moveTo(lineX, 0);
    context.lineTo(lineX, canvas.height);
    context.stroke();

  }
};

$(canvas).on("mousemove", function(e) {

  if (!dataBounds) return;

  var bounds = canvas.getBoundingClientRect();
  var x = e.clientX - bounds.left;

  var time = (x / canvas.width) * (dataBounds.x.max - dataBounds.x.min) + dataBounds.x.min;
  time = Math.round(time);

  var distance = Infinity;
  var found = null;
  for (var t in samples) {
    var dx = Math.abs(time - samples[t].timestamp);
    if (dx < distance) {
      found = samples[t];
      distance = dx;
    }
  }
  if (!found) return;

  render(found);

  allLayers.forEach(layer => layer.setStyle({ fillOpacity: 0 }));
  found.layers.forEach(layer => layer.setStyle({ fillOpacity: 1 }));

});