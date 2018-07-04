const formatTime = (inputTime, only_date = true) => {
  var date = new Date(inputTime*1000);
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  var d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  var h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  var minute = date.getMinutes();
  var second = date.getSeconds();
  minute = minute < 10 ? ('0' + minute) : minute;
  second = second < 10 ? ('0' + second) : second;

  var d = y + '-' + m + '-' + d;
  var m = h + ':' + minute + ':' + second;


  return only_date ? d : (d + '' + m);
}

module.exports = {
  formatTime: formatTime
}
