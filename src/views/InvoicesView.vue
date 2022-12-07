<script lang="ts">
import { defineComponent, Suspense, ref, nextTick } from "vue";
import TheToolbarIn from "../components/TheToolbarIn.vue";
import Sidenav from "../components/Sidenav.vue";
import { useUserStore } from "@/stores/user";
import { useSessionStore } from "@/stores/session";
import InvoiceContent from "../components/InvoiceContent.vue";
import FooterIn from "../components/Footer.vue";

const renderComponent = ref(true);

export default defineComponent({
  name: "InvoicesView",
  setup() {
    const store = useUserStore();

    return { store };
  },
  data() {
    return {
      renderComponent: true,
      adminInvoice: true,
      displayInvoice: false,
      invoiceForm: false,
    };
  },
  methods: {
    async forceInvoiceRerender() {
      // Remove MyComponent from the DOM
      this.renderComponent = false;

      // Wait for the change to get flushed to the DOM
      await this.$nextTick();

      // Add the component back in
      this.renderComponent = true;
    },
    handleAdmin(src: string) {
      switch (src) {
        case "invoices":
          this.adminInvoice = true;
          this.displayInvoice = false;
          this.invoiceForm = false;
          break;
        default:
          break;
      }
      this.forceInvoiceRerender();
    },
    handleDisplay(src: string) {
      // console.log(`Display ServiceView - ${src}`);
      switch (src) {
        case "invoices":
          this.displayInvoice = true;
          this.adminInvoice = false;
          this.invoiceForm = false;
          break;
        default:
          break;
      }
      this.forceInvoiceRerender();
    },
  },
  components: {
    TheToolbarIn,
    Sidenav,
    InvoiceContent,
    Suspense,
    FooterIn,
  },
  watch: {
    $route: {
      async handler(newR, old) {
        // console.log(newR.query);
        if (newR.query.admin !== undefined) {
          this.adminInvoice = newR.query.admin === "true" ? true : false;
          this.invoiceForm = this.adminInvoice;
        }
      },
      immediate: true,
    },
  },
});
</script>
<template>
  <main>
    <TheToolbarIn @language-changed-re-render="forceInvoiceRerender" />
    <Sidenav
      :invoicesState="true"
      @show-admin="handleAdmin"
      @show-display="handleDisplay"
    />
    <div class="content">
      <Suspense>
        <InvoiceContent
          v-if="renderComponent"
          :invoiceForm="invoiceForm"
          :admin="adminInvoice"
          :display="displayInvoice"
        />
        <template #fallback> Loading... </template>
      </Suspense>
    </div>
    <FooterIn />
  </main>
</template>
