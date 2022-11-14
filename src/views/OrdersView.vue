<script lang="ts">
import { defineComponent, Suspense, ref, nextTick } from "vue";
import TheToolbarIn from "../components/TheToolbarIn.vue";
import Sidenav from "../components/Sidenav.vue";
import { useUserStore } from "@/stores/user";
import { useSessionStore } from "@/stores/session";
import OrderContent from "../components/OrderContent.vue";

const renderComponent = ref(true);

export default defineComponent({
  name: "OrdersView",
  setup() {
    const store = useUserStore();

    return { store };
  },
  data() {
    return {
      renderComponent: true,
      adminOrder: true,
      displayOrder: false,
    };
  },
  methods: {
    async forceOrderRerender() {
      // Remove MyComponent from the DOM
      this.renderComponent = false;

      // Wait for the change to get flushed to the DOM
      await this.$nextTick();

      // Add the component back in
      this.renderComponent = true;
    },
    handleAdmin(src: string) {
      switch (src) {
        case "orders":
          this.adminOrder = true;
          this.displayOrder = false;
          break;
        default:
          break;
      }
      this.forceOrderRerender();
    },
    handleDisplay(src: string) {
      // console.log(`Display ServiceView - ${src}`);
      switch (src) {
        case "orders":
          this.displayOrder = true;
          this.adminOrder = false;
          break;
        default:
          break;
      }
      this.forceOrderRerender();
    },
  },
  components: {
    TheToolbarIn,
    Sidenav,
    OrderContent,
    Suspense,
  },
});
</script>
<template>
  <main>
    <TheToolbarIn @language-changed-re-render="forceOrderRerender" />
    <Sidenav
      :ordersState="true"
      @show-admin="handleAdmin"
      @show-display="handleDisplay"
    />
    <div class="content">
      <Suspense>
        <OrderContent
          v-if="renderComponent"
          :admin="adminOrder"
          :display="displayOrder"
        />
        <template #fallback> Loading... </template>
      </Suspense>
    </div>
  </main>
</template>
