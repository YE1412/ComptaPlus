<script lang="ts">
import { defineComponent, Suspense } from "vue";
import TheWelcome from "../components/TheWelcome.vue";
import TheToolbarIn from "../components/TheToolbarIn.vue";
import Sidenav from "../components/Sidenav.vue";
import { useUserStore } from "@/stores/user";
import { useSessionStore } from "@/stores/session";
import { useCounterStore } from "@/stores/counter";
import { RouterLink } from "vue-router";

export default defineComponent({
  name: "HomeView",
  setup() {
    const userStore = useUserStore();
    const sessionStore = useSessionStore();
    const counterStore = useCounterStore();
    return { userStore, sessionStore, counterStore };
  },
  components: {
    TheWelcome,
    TheToolbarIn,
    Sidenav,
    Suspense,
  },
  methods: {},
  mounted() {},
  data() {
    this.$i18n.locale =
      this.counterStore.getLanguages[
        this.counterStore.getLangDisplayedIndex
      ].lang;
    return {};
  },
});
</script>
<template>
  <main>
    <TheToolbarIn />
    <Sidenav />
    <div class="content">
      <Suspense>
        <TheWelcome />
      </Suspense>
    </div>
  </main>
</template>
