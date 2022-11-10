<script lang="ts">
import { defineComponent } from "vue";
import { useServiceStore } from "@/stores/service";
import MessagesItem from "../components/MessagesItem.vue";
import TableItem from "../components/TableItem.vue";
import { MDBCol, MDBInput, MDBRow, MDBTextarea } from "mdb-vue-ui-kit";
import serviceAxiosService from "../services/service.service";
import ModalItem from "./ModalItem.vue";
import "../globals";

export default defineComponent({
  name: "ServiceContent",
  props: {
    serviceForm: {
      type: Boolean,
      default: () => false,
    },
  },
  setup() {
    console.log(`Setup`);
    const store = useServiceStore();
    return store
    .getAllServices()
    .then(
      (res) => {
        // console.log(res);
        // console.log(store.getServices);
        return { store };
      },
      (ret) => {
        // console.log(ret);
        return { store };
      }
    )
    .catch((err) => {
      console.log(err);
      return { store };
    });
    // return { store };
  },
  beforeCreate() {
    console.log(`Before Create`);
    // console.log(this.store.getServices);
    // return { // For display
    //   services: this.store.getServices
    // }
  },
  created() {
    console.log(`Created`);
  },
  mounted() {
    console.log(`Mounted`);
    // return { // For display
    //   services: this.store.getServices
    // }
  },
  data() {
    // console.log(this.services);
    const headTable = [
      this.$i18n.t("nameTableHeadText"),
      this.$i18n.t("amountTableHeadText"),
      this.$i18n.t("quantityTableHeadText"),
      this.$i18n.t("actionTableHeadText"),
    ];
    const addInputObj = {
      nom: {
        value: "",
        type: "",
        label: this.$i18n.t('nameInputLabel'),
        name: "addFormTextArea",
        invalidFeed: "",
        validFeed: "",
        isValid: false,
        required: true,
        placeholder: this.$i18n.t('namePlaceholder')
      },
      montantHt: {
        value: 0,
        type: "number",
        label: this.$i18n.t('amountInputLabel'),
        name: "addFormInput",
        invalidFeed: "",
        validFeed: "",
        isValid: false,
        required: true,
        placeholder: this.$i18n.t('amountPlaceholder')
      },
      quantite: {
        value: 0,
        type: "number",
        label: this.$i18n.t('quantityInputLabel'),
        name: "addFormInput",
        invalidFeed: "",
        validFeed: "",
        isValid: false,
        required: true,
        placeholder: this.$i18n.t('quantityPlaceholder')
      }
    };
    return {
      tableHeading: headTable,
      messageVisibility: false,
      form: this.serviceForm,
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
      errors: [],
      modalTitle: "",
      modalContent: "",
      serviceModal: false
    };
  },
  components: {
    MessagesItem,
    TableItem,
    MDBCol,
    MDBInput,
    MDBRow,
    MDBTextarea,
    ModalItem
  },
  methods: {
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
          if (ret){
            this.form = false;
            this.update = false;
            this.add = true;
            this.store.getAllServices();
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
            value: obj['nom'],
            type: "",
            label: this.$i18n.t('nameInputLabel'),
            name: "addFormTextArea",
            invalidFeed: "",
            validFeed: this.$i18n.t('validFeed'),
            isValid: true,
            required: true,
            placeholder: this.$i18n.t('namePlaceholder')
          },
          montantHt: {
            value: obj['montantHt'],
            type: "number",
            label: this.$i18n.t('amountInputLabel'),
            name: "addFormInput",
            invalidFeed: "",
            validFeed: this.$i18n.t('validFeed'),
            isValid: true,
            required: true,
            placeholder: this.$i18n.t('amountPlaceholder')
          },
          quantite: {
            value: obj['quantite'],
            type: "number",
            label: this.$i18n.t('quantityInputLabel'),
            name: "addFormInput",
            invalidFeed: "",
            validFeed: this.$i18n.t('validFeed'),
            isValid: true,
            required: true,
            placeholder: this.$i18n.t('quantityPlaceholder')
          }
        }
        this.updateInputObject = updateInputObj;
        this.updateInputObjectId = id;
      } else {
        // click to register the new update
        this.errors = [];

        this.inputsCheck(this.updateInputObject);

        if (!this.errors.length) {
          // console.log("perfect !");
          const ret = await this.updateService();
          if (ret){
            this.form = false;
            this.update = false;
            this.add = true;
            this.store.getAllServices();
          }
        }
      }
    },
    deleteClickFromChild(id: number) {
      // click to delete a service
    },
    inputChanges(e: Event){
      switch (e.target.getAttribute("aria-label")){
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
        quantite: this.quantite
      };
      this.transformObject(obj);
      return serviceAxiosService
      .create(obj)
      .then((res) => {
        this.modalTitle = this.$i18n.t('modalTitleOk');
        this.modalContent = this.$i18n.t('modalAddContentOk');
        this.serviceModal = true;
        return true;
      })
      .catch((err) => {
        this.modalTitle = this.$i18n.t('modalTitleKo');
        this.modalContent = this.$i18n.t('modalAddContentKo', {
          err: err.response.data.message || err.message
        });
        this.serviceModal = true;
        return false;
      })
    },
    updateService() {
      const obj = {
        nom: this.nom,
        montantHt: this.montantHt,
        quantite: this.quantite
      };
      this.transformObject(obj);
      return serviceAxiosService
      .update(this.serviceId, obj)
      .then((res) => {
        this.modalTitle = this.$i18n.t('modalTitleOk');
        this.modalContent = this.$i18n.t('modalUpdateContentOk');
        this.serviceModal = true;
        return true;
      })
      .catch((err) => {
        this.modalTitle = this.$i18n.t('modalTitleKo');
        this.modalContent = this.$i18n.t('modalUpdateContentKo', {
          err: err.response.data.message || err.message
        });
        this.serviceModal = true;
        return false;
      })
    },
    inputsCheck(obj: any) {
      if (!this.nom){
        this.errors.push(this.$i18n.t('emptyNameInvalidFeed'));
        obj['nom'].isValid = false;
        obj['nom'].invalidFeed = this.$i18n.t('emptyNameInvalidFeed');
      }else if(!this.validNom()){
        this.errors.push(this.$i18n.t('errorNameInvalidFeed'));
        obj['nom'].isValid = false;
        obj['nom'].invalidFeed = this.$i18n.t('errorNameInvalidFeed');
      }else{
        obj['nom'].isValid = true;
        obj['nom'].validFeed = this.$i18n.t('validFeed');
      }

      if (!this.montantHt){
        this.errors.push(this.$i18n.t('emptyAmountInvalidFeed'));
        obj['montantHt'].isValid = false;
        obj['montantHt'].invalidFeed = this.$i18n.t('emptyAmountInvalidFeed');
      }else if(!this.validMontantHt()){
        this.errors.push(this.$i18n.t('errorAmountInvalidFeed'));
        obj['montantHt'].isValid = false;
        obj['montantHt'].invalidFeed = this.$i18n.t('errorAmountInvalidFeed');
      }else{
        obj['montantHt'].isValid = true;
        obj['montantHt'].validFeed = this.$i18n.t('validFeed');
      }

      if (!this.quantite){
        this.errors.push(this.$i18n.t('emptyQuantityInvalidFeed'));
        obj['quantite'].isValid = false;
        obj['quantite'].invalidFeed = this.$i18n.t('emptyQuantityInvalidFeed');
      }else if(!this.validQuantite()){
        this.errors.push(this.$i18n.t('errorQuantityInvalidFeed'));
        obj['quantite'].isValid = false;
        obj['quantite'].invalidFeed = this.$i18n.t('errorQuantityInvalidFeed');
      }else{
        obj['quantite'].isValid = true;
        obj['quantite'].validFeed = this.$i18n.t('validFeed');
      }
    },
    modalChange(val: boolean){
      this.serviceModal = val;
    }
  },
});
</script>

