sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel",
    "../model/coordinates"
  ],
  (Controller, History, JSONModel, coordinates) => {
    "use strict";
    const coords = coordinates;
    return Controller.extend("keytech.demo.controller.Detail", {
      onInit() {
        const oViewModel = new JSONModel({ currency: "EUR" });
        this.getView().setModel(oViewModel, "view");

        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.getRoute("detail").attachPatternMatched(this.onObjectMatched, this);
      },

      onObjectMatched(oEvent) {
        this.getView().byId("details").setBusy(true);

        const oID = parseInt(oEvent.getParameter("arguments").order);
        const oModel = this.getView().getModel();
        oModel.read(`/Orders(${oID})`, {
          urlParameters: { $expand: "Employee,Customer,Order_Details,Shipper" },
          success: (data) => {
            const oModel = new JSONModel(data);
            this.getView().setModel(oModel, "details");

            const sShipper = coords.countryToCoords(data.ShipCountry);
            const sEmployee = coords.countryToCoords(data.Employee.Country);

            const oModelCoords = new JSONModel({
              shipperCountry: sShipper,
              employeeCountry: sEmployee
            });
            this.getView().setModel(oModelCoords, "coordinates");
          },
          error: (err) => {
            console.log(err);
            this.getView().byId("details").setBusy(false);
          }
        });

        oModel.read(`/Orders(${oID})/Order_Details`, {
          urlParameters: { $expand: "Product" },
          success: (data) => {
            let oModel = new JSONModel(data.results);
            this.getView().setModel(oModel, "products");
            this.getView().byId("details").setBusy(false);
          },
          error: (err) => {
            console.log(err);
            this.getView().byId("details").setBusy(false);
          }
        });
      },
      async onOpenCustomerDetails() {
        this.oDialog ??= await this.loadFragment({ name: "keytech.demo.view.dialogs.Customer" });
        this.oDialog.open();
      },
      onCloseCustomerDetails() {
        this.oDialog.close();
      },
      onTabSelect(oEvent) {
        const sKey = oEvent.getParameter("key");
        const oEmployee = this.getView().byId("EmployeeCard");
        const oEmployeeCoords = this.getView().byId("EmployeeCoords");
        const oShipper = this.getView().byId("ShipperCard");
        const oShipperCoords = this.getView().byId("ShipperCoords");

        if (sKey === "shipping") {
          oShipper.setVisible(true);
          oShipperCoords.setVisible(true);
          oEmployee.setVisible(false);
          oEmployeeCoords.setVisible(false);
        } else {
          oShipper.setVisible(false);
          oShipperCoords.setVisible(false);
          oEmployee.setVisible(true);
          oEmployeeCoords.setVisible(true);
        }
      },
      test(foto) {
        console.log(foto);
      },
      onBack() {
        const oHistory = History.getInstance();
        const sPreviousHash = oHistory.getPreviousHash();

        if (sPreviousHash !== undefined) window.history.go(-1);
        else {
          const oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("homepage", {}, true);
        }
      },
      onPress(oEvent) {
        const oID = oEvent.getSource().getBindingContext("products").getObject().ProductID;
        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("product", { product: oID });
      }
    });
  }
);
