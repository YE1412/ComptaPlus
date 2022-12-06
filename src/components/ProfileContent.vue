<script lang="ts">
/*global __CRYPTAPI__, __KEY__*/
import { defineComponent } from "vue";
import {
  MDBCol,
  MDBRow,
  MDBBtn,
  MDBListGroup,
  MDBListGroupItem,
  MDBFile,
  MDBInput,
} from "mdb-vue-ui-kit";
import { useUserStore } from "@/stores/user";
import { useCounterStore } from "@/stores/counter";
import { useMessageStore } from "@/stores/message";
import MessagesItem from "./MessagesItem.vue";
import userAxiosService from "../services/user.service";
import uploadImageAxiosService from "../services/upload_image.service";
import ProfileContentItem from "./ProfileContentItem.vue";
import "../globals";
import { VSelect } from "vuetify/components";
import ModalItem from "./ModalItem.vue";

export default defineComponent({
  name: "ProfileContent",
  async setup() {
    const usrStore = useUserStore();
    const cntStore = useCounterStore();
    const msgStore = useMessageStore();
    const devises = await userAxiosService
      .getAllDevises()
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.log(err);
        return [];
      });

    return {
      counterStore: cntStore,
      messageStore: msgStore,
      devisesObj: devises,
      userStore: usrStore,
    };
  },
  components: {
    MDBCol,
    MDBRow,
    MDBBtn,
    MDBListGroup,
    MDBListGroupItem,
    MessagesItem,
    ProfileContentItem,
    VSelect,
    MDBFile,
    MDBInput,
    ModalItem,
  },
  data() {
    var that = this;
    const usrDetails = this.userStore.getUser;
    const formObj = {
      login: {
        name: "formInput",
        size: "6",
        required: true,
        value: usrDetails.login,
        state: true,
        label: usrDetails.login,
        invalidFeedback: "",
        validFeedback: "",
        isValidated: true,
        isValid: true,
        type: "text",
        counter: true,
        maxLength: 255,
      },
      email: {
        name: "formInput",
        size: "6",
        required: true,
        value: usrDetails.email,
        state: true,
        label: usrDetails.email,
        invalidFeedback: "",
        validFeedback: "",
        isValidated: true,
        isValid: true,
        type: "email",
        counter: true,
        maxLength: 255,
      },
      firstName: {
        name: "formInput",
        size: "6",
        required: true,
        value: usrDetails.firstName,
        state: false,
        label: usrDetails.firstName,
        invalidFeedback: "",
        validFeedback: "",
        isValidated: true,
        isValid: true,
        type: "text",
        counter: true,
        maxLength: 30,
      },
      lastName: {
        name: "formInput",
        size: "6",
        required: true,
        value: usrDetails.lastName,
        state: false,
        label: usrDetails.lastName,
        invalidFeedback: "",
        validFeedback: "",
        isValidated: true,
        isValid: true,
        type: "text",
        counter: true,
        maxLength: 30,
      },
      pass: {
        name: "formInput",
        size: "6",
        required: true,
        value: "",
        state: false,
        label: this.$i18n.t("passwordLabelText"),
        invalidFeedback: "",
        validFeedback: "",
        isValidated: true,
        isValid: true,
        type: "password",
        counter: true,
        maxLength: 15,
      },
      companyName: {
        name: "formInput",
        size: "6",
        required: true,
        value: usrDetails.companyName,
        state: false,
        label: usrDetails.companyName,
        invalidFeedback: "",
        validFeedback: "",
        isValidated: true,
        isValid: true,
        type: "text",
        counter: true,
        maxLength: 30,
      },
      companyLogo: {
        name: "formFileInput",
        size: "6",
        required: "",
        value: "",
        state: false,
        label: this.$i18n.t('companyLogoLabelText', { size: 2 }),
        invalidFeedback: "",
        validFeedback: "",
        isValidated: true,
        isValid: true,
        type: "",
        counter: false,
        maxLength: 0,
      },
      deviseId: {
        name: "formDeviseSelect",
        size: "6",
        required: "",
        value: "",
        state: false,
        label: "",
        invalidFeedback: "",
        validFeedback: "",
        isValidated: true,
        isValid: true,
        type: "",
        counter: false,
        maxLength: 0,
      },
    };
    let mainDeviseCurrencyOpt = [];
    // mainDeviseCurrencyOpt.push({
    //   text: this.$i18n.t("devisePlaceholder"),
    //   value: 0,
    // });
    for (const k in this.devisesObj) {
      let devise = {};
      devise.text = `${this.devisesObj[k].symbole} - ${this.devisesObj[k].libelle}`;
      devise.value = this.devisesObj[k].deviseId;
      mainDeviseCurrencyOpt.push(devise);
    }
    return {
      obj: formObj,
      errors: [],
      userId: usrDetails.userId,
      lastname: usrDetails.lastName,
      lastname_valid: false,
      lastname_validMsg: "",
      lastname_valid_errorMsg: "",
      firstname: usrDetails.firstName,
      firstname_valid: false,
      firstname_validMsg: "",
      firstname_valid_errorMsg: "",
      login: "",
      login_valid: false,
      login_validMsg: "",
      login_valid_errorMsg: "",
      password: "",
      password_valid: false,
      password_validMsg: "",
      password_valid_errorMsg: "",
      companyname: usrDetails.companyName,
      companyname_valid: false,
      companyname_validMsg: "",
      companyname_valid_errorMsg: "",
      companylogo: null,
      companylogo_valid: true,
      companylogo_validMsg: "",
      companylogo_valid_errorMsg: "",
      currentImage: undefined,
      previewImage: undefined,
      progress: 0,
      message: "",
      deviseId: 0,
      selectedMainDeviseCurrency: [
        mainDeviseCurrencyOpt.find((dev) => {
          return dev.value === usrDetails.devise.deviseId;
        })
      ],
      mainDeviseCurrencyOption: mainDeviseCurrencyOpt,
      devisesError: false,
      devisesErrorMsg: "",
      updateUserModal: false,
      modalTitle: "",
      modalContent: "",
    };
  },
  methods: {
    upload() {
      this.progress = 0;

      return uploadImageAxiosService.upload(this.currentImage, (event) => {
        this.progress = Math.round((100 * event.loaded) / event.total);
      });
    },
    userUpdateForm: async function (e: Event) {
      e.preventDefault();
      this.errors = [];

      // Lastname checks
      if (!this.lastname) {
        this.errors.push(this.$i18n.t("emptyLastnameErrorMsg"));
        // this.lastname_valid = false;
        // this.lastname_valid_errorMsg = this.$i18n.t("emptyLastnameErrorMsg");
        this.obj["lastName"].isValid = false;
        this.obj["lastName"].invalidFeed = this.$i18n.t(
          "emptyLastnameErrorMsg"
        );
      } else if (!this.validLastname()) {
        this.errors.push(this.$i18n.t("errorLastnameMsg"));
        // this.lastname_valid = false;
        // this.lastname_valid_errorMsg = this.$i18n.t("errorLastnameMsg");
        this.obj["lastName"].isValid = false;
        this.obj["lastName"].invalidFeed = this.$i18n.t("errorLastnameMsg");
      } else {
        // this.lastname_valid = true;
        // this.lastname_validMsg = this.$i18n.t("validMsg");
        this.obj["lastName"].isValid = true;
        this.obj["lastName"].validFeed = this.$i18n.t("validMsg");
      }
      // Firstname checks
      if (!this.firstname) {
        this.errors.push(this.$i18n.t("emptyFirstnameErrorMsg"));
        // this.firstname_valid = false;
        // this.firstname_valid_errorMsg = this.$i18n.t("emptyFirstnameErrorMsg");
        this.obj["firstName"].isValid = false;
        this.obj["firstName"].invalidFeed = this.$i18n.t(
          "emptyFirstnameErrorMsg"
        );
      } else if (!this.validFirstname()) {
        this.errors.push(this.$i18n.t("errorFirstnameMsg"));
        // this.firstname_valid = false;
        // this.firstname_valid_errorMsg = this.$i18n.t("errorFirstnameMsg");
        this.obj["firstName"].isValid = false;
        this.obj["firstName"].invalidFeed = this.$i18n.t("errorFirstnameMsg");
      } else {
        // this.firstname_valid = true;
        // this.firstname_validMsg = this.$i18n.t("validMsg");
        this.obj["firstName"].isValid = true;
        this.obj["firstName"].invalidFeed = this.$i18n.t("validMsg");
      }
      // Password checks
      if (!this.password) {
        this.errors.push(this.$i18n.t("emptyPasswordErrorMsg"));
        // this.password_valid = false;
        // this.password_valid_errorMsg = this.$i18n.t("emptyPasswordErrorMsg");
        this.obj["pass"].isValid = false;
        this.obj["pass"].invalidFeed = this.$i18n.t("emptyPasswordErrorMsg");
      } else if (!this.validPassword()) {
        this.errors.push(this.$i18n.t("errorPasswordMsg"));
        // this.password_valid = false;
        // this.password_valid_errorMsg = this.$i18n.t("errorPasswordMsg");
        this.obj["pass"].isValid = false;
        this.obj["pass"].invalidFeed = this.$i18n.t("errorPasswordMsg");
      } else {
        // this.password_valid = true;
        // this.password_validMsg = this.$i18n.t("validMsg");
        this.obj["pass"].isValid = true;
        this.obj["pass"].invalidFeed = this.$i18n.t("validMsg");
      }
      // Company Name checks
      if (!this.companyname) {
        this.errors.push(this.$i18n.t("emptyCompanyNameErrorMsg"));
        // this.companyname_valid = false;
        // this.companyname_valid_errorMsg = this.$i18n.t(
        //   "emptyCompanyNameErrorMsg"
        // );
        this.obj["companyName"].isValid = false;
        this.obj["companyName"].invalidFeed = this.$i18n.t(
          "emptyCompanyNameErrorMsg"
        );
      } else {
        if (!this.validCompanyName()) {
          this.errors.push(this.$i18n.t("errorCompanyNameMsg"));
          // this.companyname_valid = false;
          // this.companyname_valid_errorMsg = this.$i18n.t("errorCompanyNameMsg");
          this.obj["companyName"].isValid = false;
          this.obj["companyName"].invalidFeed = this.$i18n.t(
            "errorCompanyNameMsg"
          );
        } else {
          // this.companyname_valid = true;
          // this.companyname_validMsg = this.$i18n.t("validMsg");
          this.obj["companyName"].isValid = true;
          this.obj["companyName"].invalidFeed = this.$i18n.t("validMsg");
        }
      }
      // Devise checks
      if (this.selectedMainDeviseCurrency === null) {
        this.errors.push(this.$i18n.t("emptyDeviseErrorMsg"));
        this.devisesError = true;
        this.devisesErrorMsg = this.$i18n.t("emptyDeviseErrorMsg");
        // this.modalTitle = this.$i18n.t("modalTitleKo");
        // this.modalContent = this.$i18n.t("modalContentKo", {
        //   err: this.$i18n.t("emptyDeviseErrorMsg"),
        // });
        // this.updateUserModal = true;
      } else {
        this.devisesError = false;
        this.deviseId = this.selectedMainDeviseCurrency.value;
      }
      // Company Logo checks
      if (this.companylogo !== null) {
        if (!this.validCompanyLogo()) {
          this.errors.push(this.$i18n.t("errorCompanyLogoMsg"));
          // this.obj["companyLogo"].isValid = false;
          // this.obj["companyLogo"].invalidFeed = this.$i18n.t("errorCompanyLogoMsg");
          this.companylogo_valid = false;
          this.companylogo_valid_errorMsg = this.$i18n.t("errorCompanyLogoMsg");
        } else {
          await this.upload()
            .then((response) => {
              // console.log(response);
              this.message = response.data.message;
              // this.obj["companyLogo"].isValid = true;
              // this.obj["companyLogo"].validFeed = this.$i18n.t("validMsg");
              this.companylogo_valid = true;
              this.companylogo_validMsg = this.$i18n.t("validMsg");
            })
            .catch((err) => {
              // console.log(err);
              this.progress = 0;
              this.message =
                "Could not upload the image, " + err.response.data.message ||
                err.message;
              this.currentImage = undefined;
              if (
                err.response.data.errFileSize !== undefined &&
                err.response.data.errFileSize
              ) {
                this.errors.push(
                  this.$i18n.t("errorCompanyLogoMaxSizeFileUploadMsg", {
                    size: err.response.data.errMaxFileSize,
                  })
                );
                // this.obj["companyLogo"].isValid = false;
                // this.obj["companyLogo"].invalidFeed = this.$i18n.t(
                //   "errorCompanyLogoMaxSizeFileUploadMsg",
                //   { size: err.response.data.errMaxFileSize }
                // );
                this.companylogo_valid = false;
                this.companylogo_valid_errorMsg = this.$i18n.t(
                  "errorCompanyLogoMaxSizeFileUploadMsg",
                  { size: err.response.data.errMaxFileSize }
                );
              } else {
                this.errors.push(
                  this.$i18n.t("errorCompanyLogoFileUploadMsg", {
                    err: this.message,
                  })
                );
                // this.obj["companyLogo"].isValid = false;
                // this.obj["companyLogo"].invalidFeed = this.$i18n.t(
                //   "errorCompanyLogoFileUploadMsg",
                //   { err: this.message }
                // );
                this.companylogo_valid = false;
                this.companylogo_valid_errorMsg = this.$i18n.t(
                  "errorCompanyLogoFileUploadMsg",
                  { err: this.message }
                );
              }
            });
        }
      }

      if (!this.errors.length) {
        const ret = await this.updateUser();
        // console.log(ret);
        if (ret) {
          this.userStore
            .retrieveUser(this.userId)
            .then(
              () => {
                this.$router.push("/");
              },
              () => {}
            )
            .catch((err) => {});
        }
      }
    },
    validLogin: function () {
      var re = /^([a-zA-Z])*$/;
      return re.test(this.login);
    },
    validLastname: function () {
      var re = /^([a-zA-Z])*$/;
      return re.test(this.lastname);
    },
    validFirstname: function () {
      var re = /^([a-zA-Z])*$/;
      return re.test(this.firstname);
    },
    validPassword: function () {
      var re = /^([a-zA-Z0-9])*$/;
      return re.test(this.password);
    },
    validCompanyName: function () {
      var re = /^([a-zA-Z])*$/;
      return re.test(this.companyname);
    },
    validCompanyLogo: function () {
      var re = /(?:\.(svg))$/i;
      // console.log(this.companylogo);
      return this.companylogo === null
        ? false
        : re.test(this.companylogo[0].name);
    },
    updateUser() {
      const obj = {
        lastname: this.lastname,
        firstname: this.firstname,
        companyName: this.companyname,
        companyLogo:
          this.companylogo !== null
            ? this.currentImage.name
            : this.companylogo,
        pass: this.password,
        deviseId: this.deviseId,
        userTypeId: 1,
      };
      this.transformObject(obj);
      return userAxiosService
        .update(this.userId, obj)
        .then((res) => {
          // console.log(res);
          // this.modalTitle = this.$i18n.t("modalTitleOk");
          // this.modalContent = this.$i18n.t("modalContentOk");
          // this.registerModal = true;
          // MESSAGES
          this.messageStore.messages.push({
            severity: false,
            content: this.$i18n.t("modalContentOk"),
          });
          this.messageVisibility = true;
          this.messageStore.messagesVisibility = true;
          return true;
        })
        .catch((err) => {
          // MESSAGES
          this.messageStore.messages.push({
            severity: true,
            content: this.$i18n.t("modalContentKo", {
              err: err.response.data.message || err.message,
            }),
          });
          this.messageVisibility = true;
          this.messageStore.messagesVisibility = true;
          return false;
        });
    },
    inputChanges(e: Event) {
      // console.log(e.target.getAttribute("aria-label"));
      // console.log(e.target.value);
      switch (e.target.getAttribute("aria-label")) {
        case "firstName":
          this.firstname = e.target.value;
          break;
        case "lastName":
          this.lastname = e.target.value;
          break;
        case "pass":
          this.password = e.target.value;
          break;
        case "companyName":
          this.companyname = e.target.value;
          break;
        default:
          break;
      }
    },
    modalChange(val: Boolean) {
      this.updateUserModal = val;
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
  },
  mounted() {
    this.currentImage = this.userStore.getUser.companyLogo;
    this.previewImage =
      this.currentImage !== null
        ? `${window.location.origin}/dist/assets/uploads/${this.currentImage}`
        : undefined;
    this.progress = 0;
    this.message = "";
    this.deviseId = this.userStore.getUser.devise.deviseId;
  },
  watch: {
    companylogo: {
      handler(newValue, oldValue) {
        if (newValue !== null && this.validCompanyLogo()) {
          this.currentImage = newValue.item(0);
          // console.log(this.currentImage);
          this.previewImage = URL.createObjectURL(this.currentImage);
          this.progress = 0;
          this.message = "";
        } else {
          this.currentImage = undefined;
          this.previewImage = undefined;
          this.progress = 0;
          this.message = "";
        }
      },
      immediate: true,
    },
  },
});
</script>

