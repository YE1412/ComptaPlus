<script lang="ts">
import { defineComponent } from "vue";
import TheToolbarIn from "../components/TheToolbarIn.vue";
import Sidenav from "../components/Sidenav.vue";
import { useUserStore } from "@/stores/user";

export default defineComponent({
  name: "ActorsView",
  setup() {
    const store = useUserStore();

    return { store };
  },
  components: {
    TheToolbarIn,
    Sidenav,
  },
});
</script>
<template>
  <main>
    <TheToolbarIn />
    <Sidenav />
  </main>
</template>
