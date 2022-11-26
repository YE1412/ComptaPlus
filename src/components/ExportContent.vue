<script lang="ts">
import { defineComponent } from "vue";
import { MDBTable, MDBCheckbox } from "mdb-vue-ui-kit";
import router from "@/router/index";
import { RouterLink } from "vue-router";
import { useInvoiceStore } from "@/stores/invoice";
import { useCounterStore } from "@/stores/counter";

export default defineComponent({
  name: "ExportContent",
  async setup() {
    const invStore = useInvoiceStore();
    const cntStore = useCounterStore();
    const invoicesObj = await invStore
      .getAllInvoices()
      .then(
        (res) => {
          return res;
        },
        (ret) => {
          return [];
        }
      )
      .catch((err) => {
        console.log(err);
        return [];
      });
    return {
      invoiceStore: invStore,
      counterStore: cntStore,
      invoices: invoicesObj,
    };
  },
  mounted() {
    // this.contents = this.hydrateObjContent();
  },
  data() {
    // this.getInvoices();
    const chkbox = this.setCheckBoxModels();
    const headTable = [
      this.$i18n.t("dateTableHeadText"),
      this.$i18n.t("htPriceTableHeadText"),
      this.$i18n.t("ttPriceTableHeadText"),
      this.$i18n.t("vatTableHeadText"),
      this.$i18n.t("languageTableHeadText"),
      this.$i18n.t("deviseTableHeadText"),
      this.$i18n.t("buyerTableHeadText"),
      this.$i18n.t("sellerTableHeadText"),
      this.$i18n.t("orderTableHeadText"),
      this.$i18n.t("paymentTableHeadText"),
      this.$i18n.t("actionTableHeadText"),
    ];
    return {
      checkbox: chkbox,
      heading: headTable,
      colSpan: "11",
    };
  },
  computed: {
    getSelectedInvoices() {
      let ret = [];
      for (const key in this.checkbox) {
        // console.log(key);
        if (this.checkbox[key]) ret.push(key);
      }
      return ret;
    },
    contentsForDisp() {
      let ret = [];
      for (const key in this.invoices) {
        ret[key] = {};
        for (const key2 in this.invoices[key]) {
          if (key2 === "buyer") {
            ret[key][key2] = this.tableInvoicesBuyerLibelle(key);
          } else if (key2 === "seller") {
            ret[key][key2] = this.tableInvoicesSellerLibelle(key);
          } else if (key2 === "commandes") {
            ret[key][key2] = this.tableInvoicesOrdersLibelle(key);
          } else if (key2 === "devise") {
            ret[key][key2] = this.tableInvoicesDeviseLibelle(key);
          } else if (key2 === "langue") {
            ret[key][key2] = this.tableInvoicesLangueLibelle(key);
          } else if (key2 === "payments") {
            ret[key][key2] = this.tableInvoicesPaymentsLibelle(key);
          } else if (key2 === "tvaValue") {
            ret[key][key2] = this.tableInvoicesVATLibelle(key);
          } else if (key2 === "date") {
            ret[key][key2] = this.tableInvoicesDateLibelle(key);
          } else {
            ret[key][key2] = this.invoices[key][key2];
          }
        }
      }
      return ret;
    },
  },
  methods: {
    tableInvoicesBuyerLibelle(ind: number) {
      let ret = "";
      let libelle = `${this.invoices[ind]["buyer"].actorId} - ${this.invoices[ind]["buyer"].prenom} ${this.invoices[ind]["buyer"].nom}`;
      ret = libelle;
      return ret;
    },
    tableInvoicesSellerLibelle(ind: number) {
      let ret = "";
      let libelle = `${this.invoices[ind]["seller"].actorId} - ${this.invoices[ind]["seller"].prenom} ${this.invoices[ind]["seller"].nom}`;
      ret = libelle;
      return ret;
    },
    tableInvoicesOrdersLibelle(ind: number) {
      let ret = "";
      for (const m in this.invoices[ind]["commandes"]) {
        let libelle = "";
        libelle = `${this.invoices[ind]["commandes"][m].orderId} - ${this.invoices[ind]["commandes"][m].priceHt}`;
        ret +=
          m != this.invoices[ind]["commandes"].length - 1
            ? `${libelle}, `
            : libelle;
      }
      return ret;
    },
    tableInvoicesDeviseLibelle(ind: number) {
      let ret = "";
      let libelle = `${this.invoices[ind]["devise"].symbole}`;
      ret = libelle;
      return ret;
    },
    tableInvoicesLangueLibelle(ind: number) {
      let ret = "";
      let libelle = `${this.invoices[ind]["langue"].libelle}`;
      ret = libelle;
      return ret;
    },
    tableInvoicesPaymentsLibelle(ind: number) {
      let ret = "";
      for (const m in this.invoices[ind]["payments"]) {
        let libelle = "";
        let state = "";
        state =
          this.invoices[ind]["payments"][m].etat === 0
            ? this.$i18n.t("paymentStateKoLibelle")
            : "";
        state =
          this.invoices[ind]["payments"][m].etat === 1
            ? this.$i18n.t("paymentStateOkLibelle")
            : "";
        libelle = `${this.invoices[ind]["payments"][m].paymentId} - ${state} - ${this.invoices[ind]["payments"][m].paymentValue}`;
        ret +=
          m != this.invoices[ind]["payments"].length - 1
            ? `${libelle}, `
            : libelle;
      }
      return ret;
    },
    tableInvoicesVATLibelle(ind: number) {
      let ret = "";
      let libelle = "";
      libelle = `${this.invoices[ind]["tvaValue"] * 100} %`;
      ret = libelle;
      return ret;
    },
    tableInvoicesDateLibelle(ind: number) {
      let ret = "";
      let libelle = "";
      let date = new Date(this.invoices[ind]["date"]);
      let locale =
        this.counterStore.getLanguages[this.counterStore.getLangDisplayedIndex]
          .class === "fr"
          ? "fr-FR"
          : "";
      locale =
        this.counterStore.getLanguages[this.counterStore.getLangDisplayedIndex]
          .class === "us"
          ? "en-US"
          : locale;
      const options = { day: "2-digit", month: "2-digit", year: "numeric" };
      libelle = `${date.toLocaleDateString(locale, options)}`;
      ret = libelle;
      return ret;
    },
    setCheckBoxModels() {
      let ret = {};
      for (const key in this.invoices) {
        ret[this.invoices[key].factureId] = false;
      }
      return ret;
    },
    // async hydrateObjContent() {
    // 	let contentTab = [];
    // 	return (contentTab = await this.invoiceStore
    // 		.getAllInvoices()
    // 		.then((res) => {
    // 			return res;
    // 		},
    // 		(rej) => {
    // 			return [];
    // 		})
    // 		.catch((err) => {
    // 			return [];
    // 		}));
    // }
  },
  components: {
    MDBTable,
    MDBCheckbox,
    RouterLink,
  },
});
</script>

