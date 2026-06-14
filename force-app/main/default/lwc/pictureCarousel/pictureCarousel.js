import { LightningElement, api } from "lwc";

export default class PictureCarousel extends LightningElement {
  @api slides = [];
  slideIndex = 0;

  get slideWidth() {
    const gallery = this.template.querySelector(".gallery");
    return gallery ? gallery.offsetWidth : 0;
  }

  get filmstripStyle() {
    return `margin-left: -${this.slideIndex * this.slideWidth}px`;
  }

  get slidesWithIndex() {
    return this.slides.map((url, index) => ({
      url,
      index,
      style: `width:${this.slideWidth}px;background-image:url(${url})`
    }));
  }

  get isPrevDisabled() {
    return this.slideIndex <= 0;
  }

  get isNextDisabled() {
    return this.slideIndex >= this.slides.length - 1;
  }

  get buttonSizeClass() {
    return this.slideWidth > 640 ? "btn x-large" : "btn";
  }

  next() {
    if (this.slideIndex + 1 < this.slides.length) {
      this.slideIndex++;
    }
  }

  prev() {
    if (this.slideIndex > 0) {
      this.slideIndex--;
    }
  }
}
