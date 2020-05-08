exports.getDate = function() {

  const day = new Date();
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };

  return day.toLocaleString("en-US", options);

};
