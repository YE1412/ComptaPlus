<script lang="ts">
import { defineComponent, Suspense } from "vue";
import TheWelcome from "../components/TheWelcome.vue";
import TheToolbarIn from "../components/TheToolbarIn.vue";
import Sidenav from "../components/Sidenav.vue";
// import { useUserStore } from "@/stores/user";
// import { useSessionStore } from "@/stores/session";
import { useCounterStore } from "@/stores/counter";
// import { RouterLink } from "vue-router";

export default defineComponent({
  name: "HomeView",
  setup() {
    const counterStore = useCounterStore();
    return { counterStore };
  },
  components: {
    TheWelcome,
    TheToolbarIn,
    Sidenav,
    Suspense,
  },
  methods: {
    async forceHomeRerender() {
      // Remove MyComponent from the DOM
      this.renderComponent = false;

      // Wait for the change to get flushed to the DOM
      await this.$nextTick();

      // Add the component back in
      this.renderComponent = true;
    },
  },
  mounted() {},
  data() {
    this.$i18n.locale = this.counterStore.getLanguages[
        this.counterStore.getLangDisplayedIndex
      ].lang;
    return {
      renderComponent: true,
    };
  },
});
</script>
<template>
  <main>
    <TheToolbarIn @language-changed-re-render="forceHomeRerender" />
    <Sidenav />
    <div class="content">
      <Suspense>
        <TheWelcome v-if="renderComponent" />
      </Suspense>
    </div>
  </main>
</template>
