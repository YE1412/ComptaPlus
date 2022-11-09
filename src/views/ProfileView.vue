<script lang="ts">
import { defineComponent } from "vue";
import TheToolbarIn from "../components/TheToolbarIn.vue";
import { useUserStore } from "@/stores/user";

export default defineComponent({
  name: "ProfileView",
  setup() {
    const store = useUserStore();
    return { store };
  },
  components: {
    TheToolbarIn,
  },
});
</script>
<template>
  <main>
    <TheToolbarIn />
  </main>
</template>
