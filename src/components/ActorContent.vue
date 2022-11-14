<script lang="ts">
/*global __CRYPTAPI__, __KEY__*/
import { defineComponent, nextTick, ref } from "vue";
import { useActorStore } from "@/stores/actor";
import { useMessageStore } from "@/stores/message";
import MessagesItem from "../components/MessagesItem.vue";
import TableItem from "../components/TableItem.vue";
import { MDBCol, MDBInput, MDBRow, MDBCheckbox } from "mdb-vue-ui-kit";
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
  provide() {
    return { src: "actors" };
  },
  async setup() {
    // console.log(`Setup`);
    const actorStore = useActorStore();
    const messageStore = useMessageStore();
    const types = await actorStore
      .getAllTypes()
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
    return { actorStore, messageStore, types };
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
      this.$i18n.t("emailTableHeadText"),
      this.$i18n.t("streetNameTableHeadText"),
      this.$i18n.t("streetNumberTableHeadText"),
      this.$i18n.t("cityTableHeadText"),
      this.$i18n.t("cpTableHeadText"),
      this.$i18n.t("telTableHeadText"),
      this.$i18n.t("sellerNumberTableHeadText"),
      this.$i18n.t("typeTableHeadText"),
      this.$i18n.t("actionTableHeadText"),
    ];
    const addInputObj = {
      prenom: {
        value: "",
        type: "text",
        label: this.$i18n.t("firstnameInputLabel"),
        name: "addFormInput",
        invalidFeed: "",
        validFeed: "",
        isValid: false,
        required: true,
        placeholder: this.$i18n.t("firstnamePlaceholder"),
        size: "12",
        disabled: false,
        counter: true,
        maxLength: 255,
      },
      nom: {
        value: "",
        type: "text",
        label: this.$i18n.t("lastnameInputLabel"),
        name: "addFormInput",
        invalidFeed: "",
        validFeed: "",
        isValid: false,
        required: true,
        placeholder: this.$i18n.t("lastnamePlaceholder"),
        size: "12",
        disabled: false,
        counter: true,
        maxLength: 255,
      },
      email: {
        value: "",
        type: "email",
        label: this.$i18n.t("emailInputLabel"),
        name: "addFormInput",
        invalidFeed: "",
        validFeed: "",
        isValid: false,
        required: true,
        placeholder: this.$i18n.t("emailPlaceholder"),
        size: "12",
        disabled: false,
        counter: true,
        maxLength: 255,
      },
      nomRue: {
        value: "",
        type: "text",
        label: this.$i18n.t("streetNameInputLabel"),
        name: "addFormInput",
        invalidFeed: "",
        validFeed: "",
        isValid: false,
        required: true,
        placeholder: this.$i18n.t("streetNamePlaceholder"),
        size: "12",
        disabled: false,
        counter: true,
        maxLength: 255,
      },
      numRue: {
        value: 0,
        type: "number",
        label: this.$i18n.t("streetNumberInputLabel"),
        name: "addFormInput",
        invalidFeed: "",
        validFeed: "",
        isValid: false,
        required: true,
        placeholder: this.$i18n.t("streetNumberPlaceholder"),
        size: "12",
        disabled: false,
      },
      ville: {
        value: "",
        type: "text",
        label: this.$i18n.t("cityInputLabel"),
        name: "addFormInput",
        invalidFeed: "",
        validFeed: "",
        isValid: false,
        required: true,
        placeholder: this.$i18n.t("cityPlaceholder"),
        size: "12",
        disabled: false,
        counter: true,
        maxLength: 255,
      },
      cp: {
        value: "",
        type: "text",
        label: this.$i18n.t("cpInputLabel"),
        name: "addFormInput",
        invalidFeed: "",
        validFeed: "",
        isValid: false,
        required: true,
        placeholder: this.$i18n.t("cpPlaceholder"),
        size: "12",
        disabled: false,
        counter: true,
        maxLength: 10,
      },
      tel: {
        value: "",
        type: "text",
        label: this.$i18n.t("telInputLabel"),
        name: "addFormInput",
        invalidFeed: "",
        validFeed: "",
        isValid: false,
        required: true,
        placeholder: this.$i18n.t("telPlaceholder"),
        size: "12",
        disabled: false,
        counter: true,
        maxLength: 10,
      },
      numCommercant: {
        value: "",
        type: "text",
        label: this.$i18n.t("sellerNumberInputLabel"),
        name: "addFormInput",
        invalidFeed: "",
        validFeed: "",
        isValid: false,
        required: true,
        placeholder: this.$i18n.t("sellerNumberPlaceholder"),
        size: "12",
        disabled: false,
        counter: true,
        maxLength: 255,
      },
      typeObj: {
        value: "",
        name: "addFormCheckbox",
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
      actorId: 0,
      prenom: "",
      nom: "",
      email: "",
      nomRue: "",
      numRue: 0,
      ville: "",
      cp: "",
      tel: "",
      numCommercant: null,
      type: 0,
      seller: false,
      buyer: false,
      // both: false,
      // For update
      updateInputObject: {},
      updateInputObjectId: 0,
      // For all
      errors: [],
      modalTitle: "",
      modalContent: "",
      actorModal: false,
      renderComponent: true,
    };
  },
  computed: {
    typesInputForAdding() {
      let ret = [];
      for (const key in this.types) {
        let label = "",
          model;
        label =
          this.types[key].seller && !this.types[key].buyer
            ? this.$i18n.t("typeInputSellerLabel")
            : label;
        label =
          !this.types[key].seller && this.types[key].buyer
            ? this.$i18n.t("typeInputBuyerLabel")
            : label;
        // label =
        //   this.types[key].seller && this.types[key].buyer
        //     ? this.$i18n.t("typeInputAllLabel")
        //     : label;
        model =
          this.types[key].seller && !this.types[key].buyer ? "seller" : model;
        model =
          !this.types[key].seller && this.types[key].buyer ? "buyer" : model;
        // model =
        //   this.types[key].seller && this.types[key].buyer ? "both" : model;
        if (!this.types[key].seller || !this.types[key].buyer) {
          ret[key] = {};
          ret[key].label = label;
          ret[key].id = `type-${this.types[key].actorTypeId}`;
          ret[key].model = model;
          ret[key].ariaLabel = `actorType-${model}`;
          ret[key].required = true;
          ret[key].isValid = false;
          ret[key].validFeedback = "";
          ret[key].invalidFeedback = "";
          ret[key].btnCheck = false;
        }
      }
      return ret;
    },
  },
  components: {
    MessagesItem,
    TableItem,
    MDBCol,
    MDBInput,
    MDBRow,
    ModalItem,
    MDBCheckbox,
  },
  methods: {
    async addClickFromChild(db: boolean) {
      if (!db) {
        // click to add new actor line
        this.form = true;
        this.update = false;
        this.add = true;
      } else {
        // console.log(this.buyer);
        // console.log(this.seller);
        // console.log(this.both);
        // click to register a new actor
        this.errors = [];
        // console.log("addClick !");

        this.inputsCheck(this.addInputObject);

        if (!this.errors.length) {
          const ret = await this.insertNewActor();
          console.log(ret);
          if (ret) {
            this.form = false;
            this.update = false;
            this.add = true;
            this.actorStore
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
        // click to update new actor line
        this.form = true;
        this.update = true;
        this.add = false;
        this.actorId = id;
        this.prenom = obj.prenom;
        this.nom = obj.nom;
        this.email = obj.email;
        this.nomRue = obj.nomRue;
        this.numRue = obj.numRue;
        this.ville = obj.ville;
        this.cp = obj.cp;
        this.tel = obj.tel;
        this.numCommercant = obj.numCommercant;
        this.type = obj.personne_type.actorTypeId;
        this.seller = obj.personne_type.seller;
        this.buyer = obj.personne_type.buyer;
        // console.log(obj);
        const updateInputObj = {
          prenom: {
            value: obj["prenom"],
            type: "text",
            label: this.$i18n.t("firstnameInputLabel"),
            name: "addFormInput",
            invalidFeed: "",
            validFeed: this.$i18n.t("validFeed"),
            isValid: true,
            required: true,
            placeholder: this.$i18n.t("firstnamePlaceholder"),
            size: "12",
            counter: true,
            maxLength: 255,
          },
          nom: {
            value: obj["nom"],
            type: "text",
            label: this.$i18n.t("lastnameInputLabel"),
            name: "addFormInput",
            invalidFeed: "",
            validFeed: this.$i18n.t("validFeed"),
            isValid: true,
            required: true,
            placeholder: this.$i18n.t("lastnamePlaceholder"),
            size: "12",
            counter: true,
            maxLength: 255,
          },
          email: {
            value: obj["email"],
            type: "email",
            label: this.$i18n.t("emailInputLabel"),
            name: "addFormInput",
            invalidFeed: "",
            validFeed: this.$i18n.t("validFeed"),
            isValid: true,
            required: true,
            placeholder: this.$i18n.t("emailPlaceholder"),
            size: "12",
            counter: true,
            maxLength: 255,
          },
          nomRue: {
            value: obj["nomRue"],
            type: "text",
            label: this.$i18n.t("streetNameInputLabel"),
            name: "addFormInput",
            invalidFeed: "",
            validFeed: this.$i18n.t("validFeed"),
            isValid: true,
            required: true,
            placeholder: this.$i18n.t("streetNamePlaceholder"),
            size: "12",
            counter: true,
            maxLength: 255,
          },
          numRue: {
            value: obj["numRue"],
            type: "number",
            label: this.$i18n.t("streetNumberInputLabel"),
            name: "addFormInput",
            invalidFeed: "",
            validFeed: this.$i18n.t("validFeed"),
            isValid: true,
            required: true,
            placeholder: this.$i18n.t("streetNumberPlaceholder"),
            size: "12",
            counter: false,
          },
          ville: {
            value: obj["ville"],
            type: "text",
            label: this.$i18n.t("cityInputLabel"),
            name: "addFormInput",
            invalidFeed: "",
            validFeed: this.$i18n.t("validFeed"),
            isValid: true,
            required: true,
            placeholder: this.$i18n.t("cityPlaceholder"),
            size: "12",
            counter: true,
            maxLength: 255,
          },
          cp: {
            value: obj["cp"],
            type: "text",
            label: this.$i18n.t("cpInputLabel"),
            name: "addFormInput",
            invalidFeed: "",
            validFeed: this.$i18n.t("validFeed"),
            isValid: true,
            required: true,
            placeholder: this.$i18n.t("cpPlaceholder"),
            size: "12",
            counter: true,
            maxLength: 10,
          },
          tel: {
            value: obj["tel"],
            type: "text",
            label: this.$i18n.t("telInputLabel"),
            name: "addFormInput",
            invalidFeed: "",
            validFeed: this.$i18n.t("validFeed"),
            isValid: true,
            required: true,
            placeholder: this.$i18n.t("telPlaceholder"),
            size: "12",
            counter: true,
            maxLength: 10,
          },
          numCommercant: {
            value: obj["numCommercant"] !== null ? obj["numCommercant"] : "",
            type: "text",
            label: this.$i18n.t("sellerNumberInputLabel"),
            name: "addFormInput",
            invalidFeed: "",
            validFeed: this.$i18n.t("validFeed"),
            isValid: true,
            required: true,
            placeholder: this.$i18n.t("sellerNumberPlaceholder"),
            size: "12",
            counter: true,
            maxLength: 10,
          },
          typeObj: {
            value: "",
            name: "addFormCheckbox",
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
          const ret = await this.updateActor();
          if (ret) {
            this.form = false;
            this.update = false;
            this.add = true;
            // console.log(this.messageStore.getMessages);
            // console.log(this.messageStore.getMessagesVisibility);
            this.actorStore
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
      // click to delete a actor
      this.actorId = id;
      const ret = await this.deleteActor();
      if (ret) {
        this.form = false;
        this.update = false;
        this.add = true;
        this.actorStore
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
        case "prenom":
          this.prenom = e.target.value;
          break;
        case "nom":
          this.nom = e.target.value;
          break;
        case "email":
          this.email = e.target.value;
          break;
        case "numRue":
          this.numRue = e.target.value;
          break;
        case "nomRue":
          this.nomRue = e.target.value;
          break;
        case "cp":
          this.cp = e.target.value;
          break;
        case "ville":
          this.ville = e.target.value;
          break;
        case "tel":
          this.tel = e.target.value;
          break;
        case "numCommercant":
          this.numCommercant = e.target.value;
          break;
        default:
          break;
      }
      // console.log(e.target);
      // console.log("changes !");
    },
    validPrenom: function () {
      var re = /^([a-zA-Z])*$/;
      return re.test(this.nom);
    },
    validNom: function () {
      var re = /^([a-zA-Z])*$/;
      return re.test(this.nom);
    },
    validEmail: function () {
      return true;
    },
    validNumRue: function () {
      return true;
    },
    validNomRue: function () {
      return true;
    },
    validCp: function () {
      return true;
    },
    validVille: function () {
      return true;
    },
    validTel: function () {
      return true;
    },
    validNumCommercant: function () {
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
    insertNewActor() {
      const obj = {
        prenom: this.prenom,
        nom: this.nom,
        email: this.email,
        nomRue: this.nomRue,
        numRue: this.numRue,
        ville: this.ville,
        cp: this.cp,
        tel: this.tel,
        numCommercant: this.numCommercant,
        type: this.type,
      };
      this.transformObject(obj);
      return actorAxiosService
        .create(obj)
        .then((res) => {
          // MODALS (set actorModal to TRUE to active)
          this.modalTitle = this.$i18n.t("modalTitleOk");
          this.modalContent = this.$i18n.t("modalAddContentOk");
          this.actorModal = false;
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
          this.actorModal = false;
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
    updateActor() {
      const obj = {
        prenom: this.prenom,
        nom: this.nom,
        email: this.email,
        nomRue: this.nomRue,
        numRue: this.numRue,
        ville: this.ville,
        cp: this.cp,
        tel: this.tel,
        numCommercant: this.numCommercant,
        actorTypeId: this.type,
      };
      this.transformObject(obj);
      return actorAxiosService
        .update(this.actorId, obj)
        .then((res) => {
          // MODALS (set actorModal to TRUE to active)
          this.modalTitle = this.$i18n.t("modalTitleOk");
          this.modalContent = this.$i18n.t("modalUpdateContentOk");
          this.actorModal = false;
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
          this.actorModal = false;
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
    deleteActor() {
      return actorAxiosService
        .delete(this.actorId)
        .then((res) => {
          // MODALS (set actorModal to TRUE to active)
          this.modalTitle = this.$i18n.t("modalTitleOk");
          this.modalContent = this.$i18n.t("modalDeleteContentOk");
          this.actorModal = false;
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
          this.actorModal = false;
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
      if (!this.seller && !this.buyer && !this.both) {
        this.errors.push(this.$i18n.t("emptyTypeInvalidFeed"));
        obj["typeObj"].isValid = false;
        obj["typeObj"].invalidFeed = this.$i18n.t("emptyTypeInvalidFeed");
      } else if (this.seller) {
        if (!this.numCommercant) {
          this.errors.push(this.$i18n.t("emptySellerNumberInvalidFeed"));
          obj["numCommercant"].isValid = false;
          obj["numCommercant"].invalidFeed = this.$i18n.t(
            "emptySellerNumberInvalidFeed"
          );
        } else if (!this.validNumCommercant()) {
          this.errors.push(this.$i18n.t("errorSellerNumberInvalidFeed"));
          obj["numCommercant"].isValid = false;
          obj["numCommercant"].invalidFeed = this.$i18n.t(
            "errorSellerNumberInvalidFeed"
          );
        } else {
          if (this.buyer) this.type = 1;
          else this.type = 2;
          obj["typeObj"].isValid = true;
          obj["typeObj"].validFeed = this.$i18n.t("validFeed");
          obj["numCommercant"].isValid = true;
          obj["numCommercant"].validFeed = this.$i18n.t("validFeed");
        }
        obj["typeObj"].invalidFeed = "";
      } else {
        this.type = 3;
        this.numCommercant = null;
        obj["typeObj"].isValid = true;
        obj["typeObj"].validFeed = this.$i18n.t("validFeed");
        obj["typeObj"].invalidFeed = "";
        obj["numCommercant"].isValid = true;
        obj["numCommercant"].validFeed = this.$i18n.t("validFeed");
      }

      if (!this.prenom) {
        this.errors.push(this.$i18n.t("emptyFirstnameInvalidFeed"));
        obj["prenom"].isValid = false;
        obj["prenom"].invalidFeed = this.$i18n.t("emptyFirstnameInvalidFeed");
      } else if (!this.validPrenom()) {
        this.errors.push(this.$i18n.t("errorFirstnameInvalidFeed"));
        obj["prenom"].isValid = false;
        obj["prenom"].invalidFeed = this.$i18n.t("errorFirstnameInvalidFeed");
      } else {
        obj["prenom"].isValid = true;
        obj["prenom"].validFeed = this.$i18n.t("validFeed");
      }

      if (!this.nom) {
        this.errors.push(this.$i18n.t("emptyLastnameInvalidFeed"));
        obj["nom"].isValid = false;
        obj["nom"].invalidFeed = this.$i18n.t("emptyLastnameInvalidFeed");
      } else if (!this.validNom()) {
        this.errors.push(this.$i18n.t("errorLastnameInvalidFeed"));
        obj["nom"].isValid = false;
        obj["nom"].invalidFeed = this.$i18n.t("errorLastnameInvalidFeed");
      } else {
        obj["nom"].isValid = true;
        obj["nom"].validFeed = this.$i18n.t("validFeed");
      }

      if (!this.email) {
        this.errors.push(this.$i18n.t("emptyEmailInvalidFeed"));
        obj["email"].isValid = false;
        obj["email"].invalidFeed = this.$i18n.t("emptyEmailInvalidFeed");
      } else if (!this.validEmail()) {
        this.errors.push(this.$i18n.t("errorEmailInvalidFeed"));
        obj["email"].isValid = false;
        obj["email"].invalidFeed = this.$i18n.t("errorEmailInvalidFeed");
      } else {
        obj["email"].isValid = true;
        obj["email"].validFeed = this.$i18n.t("validFeed");
      }

      if (!this.numRue) {
        this.errors.push(this.$i18n.t("emptyStreetNumberInvalidFeed"));
        obj["numRue"].isValid = false;
        obj["numRue"].invalidFeed = this.$i18n.t(
          "emptyStreetNumberInvalidFeed"
        );
      } else if (!this.validNumRue()) {
        this.errors.push(this.$i18n.t("errorStreetNumberInvalidFeed"));
        obj["numRue"].isValid = false;
        obj["numRue"].invalidFeed = this.$i18n.t(
          "errorStreetNumberInvalidFeed"
        );
      } else {
        obj["numRue"].isValid = true;
        obj["numRue"].validFeed = this.$i18n.t("validFeed");
      }

      if (!this.nomRue) {
        this.errors.push(this.$i18n.t("emptyStreetNameInvalidFeed"));
        obj["nomRue"].isValid = false;
        obj["nomRue"].invalidFeed = this.$i18n.t("emptyStreetNameInvalidFeed");
      } else if (!this.validNomRue()) {
        this.errors.push(this.$i18n.t("errorStreetNameInvalidFeed"));
        obj["nomRue"].isValid = false;
        obj["nomRue"].invalidFeed = this.$i18n.t("errorStreetNameInvalidFeed");
      } else {
        obj["nomRue"].isValid = true;
        obj["nomRue"].validFeed = this.$i18n.t("validFeed");
      }

      if (!this.ville) {
        this.errors.push(this.$i18n.t("emptyCityInvalidFeed"));
        obj["ville"].isValid = false;
        obj["ville"].invalidFeed = this.$i18n.t("emptyCityInvalidFeed");
      } else if (!this.validVille()) {
        this.errors.push(this.$i18n.t("errorCityInvalidFeed"));
        obj["ville"].isValid = false;
        obj["ville"].invalidFeed = this.$i18n.t("errorCityInvalidFeed");
      } else {
        obj["ville"].isValid = true;
        obj["ville"].validFeed = this.$i18n.t("validFeed");
      }

      if (!this.cp) {
        this.errors.push(this.$i18n.t("emptyCPInvalidFeed"));
        obj["cp"].isValid = false;
        obj["cp"].invalidFeed = this.$i18n.t("emptyCPInvalidFeed");
      } else if (!this.validCp()) {
        this.errors.push(this.$i18n.t("errorCPInvalidFeed"));
        obj["cp"].isValid = false;
        obj["cp"].invalidFeed = this.$i18n.t("errorCPInvalidFeed");
      } else {
        obj["cp"].isValid = true;
        obj["cp"].validFeed = this.$i18n.t("validFeed");
      }

      if (!this.tel) {
        this.errors.push(this.$i18n.t("emptyTelInvalidFeed"));
        obj["tel"].isValid = false;
        obj["tel"].invalidFeed = this.$i18n.t("emptyTelInvalidFeed");
      } else if (!this.validTel()) {
        this.errors.push(this.$i18n.t("errorTelInvalidFeed"));
        obj["tel"].isValid = false;
        obj["tel"].invalidFeed = this.$i18n.t("errorTelInvalidFeed");
      } else {
        obj["tel"].isValid = true;
        obj["tel"].validFeed = this.$i18n.t("validFeed");
      }

      // if (!this.numCommercant) {
      //   this.errors.push(this.$i18n.t("emptySellerNumInvalidFeed"));
      //   obj["numCommercant"].isValid = false;
      //   obj["numCommercant"].invalidFeed = this.$i18n.t("emptySellerNumInvalidFeed");
      // } else if (!this.validNumCommercant()) {
      //   this.errors.push(this.$i18n.t("errorSellerNumInvalidFeed"));
      //   obj["numCommercant"].isValid = false;
      //   obj["numCommercant"].invalidFeed = this.$i18n.t("errorSellerNumInvalidFeed");
      // } else {
      //   obj["numCommercant"].isValid = true;
      //   obj["numCommercant"].validFeed = this.$i18n.t("validFeed");
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
      this.actorModal = val;
    },
  },
});
</script>

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
    "sellerNumberTableHeadText": "N° Commerçant",
    "telTableHeadText": "Téléphone",
    "typeTableHeadText": "Type",
    "emptyTableBodyContentText": "Aucun Acteur.",
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
    "emptyStreetNameInvalidFeed": "Le nom de rue ne peut être vide!",
    "errorStreetNameInvalidFeed": "Nom de rue incorrect!",
    "streetNumberPlaceholder": "Numéro de rue",
    "emptyStreetNumberInvalidFeed": "Le n° de rue ne peut être vide!",
    "errorStreetNumberInvalidFeed": "N° de rue incorrect!",
    "cityPlaceholder": "Ville",
    "emptyCityInvalidFeed": "La ville ne peut être vide!",
    "errorCityInvalidFeed": "Ville incorrect!",
    "sellerNumberPlaceholder": "N° Commerçant",
    "emptySellerNumberInvalidFeed": "Le n° de commerçant ne peut être vide!",
    "errorSellerNumberInvalidFeed": "N° de commerçant incorrect!",
    "telPlaceholder": "Téléphone",
    "emptyTelInvalidFeed": "Le n° de téléphone ne peut être vide!",
    "errorTelInvalidFeed": "N° de téléphone incorrect!",
    "typePlaceholder": "Type",
    "emptyTypeInvalidFeed": "Le type ne peut être vide!",
    "errorTypeInvalidFeed": "Type incorrect!",
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
    "sellerNumberInputLabel": "N° Commerçant",
    "telInputLabel": "Téléphone",
    "typeInputSellerLabel": "Vendeur",
    "typeInputBuyerLabel": "Acheteur",

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
    "sellerNumberTableHeadText": "Seller ID Number",
    "telTableHeadText": "Phone",
    "typeTableHeadText": "Type",
    "emptyTableBodyContentText": "No Actor.",
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
    "emptyStreetNameInvalidFeed": "Street name can't be empty!",
    "errorStreetNameInvalidFeed": "Bad street name supplied!",
    "streetNumberPlaceholder": "Street number",
    "emptyStreetNumberInvalidFeed": "Street number can't be empty!",
    "errorStreetNumberInvalidFeed": "Bad street number supplied!",
    "cityPlaceholder": "City",
    "emptyCityInvalidFeed": "City can't be empty!",
    "errorCityInvalidFeed": "Bad city supplied!",
    "sellerNumberPlaceholder": "Seller name",
    "emptySellerNumberInvalidFeed": "Seller name can't be empty!",
    "errorSellerNumberInvalidFeed": "Bad seller name supplied!",
    "telPlaceholder": "Phone number",
    "emptyTelInvalidFeed": "Phone number can't be empty!",
    "errorTelInvalidFeed": "Bad phone number supplied!",
    "typePlaceholder": "Type",
    "emptyTypeInvalidFeed": "Type can't be empty!",
    "errorTypeInvalidFeed": "Bad type supplied!",
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
    "sellerNumberInputLabel": "Seller ID Number",
    "telInputLabel": "Phone",
    "typeInputSellerLabel": "Seller",
    "typeInputBuyerLabel": "Buyer",

    "servicesLinkTarget": "/actors"
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
          disabled,
          counter,
          maxlength,
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
              :disabled="disabled"
              @input="inputChanges($event)"
              :counter="counter"
              :maxlength="maxlength"
            >
              <!-- <slot name="input-prepend"></slot> -->
              <!-- <template v-if="inputGroup" v-slot:prepend>
                <span class="input-group-text" id="basic">@</span>
              </template> -->
            </MDBInput>
          </MDBCol>
        </MDBRow>
      </template>
      <!-- <template
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
      </template> -->
      <template #addFormCheckbox="{ size, invalidFeedback, validFeedback }">
        <MDBRow class="g-2 d-flex justify-content-center">
          <MDBCol :md="size">
            <MDBCheckbox
              v-for="(val, ind) in typesInputForAdding"
              v-bind:key="ind"
              :id="val.id"
              :label="val.label"
              :aria-label="val.ariaLabel"
              v-model="$data[val.model]"
              :validateOnChange="true"
              :required="val.required"
              :isValid="val.isValid"
              :isValidated="true"
              :validFeedback="validFeedback"
              :invalidFeedback="invalidFeedback"
              :btnCheck="val.btnCheck"
            >
            </MDBCheckbox>
            <!-- <MDBSwitch
              label="val.label"
            > 
            </MDBSwitch> -->
          </MDBCol>
        </MDBRow>
      </template>
    </TableItem>
  </div>
  <ModalItem
    @actorModal="modalChange"
    input="actorModal"
    id="actorModal"
    tabIndex="-1"
    labelledBy="actorModal"
    :model="actorModal"
    :centered="true"
    :modalTitle="modalTitle"
    :modalContent="modalContent"
    :modalCloseBtnText="$t('modalCloseBtnText')"
    :staticBackdrop="true"
  >
  </ModalItem>
</template>
