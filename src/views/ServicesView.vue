<script lang="ts">
import { defineComponent } from "vue";
import TheToolbarIn from "../components/TheToolbarIn.vue";
import Sidenav from "../components/Sidenav.vue";
import ServiceContent from "../components/ServiceContent.vue";
import { useUserStore } from "@/stores/user";

export default defineComponent({
  name: "ServicesView",
  setup() {
    const store = useUserStore();
    return { store };
  },
  components: {
    TheToolbarIn,
    Sidenav,
    ServiceContent,
  },
});
</script>
<template>
  <main>
    <TheToolbarIn />
    <Sidenav :servicesState="true" />
    <ServiceContent />
  </main>
</template>
