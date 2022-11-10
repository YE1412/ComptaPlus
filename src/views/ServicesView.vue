<script lang="ts">
import { defineComponent, Suspense } from "vue";
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
    Suspense
  },
});
</script>
<template>
  <main>
    <TheToolbarIn />
    <Sidenav :servicesState="true" />
    <div class="content">
      <Suspense>
        <ServiceContent />
        <template #fallback>
          Loading...
        </template>
      </Suspense>
    </div>
  </main>
</template>
