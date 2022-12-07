<script lang="ts">
import { defineComponent, Suspense, ref, nextTick } from "vue";
import TheToolbarIn from "../components/TheToolbarIn.vue";
import Sidenav from "../components/Sidenav.vue";
import { useUserStore } from "@/stores/user";
import { useSessionStore } from "@/stores/session";
import PaymentContent from "../components/PaymentContent.vue";
import FooterIn from "../components/Footer.vue";

// const renderComponent = ref(true);

export default defineComponent({
  name: "PaymentsView",
  setup() {
    const store = useUserStore();

    return { store };
  },
  data() {
    return {
      renderComponent: true,
      adminPayment: true,
      displayPayment: false,
      paymentForm: false,
    };
  },
  methods: {
    async forcePaymentRerender() {
      // Remove MyComponent from the DOM
      this.renderComponent = false;

      // Wait for the change to get flushed to the DOM
      await this.$nextTick();

      // Add the component back in
      this.renderComponent = true;
    },
    handleAdmin(src: string) {
      switch (src) {
        case "payments":
          this.adminPayment = true;
          this.displayPayment = false;
          this.paymentForm = false;
          break;
        default:
          break;
      }
      this.forcePaymentRerender();
    },
    handleDisplay(src: string) {
      // console.log(`Display ServiceView - ${src}`);
      switch (src) {
        case "payments":
          this.displayPayment = true;
          this.adminPayment = false;
          this.paymentForm = false;
          break;
        default:
          break;
      }
      this.forcePaymentRerender();
    },
  },
  components: {
    TheToolbarIn,
    Sidenav,
    PaymentContent,
    Suspense,
    FooterIn,
  },
  watch: {
    $route: {
      async handler(newR, old) {
        // console.log(newR.query);
        if (newR.query.admin !== undefined) {
          this.adminPayment = newR.query.admin === "true" ? true : false;
          this.paymentForm = this.adminPayment;
        }
      },
      immediate: true,
    },
  },
});
</script>
<template>
  <main>
    <TheToolbarIn @language-changed-re-render="forcePaymentRerender" />
    <Sidenav
      :paymentsState="true"
      @show-admin="handleAdmin"
      @show-display="handleDisplay"
    />
    <div class="content">
      <Suspense>
        <PaymentContent
          v-if="renderComponent"
          :paymentForm="paymentForm"
          :admin="adminPayment"
          :display="displayPayment"
        />
        <template #fallback> Loading... </template>
      </Suspense>
    </div>
    <FooterIn />
  </main>
</template>
