<script lang="ts">
import { defineComponent, Suspense, ref, nextTick } from "vue";
import TheToolbarIn from "../components/TheToolbarIn.vue";
import Sidenav from "../components/Sidenav.vue";
import ServiceContent from "../components/ServiceContent.vue";
import { useUserStore } from "@/stores/user";
import { useSessionStore } from "@/stores/session";
const renderComponent = ref(true);
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
    // this.validateSession()
    // .then(
    //   (res) => {
    //     // console.log(res);
    //   },
    //   (rej) => {
    //     // console.log(rej);
    //     this.$router.push(this.$i18n.t("startLinkTarget"));
    //   }
    // )
    // .catch((err) => {
    //   console.log(err);
    //   this.$router.push(this.$i18n.t("startLinkTarget"));
    // });
  },
  data() {
    return {
      renderComponent: true,
      adminService: true,
      displayService: false,
    };
  },
  methods: {
    // validateSession() {
    //   return this.sessionStore.validateSession();
    // },
    async forceServiceRerender() {
      // Remove MyComponent from the DOM
      this.renderComponent = false;

      // Wait for the change to get flushed to the DOM
      await this.$nextTick();

      // Add the component back in
      this.renderComponent = true;
    },
    handleAdmin(src: string) {
      switch (src) {
        case "services":
          this.adminService = true;
          this.displayService = false;
          break;
        default:
          break;
      }
      this.forceServiceRerender();
    },
    handleDisplay(src: string) {
      // console.log(`Display ServiceView - ${src}`);
      switch (src) {
        case "services":
          this.displayService = true;
          this.adminService = false;
          break;
        default:
          break;
      }
      this.forceServiceRerender();
    },
  },
});
</script>
<template>
  <main>
    <TheToolbarIn @language-changed-re-render="forceServiceRerender" />
    <Sidenav
      :servicesState="true"
      @show-admin="handleAdmin"
      @show-display="handleDisplay"
    />
    <div class="content">
      <Suspense>
        <ServiceContent
          v-if="renderComponent"
          :admin="adminService"
          :display="displayService"
        />
        <template #fallback> Loading... </template>
      </Suspense>
    </div>
  </main>
</template>
