module.exports = function(value) {
  var day = new Date(value).getDate();

if (day == 24) {
    return '#FFFFED';
  } else if (day == 23) {
    return '#FCBB6D';
  } else if (day == 21) {
    return '#F99E49';
  } else if (day == 20) {
    return '#F47920';
  } else if (day == 19) {
    return '#DD788A';
  } else if (day == 18) {
    return '#A05DA5';
  } else if (day == 17) {
    return '#522E91';
  } else if (day == 16) {
    return '#231F20';
  } else if (day == 15) {
    return 'black';
  }
}
