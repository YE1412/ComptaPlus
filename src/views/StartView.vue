<script lang="ts">
import { defineComponent } from "vue";
import TheToolbarOut from "../components/TheToolbarOut.vue";
import StartContent from "../components/StartContent.vue";
import { useUserStore } from "@/stores/user";
import { useSessionStore } from "@/stores/session";
import { useCounterStore } from "@/stores/counter";

export default defineComponent({
  name: "StartView",
  setup() {
    const userStore = useUserStore();
    const sessionStore = useSessionStore();
    const counterStore = useCounterStore();
    return { userStore, sessionStore, counterStore };
  },
  mounted() {
    // this.sessionStore
    //   .getSession()
    //   .then(
    //     (res) => {
    //       this.sessionId = res;
    //     },
    //     (ret) => {}
    //   )
    //   .catch((err) => {});
  },
  data() {
    // console.log(this.$i18n.locale);
    this.$i18n.locale =
      this.counterStore.getLanguages[
        this.counterStore.getLangDisplayedIndex
      ].lang;
    // console.log(this.$i18n.locale);
    // console.log(this.counterStore.getLangDisplayedIndex);
    return {
      sessionId: "",
    };
  },
  components: {
    TheToolbarOut,
    StartContent,
  },
});
</script>
<template>
  <main style="height: 100%">
    <TheToolbarOut />
    <StartContent />
  </main>
</template>
