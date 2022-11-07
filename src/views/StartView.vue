<script lang="ts">
import { defineComponent } from "vue";
import TheToolbarOut from "../components/TheToolbarOut.vue";
import StartContent from "../components/StartContent.vue";
import { useUserStore } from "@/stores/user";

export default defineComponent({
  name: "StartView",
  setup() {
    const store = useUserStore();

    return { store };
  },
  components: {
    TheToolbarOut,
    StartContent,
  }
});
</script>
<template>
  <main>
    <TheToolbarOut />
    <StartContent />
  </main>
</template>
