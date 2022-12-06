<script lang="ts">
/*global __CRYPTAPI__, __KEY__*/
import { defineComponent, nextTick, ref } from "vue";
import { useOrderStore } from "@/stores/order";
import { useServiceStore } from "@/stores/service";
import { useMessageStore } from "@/stores/message";
import MessagesItem from "../components/MessagesItem.vue";
import TableItem from "../components/TableItem.vue";
import { MDBCol, MDBRow, MDBTextarea } from "mdb-vue-ui-kit";
import orderAxiosService from "../services/order.service";
import ModalItem from "./ModalItem.vue";
const renderComponent = ref(true);
import "../globals";
import { VSelect } from "vuetify/components";

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
    const headTable = this.orderForm
      ? [
          this.$i18n.t("additionalContentTableHeadText"),
          this.$i18n.t("servicesTableHeadText"),
          this.$i18n.t("actionTableHeadText"),
        ]
      : [
          this.$i18n.t("additionalContentTableHeadText"),
          this.$i18n.t("priceHtHeadText"),
          this.$i18n.t("servicesTableHeadText"),
          this.$i18n.t("invoiceHeadText"),
          this.$i18n.t("actionTableHeadText"),
        ];
    let servicesOpt = [];
    // servicesOpt.push({
    //   text: this.$i18n.t("servicesPlaceholder"),
    //   value: 0,
    //   montantHt: 0,
    //   quantite: 0,
    //   nom: "default",
    // });
    for (const key in this.servicesObj) {
      let service = {};
      service.text = `${this.servicesObj[key].nom} - ${this.servicesObj[key].montantHt}`;
      service.value = this.servicesObj[key].serviceId;
      service.montantHt = this.servicesObj[key].montantHt;
      service.quantite = this.servicesObj[key].quantite;
      service.nom = this.servicesObj[key].nom;
      servicesOpt.push(service);
    }
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
      form: this.orderForm,
      // For adding
      update: false,
      add: true,
      addInputObject: addInputObj,
      orderId: 0,
      contenuAdditionnel: "",
      priceHt: 0,
      services: [],
      selectedServices: [],
      servicesOption: servicesOpt,
      servicesError: true,
      servicesErrorMsg: "",
      // For update
      updateInputObject: {},
      updateInputObjectId: 0,
      // For all
      errors: [],
      modalTitle: "",
      modalContent: "",
      orderModal: false,
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
    MDBTextarea,
    VSelect,
  },
  methods: {
    setSelectedServicesForUpdate() {
      let ret = [];
      // ret.push({
      //   text: this.$i18n.t("servicesPlaceholder"),
      //   value: 0,
      //   montantHt: 0,
      //   quantite: 0,
      //   nom: "default",
      // });
      return this.serviceStore.getAllServices().then((res) => {
        for (const key in this.serviceStore.getServices) {
          let service = {};
          service.text = `${this.serviceStore.getServices[key].nom} - ${this.serviceStore.getServices[key].montantHt}`;
          service.value = this.serviceStore.getServices[key].serviceId;
          service.montantHt = this.serviceStore.getServices[key].montantHt;
          service.quantite = this.serviceStore.getServices[key].quantite;
          service.nom = this.serviceStore.getServices[key].nom;
          ret.push(service);
        }
        // console.log(ret);
        return ret;
      });
    },
    async addClickFromChild(db: boolean) {
      if (!db) {
        // click to add new order line
        this.form = true;
        this.update = false;
        this.add = true;
        this.tableHeading = [
          this.$i18n.t("additionalContentTableHeadText"),
          this.$i18n.t("servicesTableHeadText"),
          this.$i18n.t("actionTableHeadText"),
        ];
      } else {
        // console.log(this.buyer);
        // console.log(this.seller);
        // console.log(this.both);
        // click to register a new order
        this.errors = [];
        // console.log("addClick !");
        // console.log(this.selectedServices);
        // HtPrice calculation
        this.priceHt = 0;
        for (const key in this.selectedServices) {
          this.priceHt +=
            this.selectedServices[key].montantHt *
            this.selectedServices[key].quantite;
        }
        this.inputsCheck(this.addInputObject);

        if (!this.errors.length) {
          const ret = await this.insertNewOrder();
          // console.log(ret);
          if (ret) {
            this.form = false;
            this.update = false;
            this.add = true;
            this.tableHeading = [
              this.$i18n.t("additionalContentTableHeadText"),
              this.$i18n.t("priceHtHeadText"),
              this.$i18n.t("servicesTableHeadText"),
              this.$i18n.t("invoiceHeadText"),
              this.$i18n.t("actionTableHeadText"),
            ];
            this.orderStore
              .getAllOrders()
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
        // this.servicesOption = this.setSelectedServicesForUpdate
        this.setSelectedServicesForUpdate().then((res) => {
          this.servicesOption = res;
          // console.log(this.servicesOption);
        });
        this.selectedServices = [];
        this.tableHeading = [
          this.$i18n.t("additionalContentTableHeadText"),
          this.$i18n.t("servicesTableHeadText"),
          this.$i18n.t("actionTableHeadText"),
        ];
        // this.services = obj.nom;
        // console.log(obj);
        const updateInputObj = {
          contenuAdditionnel: {
            value:
              obj["contenuAdditionnel"] !== null
                ? obj["contenuAdditionnel"]
                : "",
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
        this.priceHt = 0;
        for (const key in this.selectedServices) {
          this.priceHt +=
            this.selectedServices[key].montantHt *
            this.selectedServices[key].quantite;
        }
        this.inputsCheck(this.updateInputObject);

        if (!this.errors.length) {
          // console.log("perfect !");
          const ret = await this.updateOrder();
          if (ret) {
            this.form = false;
            this.update = false;
            this.add = true;
            this.tableHeading = [
              this.$i18n.t("additionalContentTableHeadText"),
              this.$i18n.t("priceHtHeadText"),
              this.$i18n.t("servicesTableHeadText"),
              this.$i18n.t("invoiceHeadText"),
              this.$i18n.t("actionTableHeadText"),
            ];
            this.orderStore
              .getAllOrders()
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
          .getAllOrders()
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
      // console.log(this.buyer);
      // console.log(this.seller);
      // console.log(this.both);
      // console.log(e.target.getAttribute("id"));
      // console.log(e.target.getAttribute("aria-label"));
      // console.log(e.target.value);
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
        } else if (typeof obj[k] === "object") {
          this.transformObject(obj[k]);
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
        priceHt: this.priceHt,
        services: this.selectedServices,
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
        priceHt: this.priceHt,
        services: this.selectedServices,
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
            content: this.$i18n.t("modalUpdateContentKo", {
              err: err.response.data.message || err.message,
            }),
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
      // console.log(this.contenuAdditionnel);
      if (this.contenuAdditionnel) {
        if (!this.validContenuAdditionnel()) {
          this.errors.push(this.$i18n.t("errorAdditionalContentInvalidFeed"));
          obj["contenuAdditionnel"].isValid = false;
          obj["contenuAdditionnel"].invalidFeed = this.$i18n.t(
            "errorAdditionalContentInvalidFeed"
          );
        } else {
          obj["contenuAdditionnel"].isValid = true;
          obj["contenuAdditionnel"].validFeed = this.$i18n.t("validFeed");
          obj["contenuAdditionnel"].invalidFeed = "";
        }
      } else {
        this.contenuAdditionnel = null;
        obj["contenuAdditionnel"].isValid = true;
        obj["contenuAdditionnel"].validFeed = this.$i18n.t("validFeed");
        obj["contenuAdditionnel"].invalidFeed = "";
      }

      if (!this.selectedServices.length) {
        this.errors.push(this.$i18n.t("emptyServicesInvalidFeed"));
        // this.modalTitle = this.$i18n.t("modalTitleKo");
        // this.modalContent = this.$i18n.t("modalAddContentKo", {
        //   err: this.$i18n.t("emptyServicesInvalidFeed"),
        // });
        // this.orderModal = true;
        this.servicesError = true;
        this.servicesErrorMsg = this.$i18n.t("emptyServicesInvalidFeed");
      } else {
        this.servicesError = false;
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
    "priceHtHeadText": "Prix Hors taxes",
    "invoiceHeadText": "Facture",
    "emptyTableBodyContentText": "Aucune Commande.",
    "addButtonText": "Ajouter",
    "updateButtonText": "Modifier",
    "deleteButtonText": "Suppimer",
    "actionTableHeadText": "Actions",

    "additionalContentPlaceholder": "Contenu additionnel",
    "errorAdditionalContentInvalidFeed": "Contenu additionnel incorrect!",
    "servicesPlaceholder": "Services",
    "emptyServicesInvalidFeed": "Les services doivent être renseignés !",
    "errorServicesInvalidFeed": "Services incorrect!",
    "validFeed": "Validé!",

    "modalCloseBtnText": "Fermer",
    "modalTitleOk": "Cool !",
    "modalAddContentOk": "Commande ajouté avec succès !",
    "modalUpdateContentOk": "Commande mis à jour avec succès !",
    "modalDeleteContentOk": "Commande supprimé avec succès !",
    "modalTitleKo": "Oups !",
    "modalAddContentKo": "Une erreur est survenue lors de l'ajout de la commande : {err}",
    "modalUpdateContentKo": "Une erreur est survenue lors de la modification de la commande : {err}!",
    "modalDeleteContentKo": "Une erreur est survenue lors de la suppression de la commande : {err}!",

    "additionalContentInputLabel": "Contenu",
    "servicesInputLabel": "Services",

    "ordersLinkTarget": "/commandes"
  },
  "en": {
    "additionalContentTableHeadText": "Additional content",
    "servicesTableHeadText": "Services",
    "priceHtHeadText": "Price Excl. taxes",
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
    "modalAddContentKo": "An error occured while adding order : {err}",
    "modalUpdateContentKo": "An error occured while updating order : {err} !",
    "modalDeleteContentKo": "An error occured while deleting order : {err} !",

    "additionalContentInputLabel": "Content",
    "servicesInputLabel": "Services",

    "ordersLinkTarget": "/orders"
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
      ident="orderId"
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
      <template #addFormSelect="{ size, ariaLabel }">
        <MDBRow class="g-3 d-flex justify-content-center">
          <MDBCol :md="size" class="input-group flex-column">
            <label for="services">{{ $t("servicesPlaceholder") }}</label>
            <vSelect
              :aria-label="ariaLabel"
              :label="$t('servicesPlaceholder')"
              item-title="text"
              item-value="value"
              v-model="selectedServices"
              :multiple="true"
              :items="servicesOption"
              id="services"
              class="custom-select w-100"
              :hide-selected="true"
              return-object
              :error="servicesError"
              :error-messages="servicesErrorMsg"
            >
              <template #search="{ attributes, events }">
                <input
                  class="vs__search"
                  :required="!selectedServices"
                  v-bind="attributes"
                  v-on="events"
                />
              </template>
            </vSelect>
            <!-- <vSelect
              :required="required"
              :aria-label="ariaLabel"
              label="text"
              v-model="selectedServices"
              :multiple="true"
              :options="servicesOption"
              id="services"
              class="custom-select w-100"
              :selectable="(option) => option.value !== 0"
            >
              <template #search="{ attributes, events }">
                <input
                  class="vs__search"
                  :required="!selectedServices"
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
    @orderModal="modalChange"
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
