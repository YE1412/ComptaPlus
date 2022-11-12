<script lang="ts">
/*global __CRYPTAPI__, __KEY__*/
import { defineComponent, nextTick, ref } from "vue";
import { useActorStore } from "@/stores/actor";
import MessagesItem from "../components/MessagesItem.vue";
import TableItem from "../components/TableItem.vue";
import {
  MDBCol,
  MDBInput,
  MDBRow,
  MDBTextarea,
  MDBRadio,
} from "mdb-vue-ui-kit";
import actorAxiosService from "../services/actor.service";
import ModalItem from "./ModalItem.vue";
const renderComponent = ref(true);
import "../globals";

export default defineComponent({
  name: "ActorContent",
  props: {
    actorForm: {
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
  async setup() {
    // console.log(`Setup`);
    const store = useActorStore();

    return { store };
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
      this.$i18n.t("firstnameTableHeadText"),
      this.$i18n.t("lastnameTableHeadText"),
      this.$i18n.t("cpTableHeadText"),
      this.$i18n.t("emailTableHeadText"),
      this.$i18n.t("streetNameTableHeadText"),
      this.$i18n.t("streetNumberTableHeadText"),
      this.$i18n.t("cityTableHeadText"),
      this.$i18n.t("sellerNumTableHeadText"),
      this.$i18n.t("telTableHeadText"),
      this.$i18n.t("typeTableHeadText"),
      this.$i18n.t("actionTableHeadText"),
    ];
    const addInputObj = {
      nom: {
        value: "",
        type: "",
        label: this.$i18n.t("nameInputLabel"),
        name: "addFormTextArea",
        invalidFeed: "",
        validFeed: "",
        isValid: false,
        required: true,
        placeholder: this.$i18n.t("namePlaceholder"),
      },
      montantHt: {
        value: 0,
        type: "number",
        label: this.$i18n.t("amountInputLabel"),
        name: "addFormInput",
        invalidFeed: "",
        validFeed: "",
        isValid: false,
        required: true,
        placeholder: this.$i18n.t("amountPlaceholder"),
      },
      quantite: {
        value: 0,
        type: "number",
        label: this.$i18n.t("quantityInputLabel"),
        name: "addFormInput",
        invalidFeed: "",
        validFeed: "",
        isValid: false,
        required: true,
        placeholder: this.$i18n.t("quantityPlaceholder"),
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
      serviceId: 0,
      nom: "",
      montantHt: 0,
      quantite: 0,
      // For update
      updateInputObject: {},
      updateInputObjectId: 0,
      // For all
      // services: this.fetchServices,
      errors: [],
      modalTitle: "",
      modalContent: "",
      serviceModal: false,
      renderComponent: true,
    };
  },
  components: {
    MessagesItem,
    TableItem,
    MDBCol,
    MDBInput,
    MDBRow,
    MDBTextarea,
    MDBRadio,
    ModalItem,
  },
  methods: {
    // getAllServices() {
    //   this.store.getAllServices();
    // },
    async addClickFromChild(db: boolean) {
      if (!db) {
        // click to add new service line
        this.form = true;
        this.update = false;
        this.add = true;
      } else {
        // click to register a new service
        this.errors = [];

        this.inputsCheck(this.addInputObject);

        if (!this.errors.length) {
          const ret = await this.insertNewService();
          if (ret) {
            this.form = false;
            this.update = false;
            this.add = true;
            this.store
              .getAllServices()
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
    async updateClickFromChild(db: boolean, id: number, obj: any) {
      if (!db) {
        // click to update new service line
        this.form = true;
        this.update = true;
        this.add = false;
        this.serviceId = id;
        this.nom = obj.nom;
        this.montantHt = obj.montantHt;
        this.quantite = obj.quantite;
        // console.log(obj);
        const updateInputObj = {
          nom: {
            value: obj["nom"],
            type: "",
            label: this.$i18n.t("nameInputLabel"),
            name: "addFormTextArea",
            invalidFeed: "",
            validFeed: this.$i18n.t("validFeed"),
            isValid: true,
            required: true,
            placeholder: this.$i18n.t("namePlaceholder"),
          },
          montantHt: {
            value: obj["montantHt"],
            type: "number",
            label: this.$i18n.t("amountInputLabel"),
            name: "addFormInput",
            invalidFeed: "",
            validFeed: this.$i18n.t("validFeed"),
            isValid: true,
            required: true,
            placeholder: this.$i18n.t("amountPlaceholder"),
          },
          quantite: {
            value: obj["quantite"],
            type: "number",
            label: this.$i18n.t("quantityInputLabel"),
            name: "addFormInput",
            invalidFeed: "",
            validFeed: this.$i18n.t("validFeed"),
            isValid: true,
            required: true,
            placeholder: this.$i18n.t("quantityPlaceholder"),
          },
        };
        this.updateInputObject = updateInputObj;
        this.updateInputObjectId = id;
      } else {
        // click to register the new update
        this.errors = [];

        this.inputsCheck(this.updateInputObject);

        if (!this.errors.length) {
          // console.log("perfect !");
          const ret = await this.updateService();
          if (ret) {
            this.form = false;
            this.update = false;
            this.add = true;
            this.store
              .getAllServices()
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
      // click to delete a service
      this.serviceId = id;
      const ret = await this.deleteService();
      if (ret) {
        this.form = false;
        this.update = false;
        this.add = true;
        this.store
          .getAllServices()
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
      switch (e.target.getAttribute("aria-label")) {
        case "nom":
          this.nom = e.target.value;
          break;
        case "montantHt":
          this.montantHt = parseFloat(e.target.value);
          break;
        case "quantite":
          this.quantite = parseInt(e.target.value);
          break;
        default:
          break;
      }
      // console.log(e.target);
      // console.log("changes !");
    },
    validNom: function () {
      var re = /^([a-zA-Z])*$/;
      return re.test(this.nom);
    },
    validMontantHt: function () {
      return true;
    },
    validQuantite: function () {
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
    insertNewService() {
      const obj = {
        nom: this.nom,
        montantHt: this.montantHt,
        quantite: this.quantite,
      };
      this.transformObject(obj);
      return actorAxiosService
        .create(obj)
        .then((res) => {
          // MODALS (set serviceModal to TRUE to active)
          this.modalTitle = this.$i18n.t("modalTitleOk");
          this.modalContent = this.$i18n.t("modalAddContentOk");
          this.serviceModal = false;
          // MESSAGES
          this.store.messages.push({
            severity: false,
            content: this.$i18n.t("modalAddContentOk"),
          });
          this.messageVisibility = true;
          this.store.messagesVisibility = true;
          return true;
        })
        .catch((err) => {
          // MODALS (set serviceModal to TRUE to active)
          this.modalTitle = this.$i18n.t("modalTitleKo");
          this.modalContent = this.$i18n.t("modalAddContentKo", {
            err: err.response.data.message || err.message,
          });
          this.serviceModal = false;
          // MESSAGES
          this.store.messages.push({
            severity: true,
            content: this.$i18n.t("modalAddContentKo", {
              err: err.response.data.message || err.message,
            }),
          });
          this.messageVisibility = true;
          this.store.messagesVisibility = true;
          return false;
        });
    },
    updateService() {
      const obj = {
        nom: this.nom,
        montantHt: this.montantHt,
        quantite: this.quantite,
      };
      this.transformObject(obj);
      return actorAxiosService
        .update(this.serviceId, obj)
        .then((res) => {
          // MODALS (set serviceModal to TRUE to active)
          this.modalTitle = this.$i18n.t("modalTitleOk");
          this.modalContent = this.$i18n.t("modalUpdateContentOk");
          this.serviceModal = false;
          // MESSAGES
          this.store.messages.push({
            severity: false,
            content: this.$i18n.t("modalUpdateContentOk"),
          });
          this.messageVisibility = true;
          this.store.messagesVisibility = true;
          return true;
        })
        .catch((err) => {
          // MODALS (set serviceModal to TRUE to active)
          this.modalTitle = this.$i18n.t("modalTitleKo");
          this.modalContent = this.$i18n.t("modalUpdateContentKo", {
            err: err.response.data.message || err.message,
          });
          this.serviceModal = false;
          // MESSAGES
          this.store.messages.push({
            severity: true,
            content: this.$i18n.t("modalUpdateContentKo"),
          });
          this.messageVisibility = true;
          this.store.messagesVisibility = true;
          return false;
        });
    },
    deleteService() {
      return actorAxiosService
        .delete(this.serviceId)
        .then((res) => {
          // MODALS (set serviceModal to TRUE to active)
          this.modalTitle = this.$i18n.t("modalTitleOk");
          this.modalContent = this.$i18n.t("modalDeleteContentOk");
          this.serviceModal = false;
          // MESSAGES
          this.store.messages.push({
            severity: false,
            content: this.$i18n.t("modalDeleteContentOk"),
          });
          this.messageVisibility = true;
          this.store.messagesVisibility = true;
          return true;
        })
        .catch((err) => {
          // MODALS (set serviceModal to TRUE to active)
          this.modalTitle = this.$i18n.t("modalTitleKo");
          this.modalContent = this.$i18n.t("modalDeleteContentKo", {
            err: err.response.data.message || err.message,
          });
          this.serviceModal = false;
          // MESSAGES
          this.store.messages.push({
            severity: true,
            content: this.$i18n.t("modalDeleteContentKo"),
          });
          this.messageVisibility = true;
          this.store.messagesVisibility = true;
          return false;
        });
    },
    inputsCheck(obj: any) {
      if (!this.nom) {
        this.errors.push(this.$i18n.t("emptyNameInvalidFeed"));
        obj["nom"].isValid = false;
        obj["nom"].invalidFeed = this.$i18n.t("emptyNameInvalidFeed");
      } else if (!this.validNom()) {
        this.errors.push(this.$i18n.t("errorNameInvalidFeed"));
        obj["nom"].isValid = false;
        obj["nom"].invalidFeed = this.$i18n.t("errorNameInvalidFeed");
      } else {
        obj["nom"].isValid = true;
        obj["nom"].validFeed = this.$i18n.t("validFeed");
      }

      if (!this.montantHt) {
        this.errors.push(this.$i18n.t("emptyAmountInvalidFeed"));
        obj["montantHt"].isValid = false;
        obj["montantHt"].invalidFeed = this.$i18n.t("emptyAmountInvalidFeed");
      } else if (!this.validMontantHt()) {
        this.errors.push(this.$i18n.t("errorAmountInvalidFeed"));
        obj["montantHt"].isValid = false;
        obj["montantHt"].invalidFeed = this.$i18n.t("errorAmountInvalidFeed");
      } else {
        obj["montantHt"].isValid = true;
        obj["montantHt"].validFeed = this.$i18n.t("validFeed");
      }

      if (!this.quantite) {
        this.errors.push(this.$i18n.t("emptyQuantityInvalidFeed"));
        obj["quantite"].isValid = false;
        obj["quantite"].invalidFeed = this.$i18n.t("emptyQuantityInvalidFeed");
      } else if (!this.validQuantite()) {
        this.errors.push(this.$i18n.t("errorQuantityInvalidFeed"));
        obj["quantite"].isValid = false;
        obj["quantite"].invalidFeed = this.$i18n.t("errorQuantityInvalidFeed");
      } else {
        obj["quantite"].isValid = true;
        obj["quantite"].validFeed = this.$i18n.t("validFeed");
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
      this.serviceModal = val;
    },
  },
});
</script>

this.$i18n.t("firstnameTableHeadText"), this.$i18n.t("lastnameTableHeadText"),
this.$i18n.t("cpTableHeadText"), this.$i18n.t("emailTableHeadText"),
this.$i18n.t("streetNameTableHeadText"),
this.$i18n.t("streetNumberTableHeadText"), this.$i18n.t("cityTableHeadText"),
this.$i18n.t("sellerNumTableHeadText"), this.$i18n.t("telTableHeadText"),
this.$i18n.t("typeTableHeadText"), this.$i18n.t("actionTableHeadText"),
<i18n>
{
  "fr": {
    "firstnameTableHeadText": "Prénom",
    "lastnameTableHeadText": "Nom",
    "cpTableHeadText": "Code Postal",
    "emailTableHeadText": "Email",
    "streetNameTableHeadText": "Nom de rue",
    "streetNumberTableHeadText": "Numéro de rue",
    "cityTableHeadText": "Ville",
    "sellerNumTableHeadText": "N° Commerçant",
    "telTableHeadText": "Téléphone",
    "typeTableHeadText": "Type",
    "emptyTableBodyContentText": "Aucun Service.",
    "addButtonText": "Ajouter",
    "updateButtonText": "Modifier",
    "deleteButtonText": "Suppimer",
    "actionTableHeadText": "Actions",

    "firstnamePlaceholder": "Prénom",
    "emptyFirstnameInvalidFeed": "Le prénom ne peut être vide!",
    "errorFirstnameInvalidFeed": "Prénom incorrect!",
    "lastnamePlaceholder": "Nom",
    "emptyLastnameInvalidFeed": "Le nom ne peut être vide!",
    "errorLastnameInvalidFeed": "Nom incorrect!",
    "cpPlaceholder": "Code Postal",
    "emptyCPInvalidFeed": "Le code postal ne peut être vide!",
    "errorCPInvalidFeed": "Code postal incorrect!",
    "emailPlaceholder": "Email",
    "emptyEmailInvalidFeed": "L'email' ne peut être vide!",
    "errorEmailInvalidFeed": "Email incorrect!",
    "streetNamePlaceholder": "Nom de rue",
    "emptyStreetnameInvalidFeed": "Le nom de rue ne peut être vide!",
    "errorStreetnameInvalidFeed": "Nom de rue incorrect!",
    "streetNumberPlaceholder": "Numéro de rue",
    "emptyStreetnumberInvalidFeed": "Le n° de rue ne peut être vide!",
    "errorStreetnumberInvalidFeed": "N° de rue incorrect!",
    "cityPlaceholder": "Ville",
    "emptyCityInvalidFeed": "La ville ne peut être vide!",
    "errorCityInvalidFeed": "Ville incorrect!",
    "sellerNumPlaceholder": "N° Commerçant",
    "emptySellernumInvalidFeed": "Le n° de commerçant ne peut être vide!",
    "errorSellernumInvalidFeed": "N° de commerçant incorrect!",
    "telPlaceholder": "Téléphone",
    "emptyTelInvalidFeed": "Le n° de téléphone ne peut être vide!",
    "errorTelInvalidFeed": "N° de téléphone incorrect!",

    "validFeed": "Validé!",
    "modalCloseBtnText": "Fermer",
    "modalTitleOk": "Cool !",
    "modalAddContentOk": "Acteur ajouté avec succès !",
    "modalUpdateContentOk": "Acteur mis à jour avec succès !",
    "modalDeleteContentOk": "Acteur supprimé avec succès !",
    "modalTitleKo": "Oups !",
    "modalAddContentKo": "Une erreur est survenue lors de l'ajout de l'acteur : {err}!",
    "modalUpdateContentKo": "Une erreur est survenue lors de la modification de l'acteur : {err}!",
    "modalDeleteContentKo": "Une erreur est survenue lors de la suppression de l'acteur : {err}!",

    "firstnameInputLabel": "Prénom",
    "lastnameInputLabel": "Nom",
    "cpInputLabel": "Code Postal",
    "emailInputLabel": "Email",
    "streetNameInputLabel": "Nom de rue",
    "streetNumberInputLabel": "Numéro de rue",
    "cityInputLabel": "Ville",
    "sellerNumInputLabel": "N° Commerçant",
    "telInputLabel": "Téléphone",
    "typeInputLabel": "Type",

    "actorsLinkTarget": "/acteurs"
  },
  "en": {
    "firstnameTableHeadText": "Firstname",
    "lastnameTableHeadText": "Lastname",
    "cpTableHeadText": "Postal code",
    "emailTableHeadText": "Email",
    "streetNameTableHeadText": "Street name",
    "streetNumberTableHeadText": "Street number",
    "cityTableHeadText": "City",
    "sellerNumTableHeadText": "Seller ID Number",
    "telTableHeadText": "Phone",
    "typeTableHeadText": "Type",
    "emptyTableBodyContentText": "No Service.",
    "addButtonText": "Add",
    "updateButtonText": "Update",
    "deleteButtonText": "Delete",
    "actionTableHeadText": "Actions",

    "firstnamePlaceholder": "Firstname",
    "emptyFirstnameInvalidFeed": "Firstname can't be empty!",
    "errorFirstnameInvalidFeed": "Bad firstname supplied!",
    "lastnamePlaceholder": "Lastname",
    "emptyLastnameInvalidFeed": "Lastname can't be empty!",
    "errorLastnameInvalidFeed": "Bad lastname supplied!",
    "cpPlaceholder": "Postal code",
    "emptyCPInvalidFeed": "Postal code can't be empty!",
    "errorCPInvalidFeed": "Bad postal code supplied!",
    "emailPlaceholder": "Email",
    "emptyEmailInvalidFeed": "Email can't be empty!",
    "errorEmailInvalidFeed": "Bad email supplied!",
    "streetNamePlaceholder": "Street name",
    "emptyStreetnameInvalidFeed": "Street name can't be empty!",
    "errorStreetnameInvalidFeed": "Bad street name supplied!",
    "streetNumberPlaceholder": "Street number",
    "emptyStreetnumberInvalidFeed": "Street number can't be empty!",
    "errorStreetnumberInvalidFeed": "Bad street number supplied!",
    "cityPlaceholder": "City",
    "emptyCityInvalidFeed": "City can't be empty!",
    "errorCityInvalidFeed": "Bad city supplied!",
    "sellerNumPlaceholder": "Seller name",
    "emptySellernumInvalidFeed": "Seller name can't be empty!",
    "errorSellernumInvalidFeed": "Bad seller name supplied!",
    "telPlaceholder": "Phone number",
    "emptyTelInvalidFeed": "Phone number can't be empty!",
    "errorTelInvalidFeed": "Bad phone number supplied!",

    "validFeed": "Ok!",
    "modalCloseBtnText": "Close",
    "modalTitleOk": "Great !",
    "modalAddContentOk": "Actor added successfully !",
    "modalUpdateContentOk": "Actor updated successfully !",
    "modalDeleteContentOk": "Actor deleted successfully !",
    "modalTitleKo": "Error !",
    "modalAddContentKo": "An error occured while adding actor : {err} !",
    "modalUpdateContentKo": "An error occured while updating actor : {err} !",
    "modalDeleteContentKo": "An error occured while deleting actor : {err} !",

    "firstnameInputLabel": "Firstname",
    "lastnameInputLabel": "Lastname",
    "cpInputLabel": "Postal code",
    "emailInputLabel": "Email",
    "streetNameInputLabel": "Street name",
    "streetNumberInputLabel": "Street number",
    "cityInputLabel": "City",
    "sellerNumInputLabel": "Seller ID Number",
    "telInputLabel": "Phone",
    "typeInputLabel": "Type",

    "servicesLinkTarget": "/actors"
  }
}
</i18n>

<template>
  <MessagesItem v-if="store.getMessagesVisibility"></MessagesItem>
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
      colSpan="11"
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
        <MDBRow class="g-2 d-flex justify-content-center">
          <MDBCol :md="size">
            <MDBInput
              :inputGroup="inputGroup"
              :aria-label="ariaLabel"
              aria-describedby="basic"
              :label="label"
              :value="model"
              :invalidFeedback="invalidFeedback"
              :validFeedback="validFeedback"
              :isValid="isValid"
              :isValidated="isValidated"
              :required="required"
              :placeholder="placeholder"
              :type="type"
              @input="inputChanges($event)"
            >
              <!-- <slot name="input-prepend"></slot> -->
              <!-- <template v-if="inputGroup" v-slot:prepend>
                <span class="input-group-text" id="basic">@</span>
              </template> -->
            </MDBInput>
          </MDBCol>
        </MDBRow>
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
              <!-- <slot name="input-prepend"></slot> -->
              <!-- <template v-if="inputGroup" v-slot:prepend>
                <span class="input-group-text" id="basic">@</span>
              </template> -->
            </MDBTextarea>
          </MDBCol>
        </MDBRow>
      </template>
    </TableItem>
  </div>
  <ModalItem
    @serviceModal="modalChange"
    input="serviceModal"
    id="serviceModal"
    tabIndex="-1"
    labelledBy="serviceModal"
    :model="serviceModal"
    :centered="true"
    :modalTitle="modalTitle"
    :modalContent="modalContent"
    :modalCloseBtnText="$t('modalCloseBtnText')"
    :staticBackdrop="true"
  >
  </ModalItem>
</template>
