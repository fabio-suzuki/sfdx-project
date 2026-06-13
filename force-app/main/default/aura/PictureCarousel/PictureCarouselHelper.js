({
  setSlideWidth: function (component) {
    var slideWidth = component.find("gallery").getElement().offsetWidth;
    component.set("v.slideWidth", slideWidth);
  },

  navigate: function (component, direction) {
    var slideIndex = component.get("v.slideIndex");
    var slides = component.get("v.slides");
    var newIndex = slideIndex + direction;
    if (newIndex >= 0 && newIndex < slides.length) {
      component.set("v.slideIndex", newIndex);
    }
  }
});
