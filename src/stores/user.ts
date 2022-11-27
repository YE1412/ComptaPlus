// import { ref, computed } from "vue";
import { defineStore, acceptHMRUpdate } from "pinia";
import userAxiosService from "../services/user.service";
import { decryptMod } from "../WasmModules";
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

const useUserStore = defineStore("user", {
  state: () => ({
    connected: useStorage("connected", false),
    user: useStorage("user", {}),
  }),
  getters: {
    getConnected(state) {
      return state.connected;
    },
    getUser(state) {
      return state.user;
    },
  },
  actions: {
    loginUser(login: string, password: string) {
      // console.log("Login...");
      return new Promise((resolve, reject) => {
        userAxiosService
          .get(login, password)
          .then(async (res) => {
            // console.log(res);
            if (res.data.length) {
              // console.log(res.data);
              const dataClear = await transformObject(res.data);
              this.user = dataClear[0];
              resolve(dataClear[0]);
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
    retrieveUser(id: number) {
      return new Promise((resolve, reject) => {
        userAxiosService
          .retrieve(id)
          .then(async (res) => {
            // console.log(res);
            if (res.data.length) {
              // console.log(res.data);
              const dataClear = await transformObject(res.data);
              this.user = dataClear[0];
              resolve(dataClear[0]);
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
    resetUser() {
      this.user = {};
      this.connected = false;
    },
  },
});

// make sure to pass the right store definition, `useAuth` in this case.
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}

export { useUserStore };
