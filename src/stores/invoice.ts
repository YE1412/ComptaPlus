// import { ref, computed } from "vue";
import { defineStore, acceptHMRUpdate } from "pinia";
import invoiceAxiosService from "../services/invoice.service";
import { decryptMod } from "../WasmModules";

let __DECRYPTAPI__: any;

async function define() {
  if (__DECRYPTAPI__ === undefined) {
    return (__DECRYPTAPI__ = await decryptMod.then((e: any) => {
      return e;
    }));
  }
  return;
}

async function transformObject(obj: any) {
  await define();
  const ret: any = [];
  for (const k in obj) {
    // console.log(k);
    if (typeof obj[k] === "string" && k !== "date") {
      ret[k] = __DECRYPTAPI__.decrypt(obj[k]);
    } else if (typeof obj[k] === "object" && !Array.isArray(obj[k])) {
      ret[k] = {};
      for (const l in obj[k]) {
        if (typeof obj[k][l] === "string" && l !== "date")
          ret[k][l] = __DECRYPTAPI__.decrypt(obj[k][l]);
        else if (Array.isArray(obj[k][l])) {
          // console.log(l);
          ret[k][l] = [];
          for (const m in obj[k][l]) {
            if (
              typeof obj[k][l][m] === "object" &&
              !Array.isArray(obj[k][l][m])
            ) {
              ret[k][l][m] = {};
              for (const n in obj[k][l][m]) {
                if (typeof obj[k][l][m][n] === "string")
                  ret[k][l][m][n] = __DECRYPTAPI__.decrypt(obj[k][l][m][n]);
                else ret[k][l][m][n] = obj[k][l][m][n];
              }
            } else ret[k][l][m] = obj[k][l][m];
          }
        } else if (
          typeof obj[k][l] === "object" &&
          l !== "langue" &&
          l !== "devise"
        ) {
          ret[k][l] = {};
          for (const m in obj[k][l]) {
            if (typeof obj[k][l][m] === "string")
              ret[k][l][m] = __DECRYPTAPI__.decrypt(obj[k][l][m]);
            else ret[k][l][m] = obj[k][l][m];
          }
        } else ret[k][l] = obj[k][l];
      }
    } else if (Array.isArray(obj[k])) {
      // console.log(k);
      ret[k] = [];
      for (const l in obj[k]) {
        if (typeof obj[k][l] === "object" && !Array.isArray(obj[k][l])) {
          ret[k][l] = {};
          for (const m in obj[k][l]) {
            if (typeof obj[k][l][m] === "string" && m !== "date")
              ret[k][l][m] = __DECRYPTAPI__.decrypt(obj[k][l][m]);
          }
        } else ret[k][l] = obj[k][l];
      }
    } else {
      ret[k] = obj[k];
    }
  }
  return ret;
}

function transformValue(val: string) {
  const ret = __DECRYPTAPI__.decrypt(val);
  return ret;
}