<i18n>
{
	"fr": {
		"exportButtonText": "Exporter",
		"pdfViewLinkName": "PdfVue",
		"dateTableHeadText": "Date",
	    "htPriceTableHeadText": "Prix Hors taxes",
	    "ttPriceTableHeadText": "Prix Taxes Comprises",
	    "languageTableHeadText": "Langue",
	    "deviseTableHeadText": "Devise",
	    "vatTableHeadText": "TVA",
	    "buyerTableHeadText": "Acheteur",
	    "sellerTableHeadText": "Vendeur",
	    "orderTableHeadText": "Commande(s)",
	    "paymentTableHeadText": "Paiement(s)",
	    "actionTableHeadText": "Actions",
	    "emptyTableBodyContentText": "Aucune facture.",
	    "paymentTypeCBLibelle": "Carte bancaire",
	    "paymentTypeESPLibelle": "Espèces",
	    "paymentTypeCHQLibelle": "Chèque",
	    "paymentStateOkLibelle": "Payé",
	    "paymentStateKoLibelle": "Impayé",
	    "addButtonText": "Ajouter une facture",
	    "invoicesLinkName": "Factures",
  		"invoicesLinkTarget": "/factures",
	},
	"en": {
		"exportButtonText": "Export",
		"pdfViewLinkName": "PdfView",
		"dateTableHeadText": "Date",
	    "htPriceTableHeadText": "Price Excl. Taxes",
	    "ttPriceTableHeadText": "Price Incl. Taxes",
	    "languageTableHeadText": "Language",
	    "deviseTableHeadText": "Devise",
	    "vatTableHeadText": "VAT",
	    "buyerTableHeadText": "Buyer",
	    "sellerTableHeadText": "Seller",
	    "orderTableHeadText": "Order(s)",
	    "paymentTableHeadText": "Payment(s)",
	    "actionTableHeadText": "Actions",
	    "emptyTableBodyContentText": "No Invoice.",
	    "paymentTypeCBLibelle": "Credit card",
	    "paymentTypeESPLibelle": "Cash",
	    "paymentTypeCHQLibelle": "Check",
	    "paymentStateOkLibelle": "Paid",
	    "paymentStateKoLibelle": "Not paid",
	    "addButtonText": "Add an invoice",
	    "invoicesLinkName": "Invoices",
  		"invoicesLinkTarget": "/invoices",
	}
}
</i18n>

