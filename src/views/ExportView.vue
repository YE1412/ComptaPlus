<script lang="ts">
import { defineComponent, Suspense } from "vue";
import { RouterView } from "vue-router";
import TheToolbarIn from "../components/TheToolbarIn.vue";
import Sidenav from "../components/Sidenav.vue";
import { useUserStore } from "@/stores/user";
import { useCounterStore } from "@/stores/counter";
import ExportContent from "../components/ExportContent.vue";
import FooterIn from "../components/Footer.vue";

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
    ExportContent,
    RouterView,
    Suspense,
    FooterIn,
  },
});
</script>
<template>
  <main>
    <TheToolbarIn />
    <Sidenav />
    <div class="content">
      <Suspense>
        <ExportContent />
      </Suspense>
      <Suspense>
        <RouterView />
      </Suspense>
    </div>
    <FooterIn />
  </main>
</template>
