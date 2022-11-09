<script lang="ts">
import { defineComponent } from "vue";
import TheWelcome from "../components/TheWelcome.vue";
import TheToolbarIn from "../components/TheToolbarIn.vue";
import Sidenav from "../components/Sidenav.vue";
import { useUserStore } from "@/stores/user";
import { RouterLink } from "vue-router";

export default defineComponent({
  name: "HomeView",
  setup() {
    const store = useUserStore();

    return { store };
  },
  components: {
    TheWelcome,
    TheToolbarIn,
    Sidenav,
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
