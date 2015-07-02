module.exports = function(value) {
  var day = new Date(value).getDate();

if (day == 24) {
    return '#FFD990';
  } else if (day == 23) {
    return '#FCBB6D';
  } else if (day == 21) {
    return '#F99E49';
  } else if (day == 20) {
    return '#F47920';
  } else if (day == 19) {
    return '#FA4C3C';
  } else if (day == 18) {
    return '#E54E5F';
  } else if (day == 17) {
    return '#A05DA5';
  } else if (day == 16) {
    return '#522E91';
  } else if (day == 15) {
    return '#260066';
  }
};
