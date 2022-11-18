<script lang="ts">
import { defineComponent } from "vue";
import TheToolbarIn from "../components/TheToolbarIn.vue";
import Sidenav from "../components/Sidenav.vue";
import { useUserStore } from "@/stores/user";
import { useCounterStore } from "@/stores/counter";
import ExportContent from "../components/ExportContent.vue";
export default defineComponent({
  name: "ExportView",
  setup() {
    const userStore = useUserStore();
    const counterStore = useCounterStore();
    return { userStore, counterStore };
  },
  components: {
    TheToolbarIn,
    Sidenav,
    ExportContent
  },
});
</script>
<template>
  <main>
    <TheToolbarIn />
    <Sidenav />
    <div class="content">
      <ExportContent />
    </div>
  </main>
</template>
