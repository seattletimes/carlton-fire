// require("./lib/social");
// require("./lib/ads");
// var track = require("./lib/tracking");
require("component-responsive-frame/child");
require("component-leaflet-map");

var $ = require("jquery");
var moment = require("moment");
var getColor = require("./palette");

var canvas = document.querySelector("canvas.graph");
var context = canvas.getContext("2d");

require("./loadData").then(function(data) {

  var render = function(selected) {

      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      var scaleX = v => (v - data.bounds.x.min) / (data.bounds.x.max - data.bounds.x.min);
      var scaleY = v => (v - data.bounds.y.min) / (data.bounds.y.max - data.bounds.y.min);

      var height = canvas.height - 4;

      var previous = [0, 0];

      data.timestamps.forEach(function(time, i) {
        var val = data.values[i];
        var x = scaleX(time) * canvas.width;
        var y = height - scaleY(val) * height + 2;
        context.beginPath();
        context.moveTo(...previous);
        context.lineTo(x, y);
        context.lineTo(x, canvas.height);
        context.lineTo(previous[0], canvas.height);
        context.closePath();
        if (selected && selected.timestamp < time) {
          context.fillStyle = "#888";
        } else {
          context.fillStyle = getColor(time);
        }
        context.fill();
        previous = [x, y];
      });

      if (selected) {

        var lineX = scaleX(selected.timestamp) * canvas.width;
        context.fillStyle = "rgba(255, 255, 255, .6)";
        context.fillRect(lineX, 0, canvas.width, canvas.height);
      }
  };

  render();

  var callout = document.querySelector(".callout");

  var showSample = function(sample) {
    render(sample);
    callout.innerHTML = `
  <div class="date">${moment(sample.timestamp).format("MMM D, YYYY - h:mmA")}</div>
  <div class="area">${Math.round(sample.area).toLocaleString().replace(/\.0+$/, "")} acres</div>
    `

    data.allLayers.forEach(layer => layer.setStyle({ fillOpacity: 0 }));
    sample.layers.forEach(layer => layer.setStyle({ fillOpacity: 1 }));
  };

  $(canvas).on("mousemove touchstart touchmove", function(e) {

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
    if (found) showSample(found);

  });

});