<script lang="ts">
import { defineComponent } from "vue";
import SidenavItem from "./SidenavItem.vue";

export default defineComponent({
  name: "side-nav",
  setup() {},
  mounted() {},
  components: {
    SidenavItem,
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
            :state="false"
            icon="bi-layout-text-sidebar"
            :title="$t('servicesTitle')"
            :link="$t('servicesPath')"
          />
          <SidenavItem
            :state="false"
            icon="bi-people-fill"
            :title="$t('actorsTitle')"
            :link="$t('actorsPath')"
          />
          <SidenavItem
            :state="false"
            icon="bi-list-ul"
            :title="$t('ordersTitle')"
            :link="$t('ordersPath')"
          />
          <SidenavItem
            :state="false"
            icon="bi-credit-card-fill"
            :title="$t('paymentsTitle')"
            :link="$t('paymentsPath')"
          />
          <SidenavItem
            :state="false"
            icon="bi-receipt"
            :title="$t('invoicesTitle')"
            :link="$t('invoicesPath')"
          />
          <SidenavItem
            :state="false"
            icon="bi-file-earmark-pdf-fill"
            :title="$t('exportTitle')"
            :link="$t('exportPath')"
          />
        </ul>
      </li>
    </ul>
  </div>
</template>
