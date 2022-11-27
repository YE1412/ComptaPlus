<script lang="ts">
/*global __CRYPTAPI__, __KEY__*/
import { defineComponent, nextTick, ref } from "vue";
import { useInvoiceStore } from "@/stores/invoice";
import { useMessageStore } from "@/stores/message";
import MessagesItem from "../components/MessagesItem.vue";
import TableItem from "../components/TableItem.vue";
import { MDBCol, MDBRow, MDBInput } from "mdb-vue-ui-kit";
import invoiceAxiosService from "../services/invoice.service";
import ModalItem from "./ModalItem.vue";
const renderComponent = ref(true);
import "../globals";
import vSelect from "vue-select";

export default defineComponent({
  name: "InvoiceContent",
  props: {
    invoiceForm: {
      type: Boolean,
      default: () => false,
    },
    admin: {
      type: Boolean,
      required: true,
      default: () => true,
    },
    display: {
      type: Boolean,
      required: true,
      default: () => false,
    },
  },
  provide() {
    return { src: "invoices" };
  },
  async setup() {
    // console.log(`Setup`);
    const invoiceStore = useInvoiceStore();
    const messageStore = useMessageStore();
    const languagesObj = await invoiceStore
      .getAllLanguages()
      .then(
        (res) => {
          return res;
        },
        () => {
          return [];
        }
      )
      .catch((err) => {
        console.log(err);
        return [];
      });
    const devisesObj = await invoiceStore
      .getAllDevises()
      .then(
        (res) => {
          return res;
        },
        () => {
          return [];
        }
      )
      .catch((err) => {
        console.log(err);
        return [];
      });
    const sellersObj = await invoiceStore
      .getAllSellers()
      .then(
        (res) => {
          return res;
        },
        () => {
          return [];
        }
      )
      .catch((err) => {
        console.log(err);
        return [];
      });
    const buyersObj = await invoiceStore
      .getAllBuyers()
      .then(
        (res) => {
          return res;
        },
        () => {
          return [];
        }
      )
      .catch((err) => {
        console.log(err);
        return [];
      });
    const paymentsObj = await invoiceStore
      .getAllPayments()
      .then(
        (res) => {
          return res;
        },
        () => {
          return [];
        }
      )
      .catch((err) => {
        console.log(err);
        return [];
      });
    const ordersObj = await invoiceStore
      .getAllOrders()
      .then(
        (res) => {
          return res;
        },
        () => {
          return [];
        }
      )
      .catch((err) => {
        console.log(err);
        return [];
      });
    return {
      invoiceStore,
      messageStore,
      languagesObj,
      devisesObj,
      sellersObj,
      buyersObj,
      paymentsObj,
      ordersObj,
    };
  },
  beforeCreate() {
    // console.log(`Before Create`);
  },
  created() {
    // console.log(`Created`);
  },
  mounted() {},
  data() {
    // console.log(this.services);
    const headTable = this.invoiceForm
      ? [
          this.$i18n.t("dateTableHeadText"),
          this.$i18n.t("vatTableHeadText"),
          this.$i18n.t("languageTableHeadText"),
          this.$i18n.t("deviseTableHeadText"),
          this.$i18n.t("buyerTableHeadText"),
          this.$i18n.t("sellerTableHeadText"),
          this.$i18n.t("orderTableHeadText"),
          this.$i18n.t("paymentTableHeadText"),
          this.$i18n.t("actionTableHeadText"),
        ]
      : [
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
    let invoiceLanguagesOpt = [],
      invoiceDevisesOpt = [],
      invoiceBuyersOpt = [],
      invoiceSellersOpt = [],
      invoiceOrdersOpt = [],
      invoicePaymentsOpt = [];
    // Languages
    invoiceLanguagesOpt.push({
      text: this.$i18n.t("languageInputLabel"),
      value: 0,
      libelle: "default",
      nom: "default",
    });
    for (const key in this.languagesObj) {
      let langue = {};
      langue.text = this.languagesObj[key].libelle;
      langue.value = this.languagesObj[key].langueId;
      langue.libelle = this.languagesObj[key].libelle;
      langue.nom = this.languagesObj[key].nom;
      invoiceLanguagesOpt.push(langue);
    }
    // Devises
    invoiceDevisesOpt.push({
      text: this.$i18n.t("deviseInputLabel"),
      value: 0,
      symbole: "default",
    });
    for (const key in this.devisesObj) {
      let devise = {};
      devise.text = `${this.devisesObj[key].symbole} - ${this.devisesObj[key].libelle}`;
      devise.value = this.devisesObj[key].deviseId;
      devise.symbole = this.devisesObj[key].symbole;
      invoiceDevisesOpt.push(devise);
    }
    // Buyers
    invoiceBuyersOpt.push({
      text: this.$i18n.t("buyerInputLabel"),
      value: 0,
      email: "default",
      nom: "default",
      prenom: "default",
    });
    for (const key in this.buyersObj) {
      let buyer = {};
      buyer.text = `${this.buyersObj[key].actorId} - ${this.buyersObj[key].nom}`;
      buyer.value = this.buyersObj[key].actorId;
      buyer.email = this.buyersObj[key].email;
      buyer.nom = this.buyersObj[key].nom;
      buyer.prenom = this.buyersObj[key].prenom;
      invoiceBuyersOpt.push(buyer);
    }
    // Sellers
    invoiceSellersOpt.push({
      text: this.$i18n.t("sellerInputLabel"),
      value: 0,
      email: "default",
      nom: "default",
      prenom: "default",
    });
    for (const key in this.sellersObj) {
      let seller = {};
      seller.text = `${this.sellersObj[key].actorId} - ${this.sellersObj[key].nom}`;
      seller.value = this.sellersObj[key].actorId;
      seller.email = this.sellersObj[key].email;
      seller.nom = this.sellersObj[key].nom;
      seller.prenom = this.sellersObj[key].prenom;
      invoiceSellersOpt.push(seller);
    }
    // Orders
    invoiceOrdersOpt.push({
      text: this.$i18n.t("orderInputLabel"),
      value: 0,
      contenuAdditionnel: null,
      priceHt: 0,
    });
    for (const key in this.ordersObj) {
      let order = {};
      order.text = `${this.ordersObj[key].orderId} - ${this.ordersObj[key].priceHt}`;
      order.value = this.ordersObj[key].orderId;
      order.contenuAdditionnel = this.ordersObj[key].contenuAdditionnel;
      order.priceHt = this.ordersObj[key].priceHt;
      invoiceOrdersOpt.push(order);
    }
    // Payments
    invoicePaymentsOpt.push({
      text: this.$i18n.t("paymentInputLabel"),
      value: 0,
      etat: 0,
      paymentValue: 0,
      paymentType: 0,
    });
    for (const key in this.paymentsObj) {
      let payment = {};
      payment.text = `${this.paymentsObj[key].paymentId} - ${this.paymentsObj[key].paymentValue}`;
      payment.value = this.paymentsObj[key].paymentId;
      payment.etat = this.paymentsObj[key].etat;
      payment.paymentValue = this.paymentsObj[key].paymentValue;
      payment.paymentType = this.paymentsObj[key].paymentType;
      invoicePaymentsOpt.push(payment);
    }
    const addInputObj = {
      date: {
        value: "date",
        type: "date",
        label: this.$i18n.t("datePlaceholder"),
        name: "addFormInput",
        invalidFeed: "",
        validFeed: "",
        isValid: false,
        required: true,
        placeholder: this.$i18n.t("datePlaceholder"),
        size: "12",
        disabled: false,
      },
      tvaValue: {
        value: "tvaValue",
        type: "number",
        label: this.$i18n.t("vatInputLabel"),
        name: "addFormInput",
        invalidFeed: "",
        validFeed: "",
        isValid: false,
        required: true,
        placeholder: this.$i18n.t("vatPlaceholder"),
        size: "12",
        disabled: false,
      },
      languageId: {
        value: "",
        type: "",
        label: this.$i18n.t("languageInputLabel"),
        name: "addFormLanguageSelect",
        invalidFeed: "",
        validFeed: "",
        isValid: false,
        required: true,
        placeholder: this.$i18n.t("languagePlaceholder"),
        size: "12",
        disabled: false,
      },
      deviseId: {
        value: "",
        type: "",
        label: this.$i18n.t("deviseInputLabel"),
        name: "addFormDeviseSelect",
        invalidFeed: "",
        validFeed: "",
        isValid: false,
        required: true,
        placeholder: this.$i18n.t("devisePlaceholder"),
        size: "12",
        disabled: false,
      },
      buyerId: {
        value: "",
        type: "",
        label: this.$i18n.t("buyerInputLabel"),
        name: "addFormBuyerSelect",
        invalidFeed: "",
        validFeed: "",
        isValid: false,
        required: true,
        placeholder: this.$i18n.t("buyerPlaceholder"),
        size: "12",
        disabled: false,
      },
      sellerId: {
        value: "",
        type: "",
        label: this.$i18n.t("sellerInputLabel"),
        name: "addFormSellerSelect",
        invalidFeed: "",
        validFeed: "",
        isValid: false,
        required: true,
        placeholder: this.$i18n.t("sellerPlaceholder"),
        size: "12",
        disabled: false,
      },
      orderId: {
        value: "",
        type: "",
        label: this.$i18n.t("orderInputLabel"),
        name: "addFormOrderSelect",
        invalidFeed: "",
        validFeed: "",
        isValid: false,
        required: true,
        placeholder: this.$i18n.t("orderPlaceholder"),
        size: "12",
        disabled: false,
      },
      paymentId: {
        value: "",
        type: "",
        label: this.$i18n.t("paymentInputLabel"),
        name: "addFormPaymentSelect",
        invalidFeed: "",
        validFeed: "",
        isValid: false,
        required: false,
        placeholder: this.$i18n.t("paymentPlaceholder"),
        size: "12",
        disabled: false,
      },
    };
    return {
      tableHeading: headTable,
      messageVisibility: false,
      form: this.invoiceForm,
      // For adding
      update: false,
      add: true,
      addInputObject: addInputObj,
      factureId: 0,
      date: "",
      invoiceHTPrice: 0.0,
      invoiceTTPrice: 0.0,
      languageId: 0,
      deviseId: 0,
      tvaValue: 0,
      selectedInvoiceLanguage: null,
      invoiceLanguageOption: invoiceLanguagesOpt,
      selectedInvoiceDevise: null,
      invoiceDeviseOption: invoiceDevisesOpt,
      selectedInvoiceBuyer: null,
      invoiceBuyerOption: invoiceBuyersOpt,
      selectedInvoiceSeller: null,
      invoiceSellerOption: invoiceSellersOpt,
      selectedInvoiceOrder: null,
      invoiceOrdersOption: invoiceOrdersOpt,
      selectedInvoicePayment: null,
      invoicePaymentsOption: invoicePaymentsOpt,
      // For update
      updateInputObject: {},
      updateInputObjectId: 0,
      // For all
      errors: [],
      modalTitle: "",
      modalContent: "",
      invoiceModal: false,
      renderComponent: true,
      tableColSpan: "11",
    };
  },
  computed: {},
  components: {
    MessagesItem,
    TableItem,
    MDBCol,
    MDBRow,
    ModalItem,
    MDBInput,
    vSelect,
  },
  methods: {
    // setSelectedServicesForUpdate() {
    //   let ret = [];
    //   ret.push({
    //     text: this.$i18n.t("servicesPlaceholder"),
    //     value: 0,
    //     montantHt: 0,
    //     quantite: 0,
    //     nom: "default",
    //   });
    //   return this.serviceStore.getAllServices().then((res) => {
    //     for (const key in this.serviceStore.getServices) {
    //       let service = {};
    //       service.text = `${this.serviceStore.getServices[key].nom} - ${this.serviceStore.getServices[key].montantHt}`;
    //       service.value = this.serviceStore.getServices[key].serviceId;
    //       service.montantHt = this.serviceStore.getServices[key].montantHt;
    //       service.quantite = this.serviceStore.getServices[key].quantite;
    //       service.nom = this.serviceStore.getServices[key].nom;
    //       ret.push(service);
    //     }
    //     // console.log(ret);
    //     return ret;
    //   });
    // },
    async addClickFromChild(db: boolean) {
      if (!db) {
        // click to add new payment line
        this.form = true;
        this.update = false;
        this.add = true;
        this.tableHeading = [
          this.$i18n.t("dateTableHeadText"),
          this.$i18n.t("vatTableHeadText"),
          // this.$i18n.t("htPriceTableHeadText"),
          // this.$i18n.t("ttPriceTableHeadText"),
          this.$i18n.t("languageTableHeadText"),
          this.$i18n.t("deviseTableHeadText"),
          this.$i18n.t("buyerTableHeadText"),
          this.$i18n.t("sellerTableHeadText"),
          this.$i18n.t("orderTableHeadText"),
          this.$i18n.t("paymentTableHeadText"),
          this.$i18n.t("actionTableHeadText"),
        ];
      } else {
        // click to register a new payment
        this.errors = [];
        this.inputsCheck(this.addInputObject);

        if (!this.errors.length) {
          const ret = await this.insertNewInvoice();
          if (ret) {
            this.form = false;
            this.update = false;
            this.add = true;
            this.tableHeading = [
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
            this.invoiceStore
              .getAllInvoices()
              .then(
                () => {
                  this.forceTableRerender();
                },
                (ret) => {}
              )
              .catch((err) => {
                console.log(err);
                this.$router.go();
              });
          }
        }
      }
    },
    async updateClickFromChild(db: boolean, id: number, obj: any) {
      if (!db) {
        // click to update new payment line
        this.form = true;
        this.update = true;
        this.add = false;
        this.factureId = id;
        this.tableHeading = [
          this.$i18n.t("dateTableHeadText"),
          this.$i18n.t("vatTableHeadText"),
          // this.$i18n.t("htPriceTableHeadText"),
          // this.$i18n.t("ttPriceTableHeadText"),
          this.$i18n.t("languageTableHeadText"),
          this.$i18n.t("deviseTableHeadText"),
          this.$i18n.t("buyerTableHeadText"),
          this.$i18n.t("sellerTableHeadText"),
          this.$i18n.t("orderTableHeadText"),
          this.$i18n.t("paymentTableHeadText"),
          this.$i18n.t("actionTableHeadText"),
        ];
        // console.log(obj);
        const updateInputObj = {
          date: {
            value: obj["date"],
            type: "date",
            label: this.$i18n.t("datePlaceholder"),
            name: "addFormInput",
            invalidFeed: "",
            validFeed: "",
            isValid: true,
            required: true,
            placeholder: this.$i18n.t("datePlaceholder"),
            size: "12",
            disabled: false,
          },
          tvaValue: {
            value: obj["tvaValue"],
            type: "number",
            label: this.$i18n.t("vatInputLabel"),
            name: "addFormInput",
            invalidFeed: "",
            validFeed: "",
            isValid: false,
            required: true,
            placeholder: this.$i18n.t("vatPlaceholder"),
            size: "12",
            disabled: false,
          },
          languageId: {
            value: obj["langue"],
            type: "",
            label: this.$i18n.t("languageInputLabel"),
            name: "addFormLanguageSelect",
            invalidFeed: "",
            validFeed: "",
            isValid: false,
            required: true,
            placeholder: this.$i18n.t("languagePlaceholder"),
            size: "12",
            disabled: false,
          },
          deviseId: {
            value: obj["devise"],
            type: "",
            label: this.$i18n.t("deviseInputLabel"),
            name: "addFormDeviseSelect",
            invalidFeed: "",
            validFeed: "",
            isValid: false,
            required: true,
            placeholder: this.$i18n.t("devisePlaceholder"),
            size: "12",
            disabled: false,
          },
          buyerId: {
            value: obj["buyer"],
            type: "",
            label: this.$i18n.t("buyerInputLabel"),
            name: "addFormBuyerSelect",
            invalidFeed: "",
            validFeed: "",
            isValid: false,
            required: true,
            placeholder: this.$i18n.t("buyerPlaceholder"),
            size: "12",
            disabled: false,
          },
          sellerId: {
            value: obj["seller"],
            type: "",
            label: this.$i18n.t("sellerInputLabel"),
            name: "addFormSellerSelect",
            invalidFeed: "",
            validFeed: "",
            isValid: false,
            required: true,
            placeholder: this.$i18n.t("sellerPlaceholder"),
            size: "12",
            disabled: false,
          },
          ordersId: {
            value: obj["commandes"],
            type: "",
            label: this.$i18n.t("orderInputLabel"),
            name: "addFormOrderSelect",
            invalidFeed: "",
            validFeed: "",
            isValid: false,
            required: true,
            placeholder: this.$i18n.t("orderPlaceholder"),
            size: "12",
            disabled: false,
          },
          paymentsId: {
            value: obj["payments"],
            type: "",
            label: this.$i18n.t("paymentInputLabel"),
            name: "addFormPaymentSelect",
            invalidFeed: "",
            validFeed: "",
            isValid: false,
            required: true,
            placeholder: this.$i18n.t("paymentPlaceholder"),
            size: "12",
            disabled: false,
          },
        };
        this.updateInputObject = updateInputObj;
        this.updateInputObjectId = id;
      } else {
        // click to update payment
        this.errors = [];
        this.inputsCheck(this.updateInputObject);

        if (!this.errors.length) {
          // console.log("perfect !");
          const ret = await this.updateInvoice();
          if (ret) {
            this.form = false;
            this.update = false;
            this.add = true;
            this.tableHeading = [
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
            this.invoiceStore
              .getAllInvoices()
              .then(
                () => {
                  this.forceTableRerender();
                },
                () => {}
              )
              .catch((err) => {
                console.log(err);
                this.$router.go();
              });
          }
        }
      }
    },
    async deleteClickFromChild(id: number) {
      // click to delete an payment
      this.factureId = id;
      const ret = await this.deleteInvoice();
      if (ret) {
        this.form = false;
        this.update = false;
        this.add = true;
        this.invoiceStore
          .getAllInvoices()
          .then(
            (res) => {
              // console.log(res);
              this.forceTableRerender();
            },
            (ret) => {
              // console.log(ret);
              this.forceTableRerender();
            }
          )
          .catch((err) => {
            console.log(err);
            this.$router.go();
          });
      }
    },
    inputChanges(e: Event) {
      switch (e.target.getAttribute("aria-label")) {
        case "date":
          this.date = e.target.value;
          break;
        case "tvaValue":
          this.tvaValue = parseFloat(e.target.value);
          break;
        default:
          break;
      }
    },
    inputOrderChanges(e: any) {
      // console.log(e);
      // console.log(e.priceHt);
      // this.paymentValue = null;
      this.invoiceHTPrice = parseFloat(e[0].priceHt);
      // console.log(this.invoiceHTPrice);
    },
    validDate: function () {
      return true;
    },
    validInvoiceHTPrice: function () {
      return parseFloat(this.invoiceHTPrice) > 0.0;
    },
    validInvoiceTTPrice: function () {
      return parseFloat(this.invoiceTTPrice) > 0.0;
    },
    validLanguageId: function () {
      return true;
    },
    validDeviseId: function () {
      return true;
    },
    validTvaValue: function () {
      return this.tvaValue < 1.0 && this.tvaValue > 0.0;
    },
    validBuyerId: function () {
      return true;
    },
    validSellerId: function () {
      return true;
    },
    validOrderId: function () {
      return true;
    },
    valiPaymentId: function () {
      return true;
    },
    transformObject(obj) {
      for (const k in obj) {
        if (typeof obj[k] === "string") {
          obj[k] = __CRYPTAPI__.crypt(obj[k], __KEY__);
        } else if (typeof obj[k] === "object") {
          this.transformObject(obj[k]);
        }
      }
    },
    transformValue(val: string) {
      const ret = __CRYPTAPI__.crypt(val, __KEY__);
      return ret;
    },
    insertNewInvoice() {
      // console.log(this.invoiceHTPrice);
      // console.log(this.invoiceTTPrice);
      const obj = {
        date: this.date,
        invoiceHTPrice: this.invoiceHTPrice,
        invoiceTTPrice: this.invoiceTTPrice,
        languageId: this.languageId,
        deviseId: this.deviseId,
        tvaValue: this.tvaValue,
        buyerId: this.buyerId,
        sellerId: this.sellerId,
        orders: this.selectedInvoiceOrder,
        payments: this.selectedInvoicePayment,
      };
      this.transformObject(obj);
      // console.log(obj);
      return invoiceAxiosService
        .create(obj)
        .then((res) => {
          // MESSAGES
          this.messageStore.messages.push({
            severity: false,
            content: this.$i18n.t("modalAddContentOk"),
          });
          this.messageVisibility = true;
          this.messageStore.messagesVisibility = true;
          return true;
        })
        .catch((err) => {
          // MESSAGES
          this.messageStore.messages.push({
            severity: true,
            content: this.$i18n.t("modalAddContentKo", {
              err: err.response.data.message || err.message,
            }),
          });
          this.messageVisibility = true;
          this.messageStore.messagesVisibility = true;
          return false;
        });
    },
    updateInvoice() {
      // console.log(this.invoiceHTPrice);
      // console.log(this.invoiceTTPrice);
      const obj = {
        date: this.date,
        invoiceHTPrice: this.invoiceHTPrice,
        invoiceTTPrice: this.invoiceTTPrice,
        languageId: this.languageId,
        deviseId: this.deviseId,
        tvaValue: this.tvaValue,
        buyerId: this.buyerId,
        sellerId: this.sellerId,
        orders: this.selectedInvoiceOrder,
        payments: this.selectedInvoicePayment,
      };
      this.transformObject(obj);
      // console.log(obj);
      return invoiceAxiosService
        .update(this.factureId, obj)
        .then((res) => {
          // MESSAGES
          this.messageStore.messages.push({
            severity: false,
            content: this.$i18n.t("modalUpdateContentOk"),
          });
          this.messageVisibility = true;
          this.messageStore.messagesVisibility = true;
          return true;
        })
        .catch((err) => {
          // MESSAGES
          this.messageStore.messages.push({
            severity: true,
            content: this.$i18n.t("modalUpdateContentKo", {
              err: err.response.data.message || err.message,
            }),
          });
          this.messageVisibility = true;
          this.messageStore.messagesVisibility = true;
          return false;
        });
    },
    deleteInvoice() {
      return invoiceAxiosService
        .delete(this.factureId)
        .then((res) => {
          // MESSAGES
          this.messageStore.messages.push({
            severity: false,
            content: this.$i18n.t("modalDeleteContentOk"),
          });
          this.messageVisibility = true;
          this.messageStore.messagesVisibility = true;
          return true;
        })
        .catch((err) => {
          // MESSAGES
          this.messageStore.messages.push({
            severity: true,
            content: this.$i18n.t("modalDeleteContentKo", {
              err: err.response.data.message || err.message,
            }),
          });
          this.messageVisibility = true;
          this.messageStore.messagesVisibility = true;
          return false;
        });
    },
    inputsCheck(obj: any) {
      // DATE
      if (!this.date) {
        this.errors.push(this.$i18n.t("emptyDateInvalidFeed"));
        obj["date"].isValid = false;
        obj["date"].invalidFeed = this.$i18n.t("emptyDateInvalidFeed");
      } else if (!this.validDate()) {
        this.errors.push(this.$i18n.t("errorDateInvalidFeed"));
        obj["date"].isValid = false;
        obj["date"].invalidFeed = this.$i18n.t("errorDateInvalidFeed");
      } else {
        this.date = new Date(this.date);
        obj["date"].isValid = true;
        obj["date"].validFeed = this.$i18n.t("validFeed");
        obj["date"].invalidFeed = "";
      }
      // LANGUAGE
      if (this.selectedInvoiceLanguage === null) {
        this.errors.push(this.$i18n.t("emptyLanguageInvalidFeed"));
        this.modalTitle = this.$i18n.t("modalTitleKo");
        this.modalContent = this.$i18n.t("modalAddContentKo", {
          err: this.$i18n.t("emptyLanguageInvalidFeed"),
        });
        this.invoiceModal = true;
      } else {
        this.languageId = this.selectedInvoiceLanguage.value;
      }
      // DEVISE
      if (this.selectedInvoiceDevise === null) {
        this.errors.push(this.$i18n.t("emptyDeviseInvalidFeed"));
        this.modalTitle = this.$i18n.t("modalTitleKo");
        this.modalContent = this.$i18n.t("modalAddContentKo", {
          err: this.$i18n.t("emptyDeviseInvalidFeed"),
        });
        this.invoiceModal = true;
      } else {
        this.deviseId = this.selectedInvoiceDevise.value;
      }
      // TVA
      if (!this.tvaValue) {
        this.errors.push(this.$i18n.t("emptyVatInvalidFeed"));
        obj["tvaValue"].isValid = false;
        obj["tvaValue"].invalidFeed = this.$i18n.t("emptyVatInvalidFeed");
      } else if (!this.validTvaValue()) {
        this.errors.push(this.$i18n.t("errorVatInvalidFeed"));
        obj["tvaValue"].isValid = false;
        obj["tvaValue"].invalidFeed = this.$i18n.t("errorVatInvalidFeed");
      } else {
        obj["tvaValue"].isValid = true;
        obj["tvaValue"].validFeed = this.$i18n.t("validFeed");
        obj["tvaValue"].invalidFeed = "";
      }
      // BUYER
      if (this.selectedInvoiceBuyer === null) {
        this.errors.push(this.$i18n.t("emptyBuyerInvalidFeed"));
        this.modalTitle = this.$i18n.t("modalTitleKo");
        this.modalContent = this.$i18n.t("modalAddContentKo", {
          err: this.$i18n.t("emptyBuyerInvalidFeed"),
        });
        this.invoiceModal = true;
      } else {
        this.buyerId = this.selectedInvoiceBuyer.value;
      }
      // SELLER
      if (this.selectedInvoiceSeller === null) {
        this.errors.push(this.$i18n.t("emptySellerInvalidFeed"));
        this.modalTitle = this.$i18n.t("modalTitleKo");
        this.modalContent = this.$i18n.t("modalAddContentKo", {
          err: this.$i18n.t("emptySellerInvalidFeed"),
        });
        this.invoiceModal = true;
      } else {
        this.sellerId = this.selectedInvoiceSeller.value;
      }
      // ORDERS
      if (this.selectedInvoiceOrder === null) {
        this.errors.push(this.$i18n.t("emptyOrderInvalidFeed"));
        this.modalTitle = this.$i18n.t("modalTitleKo");
        this.modalContent = this.$i18n.t("modalAddContentKo", {
          err: this.$i18n.t("emptyOrderInvalidFeed"),
        });
        this.invoiceModal = true;
      } else {
        if (this.tvaValue)
          this.invoiceTTPrice =
            parseFloat(this.invoiceHTPrice) +
            parseFloat(this.invoiceHTPrice) * parseFloat(this.tvaValue);
      }
      // PAYMENTS
      // if (this.selectedInvoicePayment === null){
      //   this.errors.push(this.$i18n.t("emptyPaymentInvalidFeed"));
      //   this.modalTitle = this.$i18n.t("modalTitleKo");
      //   this.modalContent = this.$i18n.t("modalAddContentKo", {
      //     err: this.$i18n.t("emptyPaymentInvalidFeed"),
      //   });
      //   this.invoiceModal = true;
      // }
    },
    async forceTableRerender() {
      // Remove MyComponent from the DOM
      this.renderComponent = false;

      // Wait for the change to get flushed to the DOM
      await this.$nextTick();

      // Add the component back in
      this.renderComponent = true;
    },
    modalChange(val: boolean) {
      this.invoiceModal = val;
    },
  },
});
</script>

<i18n>
{
  "fr": {
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
    "emptyTableBodyContentText": "Aucune facture.",
    "addButtonText": "Ajouter",
    "updateButtonText": "Modifier",
    "deleteButtonText": "Suppimer",
    "actionTableHeadText": "Actions",

    "datePlaceholder": "Date",
    "emptyDateInvalidFeed": "La date doit être renseignée!",
    "errorDateInvalidFeed": "Date incorrecte!",
    "languagePlaceholder": "Langue",
    "emptyLanguageInvalidFeed": "La langue de la facture doit être renseignée!",
    "errorLanguageInvalidFeed": "Langue incorrecte!",
    "devisePlaceholder": "Devise",
    "emptyDeviseInvalidFeed": "La devise doit être renseignée!",
    "errorDeviseInvalidFeed": "Devise incorrecte!",
    "vatPlaceholder": "TVA",
    "emptyVatInvalidFeed": "La TVA doit être renseignée!",
    "errorVatInvalidFeed": "TVA incorrecte, la valeur de TVA doit être comprise entre 0 et 1!",
    "buyerPlaceholder": "Acheteur",
    "emptyBuyerInvalidFeed": "L'acheteur doit être renseigné!",
    "errorBuyerInvalidFeed": "Acheteur incorrect!",
    "sellerPlaceholder": "Vendeur",
    "emptySellerInvalidFeed": "Le vendeur doit être renseigné!",
    "errorSellerInvalidFeed": "Vendeur incorrect!",
    "orderPlaceholder": "Commande(s)",
    "emptyOrderInvalidFeed": "La commande doit être renseignée!",
    "errorOrderInvalidFeed": "Commande incorrecte!",
    "paymentPlaceholder": "Paiement(s)",
    "emptyPaymentInvalidFeed": "Le paiement doit être renseignée!",
    "errorPaymentInvalidFeed": "Paiement incorrect!",
    "validFeed": "Validé!",

    "modalCloseBtnText": "Fermer",
    "modalTitleOk": "Cool !",
    "modalAddContentOk": "Facture ajouté avec succès !",
    "modalUpdateContentOk": "Facture mis à jour avec succès !",
    "modalDeleteContentOk": "Facture supprimé avec succès !",
    "modalTitleKo": "Oups !",
    "modalAddContentKo": "Une erreur est survenue lors de l'ajout de la facture : {err}",
    "modalUpdateContentKo": "Une erreur est survenue lors de la modification de la facture : {err}!",
    "modalDeleteContentKo": "Une erreur est survenue lors de la suppression de la facture : {err}!",

    "dateInputLabel": "Date",
    "languageInputLabel": "Langues",
    "deviseInputLabel": "Devises",
    "vatInputLabel": "TVA",
    "buyerInputLabel": "Acheteurs",
    "sellerInputLabel": "Vendeurs",
    "orderInputLabel": "Commandes",
    "paymentInputLabel": "Paiements",

    "invoicesLinkTarget": "/factures"
  },
  "en": {
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
    "emptyTableBodyContentText": "No Invoice.",
    "addButtonText": "Add",
    "updateButtonText": "Update",
    "deleteButtonText": "Delete",
    "actionTableHeadText": "Actions",

    "datePlaceholder": "Date",
    "emptyDateInvalidFeed": "Date can't be empty!",
    "errorDateInvalidFeed": "Bad date supplied!",
    "languagePlaceholder": "Language",
    "emptyLanguageInvalidFeed": "Language can't be empty!",
    "errorLanguageInvalidFeed": "Bad language supplied!",
    "devisePlaceholder": "Devise",
    "emptyDeviseInvalidFeed": "Devise can't be empty!",
    "errorDeviseInvalidFeed": "Bad devise supplied!",
    "vatPlaceholder": "VAT",
    "emptyVatInvalidFeed": "VAT can't be empty!",
    "errorVatInvalidFeed": "Bad VAT supplied, the VAT value must be greater than 0 and lower than 1!",
    "buyerPlaceholder": "Buyer",
    "emptyBuyerInvalidFeed": "Buyer can't be empty!",
    "errorBuyerInvalidFeed": "Bad buyer supplied!",
    "sellerPlaceholder": "Seller",
    "emptySellerInvalidFeed": "Seller can't be empty!",
    "errorSellerInvalidFeed": "Bad seller supplied!",
    "orderPlaceholder": "Order(s)",
    "emptyOrderInvalidFeed": "Order can't be empty!",
    "errorOrderInvalidFeed": "Bad order supplied!",
    "paymentPlaceholder": "Payment(s)",
    "emptyPaymentInvalidFeed": "Payment can't be empty!",
    "errorPaymentInvalidFeed": "Bad payment supplied!",
    "validFeed": "Ok!",

    "modalCloseBtnText": "Close",
    "modalTitleOk": "Great !",
    "modalAddContentOk": "Invoice added successfully !",
    "modalUpdateContentOk": "Invoice updated successfully !",
    "modalDeleteContentOk": "Invoice deleted successfully !",
    "modalTitleKo": "Error !",
    "modalAddContentKo": "An error occured while adding invoice : {err}",
    "modalUpdateContentKo": "An error occured while updating invoice : {err} !",
    "modalDeleteContentKo": "An error occured while deleting invoice : {err} !",

    "dateInputLabel": "Date",
    "languageInputLabel": "Languages",
    "deviseInputLabel": "Devises",
    "vatInputLabel": "VAT",
    "buyerInputLabel": "Buyers",
    "sellerInputLabel": "Sellers",
    "orderInputLabel": "Orders",
    "paymentInputLabel": "Payments",

    "invoicesLinkTarget": "/invoices"
  }
}
</i18n>

<template>
  <MessagesItem v-if="messageStore.getMessagesVisibility"></MessagesItem>
  <div class="container">
    <TableItem
      :isForm="form"
      :tableHead="tableHeading"
      :emptyTableText="$t('emptyTableBodyContentText')"
      addActionName="addClick"
      ident="factureId"
      @addClick="addClickFromChild"
      updateActionName="updateClick"
      @updateClick="updateClickFromChild"
      deleteActionName="deleteClick"
      @deleteClick="deleteClickFromChild"
      :updating="update"
      :adding="add"
      :addObj="addInputObject"
      :updateObj="updateInputObject"
      :updateObjId="updateInputObjectId"
      v-if="renderComponent"
      :admin="admin"
      :display="display"
      :colSpan="tableColSpan"
    >
      <template #actionAddButton>
        <button type="button" class="btn btn-primary btn-rounded btn-sm my-0">
          {{ $t("addButtonText") }}
        </button>
      </template>
      <template #actionUpdateButton>
        <button type="button" class="btn btn-warning btn-rounded btn-sm my-0">
          {{ $t("updateButtonText") }}
        </button>
      </template>
      <template #actionDeleteButton>
        <button type="button" class="btn btn-danger btn-rounded btn-sm my-0">
          {{ $t("deleteButtonText") }}
        </button>
      </template>
      <template
        #addFormInput="{
          size,
          inputGroup,
          ariaLabel,
          label,
          model,
          invalidFeedback,
          validFeedback,
          isValid,
          isValidated,
          required,
          placeholder,
          type,
        }"
      >
        <MDBRow class="g-3 d-flex justify-content-center">
          <MDBCol :md="size">
            <MDBInput
              :inputGroup="inputGroup"
              :aria-label="ariaLabel"
              aria-describedby="basic"
              :label="label"
              :model="model"
              :invalidFeedback="invalidFeedback"
              :validFeedback="validFeedback"
              :isValid="isValid"
              :isValidated="isValidated"
              :required="required"
              :placeholder="placeholder"
              :type="type"
              @input="inputChanges($event)"
            >
            </MDBInput>
          </MDBCol>
        </MDBRow>
      </template>
      <template #addFormLanguageSelect="{ size, ariaLabel, required }">
        <MDBRow class="g-3 d-flex justify-content-center">
          <MDBCol :md="size" class="input-group">
            <vSelect
              :required="required"
              :aria-label="ariaLabel"
              label="text"
              v-model="selectedInvoiceLanguage"
              :multiple="false"
              :options="invoiceLanguageOption"
              inputId="language"
              class="custom-select w-100"
              :selectable="(option) => option.value !== 0"
            >
              <template #search="{ attributes, events }">
                <input
                  class="vs__search"
                  :required="!selectedInvoiceLanguage"
                  v-bind="attributes"
                  v-on="events"
                />
              </template>
            </vSelect>
          </MDBCol>
        </MDBRow>
      </template>
      <template #addFormDeviseSelect="{ size, ariaLabel, required }">
        <MDBRow class="g-3 d-flex justify-content-center">
          <MDBCol :md="size" class="input-group">
            <vSelect
              :required="required"
              :aria-label="ariaLabel"
              label="text"
              v-model="selectedInvoiceDevise"
              :multiple="false"
              :options="invoiceDeviseOption"
              inputId="devise"
              class="custom-select w-100"
              :selectable="
                (option) => option.value !== 0 || option.value !== 'default'
              "
            >
              <template #search="{ attributes, events }">
                <input
                  class="vs__search"
                  :required="!selectedInvoiceDevise"
                  v-bind="attributes"
                  v-on="events"
                />
              </template>
            </vSelect>
          </MDBCol>
        </MDBRow>
      </template>
      <template #addFormBuyerSelect="{ size, ariaLabel, required }">
        <MDBRow class="g-3 d-flex justify-content-center">
          <MDBCol :md="size" class="input-group">
            <vSelect
              :required="required"
              :aria-label="ariaLabel"
              label="text"
              v-model="selectedInvoiceBuyer"
              :multiple="false"
              :options="invoiceBuyerOption"
              inputId="buyer"
              class="custom-select w-100"
              :selectable="
                (option) => option.value !== 0 || option.value !== 'default'
              "
            >
              <template #search="{ attributes, events }">
                <input
                  class="vs__search"
                  :required="!selectedInvoiceBuyer"
                  v-bind="attributes"
                  v-on="events"
                />
              </template>
            </vSelect>
          </MDBCol>
        </MDBRow>
      </template>
      <template #addFormSellerSelect="{ size, ariaLabel, required }">
        <MDBRow class="g-3 d-flex justify-content-center">
          <MDBCol :md="size" class="input-group">
            <vSelect
              :required="required"
              :aria-label="ariaLabel"
              label="text"
              v-model="selectedInvoiceSeller"
              :multiple="false"
              :options="invoiceSellerOption"
              inputId="sellers"
              class="custom-select w-100"
              :selectable="
                (option) => option.value !== 0 || option.value !== 'default'
              "
            >
              <template #search="{ attributes, events }">
                <input
                  class="vs__search"
                  :required="!selectedInvoiceSeller"
                  v-bind="attributes"
                  v-on="events"
                />
              </template>
            </vSelect>
          </MDBCol>
        </MDBRow>
      </template>
      <template #addFormOrderSelect="{ size, ariaLabel, required }">
        <MDBRow class="g-3 d-flex justify-content-center">
          <MDBCol :md="size" class="input-group">
            <!-- <div class="input-group-prepend">
              <label class="input-group-text" for="services">
                {{ label }}
              </label>
            </div> -->
            <vSelect
              :required="required"
              :aria-label="ariaLabel"
              label="text"
              v-model="selectedInvoiceOrder"
              :multiple="true"
              :options="invoiceOrdersOption"
              inputId="orders"
              class="custom-select w-100"
              :selectable="(option) => option.value !== 0"
              @option:selected="inputOrderChanges($event)"
            >
              <template #search="{ attributes, events }">
                <input
                  class="vs__search"
                  :required="!selectedInvoiceOrder"
                  v-bind="attributes"
                  v-on="events"
                />
              </template>
            </vSelect>
          </MDBCol>
        </MDBRow>
      </template>
      <template #addFormPaymentSelect="{ size, ariaLabel, required }">
        <MDBRow class="g-3 d-flex justify-content-center">
          <MDBCol :md="size" class="input-group">
            <vSelect
              :required="required"
              :aria-label="ariaLabel"
              label="text"
              v-model="selectedInvoicePayment"
              :multiple="true"
              :options="invoicePaymentsOption"
              inputId="payments"
              class="custom-select w-100"
              :selectable="(option) => option.value !== 0"
            >
              <template #search="{ attributes, events }">
                <input
                  class="vs__search"
                  :required="!selectedInvoicePayment"
                  v-bind="attributes"
                  v-on="events"
                />
              </template>
            </vSelect>
          </MDBCol>
        </MDBRow>
      </template>
    </TableItem>
  </div>
  <ModalItem
    @invoiceModal="modalChange"
    input="invoiceModal"
    id="invoiceModal"
    tabIndex="-1"
    labelledBy="invoiceModal"
    :model="invoiceModal"
    :centered="true"
    :modalTitle="modalTitle"
    :modalContent="modalContent"
    :modalCloseBtnText="$t('modalCloseBtnText')"
    :staticBackdrop="true"
  >
  </ModalItem>
</template>
