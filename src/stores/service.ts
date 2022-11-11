// import { ref, computed } from "vue";
import { defineStore, acceptHMRUpdate } from "pinia";
import serviceAxiosService from "../services/service.service";
import { genMod, cryptMod, decryptMod } from "../WasmModules";
import { useStorage } from "@vueuse/core";

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
    if (typeof obj[k] === "string") {
      ret[k] = __DECRYPTAPI__.decrypt(obj[k]);
    } else if (typeof obj[k] === "object" && !Array.isArray(obj[k])) {
      ret[k] = {};
      for (const l in obj[k]) {
        if (typeof obj[k][l] === "string")
          ret[k][l] = __DECRYPTAPI__.decrypt(obj[k][l]);
        else ret[k][l] = obj[k][l];
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

const useServiceStore = defineStore("service", {
  state: () => ({
    services: [],
    messages: useStorage("messages", []),
    messagesVisibility: useStorage("messagesVisibility", false),
  }),
  getters: {
    getServices(state) {
      return state.services;
    },
    getMessages(state) {
      return state.messages;
    },
    getMessagesVisibility(state) {
      return state.messagesVisibility;
    },
  },
  actions: {
    getAllServices() {
      // console.log("Login...");
      return new Promise((resolve, reject) => {
        serviceAxiosService
          .getAll()
          .then(async (res) => {
            // console.log(res);
            if (res.data.length) {
              const dataClear = await transformObject(res.data);
              this.services = dataClear;
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
    deleteMessages() {
      this.messages = [];
      this.messagesVisibility = false;
    },
  },
});

// make sure to pass the right store definition, `useAuth` in this case.
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useServiceStore, import.meta.hot));
}

export { useServiceStore };