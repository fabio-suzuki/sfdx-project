import { createElement } from "lwc";
import RecordMap from "c/recordMap";
import { getRecord } from "lightning/uiRecordApi";
import { registerLdsTestWireAdapter } from "@salesforce/sfdx-lwc-jest";

const getRecordAdapter = registerLdsTestWireAdapter(getRecord);

const MOCK_RECORD = {
  fields: {
    Name: { value: "123 Main St" },
    Location__Latitude__s: { value: 42.3601 },
    Location__Longitude__s: { value: -71.0589 }
  }
};

const MOCK_RECORD_CUSTOM_FIELDS = {
  fields: {
    Title__c: { value: "Luxury Villa" },
    Lat__c: { value: 34.0522 },
    Lng__c: { value: -118.2437 }
  }
};

describe("c-record-map", () => {
  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
    jest.clearAllMocks();
  });

  function createComponent(props = {}) {
    const element = createElement("c-record-map", {
      is: RecordMap
    });
    Object.assign(element, props);
    document.body.appendChild(element);
    return element;
  }

  it("renders the lightning-card", () => {
    const element = createComponent({ recordId: "001xx000003FAKE" });

    return Promise.resolve().then(() => {
      const card = element.shadowRoot.querySelector("lightning-card");
      expect(card).not.toBeNull();
      expect(card.iconName).toBe("custom:custom106");
    });
  });

  it("renders the lightning-map component", () => {
    const element = createComponent({ recordId: "001xx000003FAKE" });

    return Promise.resolve().then(() => {
      const map = element.shadowRoot.querySelector("lightning-map");
      expect(map).not.toBeNull();
    });
  });

  it("uses default zoom level of 16", () => {
    const element = createComponent({ recordId: "001xx000003FAKE" });

    return Promise.resolve().then(() => {
      const map = element.shadowRoot.querySelector("lightning-map");
      expect(map.zoomLevel).toBe(16);
    });
  });

  it("accepts a custom zoom level", () => {
    const element = createComponent({
      recordId: "001xx000003FAKE",
      zoomLevel: 10
    });

    return Promise.resolve().then(() => {
      const map = element.shadowRoot.querySelector("lightning-map");
      expect(map.zoomLevel).toBe(10);
    });
  });

  it("sets title and map markers from wired record data", () => {
    const element = createComponent({ recordId: "001xx000003FAKE" });

    getRecordAdapter.emit(MOCK_RECORD);

    return Promise.resolve().then(() => {
      const card = element.shadowRoot.querySelector("lightning-card");
      expect(card.title).toBe("123 Main St");

      const map = element.shadowRoot.querySelector("lightning-map");
      expect(map.mapMarkers).toEqual([
        {
          location: {
            Latitude: 42.3601,
            Longitude: -71.0589
          }
        }
      ]);
    });
  });

  it("handles wired record error gracefully", () => {
    const element = createComponent({ recordId: "001xx000003FAKE" });

    getRecordAdapter.error();

    return Promise.resolve().then(() => {
      const card = element.shadowRoot.querySelector("lightning-card");
      expect(card.title).toBe("");

      const map = element.shadowRoot.querySelector("lightning-map");
      expect(map.mapMarkers).toEqual([]);
    });
  });

  it("uses custom field names for title, lat, and long", () => {
    const element = createComponent({
      recordId: "001xx000003FAKE",
      titleField: "Title__c",
      latField: "Lat__c",
      longField: "Lng__c"
    });

    getRecordAdapter.emit(MOCK_RECORD_CUSTOM_FIELDS);

    return Promise.resolve().then(() => {
      const card = element.shadowRoot.querySelector("lightning-card");
      expect(card.title).toBe("Luxury Villa");

      const map = element.shadowRoot.querySelector("lightning-map");
      expect(map.mapMarkers).toEqual([
        {
          location: {
            Latitude: 34.0522,
            Longitude: -118.2437
          }
        }
      ]);
    });
  });

  it("passes custom field props through to the component", () => {
    const element = createComponent({
      recordId: "001xx000003FAKE",
      titleField: "Title__c",
      latField: "Lat__c",
      longField: "Lng__c"
    });

    return Promise.resolve().then(() => {
      expect(element.titleField).toBe("Title__c");
      expect(element.latField).toBe("Lat__c");
      expect(element.longField).toBe("Lng__c");
    });
  });

  it("uses default field property values", () => {
    const element = createComponent({ recordId: "001xx000003FAKE" });

    return Promise.resolve().then(() => {
      expect(element.titleField).toBe("Name");
      expect(element.latField).toBe("Location__Latitude__s");
      expect(element.longField).toBe("Location__Longitude__s");
    });
  });

  it("handles record with missing field values", () => {
    const element = createComponent({ recordId: "001xx000003FAKE" });

    getRecordAdapter.emit({ fields: {} });

    return Promise.resolve().then(() => {
      const card = element.shadowRoot.querySelector("lightning-card");
      expect(card.title).toBe("");

      const map = element.shadowRoot.querySelector("lightning-map");
      expect(map.mapMarkers).toEqual([
        {
          location: {
            Latitude: null,
            Longitude: null
          }
        }
      ]);
    });
  });
});
