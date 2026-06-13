({
  doInit: function (component, event, helper) {
    component.set("v.fields", [
      "Id",
      component.get("v.latField"),
      component.get("v.longField"),
      component.get("v.titleField")
    ]);
    var recordId = component.get("v.recordId");
    if (!recordId) {
      console.error("RecordMap: no recordId available during init");
      return;
    }
    component.set("v.dsRecordId", recordId);
    helper.reloadRecord(component);
  },

  recordChangeHandler: function (component, event, helper) {
    var id = event.getParam("recordId");
    if (!id) {
      console.error(
        "RecordMap: recordChangeHandler received event without recordId"
      );
      return;
    }
    component.set("v.dsRecordId", id);
    helper.reloadRecord(component);
  },

  onRecordUpdated: function (component, event) {
    var changeType = event.getParams().changeType;
    if (changeType === "ERROR") {
      console.error(
        "RecordMap: force:recordData reported an error loading the record"
      );
      return;
    }
    var sObject = component.get("v.sObject");
    if (!sObject) {
      console.warn(
        "RecordMap: onRecordUpdated fired but sObject is empty — the record may have been deleted"
      );
      return;
    }
    component.set("v.title", sObject[component.get("v.titleField")]);
    component.set("v.mapMarkers", [
      {
        location: {
          Latitude: sObject[component.get("v.latField")],
          Longitude: sObject[component.get("v.longField")]
        }
      }
    ]);
  }
});
