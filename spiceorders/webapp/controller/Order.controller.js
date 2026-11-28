sap.ui.define(["sap/ui/core/mvc/Controller"], (Controller) => {
  "use strict";

  return Controller.extend("choam.spiceorders.controller.Order", {
    onInit() {
      const router = this.getOwnerComponent().getRouter();

      router
        .getRoute("RouteOrder")
        .attachPatternMatched(this._onOrderMatched, this);
    },

    _onOrderMatched(event) {
      const orderId = event.getParameter("arguments").orderId;

      this.getView()
        .getModel("appView")
        .setProperty("/layout", "TwoColumnsMidExpanded");
      this.getView().bindElement(`/Orders(${orderId})`);
    }
  });
});
