sap.ui.define(
    [
      "sap/ui/core/mvc/Controller",
      "sap/ui/model/json/JSONModel",
      "sap/ui/model/Filter",
      "sap/ui/model/FilterOperator"
    ],
    (Controller, JSONModel, Filter, FilterOperator) => {
      "use strict";
  
      return Controller.extend("keytech.demo.controller.Customers", {
        onInit() {
          const oViewModel = new JSONModel({ currency: "EUR" });
          this.getView().setModel(oViewModel, "view");
  
          const oRouter = this.getOwnerComponent().getRouter();
          oRouter.getRoute("customers").attachPatternMatched(this.onObjectMatched, this);
        },
  
        onObjectMatched() {
          this.getView().byId("customers").setBusy(true);
          const oModel = this.getView().getModel();
          
          oModel.read("/Customers", {
            success: (data) => {
              const customersModel = new JSONModel();
              const oModel = new JSONModel();
              const aCountries = [...new Set(data.results.map((item) => item.Country))];
              aCountries.sort();
              oModel.setData(aCountries);
              customersModel.setData(data.results);
              this.getView().setModel(customersModel, "customers");
              this.getView().setModel(oModel, "allCountries");
  
              this._loadInvoicesAndCount(customersModel);
            },
            error: (err) => {
              console.log(err);
              this.getView().byId("customers").setBusy(false);
            }
          });
        },
  
        _loadInvoicesAndCount(customersModel) {
          const oModel = this.getView().getModel();
  
          oModel.read("/Invoices", {
            success: (data) => {
              const oInvoiceModel = new JSONModel();
              oInvoiceModel.setData(data.results);
              this.getView().setModel(oInvoiceModel, "invoices");
  
              this._countInvoicesPerCustomer(customersModel, oInvoiceModel);
              this.getView().byId("customers").setBusy(false);
            },
            error: (err) => {
              console.log(err);
              this.getView().byId("customers").setBusy(false);
            }
          });
        },
  
        _countInvoicesPerCustomer(customersModel, invoicesModel) {
          const customersData = customersModel.getData();
          const invoicesData = invoicesModel.getData();

          const invoiceCountByCustomer = {};
  
          customersData.forEach(customer => {
            invoiceCountByCustomer[customer.CustomerID] = 0;
          });
  
          invoicesData.forEach(invoice => {
            if (invoice.CustomerID in invoiceCountByCustomer) {
              invoiceCountByCustomer[invoice.CustomerID]++;
            }
          });
  
          customersData.forEach(customer => {
            customer.invoiceCount = invoiceCountByCustomer[customer.CustomerID];
          });

          customersModel.setData(customersData);
        },
  
        onFilter() {
          const search = this.getView().byId("search");
        
          let filters = [];
          if (search.getValue()) {
            filters.push(new Filter("CompanyName", FilterOperator.Contains, search.getValue()));
          }
        
          const oList = this.getView().byId("customersList");
          const oBinding = oList.getBinding("items");
        
          if (filters.length > 0) {
            oBinding.filter(filters, sap.ui.model.FilterType.Application);
          } else {
            oBinding.filter([], sap.ui.model.FilterType.Application);
          }
        }
,        
        onReset() {
          const search = this.getView().byId("search");
          const select = this.getView().byId("select");
  
          search.setValue("");
  
          const oList = this.getView().byId("customersList");
          const oBinding = oList.getBinding("items");
          oBinding.filter([]);
        }
      });
    }
  );