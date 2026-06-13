({
  buildMapMarkers: function (component, sObject) {
    component.set("v.mapMarkers", [
      {
        location: {
          Latitude: sObject[component.get("v.latField")],
          Longitude: sObject[component.get("v.longField")]
        }
      }
    ]);
  },

  reloadRecord: function (component) {
    var self = this;
    var service = component.find("service");
    service.reloadRecord(false, function () {
      var sObject = component.get("v.sObject");
      self.buildMapMarkers(component, sObject);
    });
  }
});
