// import { ref, computed } from "vue";
import { defineStore, acceptHMRUpdate } from "pinia";
import serviceAxiosService from "../services/service.service";
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
    } else ret[k] = obj[k];
  }
  // console.log(ret);
  return ret;
}

const useServiceStore = defineStore("service", {
  state: () => ({
    services: [],
  }),
  getters: {
    getServices(state) {
      return state.services;
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
  },
});

// make sure to pass the right store definition, `useAuth` in this case.
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useServiceStore, import.meta.hot));
}

export { useServiceStore };
