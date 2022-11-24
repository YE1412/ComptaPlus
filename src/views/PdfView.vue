<script lang="ts">
import { defineComponent } from "vue";
import { useUserStore } from "@/stores/user";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import "@/assets/fonts/Avenir-Medium/Avenir-Medium-normal.js";
import { useInvoiceStore } from "@/stores/invoice";
// Requiring the lodash library
import _ from "lodash";

export default defineComponent({
  name: "PdfView",
  async setup() {
    const usrStore = useUserStore();
    const invStore = useInvoiceStore();
    const tabXPos = 26.3,
      headYPos = 41.3,
      headTableWidth = 393.9,
      headTableHeight = 95,
      ordHeadTableHeight = 30,
      servHeadTableHeight = 33,
      servContentTableHeight = 20;

    return {
      userStore: usrStore,
      invoiceStore: invStore,
      languageVal: "",
      doc: null,
      tableXPos: tabXPos,
      contentXPos: tabXPos + 1.7,
      headerYPos: headYPos,
      headerTableWidth: headTableWidth,
      headerTableHeight: headTableHeight,
      orderHeaderTableHeight: ordHeadTableHeight,
      serviceHeaderTableHeight: servHeadTableHeight,
      serviceContentTableHeight: servContentTableHeight,
      contentCellTableWidth: parseFloat((headTableWidth / 7).toFixed(1)),
      footerCellTableWidth: parseFloat((headTableWidth / 5).toFixed(1)),
    };
  },
  data() {
    // console.log(this.$route);
    return {
      invoiceIds: [],
      invoicesDetails: [],
    };
  },
  computed: {
    contentsForPrint() {
      let ret = [];
      for (const key in this.invoicesDetails) {
        ret[key] = {};
        // console.log(this.invoicesDetails[key]);
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
          } else if (key2 === "date") {
            ret[key][key2] = this.tableInvoicesDateLibelle(key);
          } else if (key2 === "invoiceTTPrice") {
            ret[key][key2] = this.tableInvoicesTTPriceLibelle(key);
          } else {
            ret[key][key2] = this.invoicesDetails[key][key2];
          }
        }
        ret[key]["billingAddress"] = this.tableInvoicesBillingLibelle(key);
      }
      return ret;
    },
  },
  methods: {
    tableInvoicesOrdersLibelle(ind: number) {
      let ret = [],
        tvaValue = 0.0,
        totalHT = 0.0,
        totalTT = 0.0,
        totalTTLibelle = "";
      let locale =
        this.invoicesDetails[ind]["langue"].nom === "fr" ? "fr-FR" : "";
      locale =
        this.invoicesDetails[ind]["langue"].nom === "us" ? "en-US" : locale;
      tvaValue = this.invoicesDetails[ind]["tvaValue"];
      for (const m in this.invoicesDetails[ind]["commandes"]) {
        ret[m] = {};
        totalHT = this.invoicesDetails[ind]["commandes"][m].priceHt;
        totalTT = totalHT + totalHT * tvaValue;
        totalTTLibelle = new Intl.NumberFormat(locale, {
          minimumFractionDigits: 2,
        }).format(totalTT.toFixed(2));
        ret[m]["orderId"] = this.invoicesDetails[ind]["commandes"][m].orderId;
        ret[m]["contenuAdditionnel"] =
          this.invoicesDetails[ind]["commandes"][m].contenuAdditionnel;
        ret[m]["totalTTLibelle"] = totalTTLibelle;
        ret[m]["Services"] = [];
        for (const n in this.invoicesDetails[ind]["commandes"][m]["Services"]) {
          let priceUnitTTLibelle = "",
            montantNetTTLibelle = "",
            montantNetTT = 0.0,
            priceUnitTT = 0.0,
            priceUnitHT = 0.0,
            quantity = 0;
          quantity =
            this.invoicesDetails[ind]["commandes"][m]["Services"][n].quantite;
          priceUnitHT =
            this.invoicesDetails[ind]["commandes"][m]["Services"][n].montantHt;
          priceUnitTT = priceUnitHT + priceUnitHT * tvaValue;
          priceUnitTTLibelle = new Intl.NumberFormat(locale, {
            minimumFractionDigits: 2,
          }).format(priceUnitTT.toFixed(2));
          montantNetTT = priceUnitTT * quantity;
          montantNetTTLibelle = new Intl.NumberFormat(locale, {
            minimumFractionDigits: 2,
          }).format(montantNetTT.toFixed(2));
          ret[m]["Services"][n] = {};
          ret[m]["Services"][n].serviceId =
            this.invoicesDetails[ind]["commandes"][m]["Services"][n].serviceId;
          ret[m]["Services"][n].quantite = quantity;
          ret[m]["Services"][n].nom =
            this.invoicesDetails[ind]["commandes"][m]["Services"][n].nom;
          ret[m]["Services"][n].montantNetTTLibelle = montantNetTTLibelle;
          ret[m]["Services"][n].priceUnitTTLibelle = priceUnitTTLibelle;
        }
      }
      return ret;
    },
    tableInvoicesBuyerLibelle(ind: number) {
      let ret = "";
      let prenom = _.capitalize(this.invoicesDetails[ind]["buyer"].prenom);
      let nom = _.capitalize(this.invoicesDetails[ind]["buyer"].nom);
      let libelle = `${prenom} ${nom}`;
      ret = libelle;
      return ret;
    },
    tableInvoicesSellerLibelle(ind: number) {
      let ret = "";
      let prenom = _.capitalize(this.invoicesDetails[ind]["seller"].prenom);
      let nom = _.capitalize(this.invoicesDetails[ind]["seller"].nom);
      let libelle = `${prenom} ${nom}`;
      ret = libelle;
      return ret;
    },
    tableInvoicesDeviseLibelle(ind: number) {
      let ret = "";
      let libelle = `${this.invoicesDetails[ind]["devise"].symbole}`;
      ret = libelle;
      return ret;
    },
    tableInvoicesLangueLibelle(ind: number) {
      let ret = "";
      let libelle = `${this.invoicesDetails[ind]["langue"].nom}`;
      ret = libelle;
      return ret;
    },
    tableInvoicesPaymentsLibelle(ind: number) {
      let ret = "";
      for (const m in this.invoicesDetails[ind]["payments"]) {
        let libelle = "";
        let state = "";
        state =
          this.invoicesDetails[ind]["payments"][m].etat === 0
            ? this.$i18n.t("paymentStateKoLibelle")
            : "";
        state =
          this.invoicesDetails[ind]["payments"][m].etat === 1
            ? this.$i18n.t("paymentStateOkLibelle")
            : "";
        libelle = `${this.invoicesDetails[ind]["payments"][m].paymentId} - ${state} - ${this.invoicesDetails[ind]["payments"][m].paymentValue}`;
        ret +=
          m != this.invoicesDetails[ind]["payments"].length - 1
            ? `${libelle}, `
            : libelle;
      }
      return ret;
    },
    tableInvoicesVATLibelle(ind: number) {
      let ret = {};
      let tvaValueLibelle = "",
        tvaValue = 0.0,
        tvaBase = 0.0,
        tvaMontant = 0.0,
        tvaBaseLibelle = "",
        tvaMontantLibelle = "";
      let locale =
        this.invoicesDetails[ind]["langue"].nom === "fr" ? "fr-FR" : "";
      locale =
        this.invoicesDetails[ind]["langue"].nom === "us" ? "en-US" : locale;
      tvaValue = this.invoicesDetails[ind]["tvaValue"] * 100;
      tvaValueLibelle = new Intl.NumberFormat(locale, {
        minimumFractionDigits: 2,
      }).format(tvaValue.toFixed(2));
      tvaMontant =
        this.invoicesDetails[ind].invoiceTTPrice *
        this.invoicesDetails[ind]["tvaValue"];
      tvaMontantLibelle = new Intl.NumberFormat(locale, {
        minimumFractionDigits: 2,
      }).format(tvaMontant.toFixed(2));
      tvaBase = this.invoicesDetails[ind].invoiceTTPrice - tvaMontant;
      tvaBaseLibelle = new Intl.NumberFormat(locale, {
        minimumFractionDigits: 2,
      }).format(tvaBase.toFixed(2));
      ret.tvaValueLibelle = `${tvaValueLibelle} %`;
      ret.tvaBaseLibelle = tvaBaseLibelle;
      ret.tvaMontantLibelle = tvaMontantLibelle;
      return ret;
    },
    tableInvoicesDateLibelle(ind: number) {
      let ret = "",
        libelle = "";
      let date = new Date(this.invoicesDetails[ind]["date"]);
      let locale =
        this.invoicesDetails[ind]["langue"].nom === "fr" ? "fr-FR" : "";
      locale =
        this.invoicesDetails[ind]["langue"].nom === "us" ? "en-US" : locale;
      // console.log(locale);
      const options = { day: "2-digit", month: "2-digit", year: "numeric" };
      libelle = `${date.toLocaleDateString(locale, options)}`;
      ret = libelle;
      return ret;
    },
    tableInvoicesTTPriceLibelle(ind: number) {
      let ret = "";
      let libelle = "",
        ttPriceLibelle = "",
        ttPrice = 0.0;
      let locale =
        this.invoicesDetails[ind]["langue"].nom === "fr" ? "fr-FR" : "";
      locale =
        this.invoicesDetails[ind]["langue"].nom === "us" ? "en-US" : locale;
      ttPrice = this.invoicesDetails[ind].invoiceTTPrice;
      ttPriceLibelle = new Intl.NumberFormat(locale, {
        minimumFractionDigits: 2,
      }).format(ttPrice.toFixed(2));
      ret = ttPriceLibelle;
      return ret;
    },
    tableInvoicesBillingLibelle(ind: number) {
      let ret = {};
      let prenomLibelle = _.capitalize(
        this.invoicesDetails[ind]["buyer"].prenom
      );
      let nomLibelle = _.capitalize(this.invoicesDetails[ind]["buyer"].nom);
      let nomRueLibelle = _.capitalize(
        this.invoicesDetails[ind]["buyer"].nomRue
      );
      let villeLibelle = this.invoicesDetails[ind]["buyer"].ville.toUpperCase();
      ret.firstLine = `${prenomLibelle} ${nomLibelle}`;
      ret.secondLine = `${this.invoicesDetails[ind]["buyer"].numRue} ${nomRueLibelle}`;
      ret.thirdLine = `${this.invoicesDetails[ind]["buyer"].cp} ${villeLibelle}`;
      return ret;
    },
    buildAndSavePdf(inv: any) {
      // console.log(this.invoicesDetails);
      this.languageVal = inv.langue === "fr" ? inv.langue : "";
      this.languageVal = inv.langue === "us" ? "en" : this.langueVal;
      this.doc = new jsPDF({
        orientation: "p",
        unit: "px",
        format: "a4",
      });
      let yPos = this.insertHead(inv);
      for (const k in inv.commandes) {
        yPos = this.insertOrder(inv, yPos, k);
      }
      yPos = this.insertInvoiceFoot(inv, yPos);
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
      const date = new Date();
      let locale = inv["langue"] === "fr" ? "fr-FR" : "";
      locale = inv["langue"] === "us" ? "en-US" : locale;
      // console.log(locale);
      const options = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      };
      const dateLibelle = date.toLocaleDateString(locale, options);
      const fileName = `${this.$i18n.t("invoiceLibelle")}_${
        inv.factureId
      }_${dateLibelle
        .replaceAll("/", "_")
        .replaceAll(" ", "_")
        .replaceAll(":", "_")
        .replaceAll(",", "")}`;
      // console.log(dateLibelle);
      // console.log(fileName);
      this.doc.save(`${fileName}.pdf`);
      // // doc.addPage(format, orientation);
    },
    insertHead(inv: any): number {
      let ret = this.headerYPos;
      const heading = "INFOSERVICES";
      this.doc.setLanguage(this.languageVal);
      // // doc.addSvg(SVG-Data, x, y, width, height);
      this.doc.setFont("helvetica", "bold");
      this.doc.setFontSize(14).text(heading, this.tableXPos, ret);
      this.doc.setFont("helvetica", "bold");
      // doc.setFontType("italic");
      ret += 18.7;
      this.doc
        .setFontSize(18)
        .text(
          this.$i18n.t("invoiceLibelle", this.languageVal).toUpperCase(),
          this.contentXPos + 35.8,
          ret
        );
      ret += 30;
      this.doc.setLineWidth(1);
      this.doc.rect(
        this.tableXPos,
        ret,
        this.headerTableWidth,
        this.headerTableHeight
      );
      this.doc
        .setFontSize(14)
        .text(
          this.$i18n.t("billingAddressLibelle", this.languageVal),
          this.contentXPos,
          107
        );
      this.doc.setFont("helvetica", "normal");
      this.doc
        .setFontSize(10)
        .text(
          inv.billingAddress.firstLine,
          this.contentXPos,
          this.headerYPos + 77.7
        );
      this.doc
        .setFontSize(10)
        .text(
          inv.billingAddress.secondLine,
          this.contentXPos,
          this.headerYPos + 89.7
        );
      this.doc
        .setFontSize(10)
        .text(
          inv.billingAddress.thirdLine,
          this.contentXPos,
          this.headerYPos + 101.7
        );
      ret += this.headerTableHeight;
      return ret;
    },
    insertOrder(inv: any, yPos: number, ind: number): number {
      let ret = yPos;
      // Additional content
      this.doc.setFont("helvetica", "bold");
      this.doc.rect(
        this.tableXPos,
        yPos,
        this.contentCellTableWidth * 2,
        this.orderHeaderTableHeight
      );
      const addContentTextCell = [
        this.$i18n.t("addContentLibelle", this.languageVal),
        inv["commandes"][ind].contenuAdditionnel,
      ];
      // this.contentXPos + 54.6
      this.doc
        .setFontSize(9)
        .text(
          addContentTextCell[0],
          this.tableXPos + this.contentCellTableWidth,
          ret + 10,
          { align: "center" }
        );
      this.doc.setFont("helvetica", "normal");
      this.doc
        .setFontSize(10)
        .text(
          addContentTextCell[1] !== null ? addContentTextCell[1] : "",
          this.contentXPos + 5,
          ret + 20,
          {
            align: "left",
            maxWidth: (this.contentCellTableWidth * 2 - 3.4).toString(),
          }
        );
      // Buyer
      this.doc.setFont("helvetica", "bold");
      this.doc.rect(
        this.tableXPos + this.contentCellTableWidth * 2,
        yPos,
        this.contentCellTableWidth,
        this.orderHeaderTableHeight
      );
      const buyerTextCell = [
        this.$i18n.t("buyerLibelle", this.languageVal),
        inv["buyer"],
      ];
      this.doc
        .setFontSize(9)
        .text(
          buyerTextCell[0],
          this.tableXPos + this.contentCellTableWidth * (1 + 1 + 1 / 2),
          ret + 10,
          { align: "center" }
        );
      this.doc.setFont("helvetica", "normal");
      this.doc
        .setFontSize(10)
        .text(
          buyerTextCell[1],
          this.tableXPos + this.contentCellTableWidth * 2 + 6.7,
          ret + this.orderHeaderTableHeight - 10,
          {
            align: "left",
            maxWidth: (this.contentCellTableWidth - 8.4).toString(),
          }
        );
      // Seller
      this.doc.setFont("helvetica", "bold");
      this.doc.rect(
        this.tableXPos + this.contentCellTableWidth * 3,
        yPos,
        this.contentCellTableWidth,
        this.orderHeaderTableHeight
      );
      const sellerTextCell = [
        this.$i18n.t("sellerLibelle", this.languageVal),
        inv["seller"],
      ];
      this.doc
        .setFontSize(9)
        .text(
          sellerTextCell[0],
          this.tableXPos + this.contentCellTableWidth * (1 + 1 + 1 + 1 / 2),
          ret + 10,
          { align: "center" }
        );
      this.doc.setFont("helvetica", "normal");
      this.doc
        .setFontSize(10)
        .text(
          sellerTextCell[1],
          this.tableXPos + this.contentCellTableWidth * 3 + 6.7,
          ret + this.orderHeaderTableHeight - 10,
          {
            align: "left",
            maxWidth: (this.contentCellTableWidth - 8.4).toString(),
          }
        );
      // Date
      this.doc.setFont("helvetica", "bold");
      this.doc.rect(
        this.tableXPos + this.contentCellTableWidth * 4,
        yPos,
        this.contentCellTableWidth,
        this.orderHeaderTableHeight
      );
      const dateTextCell = [
        this.$i18n.t("dateLibelle", this.languageVal),
        inv["date"],
      ];
      this.doc
        .setFontSize(9)
        .text(
          dateTextCell[0],
          this.tableXPos + this.contentCellTableWidth * (1 + 1 + 1 + 1 + 1 / 2),
          ret + 10,
          { align: "center" }
        );
      this.doc.setFont("helvetica", "normal");
      this.doc
        .setFontSize(10)
        .text(
          dateTextCell[1],
          this.tableXPos + this.contentCellTableWidth * 4 + 6.7,
          ret + this.orderHeaderTableHeight - 2,
          {
            align: "left",
            maxWidth: (this.contentCellTableWidth - 8.4).toString(),
          }
        );
      // Order
      this.doc.setFont("helvetica", "bold");
      this.doc.rect(
        this.tableXPos + this.contentCellTableWidth * 5,
        yPos,
        this.contentCellTableWidth * 2 - 0.2,
        this.orderHeaderTableHeight
      );
      const orderNumberTextCell = this.$i18n.t(
        "orderNumberLibelle",
        this.languageVal
      );
      this.doc
        .setFontSize(9)
        .text(
          orderNumberTextCell,
          this.tableXPos + this.contentCellTableWidth * 5 + 1.7,
          ret + 10,
          { align: "left" }
        );
      this.doc.setFont("helvetica", "bold");
      this.doc
        .setFontSize(18)
        .text(
          inv["commandes"][ind].orderId.toString(),
          this.tableXPos + this.contentCellTableWidth * 6,
          ret + this.orderHeaderTableHeight - 10,
          {
            align: "center",
            maxWidth: (this.contentCellTableWidth - 1.7).toString(),
          }
        );
      ret += this.orderHeaderTableHeight;
      // INSERT SERVICES
      ret = this.insertServiceHead(ret);
      for (const k in inv["commandes"][ind]["Services"]) {
        // console.log(k);
        ret = this.insertServiceContent(inv["commandes"][ind], ret, k);
      }
      ret = this.insertOrderFoot(inv["commandes"][ind], ret);
      return ret;
    },
    insertServiceHead(yPos: number): number {
      let ret = yPos;
      // Description
      this.doc.setFont("helvetica", "bold");
      this.doc.rect(
        this.tableXPos,
        yPos,
        this.contentCellTableWidth * 2,
        this.serviceHeaderTableHeight
      );
      const descriptionTextCell = this.$i18n.t(
        "descriptionLibelle",
        this.languageVal
      );
      this.doc
        .setFontSize(10)
        .text(descriptionTextCell.toUpperCase(), this.contentXPos, ret + 10, {
          align: "left",
        });
      // Service ID
      this.doc.rect(
        this.tableXPos + this.contentCellTableWidth * 2,
        yPos,
        this.contentCellTableWidth,
        this.serviceHeaderTableHeight
      );
      const serviceNumberTextCell = this.$i18n.t(
        "serviceNumberLibelle",
        this.languageVal
      );
      this.doc.text(
        serviceNumberTextCell.toUpperCase(),
        this.tableXPos + this.contentCellTableWidth * 2 + 1.7,
        ret + 10,
        {
          align: "left",
          maxWidth: (this.contentCellTableWidth - 3.4).toString(),
        }
      );
      // Unit Price IT
      this.doc.rect(
        this.tableXPos + this.contentCellTableWidth * 3,
        yPos,
        this.contentCellTableWidth,
        this.serviceHeaderTableHeight
      );
      const unitPriceTextCell = this.$i18n.t(
        "ttUnitPriceLibelle",
        this.languageVal
      );
      this.doc.text(
        unitPriceTextCell.toUpperCase(),
        this.tableXPos + this.contentCellTableWidth * 3 + 1.7,
        ret + 10,
        {
          align: "left",
          maxWidth: (this.contentCellTableWidth - 3.4).toString(),
        }
      );
      // Quantity
      this.doc.rect(
        this.tableXPos + this.contentCellTableWidth * 4,
        yPos,
        this.contentCellTableWidth,
        this.serviceHeaderTableHeight
      );
      const quantityTextCell = this.$i18n.t(
        "quantityLibelle",
        this.languageVal
      );
      this.doc.text(
        quantityTextCell.toUpperCase(),
        this.tableXPos + this.contentCellTableWidth * 4 + 1.7,
        ret + 10,
        {
          align: "left",
          maxWidth: (this.contentCellTableWidth - 3.4).toString(),
        }
      );
      // Net price IT
      this.doc.rect(
        this.tableXPos + this.contentCellTableWidth * 5,
        yPos,
        this.contentCellTableWidth,
        this.serviceHeaderTableHeight
      );
      const netPriceTextCell = this.$i18n.t(
        "ttNetPriceLibelle",
        this.languageVal
      );
      this.doc.text(
        netPriceTextCell.toUpperCase(),
        this.tableXPos + this.contentCellTableWidth * 5 + 1.7,
        ret + 10,
        {
          align: "left",
          maxWidth: (this.contentCellTableWidth - 3.4).toString(),
        }
      );
      // Overall amount IT
      this.doc.rect(
        this.tableXPos + this.contentCellTableWidth * 6,
        yPos,
        this.contentCellTableWidth - 0.2,
        this.serviceHeaderTableHeight
      );
      const amountTextCell = this.$i18n.t(
        "ttOverallAmountLibelle",
        this.languageVal
      );
      this.doc.text(
        amountTextCell.toUpperCase(),
        this.tableXPos + this.contentCellTableWidth * 6 + 1.7,
        ret + 10,
        {
          align: "left",
          maxWidth: (this.contentCellTableWidth - 3.4).toString(),
        }
      );
      ret += this.serviceHeaderTableHeight;
      return ret;
    },
    insertServiceContent(ord: any, yPos: number, ind: number): number {
      // console.log(ord["Services"][ind]);
      if (ind == 0) yPos += 0.5;
      let ret = yPos;
      // Description
      this.doc.setFont("helvetica", "bold");
      this.doc.setFillColor("#BBBBBB");
      this.doc.rect(
        this.tableXPos,
        yPos,
        this.contentCellTableWidth * 2,
        this.serviceContentTableHeight,
        "F"
      );
      const descriptionTextCell = ord["Services"][ind].nom;
      this.doc
        .setFontSize(9)
        .text(
          descriptionTextCell,
          this.tableXPos + 1.7,
          ret + this.serviceContentTableHeight - 2,
          {
            align: "left",
            maxWidth: (this.contentCellTableWidth * 2 - 3.4).toString(),
          }
        );
      // Service ID
      this.doc.setFillColor("#FFFFFF");
      this.doc.rect(
        this.tableXPos + this.contentCellTableWidth * 2,
        yPos,
        this.contentCellTableWidth,
        this.serviceContentTableHeight,
        "F"
      );
      const serviceNumberTextCell = ord["Services"][ind].serviceId.toString();
      this.doc.text(
        serviceNumberTextCell.toUpperCase(),
        this.tableXPos + this.contentCellTableWidth * 2 + 1.7,
        ret + this.serviceContentTableHeight - 2,
        {
          align: "left",
          maxWidth: (this.contentCellTableWidth - 3.4).toString(),
        }
      );
      // Unit Price IT
      this.doc.setFillColor("#BBBBBB");
      this.doc.rect(
        this.tableXPos + this.contentCellTableWidth * 3,
        yPos,
        this.contentCellTableWidth,
        this.serviceContentTableHeight,
        "F"
      );
      const unitPriceTextCell = ord["Services"][ind].priceUnitTTLibelle;
      this.doc.text(
        unitPriceTextCell,
        this.tableXPos + this.contentCellTableWidth * 3 + 1.7,
        ret + this.serviceContentTableHeight - 2,
        {
          align: "left",
          maxWidth: (this.contentCellTableWidth - 3.4).toString(),
        }
      );
      // Quantity
      this.doc.setFillColor("#FFFFFF");
      this.doc.rect(
        this.tableXPos + this.contentCellTableWidth * 4,
        yPos,
        this.contentCellTableWidth,
        this.serviceContentTableHeight,
        "F"
      );
      const quantityTextCell = ord["Services"][ind].quantite.toString();
      this.doc.text(
        quantityTextCell,
        this.tableXPos + this.contentCellTableWidth * 4 + 1.7,
        ret + this.serviceContentTableHeight - 2,
        {
          align: "left",
          maxWidth: (this.contentCellTableWidth - 3.4).toString(),
        }
      );
      // Net price IT
      this.doc.setFillColor("#BBBBBB");
      this.doc.rect(
        this.tableXPos + this.contentCellTableWidth * 5,
        yPos,
        this.contentCellTableWidth,
        this.serviceContentTableHeight,
        "F"
      );
      const netPriceTextCell = ord["Services"][ind].montantNetTTLibelle;
      this.doc.text(
        netPriceTextCell,
        this.tableXPos + this.contentCellTableWidth * 5 + 1.7,
        ret + this.serviceContentTableHeight - 2,
        {
          align: "left",
          maxWidth: (this.contentCellTableWidth - 3.4).toString(),
        }
      );
      // Overall amount IT
      this.doc.setFillColor("#FFFFFF");
      this.doc.rect(
        this.tableXPos + this.contentCellTableWidth * 6,
        yPos,
        this.contentCellTableWidth - 0.2,
        this.serviceContentTableHeight,
        "F"
      );
      const amountTextCell = ord["Services"][ind].montantNetTTLibelle;
      this.doc.text(
        amountTextCell,
        this.tableXPos + this.contentCellTableWidth * 6 + 1.7,
        ret + this.serviceContentTableHeight - 2,
        {
          align: "left",
          maxWidth: (this.contentCellTableWidth - 3.4).toString(),
        }
      );
      ret += this.serviceContentTableHeight;
      if (ind == ord["Services"].length - 1) {
        this.doc
          .setLineWidth(1)
          .line(
            this.tableXPos + this.contentCellTableWidth * 5,
            ret + 0.5,
            this.tableXPos + this.contentCellTableWidth * 7,
            ret + 0.5
          );
        ret += 0.5;
      }
      return ret;
    },
    insertOrderFoot(ord: any, yPos: number): number {
      yPos += 0.5;
      let ret = yPos;
      // Footer
      this.doc.setFont("helvetica", "bold");
      this.doc.setFillColor("#FFFFFF");
      this.doc.rect(
        this.tableXPos,
        yPos,
        this.headerTableWidth,
        this.serviceHeaderTableHeight,
        "F"
      );
      const totalTextCell = this.$i18n.t("totalLibelle", this.languageVal);
      const totalValueTextCell = ord.totalTTLibelle;
      this.doc.setFontSize(10).text(totalTextCell, this.contentXPos, ret + 10, {
        align: "left",
        maxWidth: (this.headerTableWidth - 98.3).toString(),
      });
      this.doc.text(
        totalValueTextCell,
        this.tableXPos + this.headerTableWidth,
        ret + 10,
        {
          align: "right",
          maxWidth: "100",
        }
      );
      ret += this.serviceHeaderTableHeight;
      return ret;
    },
    insertInvoiceFoot(inv: any, yPos: number): number {
      yPos += 3;
      let ret = yPos;
      // Footer
      this.doc.setLineWidth(0.5);
      this.doc.rect(
        this.tableXPos,
        yPos,
        this.headerTableWidth,
        this.orderHeaderTableHeight
      );
      // VAT value
      this.doc.setFont("helvetica", "bold");
      const vatTextCell = this.$i18n.t("vatLibelle", this.languageVal);
      this.tableXPos +
        this.footerCellTableWidth +
        this.footerCellTableWidth / 2;
      this.doc
        .setFontSize(10)
        .text(
          vatTextCell,
          this.tableXPos + this.footerCellTableWidth * (1 + 1 / 2),
          ret + 15,
          { align: "center" }
        );
      this.doc.setFont("helvetica", "normal");
      const vatValueTextCell = inv.tvaValue.tvaValueLibelle;
      this.doc.text(
        vatValueTextCell,
        this.tableXPos + this.footerCellTableWidth + 1.7,
        ret + this.orderHeaderTableHeight - 3,
        {
          align: "left",
          maxWidth: (this.footerCellTableWidth - 3.4).toString(),
        }
      );
      // VAT base
      this.doc.setFont("helvetica", "bold");
      const vatBaseTextCell = this.$i18n.t("vatBaseLibelle", this.languageVal);
      this.doc.text(
        vatBaseTextCell,
        this.tableXPos + this.footerCellTableWidth * (1 + 1 + 1 / 2),
        ret + 15,
        { align: "center" }
      );
      this.doc.setFont("helvetica", "normal");
      const vatBaseValueTextCell = `${inv.tvaValue.tvaBaseLibelle} ${inv.devise}`;
      this.doc.text(
        vatBaseValueTextCell,
        this.tableXPos + this.footerCellTableWidth * 2 + 1.7,
        ret + this.orderHeaderTableHeight - 3,
        {
          align: "left",
          maxWidth: (this.footerCellTableWidth - 3.4).toString(),
        }
      );
      // VAT amount
      this.doc.setFont("helvetica", "bold");
      const vatAmountTextCell = this.$i18n.t(
        "vatAmountLibelle",
        this.languageVal
      );
      this.doc.text(
        vatAmountTextCell,
        this.tableXPos + this.footerCellTableWidth * (1 + 1 + 1 + 1 / 2),
        ret + 15,
        { align: "center" }
      );
      this.doc.setFont("helvetica", "normal");
      const vatAmountValueTextCell = `${inv.tvaValue.tvaMontantLibelle} ${inv.devise}`;
      this.doc.text(
        vatAmountValueTextCell,
        this.tableXPos + this.footerCellTableWidth * 3 + 1.7,
        ret + this.orderHeaderTableHeight - 3,
        {
          align: "left",
          maxWidth: (this.footerCellTableWidth - 3.4).toString(),
        }
      );
      // Total amount IT
      this.doc.setFont("helvetica", "bold");
      const ttTotalTextCell = this.$i18n.t("ttTotalLibelle", this.languageVal);
      this.doc.text(
        ttTotalTextCell,
        this.tableXPos + this.footerCellTableWidth * (1 + 1 + 1 + 1 + 1 / 2),
        ret + 15,
        { align: "center" }
      );
      this.doc.setFont("helvetica", "normal");
      const ttTotalValueTextCell = `${inv.invoiceTTPrice} ${inv.devise}`;
      this.doc.text(
        ttTotalValueTextCell,
        this.tableXPos + this.footerCellTableWidth * 4 + 1.7,
        ret + this.orderHeaderTableHeight - 3,
        {
          align: "left",
          maxWidth: (this.footerCellTableWidth - 3.4).toString(),
        }
      );

      ret += this.orderHeaderTableHeight;
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
          .then(
            (res) => {
              // console.log(res);
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
        this.invoicesDetails = invoicesObj;
        for (const key in this.contentsForPrint)
          this.buildAndSavePdf(this.contentsForPrint[key]);
      },
      immediate: true,
    },
  },
  mounted() {},
});
</script>

