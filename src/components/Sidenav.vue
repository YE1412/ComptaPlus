<script lang="ts">
import { defineComponent } from "vue";
import SidenavItem from "./SidenavItem.vue";

export default defineComponent({
  name: "side-nav",
  props: {
    servicesState: {
      type: Boolean,
      required: false,
      default: () => false,
    },
    actorsState: {
      type: Boolean,
      required: false,
      default: () => false,
    },
    ordersState: {
      type: Boolean,
      required: false,
      default: () => false,
    },
    paymentsState: {
      type: Boolean,
      required: false,
      default: () => false,
    },
    invoicesState: {
      type: Boolean,
      required: false,
      default: () => false,
    },
    exportState: {
      type: Boolean,
      required: false,
      default: () => false,
    },
  },
  // data (){

  // },
  setup() {
    type exportState = any;
  },
  mounted() {},
  components: {
    SidenavItem,
  },
  methods: {
    handleAdminClick(src: string) {
      this.$emit("show-admin", src);
    },
    handleDisplayClick(src: string) {
      // console.log(`Display Sidenav - ${src}`);
      this.$emit("show-display", src);
    },
  },
});
</script>

<i18n>
{
  "fr": {
    "servicesTitle": "Gestion des services",
    "servicesPath": "/services",
    "actorsTitle": "Gestion des acteurs",
    "actorsPath": "/acteurs",
    "ordersTitle": "Gestion des commandes",
    "ordersPath": "/commandes",
    "paymentsTitle": "Gestion des paiements",
    "paymentsPath": "/paiements",
    "invoicesTitle": "Gestion des factures",
    "invoicesPath": "/factures",
    "exportTitle": "Exportation",
    "exportPath": "/exportation",
  },
  "en": {
    "servicesTitle": "Services management",
    "servicesPath": "/services",
    "actorsTitle": "Actors management",
    "actorsPath": "/actors",
    "ordersTitle": "Orders management",
    "ordersPath": "/orders",
    "paymentsTitle": "Payments management",
    "paymentsPath": "/payments",
    "invoicesTitle": "Invoices management",
    "invoicesPath": "/invoices",
    "exportTitle": "Export",
    "exportPath": "/export",
  }
}
</i18n>

<template>
  <div id="slide-out" class="side-nav">
    <ul class="custom-scrollbar list-unstyled">
      <li>
        <ul class="collapsible collapsible-accordion">
          <SidenavItem
            :state="servicesState"
            @show-admin="handleAdminClick"
            @show-display="handleDisplayClick"
            icon="bi-layout-text-sidebar"
            :title="$t('servicesTitle')"
            :link="$t('servicesPath')"
            src="services"
          />
          <SidenavItem
            :state="actorsState"
            @show-admin="handleAdminClick"
            @show-display="handleDisplayClick"
            icon="bi-people-fill"
            :title="$t('actorsTitle')"
            :link="$t('actorsPath')"
            src="actors"
          />
          <SidenavItem
            :state="ordersState"
            @show-admin="handleAdminClick"
            @show-display="handleDisplayClick"
            icon="bi-list-ul"
            :title="$t('ordersTitle')"
            :link="$t('ordersPath')"
            src="orders"
          />
          <SidenavItem
            :state="paymentsState"
            @show-admin="handleAdminClick"
            @show-display="handleDisplayClick"
            icon="bi-credit-card-fill"
            :title="$t('paymentsTitle')"
            :link="$t('paymentsPath')"
            src="payments"
          />
          <SidenavItem
            :state="invoicesState"
            @show-admin="handleAdminClick"
            @show-display="handleDisplayClick"
            icon="bi-receipt"
            :title="$t('invoicesTitle')"
            :link="$t('invoicesPath')"
            src="invoices"
          />
          <SidenavItem
            :state="exportState"
            @show-admin="handleAdminClick"
            @show-display="handleDisplayClick"
            icon="bi-file-earmark-pdf-fill"
            :title="$t('exportTitle')"
            :link="$t('exportPath')"
            src="export"
          />
        </ul>
      </li>
    </ul>
  </div>
</template>