const useInvoiceStore = defineStore("invoice", {
  state: () => ({
    invoices: [],
    languages: [],
    devises: [],
    sellers: [],
    buyers: [],
    payments: [],
    orders: [],
  }),
  getters: {
    getInvoices(state) {
      return state.invoices;
    },
    getLanguages(state) {
      return state.languages;
    },
    getDevises(state) {
      return state.devises;
    },
    getSellers(state) {
      return state.sellers;
    },
    getBuyers(state) {
      return state.buyers;
    },
    getPayments(state) {
      return state.payments;
    },
    getOrders(state) {
      return state.orders;
    },
  },
  actions: {
    getAllInvoices() {
      // console.log("Login...");
      return new Promise((resolve, reject) => {
        invoiceAxiosService
          .getAll()
          .then(async (res) => {
            // console.log(res);
            if (res.data.length) {
              const dataClear = await transformObject(res.data);
              this.invoices = dataClear;
              // console.log(dataClear);
              resolve(dataClear);
            } else {
              reject(false);
            }
          })
          .catch((err) => {
            // La requête a été faite et le code de
            //   réponse du serveur n'est pas dans la plage 2xx
            if (err.response) {
              console.log(err.response.data);
              console.log(err.response.status);
              console.log(err.response.headers);
            }
            // La requête a été  faite mais aucune réponse
            //  n'a été ruçue `error.request` est une instance de
            //  XMLHttpRequest dans le navigateur et une instance
            //  de http.ClientRequest avec node.js
            else if (err.request) {
              console.log(err.request);
            }
            // Quelque chose s'est passé lors de la construction de
            //  la requête et cela a provoqué une erreur
            else {
              console.log("Error", err.message);
            }
            console.log(err.config);
            reject(new Error(err));
          });
      });
    },
    getMoreInvoices(ids: number[]) {
      // console.log("Login...");
      return new Promise((resolve, reject) => {
        invoiceAxiosService
          .getMore(ids)
          .then(async (res) => {
            // console.log(res);
            if (res.data.length) {
              const dataClear = await transformObject(res.data);
              this.invoices = dataClear;
              // console.log(dataClear);
              resolve(dataClear);
            } else {
              reject(false);
            }
          })
          .catch((err) => {
            // La requête a été faite et le code de
            //   réponse du serveur n'est pas dans la plage 2xx
            if (err.response) {
              console.log(err.response.data);
              console.log(err.response.status);
              console.log(err.response.headers);
            }
            // La requête a été  faite mais aucune réponse
            //  n'a été ruçue `error.request` est une instance de
            //  XMLHttpRequest dans le navigateur et une instance
            //  de http.ClientRequest avec node.js
            else if (err.request) {
              console.log(err.request);
            }
            // Quelque chose s'est passé lors de la construction de
            //  la requête et cela a provoqué une erreur
            else {
              console.log("Error", err.message);
            }
            console.log(err.config);
            reject(new Error(err));
          });
      });
    },
    getAllLanguages() {
      // console.log("Login...");
      return new Promise((resolve, reject) => {
        invoiceAxiosService
          .getAllLanguages()
          .then(async (res) => {
            // console.log(res);
            if (res.data.length) {
              // const dataClear = await transformObject(res.data);
              this.languages = res.data;
              // console.log(dataClear);
              resolve(res.data);
            } else {
              reject(false);
            }
          })
          .catch((err) => {
            // La requête a été faite et le code de
            //   réponse du serveur n'est pas dans la plage 2xx
            if (err.response) {
              console.log(err.response.data);
              console.log(err.response.status);
              console.log(err.response.headers);
            }
            // La requête a été  faite mais aucune réponse
            //  n'a été ruçue `error.request` est une instance de
            //  XMLHttpRequest dans le navigateur et une instance
            //  de http.ClientRequest avec node.js
            else if (err.request) {
              console.log(err.request);
            }
            // Quelque chose s'est passé lors de la construction de
            //  la requête et cela a provoqué une erreur
            else {
              console.log("Error", err.message);
            }
            console.log(err.config);
            reject(new Error(err));
          });
      });
    },
    getAllDevises() {
      // console.log("Login...");
      return new Promise((resolve, reject) => {
        invoiceAxiosService
          .getAllDevises()
          .then(async (res) => {
            // console.log(res);
            if (res.data.length) {
              // const dataClear = await transformObject(res.data);
              this.devises = res.data;
              // console.log(dataClear);
              resolve(res.data);
            } else {
              reject(false);
            }
          })
          .catch((err) => {
            // La requête a été faite et le code de
            //   réponse du serveur n'est pas dans la plage 2xx
            if (err.response) {
              console.log(err.response.data);
              console.log(err.response.status);
              console.log(err.response.headers);
            }
            // La requête a été  faite mais aucune réponse
            //  n'a été ruçue `error.request` est une instance de
            //  XMLHttpRequest dans le navigateur et une instance
            //  de http.ClientRequest avec node.js
            else if (err.request) {
              console.log(err.request);
            }
            // Quelque chose s'est passé lors de la construction de
            //  la requête et cela a provoqué une erreur
            else {
              console.log("Error", err.message);
            }
            console.log(err.config);
            reject(new Error(err));
          });
      });
    },
    getAllOrders() {
      // console.log("Login...");
      return new Promise((resolve, reject) => {
        invoiceAxiosService
          .getAllOrders()
          .then(async (res) => {
            // console.log(res);
            if (res.data.length) {
              const dataClear = await transformObject(res.data);
              this.orders = dataClear;
              // console.log(dataClear);
              resolve(dataClear);
            } else {
              reject(false);
            }
          })
          .catch((err) => {
            // La requête a été faite et le code de
            //   réponse du serveur n'est pas dans la plage 2xx
            if (err.response) {
              console.log(err.response.data);
              console.log(err.response.status);
              console.log(err.response.headers);
            }
            // La requête a été  faite mais aucune réponse
            //  n'a été ruçue `error.request` est une instance de
            //  XMLHttpRequest dans le navigateur et une instance
            //  de http.ClientRequest avec node.js
            else if (err.request) {
              console.log(err.request);
            }
            // Quelque chose s'est passé lors de la construction de
            //  la requête et cela a provoqué une erreur
            else {
              console.log("Error", err.message);
            }
            console.log(err.config);
            reject(new Error(err));
          });
      });
    },
    getAllSellers() {
      // console.log("Login...");
      return new Promise((resolve, reject) => {
        invoiceAxiosService
          .getAllSellers()
          .then(async (res) => {
            // console.log(res);
            if (res.data.length) {
              const dataClear = await transformObject(res.data);
              this.sellers = dataClear;
              // console.log(dataClear);
              resolve(dataClear);
            } else {
              reject(false);
            }
          })
          .catch((err) => {
            // La requête a été faite et le code de
            //   réponse du serveur n'est pas dans la plage 2xx
            if (err.response) {
              console.log(err.response.data);
              console.log(err.response.status);
              console.log(err.response.headers);
            }
            // La requête a été  faite mais aucune réponse
            //  n'a été ruçue `error.request` est une instance de
            //  XMLHttpRequest dans le navigateur et une instance
            //  de http.ClientRequest avec node.js
            else if (err.request) {
              console.log(err.request);
            }
            // Quelque chose s'est passé lors de la construction de
            //  la requête et cela a provoqué une erreur
            else {
              console.log("Error", err.message);
            }
            console.log(err.config);
            reject(new Error(err));
          });
      });
    },
    getAllBuyers() {
      // console.log("Login...");
      return new Promise((resolve, reject) => {
        invoiceAxiosService
          .getAllBuyers()
          .then(async (res) => {
            // console.log(res);
            if (res.data.length) {
              const dataClear = await transformObject(res.data);
              this.buyers = dataClear;
              // console.log(dataClear);
              resolve(dataClear);
            } else {
              reject(false);
            }
          })
          .catch((err) => {
            // La requête a été faite et le code de
            //   réponse du serveur n'est pas dans la plage 2xx
            if (err.response) {
              console.log(err.response.data);
              console.log(err.response.status);
              console.log(err.response.headers);
            }
            // La requête a été  faite mais aucune réponse
            //  n'a été ruçue `error.request` est une instance de
            //  XMLHttpRequest dans le navigateur et une instance
            //  de http.ClientRequest avec node.js
            else if (err.request) {
              console.log(err.request);
            }
            // Quelque chose s'est passé lors de la construction de
            //  la requête et cela a provoqué une erreur
            else {
              console.log("Error", err.message);
            }
            console.log(err.config);
            reject(new Error(err));
          });
      });
    },
    getAllPayments() {
      // console.log("Login...");
      return new Promise((resolve, reject) => {
        invoiceAxiosService
          .getAllPayments()
          .then(async (res) => {
            // console.log(res);
            if (res.data.length) {
              // const dataClear = await transformObject(res.data);
              this.payments = res.data;
              // console.log(res.data);
              resolve(res.data);
            } else {
              reject(false);
            }
          })
          .catch((err) => {
            // La requête a été faite et le code de
            //   réponse du serveur n'est pas dans la plage 2xx
            if (err.response) {
              console.log(err.response.data);
              console.log(err.response.status);
              console.log(err.response.headers);
            }
            // La requête a été  faite mais aucune réponse
            //  n'a été ruçue `error.request` est une instance de
            //  XMLHttpRequest dans le navigateur et une instance
            //  de http.ClientRequest avec node.js
            else if (err.request) {
              console.log(err.request);
            }
            // Quelque chose s'est passé lors de la construction de
            //  la requête et cela a provoqué une erreur
            else {
              console.log("Error", err.message);
            }
            console.log(err.config);
            reject(new Error(err));
          });
      });
    },
  },
});

// make sure to pass the right store definition, `useAuth` in this case.
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useInvoiceStore, import.meta.hot));
}

export { useInvoiceStore };
