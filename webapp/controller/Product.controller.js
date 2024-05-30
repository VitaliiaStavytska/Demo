sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/core/routing/History", "sap/ui/model/json/JSONModel"],
  (Controller, History, JSONModel) => {
    "use strict";

    return Controller.extend("keytech.demo.controller.Product", {
      onInit() {
        const oViewModel = new JSONModel({ currency: "EUR" });
        this.getView().setModel(oViewModel, "view");

        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.getRoute("product").attachPatternMatched(this.onObjectMatched, this);
      },
      onObjectMatched(oEvent) {
        this.getView().byId("product").setBusy(true);

        const oID = oEvent.getParameter("arguments").product;
        const oModel = this.getView().getModel();
        oModel.read(`/Products(${oID})`, {
          urlParameters: { $expand: "Supplier,Category" },
          success: (data) => {
            let oModel = new JSONModel(data);
            this.getView().setModel(oModel, "product");
            this.getView().byId("product").setBusy(false);
          },
          error: (err) => {
            console.log(err);
            this.getView().byId("product").setBusy(false);
          }
        });
      },
      onTabSelectProduct(oEvent) {
        const sKey = oEvent.getParameter("key");
        const oInfo = this.getView().byId("InfoCard");
        const oCategory = this.getView().byId("CategoryCard");
        const oSupplier = this.getView().byId("SupplierCard");
        

        if (sKey === "category") {
          oCategory.setVisible(true);
          oInfo.setVisible(false);
          oSupplier.setVisible(false);

        }
        else if (sKey === "info") {
          oInfo.setVisible(true);
          oCategory.setVisible(false);
          oSupplier.setVisible(false);

        }
        else if (sKey === "supplier") {
          oSupplier.setVisible(true);
          oCategory.setVisible(false);
          oInfo.setVisible(false);
        }
      },
       async onOpenProductDetails() {
        this.oDialog ??= await this.loadFragment({ name: "keytech.demo.view.dialogs.Product" });
        this.oDialog.open();
      },
      onCloseProductDetails() {
        this.oDialog.close();
      },
      onBack() {
        const oHistory = History.getInstance();
        const sPreviousHash = oHistory.getPreviousHash();

        if (sPreviousHash !== undefined) window.history.go(-1);
        else {
          const oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("homepage", {}, true);
        }
      }
    });
  }
);
