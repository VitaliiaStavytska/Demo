sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel"],
  (Controller, JSONModel) => {
    "use strict";

    return Controller.extend("keytech.demo.controller.Homepage", {
      onInit() {
        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.getRoute("homepage").attachPatternMatched(this.onObjectMatched, this);
      },

      onObjectMatched() {
        this.getView().byId("homepage").setBusy(true);

        const oModel = this.getView().getModel();
        oModel.read("/Invoices", {
          success: (data) => {
            const oModel = new JSONModel();
            const nInvoices = data.results.length;
            oModel.setProperty("/invoices", nInvoices);
            this.getView().setModel(oModel, "count");
          },
          error: (err) => {
            console.log(err);
            this.getView().byId("homepage").setBusy(true);
          }
        });
        oModel.read("/Products", {
          success: (data) => {
            const oModel = this.getView().getModel("count");
            const nProducts = data.results.length;
            oModel.setProperty("/products", nProducts);
            this.getView().byId("homepage").setBusy(false);
          },
          error: (err) => {
            console.log(err);
            this.getView().byId("homepage").setBusy(true);
          }
        });
        oModel.read("/Customers", {
          success: (data) => {
            const oModel = this.getView().getModel("count");
            const nCustomers = data.results.length;
            oModel.setProperty("/customers", nCustomers);
            this.getView().setModel(oModel, "count");
          },
          error: (err) => {
            console.log(err);
            this.getView().byId("homepage").setBusy(true);
          }
        });

      },

      onPress(oEvent) {
        const sId = oEvent.getSource().getId().split("--")[2].split("Tile")[0];
        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo(sId);
      }
    });
  }
);
