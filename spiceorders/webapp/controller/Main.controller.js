sap.ui.define(["sap/ui/core/mvc/Controller"], (Controller) => {
  "use strict";

  return Controller.extend("choam.spiceorders.controller.Main", {
    onInit() {
      const router = this.getOwnerComponent().getRouter();

      router
        .getRoute("RouteMain")
        .attachPatternMatched(this._onMainMatched, this);
    },

    _onMainMatched() {
      this.getView().getModel("appView").setProperty("/layout", "OneColumn");
    }
  });
});
