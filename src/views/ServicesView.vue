<script lang="ts">
import { defineComponent, Suspense } from "vue";
import TheToolbarIn from "../components/TheToolbarIn.vue";
import Sidenav from "../components/Sidenav.vue";
import ServiceContent from "../components/ServiceContent.vue";
import { useUserStore } from "@/stores/user";
import { useSessionStore } from "@/stores/session";

export default defineComponent({
  name: "ServicesView",
  setup() {
    const userStore = useUserStore();
    const sessionStore = useSessionStore();
    return { userStore, sessionStore };
  },
  components: {
    TheToolbarIn,
    Sidenav,
    ServiceContent,
    Suspense,
  },
  mounted() {
    // console.log(this.sessionStore.getSessionId);
    this.validateSession()
      .then(
        (res) => {
          // console.log(res);
        },
        (rej) => {
          // console.log(rej);
          this.$router.push(this.$i18n.t("startLinkTarget"));
        }
      )
      .catch((err) => {
        console.log(err);
        this.$router.push(this.$i18n.t("startLinkTarget"));
      });
  },
  methods: {
    validateSession() {
      return this.sessionStore.validateSession();
    },
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
        <template #fallback> Loading... </template>
      </Suspense>
    </div>
  </main>
</template>
