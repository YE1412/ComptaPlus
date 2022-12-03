// import { ref } from "vue";
import { defineStore, acceptHMRUpdate } from "pinia";
import userAxiosService from "../services/user.service";
import invoiceAxiosService from "../services/invoice.service";
import i18n from "../plugins/i18n";
import { useStorage } from "@vueuse/core";
import { decryptMod } from "../WasmModules";

const { t } = i18n.global;
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
      else ret[k] = await transformObject(obj[k]);
    } else if (Array.isArray(obj[k])) {
      ret[k] = await transformObject(obj[k]);
    } else if (obj[k] === null) {
      // console.log(k);
    } else ret[k] = obj[k];
  }
  // console.log(ret);
  return ret;
}

const useCounterStore = defineStore("counter", {
  state: () => ({
    count: 0,
    languages: useStorage("languages", [
      {
        country: "France",
        lang: "fr",
        class: "fr",
        label: t("countryLabel1", "fr"),
        default: t("countryDefaultLabel1", "fr"),
      },
      {
        country: "États-Unis",
        lang: "en",
        class: "us",
        label: t("countryLabel2", "en"),
        default: t("countryDefaultLabel2", "en"),
      },
    ]),
    langDisplayedIndex: useStorage("langDisplayedIndex", 0),
    prices: [],
    htFYI: 0.0,
    ttFYI: 0.0,
    payFYI: 0.0,
    invoicesFY: [],
  }),
  getters: {
    getCount(state: any) {
      return state.count;
    },
    getLanguages(state: any) {
      return state.languages;
    },
    getLangDisplayedIndex(state: any) {
      return state.langDisplayedIndex;
    },
    getPrices(state: any) {
      return state.prices;
    },
    getEuroPrice(state: any) {
      return state.prices.find((p: any) => {
        return p.euro === 1;
      });
    },
    getDollarPrice(state: any) {
      return state.prices.find((p: any) => {
        return p.dollar === 1;
      });
    },
    getLivrePrice(state: any) {
      return state.prices.find((p: any) => {
        return p.livre === 1;
      });
    },
    getHtFYI(state: any) {
      return state.htFYI;
    },
    getTtFYI(state: any) {
      return state.ttFYI;
    },
    getPayFYI(state: any) {
      return state.payFYI;
    },
    getInvoicesFY(state: any) {
      return state.invoicesFY;
    },
  },
  actions: {
    getAllPrices() {
      return new Promise((resolve, reject) => {
        userAxiosService
          .getAllPrices()
          .then((res) => {
            // console.log(res);
            if (res.data.length) {
              this.prices = res.data;
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
    getFinancialYearInvoices(adminId: number) {
      return new Promise((resolve, reject) => {
        invoiceAxiosService
          .getFinancialYearInvoices(adminId)
          .then(async (res) => {
            // console.log(res.data);
            if (res.data.length) {
              const dataClear = await transformObject(res.data);
              this.invoicesFY = dataClear;
              resolve(dataClear);
            } else {
              resolve(false);
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

// make sure to pass the right store definition, `useCounterStore` in this case.
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCounterStore, import.meta.hot));
}

export { useCounterStore };
