<script lang="ts">
/*global __CRYPTAPI__, __KEY__*/
import { defineComponent, nextTick, ref } from "vue";
import { useOrderStore } from "@/stores/order";
import { useServiceStore } from "@/stores/service";
import { useMessageStore } from "@/stores/message";
import MessagesItem from "../components/MessagesItem.vue";
import TableItem from "../components/TableItem.vue";
import { MDBCol, MDBRow, MDBTextarea } from "mdb-vue-ui-kit";
import orderAxiosService from "../services/actor.service";
import ModalItem from "./ModalItem.vue";
const renderComponent = ref(true);
import "../globals";

export default defineComponent({
  name: "OrderContent",
  props: {
    orderForm: {
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
    return { src: "orders" };
  },
  async setup() {
    // console.log(`Setup`);
    const orderStore = useOrderStore();
    const messageStore = useMessageStore();
    const serviceStore = useServiceStore();
    const servicesObj = await serviceStore
      .getAllServices()
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
    return { orderStore, messageStore, serviceStore, servicesObj };
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
      this.$i18n.t("additionalContentTableHeadText"),
      this.$i18n.t("servicesTableHeadText"),
      this.$i18n.t("actionTableHeadText"),
    ];
    const addInputObj = {
      contenuAdditionnel: {
        value: "",
        type: "",
        label: this.$i18n.t("additionalContentInputLabel"),
        name: "addFormTextArea",
        invalidFeed: "",
        validFeed: "",
        isValid: true,
        required: true,
        placeholder: this.$i18n.t("additionalContentPlaceholder"),
        size: "12",
        disabled: false,
      },
      services: {
        value: "",
        type: "",
        label: this.$i18n.t("servicesInputLabel"),
        name: "addFormSelect",
        invalidFeed: "",
        validFeed: "",
        isValid: false,
        required: true,
        placeholder: this.$i18n.t("servicesPlaceholder"),
        size: "12",
        disabled: false,
      },
    };
    return {
      tableHeading: headTable,
      messageVisibility: false,
      form: this.actorForm,
      // For adding
      update: false,
      add: true,
      addInputObject: addInputObj,
      orderId: 0,
      contenuAdditionnel: "",
      services: [],
      // For update
      updateInputObject: {},
      updateInputObjectId: 0,
      // For all
      errors: [],
      modalTitle: "",
      modalContent: "",
      orderModal: false,
      renderComponent: true,
      tableColSpan: "3",
    };
  },
  computed: {
    // typesInputForAdding() {
    //   let ret = [];
    //   for (const key in this.types) {
    //     let label = "",
    //       model;
    //     label =
    //       this.types[key].seller && !this.types[key].buyer
    //         ? this.$i18n.t("typeInputSellerLabel")
    //         : label;
    //     label =
    //       !this.types[key].seller && this.types[key].buyer
    //         ? this.$i18n.t("typeInputBuyerLabel")
    //         : label;
    //     model =
    //       this.types[key].seller && !this.types[key].buyer ? "seller" : model;
    //     model =
    //       !this.types[key].seller && this.types[key].buyer ? "buyer" : model;
    //     if (!this.types[key].seller || !this.types[key].buyer) {
    //       ret[key] = {};
    //       ret[key].label = label;
    //       ret[key].id = `type-${this.types[key].actorTypeId}`;
    //       ret[key].model = model;
    //       ret[key].ariaLabel = `actorType-${model}`;
    //       ret[key].required = true;
    //       ret[key].isValid = false;
    //       ret[key].validFeedback = "";
    //       ret[key].invalidFeedback = "";
    //       ret[key].btnCheck = false;
    //     }
    //   }
    //   return ret;
    // },
  },
  components: {
    MessagesItem,
    TableItem,
    MDBCol,
    MDBRow,
    ModalItem,
    MDBTextarea,
  },
  methods: {
    async addClickFromChild(db: boolean) {
      if (!db) {
        // click to add new order line
        this.form = true;
        this.update = false;
        this.add = true;
      } else {
        // console.log(this.buyer);
        // console.log(this.seller);
        // console.log(this.both);
        // click to register a new order
        this.errors = [];
        // console.log("addClick !");

        this.inputsCheck(this.addInputObject);

        if (!this.errors.length) {
          const ret = await this.insertNewOrder();
          console.log(ret);
          if (ret) {
            this.form = false;
            this.update = false;
            this.add = true;
            this.orderStore
              .getAllActors()
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
        // click to update new order line
        this.form = true;
        this.update = true;
        this.add = false;
        this.orderId = id;
        this.contenuAdditionnel = obj.contenuAdditionnel;
        // this.services = obj.nom;
        // console.log(obj);
        const updateInputObj = {
          contenuAdditionnel: {
            value: obj["contenuAdditionnel"],
            type: "",
            label: this.$i18n.t("additionalContentInputLabel"),
            name: "addFormTextArea",
            invalidFeed: "",
            validFeed: this.$i18n.t("validFeed"),
            isValid: true,
            required: true,
            placeholder: this.$i18n.t("additionalContentPlaceholder"),
            size: "12",
          },
          services: {
            value: "",
            type: "",
            label: this.$i18n.t("servicesInputLabel"),
            name: "addFormSelect",
            invalidFeed: "",
            validFeed: this.$i18n.t("validFeed"),
            isValid: true,
            required: true,
            placeholder: this.$i18n.t("servicesPlaceholder"),
            size: "12",
          },
        };
        this.updateInputObject = updateInputObj;
        this.updateInputObjectId = id;
      } else {
        // click to register the new order
        this.errors = [];

        this.inputsCheck(this.updateInputObject);

        if (!this.errors.length) {
          // console.log("perfect !");
          const ret = await this.updateOrder();
          if (ret) {
            this.form = false;
            this.update = false;
            this.add = true;
            // console.log(this.messageStore.getMessages);
            // console.log(this.messageStore.getMessagesVisibility);
            this.orderStore
              .getAllActors()
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
      // click to delete an order
      this.orderId = id;
      const ret = await this.deleteOrder();
      if (ret) {
        this.form = false;
        this.update = false;
        this.add = true;
        this.orderStore
          .getAllActors()
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
    },
    inputChanges(e: Event) {
      // console.log(this.buyer);
      // console.log(this.seller);
      // console.log(this.both);
      // console.log(e.target.getAttribute("id"));
      // console.log(e.target.getAttribute("id").value);
      switch (e.target.getAttribute("aria-label")) {
        case "contenuAdditionnel":
          this.contenuAdditionnel = e.target.value;
          break;
        case "services":
          this.services = e.target.value;
          break;
        default:
          break;
      }
      // console.log(e.target);
      // console.log("changes !");
    },
    validContenuAdditionnel: function () {
      var re = /^([a-zA-Z\s])*$/;
      return re.test(this.nom);
    },
    validServices: function () {
      return true;
    },
    transformObject(obj) {
      for (const k in obj) {
        if (typeof obj[k] === "string") {
          obj[k] = __CRYPTAPI__.crypt(obj[k], __KEY__);
        }
      }
    },
    transformValue(val: string) {
      const ret = __CRYPTAPI__.crypt(val, __KEY__);
      return ret;
    },
    insertNewOrder() {
      const obj = {
        contenuAdditionnel: this.contenuAdditionnel,
        priceHT: null,
        factureId: null,
      };
      this.transformObject(obj);
      return orderAxiosService
        .create(obj)
        .then((res) => {
          // MODALS (set actorModal to TRUE to active)
          this.modalTitle = this.$i18n.t("modalTitleOk");
          this.modalContent = this.$i18n.t("modalAddContentOk");
          this.orderModal = false;
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
          this.modalTitle = this.$i18n.t("modalTitleKo");
          this.modalContent = this.$i18n.t("modalAddContentKo", {
            err: err.response.data.message || err.message,
          });
          this.orderModal = false;
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
    updateOrder() {
      const obj = {
        contenuAdditionnel: this.contenuAdditionnel,
        priceHT: null,
        factureId: null,
      };
      this.transformObject(obj);
      return orderAxiosService
        .update(this.orderId, obj)
        .then((res) => {
          // MODALS (set actorModal to TRUE to active)
          this.modalTitle = this.$i18n.t("modalTitleOk");
          this.modalContent = this.$i18n.t("modalUpdateContentOk");
          this.orderModal = false;
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
          this.modalTitle = this.$i18n.t("modalTitleKo");
          this.modalContent = this.$i18n.t("modalUpdateContentKo", {
            err: err.response.data.message || err.message,
          });
          this.orderModal = false;
          // MESSAGES
          this.messageStore.messages.push({
            severity: true,
            content: this.$i18n.t("modalUpdateContentKo"),
          });
          this.messageVisibility = true;
          this.messageStore.messagesVisibility = true;
          return false;
        });
    },
    deleteOrder() {
      return orderAxiosService
        .delete(this.orderId)
        .then((res) => {
          // MODALS (set actorModal to TRUE to active)
          this.modalTitle = this.$i18n.t("modalTitleOk");
          this.modalContent = this.$i18n.t("modalDeleteContentOk");
          this.orderModal = false;
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
          this.modalTitle = this.$i18n.t("modalTitleKo");
          this.modalContent = this.$i18n.t("modalDeleteContentKo", {
            err: err.response.data.message || err.message,
          });
          this.orderModal = false;
          // MESSAGES
          this.messageStore.messages.push({
            severity: true,
            content: this.$i18n.t("modalDeleteContentKo"),
          });
          this.messageVisibility = true;
          this.messageStore.messagesVisibility = true;
          return false;
        });
    },
    inputsCheck(obj: any) {
      if (this.contenuAdditionnel && !this.validContenuAdditionnel()) {
        this.errors.push(this.$i18n.t("errorAdditionalContentInvalidFeed"));
        obj["contenuAdditionnel"].isValid = false;
        obj["contenuAdditionnel"].invalidFeed = this.$i18n.t(
          "errorAdditionalContentInvalidFeed"
        );
      } else {
        this.contenuAdditionnel = null;
        obj["contenuAdditionnel"].isValid = true;
        obj["contenuAdditionnel"].validFeed = this.$i18n.t("validFeed");
        obj["contenuAdditionnel"].invalidFeed = "";
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
      this.orderModal = val;
    },
  },
});
</script>

<i18n>
{
  "fr": {
    "additionalContentTableHeadText": "Contenu additionnel",
    "servicesTableHeadText": "Services",
    "priceHeadText": "Prix Hors taxes",
    "invoiceHeadText": "Facture",
    "emptyTableBodyContentText": "Aucune Commande.",
    "addButtonText": "Ajouter",
    "updateButtonText": "Modifier",
    "deleteButtonText": "Suppimer",
    "actionTableHeadText": "Actions",

    "additionalContentPlaceholder": "Contenu additionnel",
    "errorAdditionalContentInvalidFeed": "Contenu additionnel incorrect!",
    "servicesPlaceholder": "Services",
    "emptyServicesInvalidFeed": "Les services doivent être renseignés!",
    "errorServicesInvalidFeed": "Services incorrect!",
    "validFeed": "Validé!",

    "modalCloseBtnText": "Fermer",
    "modalTitleOk": "Cool !",
    "modalAddContentOk": "Commande ajouté avec succès !",
    "modalUpdateContentOk": "Commande mis à jour avec succès !",
    "modalDeleteContentOk": "Commande supprimé avec succès !",
    "modalTitleKo": "Oups !",
    "modalAddContentKo": "Une erreur est survenue lors de l'ajout de la commande : {err}!",
    "modalUpdateContentKo": "Une erreur est survenue lors de la modification de la commande : {err}!",
    "modalDeleteContentKo": "Une erreur est survenue lors de la suppression de la commande : {err}!",

    "additionalContentInputLabel": "Contenu",
    "servicesInputLabel": "Services",

    "servicesLinkTarget": "/commandes"
  },
  "en": {
    "additionalContentTableHeadText": "Additional content",
    "servicesTableHeadText": "Services",
    "priceHeadText": "Price Excl. taxes",
    "invoiceHeadText": "Invoice",
    "emptyTableBodyContentText": "No Order.",
    "addButtonText": "Add",
    "updateButtonText": "Update",
    "deleteButtonText": "Delete",
    "actionTableHeadText": "Actions",

    "additionalContentPlaceholder": "Additional content",
    "errorAdditionalContentInvalidFeed": "Bad content supplied!",
    "servicesPlaceholder": "Services",
    "emptyServicesInvalidFeed": "Services can't be empty!",
    "errorServicesInvalidFeed": "Bad services supplied!",
    "validFeed": "Ok!",

    "modalCloseBtnText": "Close",
    "modalTitleOk": "Great !",
    "modalAddContentOk": "Order added successfully !",
    "modalUpdateContentOk": "Order updated successfully !",
    "modalDeleteContentOk": "Order deleted successfully !",
    "modalTitleKo": "Error !",
    "modalAddContentKo": "An error occured while adding order : {err} !",
    "modalUpdateContentKo": "An error occured while updating order : {err} !",
    "modalDeleteContentKo": "An error occured while deleting order : {err} !",

    "additionalContentInputLabel": "Content",
    "servicesInputLabel": "Services",

    "servicesLinkTarget": "/orders"
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
      ident="actorId"
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
        #addFormTextArea="{
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
            <MDBTextarea
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
            </MDBTextarea>
          </MDBCol>
        </MDBRow>
      </template>
      <template
        #addFormSelect="{
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
            <select
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
            ></select>
          </MDBCol>
        </MDBRow>
      </template>
    </TableItem>
  </div>
  <ModalItem
    @actorModal="modalChange"
    input="orderModal"
    id="orderModal"
    tabIndex="-1"
    labelledBy="orderModal"
    :model="orderModal"
    :centered="true"
    :modalTitle="modalTitle"
    :modalContent="modalContent"
    :modalCloseBtnText="$t('modalCloseBtnText')"
    :staticBackdrop="true"
  >
  </ModalItem>
</template>
