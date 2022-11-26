<script lang="ts">
import { defineComponent, Suspense } from "vue";
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
  },
});
</script>
<template>
  <main>
    <TheToolbarOut />
    <Suspense>
      <RegisterContent />
    </Suspense>
  </main>
</template>
