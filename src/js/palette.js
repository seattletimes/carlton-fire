module.exports = function(value) {
  return `hsl(${value / 1000 % 360}, 40%, 60%)`;
}