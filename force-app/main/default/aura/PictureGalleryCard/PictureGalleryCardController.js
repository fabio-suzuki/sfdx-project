({
  doInit: function (component) {
    var S3_BASE_URL = "https://s3-us-west-1.amazonaws.com/sfdc-demo/houses/";
    component.set("v.slides", [
      S3_BASE_URL + "living_room.jpg",
      S3_BASE_URL + "eatinkitchen.jpg",
      S3_BASE_URL + "kitchen.jpg"
    ]);
  },

  fullScreen: function (component) {
    component.set("v.fullScreen", true);
  },

  closeDialog: function (component) {
    component.set("v.fullScreen", false);
  }
});
