<script lang="ts">
import { defineComponent } from "vue";
import TheToolbarOut from "../components/TheToolbarOut.vue";
import StartContent from "../components/StartContent.vue";
import { useUserStore } from "@/stores/user";
import { useSessionStore } from "@/stores/session";

export default defineComponent({
  name: "StartView",
  setup() {
    const userStore = useUserStore();
    const sessionStore = useSessionStore();
    return { userStore, sessionStore };
  },
  mounted() {
    this.sessionStore
      .getSession()
      .then(
        (res) => {
          this.sessionId = res;
        },
        (ret) => {}
      )
      .catch((err) => {});
  },
  data() {
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
  <main>
    <TheToolbarOut />
    <StartContent />
  </main>
</template>
