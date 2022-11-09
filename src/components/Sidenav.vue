<script lang="ts">
import { defineComponent } from "vue";
import SidenavItem from "./SidenavItem.vue";

export default defineComponent({
  name: "Sidenav",
  setup() {
  },
  mounted() {
    
  },
  components: {
  	SidenavItem
  },
});
</script>

<i18n>
{
  "fr": {
    "servicesTitle": "Gestion des services",
    "servicesPath": "#",
    "actorsTitle": "Gestion des acteurs",
    "actorsPath": "#",
    "ordersTitle": "Gestion des commandes",
    "ordersPath": "#",
    "paymentsTitle": "Gestion des paiements",
    "paymentsPath": "#",
    "invoicesTitle": "Gestion des factures",
    "invoicesPath": "#",
    "exportTitle": "Exportation",
    "exportPath": "#",
  },
  "en": {
    "servicesTitle": "Services management",
    "servicesPath": "#",
    "actorsTitle": "Actors management",
    "actorsPath": "#",
    "ordersTitle": "Orders management",
    "ordersPath": "#",
    "paymentsTitle": "Payments management",
    "paymentsPath": "#",
    "invoicesTitle": "Invoices management",
    "invoicesPath": "#",
    "exportTitle": "Export",
    "exportPath": "#",
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