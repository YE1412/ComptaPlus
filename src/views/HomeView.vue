<script lang="ts">
import { defineComponent } from "vue";
import TheWelcome from "../components/TheWelcome.vue";
import TheToolbarIn from "../components/TheToolbarIn.vue";
import Sidenav from "../components/Sidenav.vue";
import { useUserStore } from "@/stores/user";
import { useSessionStore } from "@/stores/session";
import { RouterLink } from "vue-router";

export default defineComponent({
  name: "HomeView",
  setup() {
    const userStore = useUserStore();
    const sessionStore = useSessionStore();
    return { userStore, sessionStore };
  },
  components: {
    TheWelcome,
    TheToolbarIn,
    Sidenav,
  },
  methods: {
    validateSession() {
      return this.sessionStore.validateSession();
    },
  },
  mounted() {
    console.log(this.sessionStore.getSessionId);
    this.validateSession()
      .then((res) => {})
      .catch((err) => {
        console.log(err);
        this.$router.push(this.$i18n.t("startLinkTarget"));
      });
  },
});
</script>
<template>
  <main>
    <TheToolbarIn />
    <Sidenav />
    <TheWelcome />
    <RouterLink to="/a-propos"> A-propos </RouterLink>
  </main>
</template>