<template>
  <div class="container">
    <div class="table-responsive">
      <MDBTable class="table">
        <thead class="mdb-color darken-3">
          <tr class="text-black text-center">
            <th scope="col">#</th>
            <!-- <th scope="col">Lorem</th>
		        <th scope="col">Ipsum</th>
		        <th scope="col">Dolor</th> -->
            <th v-for="(head, ind) in heading" v-bind:key="ind" scope="col">
              {{ head }}
            </th>
          </tr>
        </thead>
        <tbody v-if="!contentsForDisp.length">
          <tr>
            <td class="text-center" :colspan="colSpan">
              {{ $t("emptyTableBodyContentText") }}
            </td>
            <td class="text-center">
              <RouterLink
                :to="{
                  name: $t('invoicesLinkName'),
                  query: {
                    admin: true,
                  },
                }"
              >
                <button
                  type="button"
                  class="btn btn-primary btn-rounded btn-sm my-0"
                >
                  {{ $t("addButtonText") }}
                </button>
              </RouterLink>
            </td>
          </tr>
        </tbody>
        <tbody v-if="contentsForDisp.length">
          <tr v-for="(fac, i) in contentsForDisp" v-bind:key="i">
            <th scope="row">
              <MDBCheckbox v-model="checkbox[fac.factureId]" />
            </th>
            <td>{{ fac.date }}</td>
            <td>{{ fac.invoiceHTPrice }}</td>
            <td>{{ fac.invoiceTTPrice }}</td>
            <td>{{ fac.tvaValue }}</td>
            <td>{{ fac.langue }}</td>
            <td>{{ fac.devise }}</td>
            <td>{{ fac.buyer }}</td>
            <td>{{ fac.seller }}</td>
            <td>{{ fac.commandes }}</td>
            <td>{{ fac.payments }}</td>
            <td>
              <RouterLink
                :to="{
                  name: $t('pdfViewLinkName'),
                  params: {
                    invoiceIds: getSelectedInvoices,
                  },
                }"
              >
                <button
                  type="button"
                  class="btn btn-primary btn-rounded btn-sm my-0"
                >
                  {{ $t("exportButtonText") }}
                </button>
              </RouterLink>
            </td>
          </tr>
          <!-- <tr>
		        <th scope="row">
		          <MDBCheckbox v-model="checkbox['1']"/>
		        </th>
		        <td>Sit</td>
		        <td>Amet</td>
		        <td>
		        	<RouterLink 
		        		:to="{name: $t('pdfViewLinkName'),
    						params: {
    							invoiceIds: getSelectedInvoices
							}
						}"
					>
						<button type="button" class="btn btn-primary btn-rounded btn-sm my-0">{{ $t("exportButtonText") }}</button>
					</RouterLink></td>
		      </tr>
		      <tr>
		        <th scope="row">
		          <MDBCheckbox v-model="checkbox['2']"/>
		        </th>
		        <td>Adipisicing</td>
		        <td>Elit</td>
		        <td><RouterLink :to="{name: $t('pdfViewLinkName'),
    						params: {
    							invoiceIds: getSelectedInvoices
							}
						}"><button type="button" class="btn btn-primary btn-rounded btn-sm my-0">{{ $t("exportButtonText") }}</button></RouterLink></td>
		      </tr>
		      <tr>
		        <th scope="row">
		          <MDBCheckbox v-model="checkbox['3']"/>
		        </th>
		        <td>Hic</td>
		        <td>Fugiat</td>
		        <td><RouterLink :to="{name: $t('pdfViewLinkName'),
    						params: {
    							invoiceIds: getSelectedInvoices
							}
						}"><button type="button" class="btn btn-primary btn-rounded btn-sm my-0">{{ $t("exportButtonText") }}</button></RouterLink></td>
		      </tr> -->
        </tbody>
      </MDBTable>
    </div>
  </div>
</template>
