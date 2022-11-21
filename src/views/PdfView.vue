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
	watch: {
	    $route: {
	      async handler(newR, old) {
	      	this.invoiceIds = newR.params.invoiceIds;
	      	const invStore = useInvoiceStore();
	      	const invoicesObj = await invStore
			.getMoreInvoices(this.invoiceIds)
			.then((res) => {
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

<template>
</template>