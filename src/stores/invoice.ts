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

async function transformObjectWithRecall(obj: any) {
  await define();
  let ret: any;
  if (typeof obj === "string") {
    ret = "";
  } else if (typeof obj === "object" && !Array.isArray(obj)) {
    ret = {};
  } else {
    ret = [];
  }
  for (const k in obj) {
    if (
      typeof obj[k] === "string" &&
      k !== "date" &&
      k !== "langue" &&
      k !== "devise"
    ) {
      ret[k] = __DECRYPTAPI__.decrypt(obj[k]);
    } else if (
      typeof obj[k] === "object" &&
      !Array.isArray(obj[k]) &&
      k !== "langue" &&
      k !== "devise"
    ) {
      if (obj[k] === null) ret[k] = null;
      else ret[k] = await transformObjectWithRecall(obj[k]);
    } else if (Array.isArray(obj[k])) {
      ret[k] = await transformObjectWithRecall(obj[k]);
    } else ret[k] = obj[k];
  }
  // console.log(ret);
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
              const dataClear = await transformObjectWithRecall(res.data);
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
      return new Promise((resolve, reject) => {
        invoiceAxiosService
          .getMore(ids)
          .then(async (res) => {
            // console.log(res);
            if (res.data.length) {
              const dataClear = await transformObjectWithRecall(res.data);
              // console.log(dataClear);
              this.invoices = dataClear;
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
              const dataClear = await transformObjectWithRecall(res.data);
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
              const dataClear = await transformObjectWithRecall(res.data);
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
              const dataClear = await transformObjectWithRecall(res.data);
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
