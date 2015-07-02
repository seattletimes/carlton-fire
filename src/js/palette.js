module.exports = function(value) {
  var day = new Date(value).getDay();
  return `hsl(${day * 20 % 360}, 40%, 60%)`;
};