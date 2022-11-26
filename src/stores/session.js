// import { ref, computed } from "vue";
import { defineStore, acceptHMRUpdate } from "pinia";
import sessionAxiosService from "../services/session.service";
import { useStorage } from "@vueuse/core";
const useSessionStore = defineStore("session", {
  state: () => ({
    sessionId: useStorage("sessionId", ""),
  }),
  getters: {
    getSessionId(state) {
      return state.sessionId;
    },
  },
  actions: {
    getSession() {
      // console.log("Login...");
      return new Promise((resolve, reject) => {
        sessionAxiosService
          .get()
          .then((res) => {
            // console.log(res);
            if (res.data.id) {
              // Insertion session en BDD
              this.sessionId = res.data.id;
              resolve(res.data.id);
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
            reject(err);
          });
      });
    },
    validateSession() {
      return new Promise((resolve, reject) => {
        sessionAxiosService
          .validate(this.sessionId)
          .then(() => {
            resolve(true);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    deleteSession() {
      // this.sessionId = null;
      return sessionAxiosService
        .delete()
        .then((res) => {
          return res;
        })
        .catch((err) => {
          return err;
        });
    },
  },
});
// make sure to pass the right store definition, `useAuth` in this case.
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSessionStore, import.meta.hot));
}
export { useSessionStore };
