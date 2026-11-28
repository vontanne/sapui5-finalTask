sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "choam/spiceorders/model/formatter"
  ],
  (Controller, JSONModel, formatter) => {
    "use strict";

    return Controller.extend("choam.spiceorders.controller.Main", {
      formatter: formatter,

      onInit() {
        const router = this.getOwnerComponent().getRouter();

        this.getView().setModel(new JSONModel({ title: "" }), "mainView");

        router
          .getRoute("RouteMain")
          .attachPatternMatched(this._onMainMatched, this);
      },

      onUpdateFinished(event) {
        const total = event.getParameter("total");
        const resourceBundle = this.getOwnerComponent()
          .getModel("i18n")
          .getResourceBundle();

        this.getView()
          .getModel("mainView")
          .setProperty(
            "/title",
            resourceBundle.getText("orderListTitle", [total])
          );
      },

      _onMainMatched() {
        this.getView().getModel("appView").setProperty("/layout", "OneColumn");
      }
    });
  }
);
