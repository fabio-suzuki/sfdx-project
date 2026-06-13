({
  reloadRecord: function (component) {
    var service = component.find("service");
    if (!service) {
      console.error("RecordMap: force:recordData service not found");
      return;
    }
    service.reloadRecord(false, function (result) {
      if (result && result.error) {
        console.error(
          "RecordMap: failed to reload record",
          JSON.stringify(result.error)
        );
        return;
      }
      var sObject = component.get("v.sObject");
      if (!sObject) {
        console.warn(
          "RecordMap: sObject is empty after reload — record may have been deleted or is inaccessible"
        );
        return;
      }
      component.set("v.mapMarkers", [
        {
          location: {
            Latitude: sObject[component.get("v.latField")],
            Longitude: sObject[component.get("v.longField")]
          }
        }
      ]);
    });
  }
});
