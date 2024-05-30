{
  sap.ui.define([], () => {
    "use strict";

    return {
      countryToCoords(country) {
        switch (country) {
          case "Argentina":
            return "-63.616672;-38.416097;0";
          case "Austria":
            return "14.550072;47.516231;0";
          case "Brazil":
            return "-51.92528;-14.235004;0";
          case "Canada":
            return "-106.346771;56.130366;0";
          case "France":
            return "2.213749;46.227638;0";
          case "Germany":
            return "10.451526;51.165691;0";
          case "Mexico":
            return "-102.552784;23.634501;0";
          case "Spain":
            return "-3.74922;40.463667;0";
          case "Sweden":
            return "18.643501;60.128161;0";
          case "Switzerland":
            return "8.227512;46.818188;0";
          case "UK":
            return "-3.435973;55.378051;0";
          case "USA":
            return "-95.712891;37.09024;0";
          default:
            return "0;0;0";
        }
      }
    };
  });
}