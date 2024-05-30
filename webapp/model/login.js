
{
  sap.ui.define([], () => {
    "use strict";

    return {
      info(email, password) {
        const userTable = [
          {
            email: "alberto.blasi@keytech.srl",
            password: "Password1!"
          },
          {
            email: "paolo.lotto@keytech.srl",
            password: "Password1!"
          },
          {
            email: "vincenza.lotito@keytech.srl",
            password: "Password1!"
          },
          {
            email: "vitaliia.stavytska@keytech.srl",
            password: "Password1!"
          }
        ];

        for (let i = 0; i < userTable.length; i++) {
          if (email === userTable[i].email && password === userTable[i].password) {
            return true;
          }
        }
      }
    };
  });
}