<script lang="ts">
import { RouterView } from "vue-router";
import { defineComponent } from "vue";
import logoURL from "@/assets/logo.svg";
import "@/assets/mdb/css/style.css";
import { useSessionStore } from "@/stores/session";
import { useCounterStore } from "@/stores/counter";

export default defineComponent({
  name: "App",
  setup() {
    const sessionStore = useSessionStore();
    const counterStore = useCounterStore();
    return {
      sessionStore,
      counterStore,
    };
  },
  data() {
    this.$i18n.locale =
      this.counterStore.getLanguages[
        this.counterStore.getLangDisplayedIndex
      ].lang;
    return {
      logoURL,
    };
  },
  components: {
    RouterView,
  },
  watch: {
    $route: {
      handler(newR, old) {
        if (!import.meta.env.SSR)
        {
          document.title = `Easy-Compta - ${newR.meta.title}`;
          const link = document.querySelector("[rel='icon']") as Element;
          link.setAttribute("href", `${newR.meta.icon}`);
        }
      },
      immediate: true,
    },
  },
  methods: {
    // validateSession() {
    //   return this.sessionStore.validateSession();
    // },
  },
  mounted() {
    //   console.log(`the component is now mounted.`);
  },
});
</script>

<template>
  <RouterView />
</template>

<!-- <style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style> -->
