import { LightningElement } from "lwc";

const DEFAULT_SLIDES = [
  "https://s3-us-west-1.amazonaws.com/sfdc-demo/houses/living_room.jpg",
  "https://s3-us-west-1.amazonaws.com/sfdc-demo/houses/eatinkitchen.jpg",
  "https://s3-us-west-1.amazonaws.com/sfdc-demo/houses/kitchen.jpg"
];

export default class PictureGalleryCard extends LightningElement {
  fullScreen = false;
  slides = DEFAULT_SLIDES;

  openFullScreen() {
    this.fullScreen = true;
  }

  closeDialog() {
    this.fullScreen = false;
  }
}
