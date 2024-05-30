sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator"
    ],
    (Controller, JSONModel, Filter, FilterOperator) => {
        "use strict";

        return Controller.extend("keytech.demo.controller.Products", {
            onInit() {
                const oViewModel = new JSONModel({ currency: "EUR" });
                this.getView().setModel(oViewModel, "view");

                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.getRoute("products").attachPatternMatched(this.onObjectMatched, this);
            },

            onObjectMatched() {
                this.getView().byId("products").setBusy(true);

                const oModel = this.getView().getModel();
                oModel.read("/Products", {
                    success: (data) => {
                        const oModel = new JSONModel();
                        const aCountries = [...new Set(data.results.map((item) => item.Country))];
                        aCountries.sort();
                        oModel.setData(aCountries);
                        this.getView().setModel(oModel, "allCountries");
                        oModel.setData(data.results);
                        this.getView().setModel(oModel, "products");
                        this.getView().byId("products").setBusy(false);
                    },
                    error: (err) => {
                        console.log(err);
                        this.getView().byId("products").setBusy(true);
                    },

                });
            },
            onFilter() {
                const search = this.getView().byId("search");
                
                let filters = [];
                if (search.getValue()) {
                  filters.push(new Filter("ProductName", FilterOperator.Contains, search.getValue()));
                }
        
                const oList = this.getView().byId("ProductList");
                const oBinding = oList.getBinding("items");
        
                if (filters.length > 0) {
                  oBinding.filter(new Filter({
                    filters: filters,
                    and: false
                  }));
                } else {
                  oBinding.filter([]);
                }
              },

            onReset() {
                const search = this.getView().byId("search");
                const select = this.getView().byId("select");

                search.setValue("");
                
                const oList = this.getView().byId("ProductList");
                const oBinding = oList.getBinding("items");
                oBinding.filter([]);
            },

            onPress(oEvent) {
                const oID = oEvent.getSource().getBindingContext("products").getObject().ProductID;
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("product", { product: oID });
            }
        });
    }
);
