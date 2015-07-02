module.exports = function(value) {
  var day = new Date(value).getDate();

if (day == 24) {
    return '#FFFCD5';
  } else if (day == 23) {
    return '#FFEFC6';
  } else if (day == 21) {
    return '#FFD990';
  } else if (day == 20) {
    return '#FCBB6D';
  } else if (day == 19) {
    return '#F99E49';
  } else if (day == 18) {
    return '#F47920';
  } else if (day == 17) {
    return '#E54E5F';
  } else if (day == 16) {
    return '#DD788A';
  } else if (day == 15) {
    return 'A05DA5';
  }
};
