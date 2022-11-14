// import { ref, computed } from "vue";
import { defineStore, acceptHMRUpdate } from "pinia";
import { useStorage } from "@vueuse/core";

const useMessageStore = defineStore("message", {
  state: () => ({
    messages: useStorage("messages", []),
    messagesVisibility: useStorage("messagesVisibility", false),
  }),
  getters: {
    getMessages(state) {
      return state.messages;
    },
    getMessagesVisibility(state) {
      return state.messagesVisibility;
    },
  },
  actions: {
    deleteMessages() {
      this.messages = [];
      this.messagesVisibility = false;
    },
  },
});

// make sure to pass the right store definition, `useAuth` in this case.
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMessageStore, import.meta.hot));
}

export { useMessageStore };
