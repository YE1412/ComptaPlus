<script lang="ts">
import { defineComponent } from "vue";
import { MDBRow, MDBTable, MDBCheckbox } from "mdb-vue-ui-kit";
import router from "@/router/index";
import { RouterLink } from "vue-router";
import { useInvoiceStore } from "@/stores/invoice";

export default defineComponent({
	name: "ExportContent",
	async setup() {
		const invStore = useInvoiceStore();
		const invoicesObj = await invStore
			.getAllInvoices()
			.then((res) => {
				return res;
			}, (ret) => {
				return [];
			})
			.catch((err) => {
				console.log(err);
				return [];
			});
		return {
			invoiceStore: invStore,
			invoices: invoicesObj,
		}
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
    		heading: headTable
    	};
  	},
  	computed: {
  		getSelectedInvoices(){
  			let ret = [];
  			for (const key in this.checkbox){
  				// console.log(key);
  				if (this.checkbox[key])
  					ret.push(key);
  			}
  			return ret;
  		},
  		contentsForDisp() {
			let ret = [];
			for (const key in this.invoices) {
				ret[key] = {};
				for (const key2 in this.invoices[key]) {
					if (key2 === "buyer") {
						ret[key][key2] = this.tableInvoicesBuyerLibelle;
					} else if (key2 === "seller") {
						ret[key][key2] = this.tableInvoicesSellerLibelle;
					} else if (key2 === "commandes") {
						ret[key][key2] = this.tableInvoicesOrdersLibelle;
					} else if (key2 === "devise") {
						ret[key][key2] = this.tableInvoicesDeviseLibelle;
					} else if (key2 === "langue") {
						ret[key][key2] = this.tableInvoicesLangueLibelle;
					} else if (key2 === "payments") {
						ret[key][key2] = this.tableInvoicesPaymentsLibelle;
					} else if (key2 === "tvaValue") {
						ret[key][key2] = this.tableInvoicesVATLibelle;
					} else {
						ret[key][key2] = this.invoices[key][key2];
					}
				}
			}
			return ret;
		},
		tableInvoicesBuyerLibelle() {
	      let ret = "";
	      // if (this.src === "invoices") {
	        for (const k in this.invoices) {
	          for (const l in this.invoices[k]) {
	            if (l === "buyer") {
	              let libelle = `${this.invoices[k][l].actorId} - ${this.invoices[k][l].prenom} ${this.invoices[k][l].nom}`;
	              ret = libelle;
	            }
	          }
	        }
	      // }
	      return ret;
	    },
	    tableInvoicesSellerLibelle() {
	      let ret = "";
	      // if (this.src === "invoices") {
	        for (const k in this.invoices) {
	          for (const l in this.invoices[k]) {
	            if (l === "seller") {
	              let libelle = `${this.invoices[k][l].actorId} - ${this.invoices[k][l].prenom} ${this.invoices[k][l].nom}`;
	              ret = libelle;
	            }
	          }
	        }
	      // }
	      return ret;
	    },
	    tableInvoicesOrdersLibelle() {
	      let ret = "";
	      // if (this.src === "invoices") {
	        for (const k in this.invoices) {
	          for (const l in this.invoices[k]) {
	            if (l === "commandes") {
	              for (const m in this.invoices[k][l]) {
	                let libelle = "";
	                libelle = `${this.invoices[k][l][m].orderId} - ${this.invoices[k][l][m].priceHt}`;
	                ret +=
	                  m != this.invoices[k][l].length - 1
	                    ? `${libelle}, `
	                    : libelle;
	              }
	            }
	          }
	        }
	      // }
	      return ret;
	    },
	    tableInvoicesDeviseLibelle() {
	      let ret = "";
	      // if (this.src === "invoices") {
	        for (const k in this.invoices) {
	          for (const l in this.invoices[k]) {
	            if (l === "devise") {
	              let libelle = `${this.invoices[k][l].symbole}`;
	              ret = libelle;
	            }
	          }
	        }
	      // }
	      return ret;
	    },
	    tableInvoicesLangueLibelle() {
	      let ret = "";
	      // if (this.src === "invoices") {
	        for (const k in this.invoices) {
	          for (const l in this.invoices[k]) {
	            if (l === "langue") {
	              let libelle = `${this.invoices[k][l].libelle}`;
	              ret = libelle;
	            }
	          }
	        }
	      // }
	      return ret;
	    },
	    tableInvoicesPaymentsLibelle() {
	      let ret = "";
	      // if (this.src === "invoices") {
	        for (const k in this.invoices) {
	          for (const l in this.invoices[k]) {
	            if (l === "payments") {
	              for (const m in this.invoices[k][l]) {
	                let libelle = "";
	                let state = "";
	                state =
	                  this.invoices[k][l][m].etat === 0
	                    ? this.$i18n.t("paymentStateKoLibelle")
	                    : "";
	                state =
	                  this.invoices[k][l][m].etat === 1
	                    ? this.$i18n.t("paymentStateOkLibelle")
	                    : "";
	                libelle = `${this.invoices[k][l][m].paymentId} - ${state} - ${this.invoices[k][l][m].paymentValue}`;
	                ret +=
	                  m != this.invoices[k][l].length - 1
	                    ? `${libelle}, `
	                    : libelle;
	              }
	            }
	          }
	        // }
	      }
	      return ret;
	    },
	    tableInvoicesVATLibelle() {
	      let ret = "";
	      // if (this.src === "invoices") {
	        for (const k in this.invoices) {
	          for (const l in this.invoices[k]) {
	            if (l === "tvaValue") {
	              let libelle = "";
	              libelle = `${this.invoices[k][l] * 100} %`;
	              ret = libelle;
	            }
	          }
	        }
	      // }
	      return ret;
	    },
  	},
  	methods: {
  		setCheckBoxModels(){
  			let ret = {};
  			for (const key in this.invoices){
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
		MDBRow,
		MDBTable,
		MDBCheckbox,
		RouterLink
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
	    "addButtonText": "Ajouter",
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
	    "addButtonText": "Add",
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
		        <th scope="col">
		          #
		        </th>
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
		          <td class="text-center" :colspan="colSpan">{{ emptyTableText }}</td>
		          <td class="text-center" v-if="admin">
		            <RouterLink :to="{name: $t('invoicesLinkName')}" >
		              <button type="button" class="btn btn-primary btn-rounded btn-sm my-0">
				          {{ $t("addButtonText") }}
				        </button>
		            </RouterLink>
		          </td>
		        </tr>
		      </tbody>
		    <tbody v-if="contentsForDisp.length">
		    	<tr v-for="(fac, i) in contentsForDisp" v-bind:key="i">
					<th scope="row">
						<MDBCheckbox v-model="checkbox[fac.factureId]"/>
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
		        			:to="{name: $t('pdfViewLinkName'),
	    						params: {
	    							invoiceIds: getSelectedInvoices
								}
							}"
						>
							<button type="button" class="btn btn-primary btn-rounded btn-sm my-0">{{ $t("exportButtonText") }}</button>
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