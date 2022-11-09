import { ref, computed } from "vue";
import { defineStore, acceptHMRUpdate } from "pinia";
import userAxiosService from "../services/user.service";

const useUserStore = defineStore("user", {
  state: () => ({
    connected: false,
    user: {},
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
          .then((res) => {
            // console.log(res);
            if (res.data.length) {
              resolve(res.data[0]);
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
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}

export { useUserStore };
