// import { ref } from "vue";
import { defineStore, acceptHMRUpdate } from "pinia";
import userAxiosService from "../services/user.service";
import i18n from "../plugins/i18n";
import { useStorage } from "@vueuse/core";

const { t } = i18n.global;
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
    euroPrice: [],
    dollarPrice: [],
    livrePrice: [],
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
  },
});

// make sure to pass the right store definition, `useCounterStore` in this case.
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCounterStore, import.meta.hot));
}

export { useCounterStore };