<i18n>
{
	"fr": {
		"invoiceLibelle": "Facture",
		"billingAddressLibelle": "Adresse de facturation :",
		"addContentLibelle": "Contenu additionnel :",
		"pdfViewLinkName": "PdfVue",
		"dateLibelle": "Date :",
	    "buyerLibelle": "Acheteur :",
	    "sellerLibelle": "Vendeur :",
	    "orderNumberLibelle": "Commande N°",
	    "descriptionLibelle": "Désignation",
	    "serviceNumberLibelle": "Identification service",
	    "ttUnitPriceLibelle": "Montant unitaire TTC",
	    "quantityLibelle": "Quantité",
	    "ttNetPriceLibelle": "Prix net TTC",
	    "ttOverallAmountLibelle": "Montant TTC",
	    "totalLibelle": "Total",
	    "vatLibelle": "TVA",
	    "vatBaseLibelle": "Base TVA",
	    "vatAmountLibelle": "Montant TVA",
	    "ttTotalLibelle": "Total TTC",

	    "languageTableHeadText": "Langue",
	    "deviseTableHeadText": "Devise",
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
		"invoiceLibelle": "Invoice",
		"billingAddressLibelle": "Billing address :",
		"addContentLibelle": "Additional content :",
		"dateLibelle": "Date :",
		"buyerLibelle": "Buyer :",
	    "sellerLibelle": "Seller :",
	    "orderNumberLibelle": "Order N#",
	    "descriptionLibelle": "Description",
	    "serviceNumberLibelle": "Service ID",
	    "ttUnitPriceLibelle": "Unit. Amount Incl. Taxes",
	    "quantityLibelle": "Quantity",
	    "ttNetPriceLibelle": "Net price Incl. Taxes",
	    "ttOverallAmountLibelle": "Amount Incl. Taxes",
	    "totalLibelle": "Total",
	    "vatLibelle": "VAT",
	    "vatBaseLibelle": "VAT Base",
	    "vatAmountLibelle": "VAT Amount",
	    "ttTotalLibelle": "Total Incl. Taxes",

		"pdfViewLinkName": "PdfView",
	    "languageTableHeadText": "Language",
	    "deviseTableHeadText": "Devise",
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
  <div></div>
</template>
<!--  
var width = doc.internal.pageSize.getWidth();
var height = doc.internal.pageSize.getHeight();
console.log(doc.getFontList());
console.log(width); // 1654.64mm - 595.28pt - 446.47px
console.log(height); // 2382.54mm - 841.89pt - 631.43px -->

<!-- case 'pt':  multiplier = 1;          break;
case 'mm':  multiplier = 72 / 25.4;  break;
case 'cm':  multiplier = 72 / 2.54;  break;
case 'in':  multiplier = 72;         break;
case 'px':  multiplier = 96 / 72;    break;
case 'pc':  multiplier = 12;         break;
case 'em':  multiplier = 12;         break;
case 'ex':  multiplier = 6; -->
