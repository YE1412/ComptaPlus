<script lang="ts">
import { defineComponent, Suspense, ref, nextTick } from "vue";
import TheToolbarIn from "../components/TheToolbarIn.vue";
import Sidenav from "../components/Sidenav.vue";
import { useUserStore } from "@/stores/user";
import { useSessionStore } from "@/stores/session";
import ActorContent from "../components/ActorContent.vue";

const renderComponent = ref(true);

export default defineComponent({
  name: "ActorsView",
  setup() {
    const userStore = useUserStore();
    const sessionStore = useSessionStore();
    return { userStore, sessionStore };
  },
  components: {
    TheToolbarIn,
    Sidenav,
    Suspense,
    ActorContent,
  },
  data() {
    return {
      renderComponent: true,
      adminActor: true,
      displayActor: false,
    };
  },
  methods: {
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
        case "actors":
          this.adminActor = true;
          this.displayActor = false;
          break;
        default:
          break;
      }
      this.forceServiceRerender();
    },
    handleDisplay(src: string) {
      // console.log(`Display ServiceView - ${src}`);
      switch (src) {
        case "actors":
          this.displayActor = true;
          this.adminActor = false;
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
      :actorsState="true"
      @show-admin="handleAdmin"
      @show-display="handleDisplay"
    />
    <div class="content">
      <Suspense>
        <ActorContent
          v-if="renderComponent"
          :admin="adminActor"
          :display="displayActor"
        />
        <template #fallback> Loading... </template>
      </Suspense>
    </div>
  </main>
</template>