<i18n>
{
  "fr": {
    "deviseLabelText": "Devise de référence*",
    "devisePlaceholder": "Devises",
    "emptyDeviseErrorMsg": "Devise requise !",
    "errorDeviseMsg": "Devise incorrecte !",
    "form_title": "Formulaire de mise à jour du profil",
    "lastNameLabelText": "Votre nom*",
    "lastNamePlaceholder": "Nom",
    "emptyLastnameErrorMsg": "Nom requis !",
    "errorLastnameMsg": "Nom invalide !",
    "validMsg": "Validé !",
    "firstNameLabelText": "Votre prénom*",
    "firstNamePlaceholder": "Prénom",
    "emptyFirstnameErrorMsg": "Prénom requis !",
    "errorFirstnameMsg": "Prénom invalide !",
    "loginLabelText": "Votre login*",
    "loginPlaceholder": "Login",
    "emptyLoginErrorMsg": "Login requis !",
    "errorLoginMsg": "Login invalide !",
    "errorExistingLoginMsg": "Login indisponible !",
    "emailLabelText": "Votre adresse électronique*",
    "emailPlaceholder": "Adresse électronique",
    "emptyEmailErrorMsg": "Adresse électronique requise !",
    "errorEmailMsg": "Adresse électronique invalide !",
    "errorExistingEmailMsg": "Adresse électronique existante !",
    "companyNameLabelText": "Nom de la société*",
    "companyNamePlaceholder": "Société",
    "emptyCompanyNameErrorMsg": "Nom de société requis !",
    "errorCompanyNameMsg": "Nom de société incorrect !",
    "passwordLabelText": "Votre mot de passe*",
    "passwordPlaceholder": "Mot de passe",
    "emptyPasswordErrorMsg": "Mot de passe requis !",
    "errorPasswordMsg": "Mot de passe invalide !",
    "companyLogoLabelText": "Logo de la société (.svg) < {size}MB",
    "companyLogoPlaceholder": "Logo (.svg)",
    "emptyCompanyLogoErrorMsg": "Logo de la société requis !",
    "errorCompanyLogoMsg": "Fichier de logo incorrect !",
    "errorCompanyLogoFileUploadMsg": "Erreur lors de l'upload du fichier : {err}",
    "errorCompanyLogoMaxSizeFileUploadMsg": "Erreur lors de l'upload du fichier : Taille de fichier supérieure à {size}MB !",

    "submit_buttonText": "Mettre à jour",
    "errorListTitle": "Veuillez corriger l'/les erreur(s) suivante(s) :",
    "modalTitleOk": "Cool !",
    "modalContentOk": "Mise à jour de l'utilisateur réussie !",
    "modalTitleKo": "Oups !",
    "modalContentKo": "Une erreur est survenue lors de la mise à jour de l'utilisateur : {err}",
    "modalCloseBtnText": "Fermer"
  },
  "en": {
    "deviseLabelText": "Reference devises*",
    "devisePlaceholder": "Devises",
    "emptyDeviseErrorMsg": "Devises required !",
    "errorDeviseMsg": "Bad devise supplied !",
    "form_title": "Profile update form",
    "lastNameLabelText": "Lastname*",
    "lastNamePlaceholder": "Lastname",
    "emptyLastnameErrorMsg": "Lastname required !",
    "errorLastnameMsg": "Wrong lastname !",
    "validMsg": "Ok !",
    "firstNameLabelText": "Firstname*",
    "firstNamePlaceholder": "Firstname",
    "emptyFirstnameErrorMsg": "Firstname required !",
    "errorFirstnameMsg": "Wrong firstname !",
    "loginLabelText": "Login*",
    "loginPlaceholder": "Login",
    "emptyLoginErrorMsg": "Login required !",
    "errorLoginMsg": "Wrong login !",
    "errorExistingLoginMsg": "Existing login supplied !",
    "emailLabelText": "Email*",
    "emailPlaceholder": "Email",
    "emptyEmailErrorMsg": "Email required !",
    "errorEmailMsg": "Wrong email !",
    "errorExistingEmailMsg": "Existing Email supplied !",
    "companyNameLabelText": "Company name*",
    "companyNamePlaceholder": "Company",
    "emptyCompanyNameErrorMsg": "Company name required !",
    "errorCompanyNameMsg": "Bad company name supplied !",
    "passwordLabelText": "Password*",
    "passwordPlaceholder": "Passwword",
    "emptyPasswordErrorMsg": "Password required !",
    "errorPasswordMsg": "Wrong paswword !",
    "companyLogoLabelText": "Company icon (.svg) < {size}MB",
    "companyLogoPlaceholder": "Icon (.svg)",
    "emptyCompanyLogoErrorMsg": "Company icon required !",
    "errorCompanyLogoMsg": "Bad company icon file supplied !",
    "errorCompanyLogoFileUploadMsg": "Error while uploading file : {err}",
    "errorCompanyLogoMaxSizeFileUploadMsg": "Error while uploading file : Size of file greater than {size}MB !",

    "submit_buttonText": "Update",
    "errorListTitle": "Please correct the following error(s) : ",
  "modalTitleOk": "Great !",
    "modalContentOk": "User update completed !",
    "modalTitleKo": "Error !",
    "modalContentKo": "An error occured while updating : {err}",
    "modalCloseBtnText": "Close"
  }
}
</i18n>

