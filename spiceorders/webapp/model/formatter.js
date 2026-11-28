sap.ui.define([], () => {
  "use strict";

  const statusTextKeys = {
    NEW: "statusNew",
    IN_TRANSIT: "statusInTransit",
    DELIVERED: "statusDelivered",
    CANCELLED: "statusCancelled"
  };

  const statusStates = {
    NEW: "Information",
    IN_TRANSIT: "Warning",
    DELIVERED: "Success",
    CANCELLED: "Error"
  };

  return {
    statusText(status) {
      const resourceBundle = this.getOwnerComponent()
        .getModel("i18n")
        .getResourceBundle();

      return statusTextKeys[status]
        ? resourceBundle.getText(statusTextKeys[status])
        : status;
    },

    statusState(status) {
      return statusStates[status] || "None";
    }
  };
});