<i18n>
{
  "fr": {
    "nameTableHeadText": "Nom",
    "amountTableHeadText": "Montant Unitaire HT",
    "quantityTableHeadText": "Quantité",
    "emptyTableBodyContentText": "Aucun Service.",
    "addButtonText": "Ajouter",
    "updateButtonText": "Modifier",
    "deleteButtonText": "Suppimer",
    "actionTableHeadText": "Actions",
    "amountPlaceholder": "Montant",
    "emptyAmountInvalidFeed": "Le montant ne peut être vide!",
    "errorAmountInvalidFeed": "Montant incorrect!",
    "namePlaceholder": "Nom",
    "emptyNameInvalidFeed": "Le nom de service ne peut être vide!",
    "errorNameInvalidFeed": "Nom incorrect incorrect!",
    "quantityPlaceholder": "Quantité",
    "emptyQuantityInvalidFeed": "La quantité ne peut être vide!",
    "errorQuantityInvalidFeed": "Quantité incorrect!",
    "validFeed": "Validé!",
    "modalCloseBtnText": "Fermer",
    "modalTitleOk": "Cool !",
    "modalAddContentOk": "Service ajouté avec succès !",
    "modalUpdateContentOk": "Service mis à jour avec succès !",
    "modalDeleteContentOk": "Service supprimé avec succès !",
    "modalTitleKo": "Oups !",
    "modalAddContentKo": "Une erreur est survenue lors de l'ajout du service : {err}!",
    "modalUpdateContentKo": "Une erreur est survenue lors de la modification du service : {err}!",
    "modalDeleteContentKo": "Une erreur est survenue lors de la suppression du service : {err}!",
    "nameInputLabel": "Nom",
    "amountInputLabel": "Montant",
    "quantityInputLabel": "Quantité"
  },
  "en": {
    "nameTableHeadText": "Name",
    "amountTableHeadText": "Unit amount excl. taxes",
    "quantityTableHeadText": "Quantity",
    "emptyTableBodyContentText": "No Service.",
    "addButtonText": "Add",
    "updateButtonText": "Update",
    "deleteButtonText": "Delete",
    "actionTableHeadText": "Actions",
    "amountPlaceholder": "Amount",
    "emptyAmountInvalidFeed": "Amount can't be empty!",
    "errorAmountInvalidFeed": "Bad amount supplied!",
    "namePlaceholder": "Name",
    "emptyNameInvalidFeed": "Service name can't be empty!",
    "errorNameInvalidFeed": "Bad service name supplied!",
    "quantityPlaceholder": "Quantity",
    "emptyQuantityInvalidFeed": "Quantity can't be empty!",
    "errorQuantityInvalidFeed": "Bad quantity supplied!",
    "validFeed": "Ok!",
    "modalCloseBtnText": "Close",
    "modalTitleOk": "Great !",
    "modalAddContentOk": "Service added successfully !",
    "modalUpdateContentOk": "Service updated successfully !",
    "modalDeleteContentOk": "Service deleted successfully !",
    "modalTitleKo": "Error !",
    "modalAddContentKo": "An error occured while adding service : {err} !",
    "modalUpdateContentKo": "An error occured while updating service : {err} !",
    "modalDeleteContentKo": "An error occured while deleting service : {err} !",
    "nameInputLabel": "Name",
    "amountInputLabel": "Amount",
    "quantityInputLabel": "Quantity"
  }
}
</i18n>

<template>
  <MessagesItem v-if="messageVisibility"></MessagesItem>
  <div class="container">
    <TableItem
      :isForm="form"
      :tableHead="tableHeading"
      :objectsProp="store.getServices"
      :emptyTableText="$t('emptyTableBodyContentText')"
      addActionName="addClick"
      ident="serviceId"
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
