// import { ref } from "vue";
import { defineStore, acceptHMRUpdate } from "pinia";
import userAxiosService from "../services/user.service";
import i18n from "../plugins/i18n";
import { useStorage } from "@vueuse/core";

const { t } = i18n.global;
const useCounterStore = defineStore("counter", {
  // const count = ref(0);
  // const doubleCount = computed(() => count.value * 2);
  // function increment() {
  //   count.value++;
  // },
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
  }),
  getters: {
    getCount(state) {
      return state.count;
    },
    getLanguages(state) {
      return state.languages;
    },
    getLangDisplayedIndex(state) {
      return state.langDisplayedIndex;
    },
  },
  actions: {},
  // return { count, doubleCount, increment, connected };
});

// make sure to pass the right store definition, `useAuth` in this case.
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCounterStore, import.meta.hot));
}

export { useCounterStore };
