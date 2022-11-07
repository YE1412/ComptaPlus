<script lang="ts">
import { RouterLink, RouterView } from "vue-router";
// import HelloWorld from "./components/HelloWorld.vue";
import { defineComponent } from "vue";
// import i18n from "@/plugins/i18n";
// import { useI18n } from 'vue-i18n'
import logoURL from "@/assets/logo.svg";
// import { useUserStore } from "@/stores/user";
// import TheToolbarIn from "./components/TheToolbarIn.vue";
// import TheToolbarOut from "./components/TheToolbarOut.vue";
// const { t } = i18n.global;
export default defineComponent({
  name: "App",
  // setup() {
  //   const store = useUserStore();

  //   return { store };
  // },
  data() {
    // console.log(i18n.global);
    return {
      logoURL,
    };
  },
  components: {
    // HelloWorld,
    // RouterLink,
    RouterView,
    // TheToolbarOut,
    // TheToolbarIn,
  },
  watch: {
    $route: {
      handler(newR, old) {
        document.title = `Easy-Compta - ${newR.meta.title}`;
        const link = document.querySelector("[rel='icon']") as Element;
        link.setAttribute("href", `${newR.meta.icon}`);
      },
      immediate: true,
    },
  },
  // methods: {
  //   changeLocale(locale: WritableComputedRef<"fr" | "en">) {
  //     this.locale = locale;
  //   },
  //   async register(login: string, password: string, e: Event) {
  //     this.store
  //       .registerUser(login, password)
  //       .then(
  //         (res) => {
  //           this.store.connected = true;
  //           this.store.user = res;
  //           console.log(this.store);
  //         },
  //         () => {
  //           this.store.connected = false;
  //           console.log(this.store);
  //         }
  //       )
  //       .catch((err) => {
  //         this.store.connected = false;
  //         console.log(this.store);
  //       });
  //   },
  // },
  // mounted() {
  //   console.log(`the component is now mounted.`);
  // },
});
</script>

<template>
  <!-- <TheToolbarIn v-if="store.getConnected" />
  <TheToolbarOut v-else /> -->
  <!-- <header v-if="store.getConnected">
    <img alt="Vue logo" class="logo" :src="logoURL" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld
        :msg="$t('helloWorldMsg.msg', { login: store.getUser.login })"
      />

      <nav>
        <RouterLink to="/">{{ $t("homeLinkName") }}</RouterLink>
        <RouterLink :to="$t('aboutLinkTarget')">{{
          $t("aboutLinkName")
        }}</RouterLink>
      </nav>
    </div>
  </header> -->
  <RouterView />
  <!-- <div class="wrapper" v-else>
    Not Connected
    <button @click="register('aLogin', 'aPass', $event)">
      Connect with 'aLogin' 'aPass'
    </button>
  </div> -->
  <!-- <RouterView /> -->
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
