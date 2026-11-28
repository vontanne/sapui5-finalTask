sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/FilterType",
    "sap/ui/model/Sorter",
    "choam/spiceorders/model/formatter"
  ],
  (
    Controller,
    JSONModel,
    Filter,
    FilterOperator,
    FilterType,
    Sorter,
    formatter
  ) => {
    "use strict";

    return Controller.extend("choam.spiceorders.controller.Main", {
      formatter: formatter,

      onInit() {
        const router = this.getOwnerComponent().getRouter();

        this.getView().setModel(
          new JSONModel({ title: "", filterInfo: "", isFiltered: false }),
          "mainView"
        );

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

        this._searchFilter = null;

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

          this._searchFilter = new Filter({
            filters: searchFilters,
            and: false
          });
        }

        this._applyFilters();
      },

      onConfirmViewSettings(event) {
        const statusItems = event.getParameter("filterItems");
        const resourceBundle = this.getOwnerComponent()
          .getModel("i18n")
          .getResourceBundle();
        const mainViewModel = this.getView().getModel("mainView");
        const statusFilters = statusItems.map(
          (statusItem) =>
            new Filter({
              path: "Status",
              operator: FilterOperator.EQ,
              value1: statusItem.getKey()
            })
        );
        const statusTexts = statusItems.map((statusItem) =>
          statusItem.getText()
        );
        const isFiltered = statusFilters.length > 0;

        this._statusFilter = isFiltered
          ? new Filter({ filters: statusFilters, and: false })
          : null;

        mainViewModel.setProperty("/isFiltered", isFiltered);
        mainViewModel.setProperty(
          "/filterInfo",
          isFiltered
            ? resourceBundle.getText("orderListFilteredBy", [
                statusTexts.join(", ")
              ])
            : ""
        );

        this._applyFilters();
        this._applyGrouping(
          event.getParameter("groupItem"),
          event.getParameter("groupDescending")
        );
      },

      async onOpenViewSettings(event) {
        const isGroupButton =
          event.getSource() === this.byId("orderGroupButton");
        const dialogPage = isGroupButton ? "group" : "filter";

        if (!this._viewSettingsDialogLoading) {
          this._viewSettingsDialogLoading = this.loadFragment({
            name: "choam.spiceorders.view.ViewSettingsDialog"
          });
        }

        const dialog = await this._viewSettingsDialogLoading;

        dialog.open(dialogPage);
      },

      _applyFilters() {
        const activeFilters = [];

        if (this._searchFilter) {
          activeFilters.push(this._searchFilter);
        }

        if (this._statusFilter) {
          activeFilters.push(this._statusFilter);
        }

        const filters = activeFilters.length
          ? [new Filter({ filters: activeFilters, and: true })]
          : [];

        this.byId("orderList")
          .getBinding("items")
          .filter(filters, FilterType.Application);
      },

      _applyGrouping(groupItem, isDescending) {
        const sorters = [];

        if (groupItem) {
          const groupPath = groupItem.getKey();
          const isStatusGroup = groupPath === "Status";

          sorters.push(
            new Sorter({
              path: groupPath,
              descending: isDescending,
              group: isStatusGroup ? this._getStatusGroup.bind(this) : true
            })
          );
        }

        sorters.push(new Sorter({ path: "OrderID", descending: true }));

        this.byId("orderList").getBinding("items").sort(sorters);
      },

      _getStatusGroup(context) {
        const status = context.getProperty("Status");

        return {
          key: status,
          text: formatter.statusText.call(this, status)
        };
      },

      _onMainMatched() {
        this.getView().getModel("appView").setProperty("/layout", "OneColumn");
      }
    });
  }
);
