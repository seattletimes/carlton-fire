// require("./lib/social");
// require("./lib/ads");
// var track = require("./lib/tracking");

var $ = require("jquery");
require("component-responsive-frame/child");
require("component-leaflet-map");

var canvas = document.querySelector("canvas.graph");
var context = canvas.getContext("2d");

var geodata = require("./loadData");

var render = function(selected) {

  geodata.then(function(data) {

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    var scaleX = v => (v - data.bounds.x.min) / (data.bounds.x.max - data.bounds.x.min);
    var scaleY = v => (v - data.bounds.y.min) / (data.bounds.y.max - data.bounds.y.min);

    context.beginPath();
    data.timestamps.forEach(function(time, i) {
      var val = data.values[i];
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

  });
};

render();

var callout = document.querySelector(".callout");

$(canvas).on("mousemove touchstart touchmove", function(e) {

  geodata.then(function(data) {

    var bounds = canvas.getBoundingClientRect();
    
    var x = e.originalEvent.touches ? e.originalEvent.touches[0].clientX : e.clientX;
    x -= bounds.left;

    var time = (x / canvas.width) * (data.bounds.x.max - data.bounds.x.min) + data.bounds.x.min;
    time = Math.round(time);

    var distance = Infinity;
    var found = null;
    for (var t in data.samples) {
      var dx = Math.abs(time - data.samples[t].timestamp);
      if (dx < distance) {
        found = data.samples[t];
        distance = dx;
      }
    }
    if (!found) return;

    render(found);
    callout.innerHTML = `
<div class="date">${found.date.toLocaleString()}</div>
<div class="area">${Math.round(found.area).toLocaleString().replace(/\.0+$/, "")} acres</div>
    `

    data.allLayers.forEach(layer => layer.setStyle({ fillOpacity: 0 }));
    found.layers.forEach(layer => layer.setStyle({ fillOpacity: 1 }));

  });

});