({
  setSlideWidth: function (component) {
    var gallery = component.find("gallery");
    if (!gallery) {
      console.error("PictureCarousel: gallery element not found in component");
      return;
    }
    var element = gallery.getElement();
    if (!element) {
      console.error("PictureCarousel: gallery DOM element not yet rendered");
      return;
    }
    component.set("v.slideWidth", element.offsetWidth);
  }
});
