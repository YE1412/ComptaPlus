<script lang="ts">
/*global __CRYPTAPI__, __KEY__*/
import { defineComponent, nextTick, ref } from "vue";
import { usePaymentStore } from "@/stores/payment";
import { useMessageStore } from "@/stores/message";
import MessagesItem from "../components/MessagesItem.vue";
import TableItem from "../components/TableItem.vue";
import { MDBCol, MDBRow, MDBInput } from "mdb-vue-ui-kit";
import paymentAxiosService from "../services/payment.service";
import ModalItem from "./ModalItem.vue";
const renderComponent = ref(true);
import "../globals";
import { VSelect }from "vuetify/components";

export default defineComponent({
  name: "PaymentContent",
  props: {
    paymentForm: {
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
    return { src: "payments" };
  },
  async setup() {
    // console.log(`Setup`);
    const paymentStore = usePaymentStore();
    const messageStore = useMessageStore();
    const typesObj = await paymentStore
      .getAllPaymentTypes()
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
    const invoicesObj = await paymentStore
      .getAllInvoices()
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
    return { paymentStore, messageStore, typesObj, invoicesObj };
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
    const headTable = [
      this.$i18n.t("stateTableHeadText"),
      this.$i18n.t("valueTableHeadText"),
      this.$i18n.t("typeTableHeadText"),
      // this.$i18n.t("orderTableHeadText"),
      this.$i18n.t("invoiceTableHeadText"),
      this.$i18n.t("actionTableHeadText"),
    ];
    let paymentTypesOpt = [],
      paymentStatesOpt = [],
      paymentInvoicesOpt = [];
    // paymentOrdersOpt = [];
    // paymentStatesOpt.push({
    //   text: this.$i18n.t("stateInputLabel"),
    //   value: "default",
    // });
    paymentStatesOpt.push({
      text: this.$i18n.t("stateOkLibelle"),
      value: true,
    });
    paymentStatesOpt.push({
      text: this.$i18n.t("stateKoLibelle"),
      value: false,
    });
    // paymentTypesOpt.push({
    //   text: this.$i18n.t("typeInputLabel"),
    //   value: 0,
    //   cb: false,
    //   esp: false,
    //   chq: false,
    // });
    for (const key in this.typesObj) {
      let type = {},
        libelle = "";
      libelle = this.typesObj[key].cb ? this.$i18n.t("typeCBLibelle") : "";
      libelle = this.typesObj[key].esp
        ? this.$i18n.t("typeESPLibelle")
        : libelle;
      libelle = this.typesObj[key].chq
        ? this.$i18n.t("typeCHQLibelle")
        : libelle;
      type.text = libelle;
      type.value = this.typesObj[key].paymentTypeId;
      type.cb = this.typesObj[key].cb;
      type.esp = this.typesObj[key].esp;
      type.chq = this.typesObj[key].chq;
      paymentTypesOpt.push(type);
    }
    // paymentInvoicesOpt.push({
    //   text: this.$i18n.t("invoiceInputLabel"),
    //   value: 0,
    //   invoiceTTPrice: 0,
    // });
    for (const key in this.invoicesObj) {
      let invoice = {};
      invoice.text = `${this.invoicesObj[key].factureId} - ${this.invoicesObj[key].invoiceTTPrice}`;
      invoice.value = this.invoicesObj[key].factureId;
      invoice.invoiceTTPrice = this.invoicesObj[key].invoiceTTPrice;
      paymentInvoicesOpt.push(invoice);
    }
    const addInputObj = {
      etat: {
        value: "",
        type: "",
        label: "text",
        name: "addFormStateSelect",
        invalidFeed: "",
        validFeed: "",
        isValid: true,
        required: true,
        placeholder: this.$i18n.t("statePlaceholder"),
        size: "12",
        disabled: false,
      },
      paymentValue: {
        value: "",
        type: "number",
        label: this.$i18n.t("valueInputLabel"),
        name: "addFormInput",
        invalidFeed: "",
        validFeed: "",
        isValid: false,
        required: true,
        placeholder: this.$i18n.t("valuePlaceholder"),
        size: "12",
        disabled: false,
      },
      paymentType: {
        value: "",
        type: "",
        label: this.$i18n.t("typeInputLabel"),
        name: "addFormTypeSelect",
        invalidFeed: "",
        validFeed: "",
        isValid: false,
        required: true,
        placeholder: this.$i18n.t("typePlaceholder"),
        size: "12",
        disabled: false,
      },
      // paymentOrder: {
      //   value: "",
      //   type: "",
      //   label: this.$i18n.t("orderInputLabel"),
      //   name: "addFormOrderSelect",
      //   invalidFeed: "",
      //   validFeed: "",
      //   isValid: false,
      //   required: true,
      //   placeholder: this.$i18n.t("orderPlaceholder"),
      //   size: "12",
      //   disabled: false,
      // },
      factureId: {
        value: "",
        type: "",
        label: this.$i18n.t("invoiceInputLabel"),
        name: "addFormInvoiceSelect",
        invalidFeed: "",
        validFeed: "",
        isValid: false,
        required: true,
        placeholder: this.$i18n.t("invoicePlaceholder"),
        size: "12",
        disabled: false,
      },
    };
    return {
      tableHeading: headTable,
      messageVisibility: false,
      form: this.paymentForm,
      // For adding
      update: false,
      add: true,
      addInputObject: addInputObj,
      paymentId: 0,
      etat: "",
      paymentValue: null,
      paymentType: 0,
      factureId: 0,
      // orderId: 0,
      selectedPaymentType: null,
      paymentTypesOption: paymentTypesOpt,
      paymentTypeError: true,
      paymentTypeErrorMsg: "",
      selectedPaymentState: null,
      paymentStatesOption: paymentStatesOpt,
      paymentStateError: true,
      paymentStateErrorMsg: "",
      selectedPaymentInvoice: null,
      paymentInvoicesOption: paymentInvoicesOpt,
      paymentInvoiceError: false,
      paymentInvoiceErrorMsg: "",
      // selectedPaymentOrder: null,
      // paymentOrdersOption: paymentOrdersOpt,
      // For update
      updateInputObject: {},
      updateInputObjectId: 0,
      // For all
      errors: [],
      modalTitle: "",
      modalContent: "",
      paymentModal: false,
      renderComponent: true,
      tableColSpan: "5",
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
    VSelect,
  },
  methods: {
    // setSelectedInvoicesForUpdate() {
    //   let ret = [];
    //   ret.push({
    //     text: this.$i18n.t("invoicesPlaceholder"),
    //     value: 0,
    //     invoiceTTPrice: 0,
    //   });
    //   return this.paymentStore.getAllInvoices().then((res) => {
    //     for (const key in this.paymentStore.getInvoices) {
    //       let invoice = {};
    //       invoice.text = `${this.paymentStore.getInvoices[key].factureId} - ${this.paymentStore.getInvoices[key].invoiceTTPrice}`;
    //       invoice.value = this.paymentStore.getInvoices[key].factureId;
    //       ret.push(invoice);
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
      } else {
        // click to register a new payment
        this.errors = [];
        // console.log(this.selectedPaymentState);
        // console.log(this.paymentValue);
        // console.log(this.selectedPaymentType);
        // console.log(this.selectedPaymentOrder);
        this.inputsCheck(this.addInputObject);

        if (!this.errors.length) {
          const ret = await this.insertNewPayment();
          if (ret) {
            this.form = false;
            this.update = false;
            this.add = true;
            this.paymentStore
              .getAllPayments()
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
        this.paymentId = id;
        // console.log(obj);
        const updateInputObj = {
          etat: {
            value: obj["etat"],
            type: "",
            label: "text",
            name: "addFormStateSelect",
            invalidFeed: "",
            validFeed: this.$i18n.t("validFeed"),
            isValid: true,
            required: true,
            placeholder: this.$i18n.t("statePlaceholder"),
            size: "12",
          },
          paymentValue: {
            value: obj["paymentValue"],
            type: "",
            label: this.$i18n.t("valueInputLabel"),
            name: "addFormInput",
            invalidFeed: "",
            validFeed: this.$i18n.t("validFeed"),
            isValid: true,
            required: true,
            placeholder: this.$i18n.t("valuePlaceholder"),
            size: "12",
          },
          paymentType: {
            value: obj["payment_type"],
            type: "",
            label: "text",
            name: "addFormTypeSelect",
            invalidFeed: "",
            validFeed: this.$i18n.t("validFeed"),
            isValid: true,
            required: true,
            placeholder: this.$i18n.t("typePlaceholder"),
            size: "12",
          },
          factureId: {
            value: obj["facture"],
            type: "",
            label: "text",
            name: "addFormInvoiceSelect",
            invalidFeed: "",
            validFeed: this.$i18n.t("validFeed"),
            isValid: true,
            required: true,
            placeholder: this.$i18n.t("invoicePlaceholder"),
            size: "12",
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
          const ret = await this.updatePayment();
          if (ret) {
            this.form = false;
            this.update = false;
            this.add = true;
            this.paymentStore
              .getAllPayments()
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
      this.paymentId = id;
      const ret = await this.deletePayment();
      if (ret) {
        this.form = false;
        this.update = false;
        this.add = true;
        this.paymentStore
          .getAllPayments()
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
    // inputChanges(e: Event) {
    //   switch (e.target.getAttribute("aria-label")) {
    //     case "paymentValue":
    //       this.paymentValue = parseFloat(e.target.value);
    //       break;
    //     default:
    //       break;
    //   }
    // },
    inputInvoiceChanges(e: any) {
      // console.log(e);
      this.paymentValue = null;
    },
    validEtat: function () {
      return true;
    },
    validPaymentValue: function () {
      let ttPriceBoolean =
        this.selectedPaymentInvoice !== null
          ? parseFloat(this.paymentValue) <=
            this.selectedPaymentInvoice.invoiceTTPrice
          : true;
      return parseFloat(this.paymentValue) > 0.0 && ttPriceBoolean;
    },
    validPaymentType: function () {
      return true;
    },
    validOrderId: function () {
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
    insertNewPayment() {
      const obj = {
        etat: this.etat,
        paymentValue: this.paymentValue,
        paymentType: this.paymentType,
        factureId: this.factureId,
      };
      this.transformObject(obj);
      return paymentAxiosService
        .create(obj)
        .then((res) => {
          // MODALS (set actorModal to TRUE to active)
          // this.modalTitle = this.$i18n.t("modalTitleOk");
          // this.modalContent = this.$i18n.t("modalAddContentOk");
          // this.paymentModal = false;
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
          // MODALS (set actorModal to TRUE to active)
          // this.modalTitle = this.$i18n.t("modalTitleKo");
          // this.modalContent = this.$i18n.t("modalAddContentKo", {
          //   err: err.response.data.message || err.message,
          // });
          // this.paymentModal = false;
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
    updatePayment() {
      const obj = {
        etat: this.etat,
        paymentValue: this.paymentValue,
        paymentType: this.paymentType,
        factureId: this.factureId,
      };
      this.transformObject(obj);
      return paymentAxiosService
        .update(this.paymentId, obj)
        .then((res) => {
          // MODALS (set actorModal to TRUE to active)
          // this.modalTitle = this.$i18n.t("modalTitleOk");
          // this.modalContent = this.$i18n.t("modalUpdateContentOk");
          // this.paymentModal = false;
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
          // MODALS (set actorModal to TRUE to active)
          // this.modalTitle = this.$i18n.t("modalTitleKo");
          // this.modalContent = this.$i18n.t("modalUpdateContentKo", {
          //   err: err.response.data.message || err.message,
          // });
          // this.paymentModal = false;
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
    deletePayment() {
      return paymentAxiosService
        .delete(this.paymentId)
        .then((res) => {
          // MODALS (set actorModal to TRUE to active)
          // this.modalTitle = this.$i18n.t("modalTitleOk");
          // this.modalContent = this.$i18n.t("modalDeleteContentOk");
          // this.paymentModal = false;
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
          // MODALS (set actorModal to TRUE to active)
          // this.modalTitle = this.$i18n.t("modalTitleKo");
          // this.modalContent = this.$i18n.t("modalDeleteContentKo", {
          //   err: err.response.data.message || err.message,
          // });
          // this.paymentModal = false;
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
      // console.log(this.selectedPaymentState);
      if (this.selectedPaymentState === null) {
        this.errors.push(this.$i18n.t("emptyStateInvalidFeed"));
        // obj["etat"].isValid = false;
        // obj["etat"].invalidFeed = this.$i18n.t(
        //   "emptyStateInvalidFeed"
        // );
        // this.modalTitle = this.$i18n.t("modalTitleKo");
        // this.modalContent = this.$i18n.t("modalAddContentKo", {
        //   err: this.$i18n.t("emptyStateInvalidFeed"),
        // });
        // this.paymentModal = true;
        this.paymentStateError = true;
        this.paymentStateErrorMsg = this.$i18n.t("emptyStateInvalidFeed");
      } else {
        this.paymentStateError = false;
        this.etat = this.selectedPaymentState.value;
      }

      if (this.paymentValue === null || !this.paymentValue) {
        this.errors.push(this.$i18n.t("emptyValueInvalidFeed"));
        obj["paymentValue"].isValid = false;
        obj["paymentValue"].invalidFeed = this.$i18n.t("emptyValueInvalidFeed");
      } else if (!this.validPaymentValue()) {
        this.errors.push(
          this.$i18n.t("errorValueInvalidFeed.linked", {
            price:
              this.selectedPaymentInvoice !== null
                ? this.selectedPaymentInvoice.invoiceTTPrice
                : "'inf'",
          })
        );
        obj["paymentValue"].isValid = false;
        obj["paymentValue"].invalidFeed = this.$i18n.t(
          "errorValueInvalidFeed.linked",
          {
            price:
              this.selectedPaymentInvoice !== null
                ? this.selectedPaymentInvoice.invoiceTTPrice
                : "'inf'",
          }
        );
      } else {
        this.paymentValue = parseFloat(this.paymentValue);
        obj["paymentValue"].isValid = true;
        obj["paymentValue"].validFeed = this.$i18n.t("validFeed");
        obj["paymentValue"].invalidFeed = "";
      }

      if (this.selectedPaymentType === null) {
        this.errors.push(this.$i18n.t("emptyTypeInvalidFeed"));
        // this.modalTitle = this.$i18n.t("modalTitleKo");
        // this.modalContent = this.$i18n.t("modalAddContentKo", {
        //   err: this.$i18n.t("emptyTypeInvalidFeed"),
        // });
        // this.paymentModal = true;
        this.paymentTypeError = true;
        this.paymentTypeErrorMsg = this.$i18n.t("emptyTypeInvalidFeed");
      } else {
        this.paymentTypeError = false;
        this.paymentType = this.selectedPaymentType.value;
      }

      if (this.selectedPaymentInvoice === null) {
        // this.errors.push(this.$i18n.t("emptyInvoiceInvalidFeed"));
        // this.modalTitle = this.$i18n.t("modalTitleKo");
        // this.modalContent = this.$i18n.t("modalAddContentKo", {
        //   err: this.$i18n.t("emptyInvoiceInvalidFeed"),
        // });
        // this.paymentModal = true;
        this.factureId = null;
      } else {
        this.factureId = this.selectedPaymentInvoice.value;
      }
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
      this.paymentModal = val;
    },
  },
});
</script>

<i18n>
{
  "fr": {
    "stateTableHeadText": "État",
    "valueTableHeadText": "Valeur",
    "typeTableHeadText": "Type",
    "orderTableHeadText": "Commande",
    "invoiceTableHeadText": "Facture",
    "emptyTableBodyContentText": "Aucun Paiement.",
    "addButtonText": "Ajouter",
    "updateButtonText": "Modifier",
    "deleteButtonText": "Suppimer",
    "actionTableHeadText": "Actions",

    "statePlaceholder": "État",
    "emptyStateInvalidFeed": "L'état du paiement doit être renseigné!",
    "errorStateInvalidFeed": "État incorrect!",
    "valuePlaceholder": "Valeur",
    "emptyValueInvalidFeed": "La valeur du paiement doit être renseignée!",
    "errorValueInvalidFeed": {
      "start": "Valeur incorrecte",
      "price": ", le prix ne doit pas dépasser {price} et doit être supérieur à 0",
      "end": "!",
      "linked": "@:errorValueInvalidFeed.start @:errorValueInvalidFeed.price @:errorValueInvalidFeed.end"
    },
    "typePlaceholder": "Type",
    "emptyTypeInvalidFeed": "Le type du paiement doit être renseigné!",
    "errorTypeInvalidFeed": "Type incorrect!",
    "invoicePlaceholder": "Facture",
    "emptyInvoiceInvalidFeed": "La facture doit être renseignée!",
    "errorInvoiceInvalidFeed": "Facture incorrecte!",
    "validFeed": "Validé!",

    "modalCloseBtnText": "Fermer",
    "modalTitleOk": "Cool !",
    "modalAddContentOk": "Paiement ajouté avec succès !",
    "modalUpdateContentOk": "Paiement mis à jour avec succès !",
    "modalDeleteContentOk": "Paiement supprimé avec succès !",
    "modalTitleKo": "Oups !",
    "modalAddContentKo": "Une erreur est survenue lors de l'ajout du paiement : {err}",
    "modalUpdateContentKo": "Une erreur est survenue lors de la modification du paiement : {err}!",
    "modalDeleteContentKo": "Une erreur est survenue lors de la suppression du paiement : {err}!",

    "stateInputLabel": "États",
    "valueInputLabel": "Valeur",
    "typeInputLabel": "Types",
    "orderInputLabel": "Commandes",
    "invoiceInputLabel": "Factures",

    "stateOkLibelle": "Payé",
    "stateKoLibelle": "Impayé",
    "typeCBLibelle": "Carte Bancaire",
    "typeESPLibelle": "Espèces",
    "typeCHQLibelle": "Chèque",

    "paymentsLinkTarget": "/paiements"
  },
  "en": {
    "stateTableHeadText": "State",
    "valueTableHeadText": "Value",
    "typeTableHeadText": "Type",
    "orderTableHeadText": "Order",
    "invoiceTableHeadText": "Invoice",
    "emptyTableBodyContentText": "No Payment.",
    "addButtonText": "Add",
    "updateButtonText": "Update",
    "deleteButtonText": "Delete",
    "actionTableHeadText": "Actions",

    "statePlaceholder": "State",
    "emptyStateInvalidFeed": "State can't be empty!",
    "errorStateInvalidFeed": "Bad state supplied!",
    "valuePlaceholder": "Value",
    "emptyValueInvalidFeed": "Value can't be empty!",
    "errorValueInvalidFeed": {
      "start": "Bad price supplied",
      "price": ", the price value must be lower than {price} and greater than 0",
      "end": "!",
      "linked": "@:errorValueInvalidFeed.start @:errorValueInvalidFeed.price @:errorValueInvalidFeed.end"
    },
    "typePlaceholder": "Type",
    "emptyTypeInvalidFeed": "Type can't be empty!",
    "errorTypeInvalidFeed": "Bad type supplied!",
    "invoicePlaceholder": "Invoice",
    "emptyInvoiceInvalidFeed": "Invoice can't be empty!",
    "errorInvoiceInvalidFeed": "Bad invoice supplied!",
    "validFeed": "Ok!",

    "modalCloseBtnText": "Close",
    "modalTitleOk": "Great !",
    "modalAddContentOk": "Payment added successfully !",
    "modalUpdateContentOk": "Payment updated successfully !",
    "modalDeleteContentOk": "Payment deleted successfully !",
    "modalTitleKo": "Error !",
    "modalAddContentKo": "An error occured while adding payment : {err}",
    "modalUpdateContentKo": "An error occured while updating payment : {err} !",
    "modalDeleteContentKo": "An error occured while deleting payment : {err} !",

    "stateInputLabel": "States",
    "valueInputLabel": "Value",
    "typeInputLabel": "Types",
    "orderInputLabel": "Orders",
    "invoiceInputLabel": "Invoices",

    "stateOkLibelle": "Paid",
    "stateKoLibelle": "Not paid",
    "typeCBLibelle": "Credit Card",
    "typeESPLibelle": "Cash",
    "typeCHQLibelle": "Check",

    "paymentsLinkTarget": "/payments"
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
      ident="paymentId"
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
              v-model="paymentValue"
              :invalidFeedback="invalidFeedback"
              :validFeedback="validFeedback"
              :isValid="isValid"
              :isValidated="isValidated"
              :required="required"
              :placeholder="placeholder"
              :type="type"
            >
            </MDBInput>
          </MDBCol>
        </MDBRow>
      </template>
      <template #addFormStateSelect="{ size, ariaLabel }">
        <MDBRow class="g-3 d-flex justify-content-center">
          <MDBCol :md="size" class="input-group flex-column">
            <label for="states">{{ $t("statePlaceholder") }}</label>
            <v-select
              :aria-label="ariaLabel"
              :label="$t('statePlaceholder')"
              v-model="selectedPaymentState"
              :multiple="false"
              item-title="text"
              item-value="value"
              :items="paymentStatesOption"
              id="states"
              class="custom-select w-100"
              hide-selected
              return-object
              :error="paymentStateError"
              :error-messages="paymentStateErrorMsg"
            >
            </v-select>
            <!-- <vSelect
              :required="required"
              :aria-label="ariaLabel"
              label="text"
              v-model="selectedPaymentState"
              :multiple="false"
              :options="paymentStatesOption"
              inputId="states"
              class="custom-select w-100"
              :selectable="(option) => option.value !== 0"
            >
              <template #search="{ attributes, events }">
                <input
                  class="vs__search"
                  :required="!selectedPaymentState"
                  v-bind="attributes"
                  v-on="events"
                />
              </template>
            </vSelect> -->
          </MDBCol>
        </MDBRow>
      </template>
      <template #addFormTypeSelect="{ size, ariaLabel}">
        <MDBRow class="g-3 d-flex justify-content-center">
          <MDBCol :md="size" class="input-group flex-column">
            <label for="types">{{ $t("typePlaceholder") }}</label>
            <v-select
              :aria-label="ariaLabel"
              :label="$t('typePlaceholder')"
              v-model="selectedPaymentType"
              :multiple="false"
              item-title="text"
              item-value="value"
              :items="paymentTypesOption"
              id="types"
              class="custom-select w-100"
              hide-selected
              return-object
              :error="paymentTypeError"
              :error-messages="paymentTypeErrorMsg"
            >
            </v-select>
            <!-- <vSelect
              :required="required"
              :aria-label="ariaLabel"
              label="text"
              v-model="selectedPaymentType"
              :multiple="false"
              :options="paymentTypesOption"
              inputId="types"
              class="custom-select w-100"
              :selectable="
                (option) => option.value !== 0 || option.value !== 'default'
              "
            >
              <template #search="{ attributes, events }">
                <input
                  class="vs__search"
                  :required="!selectedPaymentType"
                  v-bind="attributes"
                  v-on="events"
                />
              </template>
            </vSelect> -->
          </MDBCol>
        </MDBRow>
      </template>
      <template #addFormInvoiceSelect="{ size, ariaLabel }">
        <MDBRow class="g-3 d-flex justify-content-center">
          <MDBCol :md="size" class="input-group flex-column">
            <label for="invoices">{{ $t("invoicePlaceholder") }}</label>
            <v-select
              :aria-label="ariaLabel"
              :label="$t('invoicePlaceholder')"
              v-model="selectedPaymentInvoice"
              :multiple="false"
              item-title="text"
              item-value="value"
              :items="paymentInvoicesOption"
              id="invoices"
              class="custom-select w-100"
              hide-selected
              return-object
              :error="paymentInvoiceError"
              :error-messages="paymentInvoiceErrorMsg"
            >
            </v-select>
            <!-- <vSelect
              :required="required"
              :aria-label="ariaLabel"
              label="text"
              v-model="selectedPaymentInvoice"
              :multiple="false"
              :options="paymentInvoicesOption"
              inputId="invoices"
              class="custom-select w-100"
              :selectable="(option) => option.value !== 0"
            >
              <template #search="{ attributes, events }">
                <input
                  class="vs__search"
                  :required="!selectedPaymentInvoice"
                  v-bind="attributes"
                  v-on="events"
                />
              </template>
            </vSelect> -->
          </MDBCol>
        </MDBRow>
      </template>
    </TableItem>
  </div>
  <ModalItem
    @paymentModal="modalChange"
    input="paymentModal"
    id="paymentModal"
    tabIndex="-1"
    labelledBy="paymentModal"
    :model="paymentModal"
    :centered="true"
    :modalTitle="modalTitle"
    :modalContent="modalContent"
    :modalCloseBtnText="$t('modalCloseBtnText')"
    :staticBackdrop="true"
  >
  </ModalItem>
</template>
