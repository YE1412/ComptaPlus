<script lang="ts">
import { defineComponent, Suspense, ref, nextTick } from "vue";
import TheToolbarIn from "../components/TheToolbarIn.vue";
import Sidenav from "../components/Sidenav.vue";
import { useUserStore } from "@/stores/user";
import { useSessionStore } from "@/stores/session";
import OrderContent from "../components/OrderContent.vue";
import FooterIn from "../components/Footer.vue";

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
      orderForm: false,
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
          this.orderForm = false;
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
          this.orderForm = false;
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
    FooterIn,
  },
  watch: {
    $route: {
      async handler(newR, old) {
        // console.log(newR.query);
        if (newR.query.admin !== undefined) {
          this.adminOrder = newR.query.admin === "true" ? true : false;
          this.orderForm = this.adminOrder;
        }
      },
      immediate: true,
    },
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
          :orderForm="orderForm"
          :admin="adminOrder"
          :display="displayOrder"
        />
        <template #fallback> Loading... </template>
      </Suspense>
    </div>
    <FooterIn />
  </main>
</template>
