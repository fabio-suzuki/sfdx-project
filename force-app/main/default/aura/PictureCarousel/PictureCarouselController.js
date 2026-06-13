({
  next: function (component) {
    var slideIndex = component.get("v.slideIndex");
    var slides = component.get("v.slides");
    if (!slides || !slides.length) {
      console.warn("PictureCarousel: no slides available to navigate");
      return;
    }
    if (slideIndex + 1 < slides.length) {
      component.set("v.slideIndex", slideIndex + 1);
    }
  },

  prev: function (component) {
    var slideIndex = component.get("v.slideIndex");
    if (slideIndex > 0) {
      component.set("v.slideIndex", slideIndex - 1);
    }
  }
});
