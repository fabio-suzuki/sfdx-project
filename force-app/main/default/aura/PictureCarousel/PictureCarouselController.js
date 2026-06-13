({
  next: function (component, event, helper) {
    helper.navigate(component, 1);
  },

  prev: function (component, event, helper) {
    helper.navigate(component, -1);
  }
});
