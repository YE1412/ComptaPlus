<script lang="ts">
import { defineComponent } from "vue";
import TheWelcome from "../components/TheWelcome.vue";
import TheToolbarIn from "../components/TheToolbarIn.vue";
import { useUserStore } from "@/stores/user";
import { RouterLink, RouterView } from "vue-router";

export default defineComponent({
  name: "HomeView",
  setup() {
    const store = useUserStore();

    return { store };
  },
  components: {
    TheWelcome,
    TheToolbarIn,
    // TheToolbarOut,
  },
});
</script>
<template>
  <main>
    <TheToolbarIn />
    <TheWelcome />
    <RouterLink to="/a-propos"> A-propos </RouterLink>
  </main>
</template>
