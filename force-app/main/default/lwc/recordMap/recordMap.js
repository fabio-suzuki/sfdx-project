import { LightningElement, api, wire } from "lwc";
import { getRecord } from "lightning/uiRecordApi";

export default class RecordMap extends LightningElement {
  @api recordId;
  @api titleField = "Name";
  @api latField = "Location__Latitude__s";
  @api longField = "Location__Longitude__s";
  @api zoomLevel = 16;

  title = "";
  mapMarkers = [];

  get fields() {
    return ["Id", this.latField, this.longField, this.titleField];
  }

  @wire(getRecord, { recordId: "$recordId", fields: "$fields" })
  wiredRecord({ error, data }) {
    if (data) {
      this.processRecord(data);
    } else if (error) {
      this.title = "";
      this.mapMarkers = [];
    }
  }

  processRecord(record) {
    const fieldValues = record.fields || {};
    const titleVal = fieldValues[this.titleField];
    const latVal = fieldValues[this.latField];
    const longVal = fieldValues[this.longField];

    this.title = titleVal ? titleVal.value : "";
    this.mapMarkers = [
      {
        location: {
          Latitude: latVal ? latVal.value : null,
          Longitude: longVal ? longVal.value : null
        }
      }
    ];
  }
}