<template>
  <main>
    <MessagesItem v-if="messageStore.getMessagesVisibility"></MessagesItem>
    <div class="container">
      <MDBRow
        tag="form"
        class="g-3 justify-content-center"
        @submit="userUpdateForm"
        novalidate="true"
      >
        <p class="h4 text-center mb-4 fw-bold">
          {{ $t("form_title") }}
        </p>
        <MDBListGroup class="list-group-light col-6 mb-4" v-if="errors.length">
          <MDBListGroupItem class="rounded-3 mb-2 border-0 px-3">
            {{ $t("errorListTitle") }}
          </MDBListGroupItem>
          <MDBListGroupItem
            v-for="(error, index) in errors"
            :key="index"
            class="rounded-3 mb-2 border-0 px-3"
            color="danger"
          >
            {{ error }}
          </MDBListGroupItem>
        </MDBListGroup>
        <ProfileContentItem :formObj="obj">
          <template
            #formInput="{
              size,
              ariaLabel,
              required,
              value,
              state,
              label,
              invalidFeedback,
              validFeedback,
              isValidated,
              isValid,
              type,
              counter,
              maxlength
            }"
          >
            <MDBCol :md="size">
              <MDBInput
                :required="required"
                :disabled="state"
                :aria-label="ariaLabel"
                :label="label"
                :value="value"
                :invalidFeedback="invalidFeedback"
                :validFeedback="validFeedback"
                :isValid="isValid"
                :isValidated="isValidated"
                :type="type"
                size="6"
                :counter="counter"
                :maxlength="maxlength"
                @input="inputChanges($event)"
              >
              </MDBInput>
            </MDBCol>
          </template>
          <template #formDeviseSelect="{ size, ariaLabel, required }">
            <MDBCol :md="size">
              <label for="devises">{{ $t("deviseLabelText") }}</label>
              <v-select
                :aria-label="ariaLabel"
                :label="$t('devisePlaceholder')"
                item-title="text"
                item-value="value"
                v-model="selectedMainDeviseCurrency"
                :multiple="false"
                :items="mainDeviseCurrencyOption"
                id="devises"
                class="custom-select w-100"
                :hide-selected="true"
                return-object
                :error="devisesError"
                :error-messages="devisesErrorMsg"
              >
              </v-select>
              <!-- <vSelect
                :required="required"
                :aria-label="ariaLabel"
                label="text"
                v-model="selectedMainDeviseCurrency"
                :multiple="false"
                :options="mainDeviseCurrencyOption"
                inputId="devises"
                class="custom-select w-100"
                :selectable="(option) => option.value !== 0"
              >
                <template #search="{ attributes, events }">
                  <input
                    class="vs__search"
                    :required="!selectedMainDeviseCurrency"
                    v-bind="attributes"
                    v-on="events"
                  />
                </template>
              </vSelect> -->
            </MDBCol>
          </template>
          <template #formFileInput="{ size, label }">
            <MDBCol :md="size">
              <MDBFile
                v-model="companylogo"
                :label="label"
                :isValid="companylogo_valid"
                :isValidated="true"
                :invalidFeedback="companylogo_valid_errorMsg"
                :validFeedback="companylogo_validMsg"
                size="lg"
              />
              <div
                v-if="currentImage"
                class="progress"
                style="height: 10px; margin-top: 30px"
              >
                <div
                  class="progress-bar progress-bar-info"
                  role="progressbar"
                  :aria-valuenow="progress"
                  aria-valuemin="0"
                  aria-valuemax="100"
                  :style="{ width: progress + '%' }"
                >
                  {{ progress }}%
                </div>
              </div>
              <div v-if="previewImage" style="width: 50px">
                <div>
                  <img
                    class="preview my-3"
                    :src="previewImage"
                    alt=""
                    width="50"
                  />
                </div>
              </div>
            </MDBCol>
          </template>
        </ProfileContentItem>
        <MDBRow class="mb-4 d-flex justify-content-center">
          <MDBCol
            col="6"
            class="justify-content-center mb-4 text-center"
            style="text-align: center"
          >
            <MDBBtn color="primary" type="submit" style="color: #fff">
              {{ $t("submit_buttonText") }}
            </MDBBtn>
          </MDBCol>
        </MDBRow>
      </MDBRow>
    </div>
    <ModalItem
      @updateUserModal="modalChange"
      input="updateUserModal"
      id="updateUserModal"
      tabIndex="-1"
      labelledBy="updateUserModal"
      :model="updateUserModal"
      :centered="true"
      :modalTitle="modalTitle"
      :modalContent="modalContent"
      :modalCloseBtnText="$t('modalCloseBtnText')"
      :staticBackdrop="true"
    >
    </ModalItem>
  </main>
</template>
