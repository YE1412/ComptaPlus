<script lang="ts">
import { defineComponent } from "vue";
import TheToolbarOut from "../components/TheToolbarOut.vue";
import RegisterContent from "../components/RegisterContent.vue";
import { useUserStore } from "@/stores/user";

export default defineComponent({
  name: "RegisterView",
  setup() {
    const store = useUserStore();

    return { store };
  },
  components: {
    TheToolbarOut,
    RegisterContent,
  }
});
</script>
<template>
  <main>
    <TheToolbarOut />
    <RegisterContent />
  </main>
</template>
