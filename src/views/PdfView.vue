<script lang="ts">
import { defineComponent } from "vue";
import { useUserStore } from "@/stores/user";
import { jsPDF } from "jspdf";
import font from "@/assets/fonts/Avenir-Medium/Avenir-Medium.ttf";
import { useInvoiceStore } from "@/stores/invoice";

export default defineComponent({
	name: "PdfView",
	async setup() {
		const usrStore = useUserStore();
		const invStore = useInvoiceStore();

		return { 
    		userStore: usrStore,
    		invoiceStore: invStore
		}; 
	},
	data() {
		// console.log(this.$route);
		return {
			invoiceIds: [],
			invoicesDetails: []
		};
	},
	computed: {
		contentsForPrint() {
			let ret = [];
			for (const key in this.invoicesDetails) {
				ret[key] = {};
				console.log(this.invoicesDetails[key]);
				for (const key2 in this.invoicesDetails[key]) {
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
					} else if (key2 === "date"){
						ret[key][key2] = this.tableInvoicesDateLibelle(key);
					} else {
						ret[key][key2] = this.invoicesDetails[key][key2];
					}
				}
			}
			return ret;
		},
	},
	methods: {
		tableInvoicesOrdersLibelle(ind: number) {
	      	let ret = {};
	      	ret['details'] = "";
			for (const m in this.invoicesDetails[ind]['commandes']) {
				let libelle = "";
				libelle = `${this.invoicesDetails[ind]['commandes'][m].orderId} - ${this.invoicesDetails[ind]['commandes'][m].priceHt}`;
				ret['details'] +=
					m != this.invoicesDetails[ind]['commandes'].length - 1
					? `${libelle}, `
					: libelle;
				ret['services'] = "";
				for (const n in this.invoicesDetails[ind]['commandes'][m]['Services']){
					let serv = "";
					serv = `${this.invoicesDetails[ind]['commandes'][m]['Services'][n].serviceId} - ${this.invoicesDetails[ind]['commandes'][m]['Services'][n].nom} - ${this.invoicesDetails[ind]['commandes'][m]['Services'][n].montantHt}`;
					ret['services'] +=
					n != this.invoicesDetails[ind]['commandes'][m]['Services'].length - 1
					? `${serv}, `
					: serv;
				}
			}
	      	return ret;
	    },
	    tableInvoicesBuyerLibelle(ind: number) {
	      	let ret = "";
			let libelle = `${this.invoicesDetails[ind]['buyer'].actorId} - ${this.invoicesDetails[ind]['buyer'].prenom} ${this.invoicesDetails[ind]['buyer'].nom}`;
			ret = libelle;
	      	return ret;
	    },
	    tableInvoicesSellerLibelle(ind: number) {
	      	let ret = "";
			let libelle = `${this.invoicesDetails[ind]['seller'].actorId} - ${this.invoicesDetails[ind]['seller'].prenom} ${this.invoicesDetails[ind]['seller'].nom}`;
			ret = libelle;
	      	return ret;
	    },
	    tableInvoicesDeviseLibelle(ind: number) {
	      	let ret = "";
			let libelle = `${this.invoicesDetails[ind]['devise'].symbole}`;
			ret = libelle;
	      	return ret;
	    },
	    tableInvoicesLangueLibelle(ind: number) {
	      	let ret = "";
			let libelle = `${this.invoicesDetails[ind]['langue'].libelle}`;
			ret = libelle;
	      	return ret;
	    },
	    tableInvoicesPaymentsLibelle(ind: number) {
	      	let ret = "";
			for (const m in this.invoicesDetails[ind]['payments']) {
                let libelle = "";
                let state = "";
                state =
                  this.invoicesDetails[ind]['payments'][m].etat === 0
                    ? this.$i18n.t("paymentStateKoLibelle")
                    : "";
                state =
                  this.invoicesDetails[ind]['payments'][m].etat === 1
                    ? this.$i18n.t("paymentStateOkLibelle")
                    : "";
                libelle = `${this.invoicesDetails[ind]['payments'][m].paymentId} - ${state} - ${this.invoicesDetails[ind]['payments'][m].paymentValue}`;
                ret +=
                  m != this.invoicesDetails[ind]['payments'].length - 1
                    ? `${libelle}, `
                    : libelle;
			}
	      	return ret;
	    },
	    tableInvoicesVATLibelle(ind: number) {
	      	let ret = "";
			let libelle = "";
			libelle = `${this.invoicesDetails[ind]['tvaValue'] * 100} %`;
			ret = libelle;
	      	return ret;
	    },
	    tableInvoicesDateLibelle(ind: number){
	      let ret = "";
	      let libelle = "";
	      libelle = `${this.invoicesDetails[ind]['date']}`;
	      ret = libelle;
	      return ret;
	    },
	},
	watch: {
	    $route: {
	      async handler(newR, old) {
	      	this.invoiceIds = newR.params.invoiceIds;
	      	const invStore = useInvoiceStore();
	      	const invoicesObj = await invStore
			.getMoreInvoices(this.invoiceIds)
			.then((res) => {
				console.log(res);
				return res;
			},
			(ret) => {
				return [];
			})
			.catch((err) => {
				console.log(err);
				return [];
			});
			this.invoicesDetails = invoicesObj;
	      },
	      immediate: true,
	    },
  	},
  	mounted() {
  		// const heading = "invoice";
		// const doc = new jsPDF({
		// 	orientation: "p",
		// 	format: "a4"
		// });
		// doc.setLanguage("fr-FR");
		// // doc.addSvg(SVG-Data, x, y, width, height);
		// const myFont = font; // load the *.ttf font file as binary string

		// // add the font to jsPDF
		// doc.addFileToVFS("AvenirMedium.ttf", myFont);
		// doc.addFont("AvenirMedium.ttf", "AvenirMedium", "normal");
		// doc.setFont("AvenirMedium");
		// doc.setFontStyle("bold");
		// // Red Color
		// doc.setFillColor(127, 21, 25);
		// doc.setFontSize(18);
		// console.log(doc.getFontList());
		// // Using autoTable plugin
		// doc.autoTable({
		// 	columns: [
		// 		{
		// 			title: "Title",
		// 			dataKey: "title",
		// 		},
		// 		{
		// 			title: "Content",
		// 			dataKey: "content",
		// 		}
		// 	],
		// 	body: [
		// 		{
		// 			title:"ATitle",
		// 			content:"AContent"
		// 		}
		// 	],
		// 	margin: { left: 0.5, top: 1.25 }
		// });
		// // create a line under heading 
      	// doc.setLineWidth(0.01).line(0.5, 1.1, 8.0, 1.1);
      	//  // Creating footer and saving file
      	// doc
	    //     .setFont("times")
	    //     .setFontSize(11)
	    //     .setFontStyle("italic")
	    //     .setTextColor(0, 0, 255)
	    //     .text(
	    //       "This is a simple footer located .5 inches from page bottom",
	    //       0.5,
	    //       doc.internal.pageSize.height - 0.5
	    //     )
        // 	.save(`${heading}.pdf`);
        // // doc.addPage(format, orientation);
  	}
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
</template>