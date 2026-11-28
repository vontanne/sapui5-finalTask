sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/FilterType",
    "choam/spiceorders/model/formatter"
  ],
  (Controller, JSONModel, Filter, FilterOperator, FilterType, formatter) => {
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

      onSearch(event) {
        const query = event.getParameter("query").trim();
        const isOrderNumber = /^\d{1,9}$/.test(query);
        const filters = [];

        if (query) {
          const searchFilters = [
            new Filter({
              path: "Customer/Name",
              operator: FilterOperator.Contains,
              value1: query,
              caseSensitive: false
            })
          ];

          if (isOrderNumber) {
            searchFilters.push(
              new Filter({
                path: "OrderID",
                operator: FilterOperator.EQ,
                value1: Number(query)
              })
            );
          }

          filters.push(new Filter({ filters: searchFilters, and: false }));
        }

        this.byId("orderList")
          .getBinding("items")
          .filter(filters, FilterType.Application);
      },

      _onMainMatched() {
        this.getView().getModel("appView").setProperty("/layout", "OneColumn");
      }
    });
  }
);
