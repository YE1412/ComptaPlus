<script lang="ts">
import { defineComponent } from "vue";
// import router from "@/router/index";
// import { RouterLink } from "vue-router";
import { useUserStore } from "@/stores/user";
import { useCounterStore } from "@/stores/counter";
import OrgChart from "./OrgChart.vue";

export default defineComponent({
  name: "AboutContent",
  setup() {
    const usrStore = useUserStore();
    const cntStore = useCounterStore();

    return {
      userStore: usrStore,
      counterStore: cntStore,
    };
  },
  components: {
    OrgChart,
  },
});
</script>

<template>
  <div class="container d-flex flex-column mb-lg-5 mb-xl-5">
    <OrgChart/>
  </div>
</template>
