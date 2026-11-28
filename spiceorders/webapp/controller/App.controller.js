sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel"],
  (BaseController, JSONModel) => {
    "use strict";

    return BaseController.extend("choam.spiceorders.controller.App", {
      onInit() {
        const appViewModel = new JSONModel({
          layout: "OneColumn"
        });

        this.getView().setModel(appViewModel, "appView");
      }
    });
  }
);
