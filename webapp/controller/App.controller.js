sap.ui.define(["sap/ui/core/mvc/Controller", "../model/login"], (Controller, Login) => {
  "use strict";
  return Controller.extend("keytech.demo.controller.App", {
    onInit() {
      this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());

      window.localStorage.getItem("user")
        ? this.getView().byId("appContainer").setVisible(true)
        : this.getView().byId("loginContainer").setVisible(true);
      window.localStorage.getItem("user")
        ? this.getView()
            .byId("username")
            .setText("Welcome, " + window.localStorage.getItem("user"))
        : this.getView().byId("username").setText();

      const location = window.location.hash;
      if (!location) {
        this.getView().byId("navigationList").setSelectedKey("homeButton");
      }
      if (location === "#/invoices") {
        this.getView().byId("navigationList").setSelectedKey("invoicesButton");
      }
      if (location === "#/products") {
        this.getView().byId("navigationList").setSelectedKey("productsButton");
      }
      if (location === "#/customers") {
        this.getView().byId("navigationList").setSelectedKey("customersButton");
      }
      this.byId("email").attachBrowserEvent("keypress", this.onKeyPress, this);
      this.byId("password").attachBrowserEvent("keypress", this.onKeyPress, this);
    },
    onKeyPress: function (oEvent) {
      if (oEvent.which === 13 || oEvent.keyCode === 13) this.onLogin();
    },
    onLogin: function () {
      const sEmail = this.byId("email").getValue();
      const sPassword = this.byId("password").getValue();
      this.byId("email").setValueState("None");
      this.byId("email").setValueStateText();
      this.byId("password").setValueState("None");
      this.byId("password").setValueStateText();

      if (sEmail || sPassword) {
        if (sEmail && !sPassword) {
          this.byId("password").setValueState("Error");
          this.byId("password").setValueStateText("Please enter a password");
        } else if (!sEmail && sPassword) {
          this.byId("email").setValueState("Error");
          this.byId("email").setValueStateText("Please enter an email");
        } else {
          const check = Login.info(sEmail, sPassword);
          if (check) {
            this.getView().byId("loginContainer").setVisible(false);
            this.getView().byId("appContainer").setVisible(true);
            window.localStorage.setItem("user", sEmail);
          } else {
            this.byId("email").setValueState("Error");
            this.byId("email").setValueStateText("Invalid email or password, please try again");
            this.byId("password").setValueState("Error");
            this.byId("password").setValueStateText("Invalid email or password, please try again");
          }
        }
      } else {
        this.byId("email").setValueState("Error");
        this.byId("email").setValueStateText("Please enter an email");
        this.byId("password").setValueState("Error");
        this.byId("password").setValueStateText("Please enter a password");
      }
    },
    onLogout: function () {
      this.getView().byId("loginContainer").setVisible(true);
      this.getView().byId("appContainer").setVisible(false);
      window.localStorage.removeItem("user");
    },
    onNavButton: function () {
      const oPage = this.byId("appContainer");
      oPage.setSideExpanded(!oPage.getSideExpanded());
    }
  });
});