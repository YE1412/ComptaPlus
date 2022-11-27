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
} from "mdb-vue-ui-kit";
import RegisterContentItem from "./RegisterContentItem.vue";
import userAxiosService from "../services/user.service";
import uploadImageAxiosService from "../services/upload_image.service";
import ModalItem from "./ModalItem.vue";
import router from "@/router/index";
import { useMessageStore } from "@/stores/message";
import MessagesItem from "../components/MessagesItem.vue";
// import { MAX_SIZE } from "../../upload.js";
import "../globals";
import vSelect from "vue-select";

export default defineComponent({
  name: "RegisterContent",
  async setup() {
    const messageStore = useMessageStore();
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
      messageStore,
      devisesObj: devises,
    };
  },
  data() {
    let mainDeviseCurrencyOpt = [];
    mainDeviseCurrencyOpt.push({
      text: this.$i18n.t("devisePlaceholder"),
      value: 0,
    });
    for (const k in this.devisesObj) {
      let devise = {};
      devise.text = `${this.devisesObj[k].symbole} - ${this.devisesObj[k].libelle}`;
      devise.value = this.devisesObj[k].deviseId;
      mainDeviseCurrencyOpt.push(devise);
    }
    return {
      errors: [],
      lastname: "",
      lastname_valid: false,
      lastname_validMsg: "",
      lastname_valid_errorMsg: "",
      firstname: "",
      firstname_valid: false,
      firstname_validMsg: "",
      firstname_valid_errorMsg: "",
      login: "",
      login_valid: false,
      login_validMsg: "",
      login_valid_errorMsg: "",
      email: "",
      email_valid: false,
      email_validMsg: "",
      email_valid_errorMsg: "",
      email_confirm: "",
      emailConfirm_valid: false,
      emailConfirm_validMsg: "",
      emailConfirm_valid_errorMsg: "",
      password: "",
      password_valid: false,
      password_validMsg: "",
      password_valid_errorMsg: "",
      password_confirm: "",
      passwordConfirm_valid: false,
      passwordConfirm_validMsg: "",
      passwordConfirm_valid_errorMsg: "",
      companyName: "",
      companyName_valid: false,
      companyName_validMsg: "",
      companyName_valid_errorMsg: "",
      companyLogo: null,
      companyLogo_valid: false,
      companyLogo_validMsg: "",
      companyLogo_valid_errorMsg: "",
      currentImage: undefined,
      previewImage: undefined,
      progress: 0,
      message: "",
      deviseId: 0,
      selectedMainDeviseCurrency: null,
      mainDeviseCurrencyOption: mainDeviseCurrencyOpt,
      registerModal: false,
      modalTitle: "",
      modalContent: "",
    };
  },
  watch: {
    companyLogo: {
      handler(newValue, oldValue) {
        if (newValue !== null && this.validCompanyLogo()) {
          this.currentImage = newValue.item(0);
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
  components: {
    RegisterContentItem,
    MDBRow,
    MDBCol,
    MDBBtn,
    MDBListGroupItem,
    MDBListGroup,
    ModalItem,
    MessagesItem,
    vSelect,
    MDBFile,
  },
  methods: {
    upload() {
      this.progress = 0;

      return uploadImageAxiosService.upload(this.currentImage, (event) => {
        this.progress = Math.round((100 * event.loaded) / event.total);
      });
      // .then((response) => {
      //   console.log(response);
      //   this.message = response.data.message;
      //   return response.data;
      // })
      // .catch((err) => {
      //   console.log(err);
      //   this.progress = 0;
      //   this.message = "Could not upload the image ! " + err.response.data.message || err.message;
      //   this.currentImage = undefined;
      // });
    },
    lastnameChanges(text: string) {
      this.lastname = text;
    },
    firstnameChanges(text: string) {
      this.firstname = text;
    },
    loginChanges(text: string) {
      this.login = text;
    },
    emailChanges(text: string) {
      this.email = text;
    },
    emailConfirmChanges(text: string) {
      this.email_confirm = text;
    },
    passwordChanges(text: string) {
      this.password = text;
    },
    passwordConfirmChanges(text: string) {
      this.password_confirm = text;
    },
    companyNameChanges(text: string) {
      this.companyName = text;
    },
    userForm: async function (e) {
      e.preventDefault();
      this.errors = [];
      // console.log(this.lastname);
      // Lastname checks
      if (!this.lastname) {
        this.errors.push(this.$i18n.t("emptyLastnameErrorMsg"));
        this.lastname_valid = false;
        this.lastname_valid_errorMsg = this.$i18n.t("emptyLastnameErrorMsg");
      } else if (!this.validLastname()) {
        this.errors.push(this.$i18n.t("errorLastnameMsg"));
        this.lastname_valid = false;
        this.lastname_valid_errorMsg = this.$i18n.t("errorLastnameMsg");
      } else {
        this.lastname_valid = true;
        this.lastname_validMsg = this.$i18n.t("validMsg");
      }
      // Firstname checks
      if (!this.firstname) {
        this.errors.push(this.$i18n.t("emptyFirstnameErrorMsg"));
        this.firstname_valid = false;
        this.firstname_valid_errorMsg = this.$i18n.t("emptyFirstnameErrorMsg");
      } else if (!this.validFirstname()) {
        this.errors.push(this.$i18n.t("errorFirstnameMsg"));
        this.firstname_valid = false;
        this.firstname_valid_errorMsg = this.$i18n.t("errorFirstnameMsg");
      } else {
        this.firstname_valid = true;
        this.firstname_validMsg = this.$i18n.t("validMsg");
      }
      // Login checks
      if (!this.login) {
        this.errors.push(this.$i18n.t("emptyLoginErrorMsg"));
        this.login_valid = false;
        this.login_valid_errorMsg = this.$i18n.t("emptyLoginErrorMsg");
      } else if (!this.validLogin()) {
        this.errors.push(this.$i18n.t("errorLoginMsg"));
        this.login_valid = false;
        this.login_valid_errorMsg = this.$i18n.t("errorLoginMsg");
      } else {
        const exist = await this.checkExistingLogin();
        if (exist) {
          this.errors.push(this.$i18n.t("errorExistingLoginMsg"));
          this.login_valid = false;
          this.login_valid_errorMsg = this.$i18n.t("errorExistingLoginMsg");
        } else {
          this.login_valid = true;
          this.login_validMsg = this.$i18n.t("validMsg");
        }
      }
      // Email checks
      if (!this.email) {
        this.errors.push(this.$i18n.t("emptyEmailErrorMsg"));
        this.email_valid = false;
        this.email_valid_errorMsg = this.$i18n.t("emptyEmailErrorMsg");
      } else if (!this.validEmail()) {
        this.errors.push(this.$i18n.t("errorEmailMsg"));
        this.email_valid = false;
        this.email_valid_errorMsg = this.$i18n.t("errorEmailMsg");
      } else {
        const exist = await this.checkExistingEmail();
        if (exist) {
          this.errors.push(this.$i18n.t("errorExistingEmailMsg"));
          this.email_valid = false;
          this.email_valid_errorMsg = this.$i18n.t("errorExistingEmailMsg");
        } else {
          this.email_valid = true;
          this.email_validMsg = this.$i18n.t("validMsg");
        }
      }
      // Confirm Email checks
      if (!this.email_confirm) {
        this.errors.push(this.$i18n.t("emptyEmailConfirmErrorMsg"));
        this.emailConfirm_valid = false;
        this.emailConfirm_valid_errorMsg = this.$i18n.t(
          "emptyEmailConfirmErrorMsg"
        );
      } else if (this.email_confirm !== this.email) {
        this.errors.push(this.$i18n.t("errorEmailConfirmMsg"));
        this.emailConfirm_valid = false;
        this.emailConfirm_valid_errorMsg = this.$i18n.t("errorEmailConfirmMsg");
      } else {
        this.emailConfirm_valid = true;
        this.emailConfirm_validMsg = this.$i18n.t("validMsg");
      }
      // Password checks
      if (!this.password) {
        this.errors.push(this.$i18n.t("emptyPasswordErrorMsg"));
        this.password_valid = false;
        this.password_valid_errorMsg = this.$i18n.t("emptyPasswordErrorMsg");
      } else if (!this.validPassword()) {
        this.errors.push(this.$i18n.t("errorPasswordMsg"));
        this.password_valid = false;
        this.password_valid_errorMsg = this.$i18n.t("errorPasswordMsg");
      } else {
        this.password_valid = true;
        this.password_validMsg = this.$i18n.t("validMsg");
      }
      // Confirm Password checks
      if (!this.password_confirm) {
        this.errors.push(this.$i18n.t("emptyPasswordConfirmErrorMsg"));
        this.passwordConfirm_valid = false;
        this.passwordConfirm_valid_errorMsg = this.$i18n.t(
          "emptyPasswordConfirmErrorMsg"
        );
      } else if (this.password_confirm !== this.password) {
        this.errors.push(this.$i18n.t("errorPasswordConfirmMsg"));
        this.passwordConfirm_valid = false;
        this.passwordConfirm_valid_errorMsg = this.$i18n.t(
          "errorPasswordConfirmMsg"
        );
      } else {
        this.passwordConfirm_valid = true;
        this.passwordConfirm_validMsg = this.$i18n.t("validMsg");
      }
      // Company Name checks
      if (!this.companyName) {
        this.errors.push(this.$i18n.t("emptyCompanyNameErrorMsg"));
        this.companyName_valid = false;
        this.companyName_valid_errorMsg = this.$i18n.t(
          "emptyCompanyNameErrorMsg"
        );
      } else {
        if (!this.validCompanyName()) {
          this.errors.push(this.$i18n.t("errorCompanyNameMsg"));
          this.companyName_valid = false;
          this.companyName_valid_errorMsg = this.$i18n.t("errorCompanyNameMsg");
        } else {
          this.companyName_valid = true;
          this.companyName_validMsg = this.$i18n.t("validMsg");
        }
      }
      // Devise checks
      if (this.selectedMainDeviseCurrency === null) {
        this.errors.push(this.$i18n.t("emptyDeviseErrorMsg"));
        this.modalTitle = this.$i18n.t("modalTitleKo");
        this.modalContent = this.$i18n.t("modalContentKo", {
          err: this.$i18n.t("emptyDeviseErrorMsg"),
        });
        this.registerModal = true;
      } else {
        this.deviseId = this.selectedMainDeviseCurrency.value;
      }
      // Company Logo checks
      // console.log(this.companyLogo);
      // console.log(this.companyLogo.length);
      if (this.companyLogo !== null) {
        if (!this.validCompanyLogo()) {
          this.errors.push(this.$i18n.t("errorCompanyLogoMsg"));
          this.companyLogo_valid = false;
          this.companyLogo_valid_errorMsg = this.$i18n.t("errorCompanyLogoMsg");
        } else {
          await this.upload()
            .then((response) => {
              // console.log(response);
              this.message = response.data.message;
              this.companyLogo_valid = true;
              this.companyLogo_validMsg = this.$i18n.t("validMsg");
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
                this.companyLogo_valid = false;
                this.companyLogo_valid_errorMsg = this.$i18n.t(
                  "errorCompanyLogoMaxSizeFileUploadMsg",
                  { size: err.response.data.errMaxFileSize }
                );
              } else {
                this.errors.push(
                  this.$i18n.t("errorCompanyLogoFileUploadMsg", {
                    err: this.message,
                  })
                );
                this.companyLogo_valid = false;
                this.companyLogo_valid_errorMsg = this.$i18n.t(
                  "errorCompanyLogoFileUploadMsg",
                  { err: this.message }
                );
              }
            });
        }
      }

      if (!this.errors.length) {
        const ret = await this.registerNewUser();
        // console.log(ret);
        if (ret) {
          router.push("/");
        }
      }
    },
    validEmail: function () {
      var re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(this.email);
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
      var re = /^([a-zA-Z])*$/;
      return re.test(this.password);
    },
    checkExistingEmail() {
      const email = this.transformValue(this.email);
      return userAxiosService
        .checkEmail(email)
        .then((res) => {
          if (res.data.length) return true;
          else return false;
        })
        .catch((err) => {
          console.log(err);
          return true;
        });
    },
    checkExistingLogin: function () {
      const login = this.transformValue(this.login);
      return userAxiosService
        .checkLogin(login)
        .then((res) => {
          if (res.data.length) return true;
          else return false;
        })
        .catch((err) => {
          console.log(err);
          return true;
        });
    },
    validCompanyName: function () {
      var re = /^([a-zA-Z])*$/;
      return re.test(this.companyName);
    },
    validCompanyLogo: function () {
      var re = /(?:\.(jpg|jpeg|svg|png|ico))$/i;
      return re.test(this.companyLogo[0].name);
    },
    registerNewUser() {
      const obj = {
        lastname: this.lastname,
        firstname: this.firstname,
        login: this.login,
        email: this.email,
        password: this.password,
        companyName: this.companyName,
        companyLogo: this.companyLogo[0].name,
        deviseId: this.deviseId,
        type: 1,
      };
      this.transformObject(obj);
      return userAxiosService
        .create(obj)
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
          // console.log(err);
          // this.modalTitle = this.$i18n.t("modalTitleKo");
          // this.modalContent = this.$i18n.t("modalContentKo", {
          //   err: err.response.data.message || err.message,
          // });
          // this.registerModal = true;
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
    modalChange(val: Boolean) {
      this.registerModal = val;
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
});
</script>

<i18n>
{
	"fr": {
		"form_title": "Formulaire d'inscription",
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
		"emailConfirmLabelText": "Confirmation de l'adresse électronique*",
		"emailConfirmPlaceholder": "Adresse électronique (bis)",
		"emptyEmailConfirmErrorMsg": "Confirmation de l'adresse électronique requise !",
		"errorEmailConfirmMsg": "Les adresses électroniques ne sont pas identiques !",
		"passwordLabelText": "Votre mot de passe*",
		"passwordPlaceholder": "Mot de passe",
		"emptyPasswordErrorMsg": "Mot de passe requis !",
		"errorPasswordMsg": "Mot de passe invalide !",
		"passwordConfirmLabelText": "Confirmation de mot de passe*",
		"passwordConfirmPlaceholder": "Mot de passe (bis)",
		"emptyPasswordConfirmErrorMsg": "Confirmation de mot de passe requise !",
		"errorPasswordConfirmMsg": "Les mots de passe ne sont pas identiques !",
    "deviseLabelText": "Devise de référence*",
    "devisePlaceholder": "Devises",
    "emptyDeviseErrorMsg": "Devise requise ",
    "errorDeviseMsg": "Devise incorrecte ",
    "companyNameLabelText": "Nom de la société*",
    "companyNamePlaceholder": "Société",
    "emptyCompanyNameErrorMsg": "Nom de société requis !",
    "errorCompanyNameMsg": "Nom de société incorrect !",
    "companyLogoLabelText": "Logo de la société (.png/.jpg/.ico/.svg) < {size}MB",
    "companyLogoPlaceholder": "Logo (.png/.jpg/.ico/.svg)",
    "emptyCompanyLogoErrorMsg": "Logo de la société requis !",
    "errorCompanyLogoMsg": "Fichier de logo incorrect !",
    "errorCompanyLogoFileUploadMsg": "Erreur lors de l'upload du fichier : {err}",
    "errorCompanyLogoMaxSizeFileUploadMsg": "Erreur lors de l'upload du fichier : Taille de fichier supérieure à {size}MB !",

		"submit_buttonText": "S'enregistrer",
		"errorListTitle": "Veuillez corriger l'/les erreur(s) suivante(s) :",
		"modalTitleOk": "Cool !",
    "modalContentOk": "Inscription résussie !",
    "modalTitleKo": "Oups !",
    "modalContentKo": "Une erreur est survenue lors de l'inscription : {err} !",
    "modalCloseBtnText": "Fermer"
	},
	"en": {
		"form_title": "Sign up form",
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
		"emailConfirmLabelText": "Confirm email*",
		"emailConfirmPlaceholder": "Email (bis)",
		"emptyEmailConfirmErrorMsg": "Email confirmation required !",
		"errorEmailConfirmMsg": "Email confirmation mismatch !",
		"passwordLabelText": "Password*",
		"passwordPlaceholder": "Passwword",
		"emptyPasswordErrorMsg": "Password required !",
		"errorPasswordMsg": "Wrong paswword !",
		"passwordConfirmLabelText": "Confirm password*",
		"passwordConfirmPlaceholder": "Password (bis)",
		"emptyPasswordConfirmErrorMsg": "Password confirmation required !",
		"errorPasswordConfirmMsg": "Password confirmation mismatch !",
		"deviseLabelText": "Reference devise*",
    "devisePlaceholder": "Devises",
    "emptyDeviseErrorMsg": "Devises required !",
    "errorDeviseMsg": "Bad devise supplied !",
    "companyNameLabelText": "Company name*",
    "companyNamePlaceholder": "Company",
    "emptyCompanyNameErrorMsg": "Company name required !",
    "errorCompanyNameMsg": "Bad company name supplied !",
    "companyLogoLabelText": "Company icon (.png/.jpg/.ico/.svg) < {size}MB",
    "companyLogoPlaceholder": "Icon (.png/.jpg/.ico/.svg)",
    "emptyCompanyLogoErrorMsg": "Company icon required !",
    "errorCompanyLogoMsg": "Bad company icon file supplied !",
    "errorCompanyLogoFileUploadMsg": "Error while uploading file : {err}",
    "errorCompanyLogoMaxSizeFileUploadMsg": "Error while uploading file : Size of file greater than {size}MB !",

    "submit_buttonText": "Sign up",
		"errorListTitle": "Please correct the following error(s) : ",
		"modalTitleOk": "Great !",
    "modalContentOk": "Signing up completed !",
    "modalTitleKo": "Error !",
    "modalContentKo": "An error occured while singing up : {err} !",
    "modalCloseBtnText": "Close"
	}
}
</i18n>

<template>
  <main class="mt-3">
    <MessagesItem v-if="messageStore.getMessagesVisibility"></MessagesItem>
    <div class="container">
      <MDBRow
        tag="form"
        class="g-3 justify-content-center"
        @submit="userForm"
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
        <MDBRow class="mb-4 d-flex justify-content-center">
          <RegisterContentItem
            :label="$t('lastNameLabelText')"
            @lastname="lastnameChanges"
            input="lastname"
            :placeholder="$t('lastNamePlaceholder')"
            :invalidFeedback="lastname_valid_errorMsg"
            :validFeedback="lastname_validMsg"
            :isValid="lastname_valid"
            :isValidated="true"
            :required="true"
            ariaLabel="lastname"
            type="text"
            size="3"
          />
          <RegisterContentItem
            :label="$t('firstNameLabelText')"
            @firstname="firstnameChanges"
            input="firstname"
            :placeholder="$t('firstNamePlaceholder')"
            :invalidFeedback="firstname_valid_errorMsg"
            :validFeedback="firstname_validMsg"
            :isValid="firstname_valid"
            :isValidated="true"
            :required="true"
            ariaLabel="firstname"
            type="text"
            size="3"
          />
        </MDBRow>
        <MDBRow class="mb-4 d-flex justify-content-center">
          <RegisterContentItem
            :label="$t('loginLabelText')"
            @login="loginChanges"
            input="login"
            :placeholder="$t('loginPlaceholder')"
            :invalidFeedback="login_valid_errorMsg"
            :validFeedback="login_validMsg"
            :isValid="login_valid"
            :isValidated="true"
            :required="true"
            ariaLabel="login"
            :inputGroup="true"
            type="text"
            size="6"
          />
        </MDBRow>
        <MDBRow class="mb-4 d-flex justify-content-center">
          <RegisterContentItem
            :label="$t('emailLabelText')"
            @email="emailChanges"
            input="email"
            :placeholder="$t('emailPlaceholder')"
            :invalidFeedback="email_valid_errorMsg"
            :validFeedback="email_validMsg"
            :isValid="email_valid"
            :isValidated="true"
            :required="true"
            ariaLabel="email"
            type="email"
            size="6"
          />
        </MDBRow>
        <MDBRow class="mb-4 d-flex justify-content-center">
          <RegisterContentItem
            :label="$t('emailConfirmLabelText')"
            @email_confirm="emailConfirmChanges"
            input="email_confirm"
            :placeholder="$t('emailConfirmPlaceholder')"
            :invalidFeedback="emailConfirm_valid_errorMsg"
            :validFeedback="emailConfirm_validMsg"
            :isValid="emailConfirm_valid"
            :isValidated="true"
            :required="true"
            ariaLabel="email_confirm"
            type="email"
            size="6"
          />
        </MDBRow>
        <MDBRow class="mb-4 d-flex justify-content-center">
          <RegisterContentItem
            :label="$t('passwordLabelText')"
            @password="passwordChanges"
            input="password"
            :placeholder="$t('passwordPlaceholder')"
            :invalidFeedback="password_valid_errorMsg"
            :validFeedback="password_validMsg"
            :isValid="password_valid"
            :isValidated="true"
            :required="true"
            ariaLabel="password"
            type="password"
            size="6"
          />
        </MDBRow>
        <MDBRow class="mb-4 d-flex justify-content-center">
          <RegisterContentItem
            :label="$t('passwordConfirmLabelText')"
            @password_confirm="passwordConfirmChanges"
            input="password_confirm"
            :placeholder="$t('passwordConfirmPlaceholder')"
            :invalidFeedback="passwordConfirm_valid_errorMsg"
            :validFeedback="passwordConfirm_validMsg"
            :isValid="passwordConfirm_valid"
            :isValidated="true"
            :required="true"
            ariaLabel="password_confirm"
            type="password"
            size="6"
          />
        </MDBRow>
        <MDBRow class="mb-4 d-flex justify-content-center">
          <RegisterContentItem
            :label="$t('companyNameLabelText')"
            @company_name="companyNameChanges"
            input="company_name"
            :placeholder="$t('companyNamePlaceholder')"
            :invalidFeedback="companyName_valid_errorMsg"
            :validFeedback="companyName_validMsg"
            :isValid="companyName_valid"
            :isValidated="true"
            :required="true"
            ariaLabel="company_name"
            type="text"
            size="6"
          />
        </MDBRow>
        <MDBRow class="mb-4 d-flex justify-content-center">
          <MDBCol md="6">
            <MDBFile
              v-model="companyLogo"
              :label="$t('companyLogoLabelText', { size: 2 })"
              :isValid="companyLogo_valid"
              :isValidated="true"
              :invalidFeedback="companyLogo_valid_errorMsg"
              :validFeedback="companyLogo_validMsg"
              size="lg"
            >
            </MDBFile>
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
        </MDBRow>
        <MDBRow class="mb-4 d-flex justify-content-center">
          <MDBCol md="6">
            <label for="devises">{{ $t("deviseLabelText") }}</label>
            <vSelect
              :inputGroup="true"
              :required="true"
              aria-label="deviseId"
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
              <template v-slot:prepend>
                <span class="input-group-text" id="basic">@</span>
              </template>
            </vSelect>
          </MDBCol>
        </MDBRow>
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
      @registerModal="modalChange"
      input="registerModal"
      id="registerModal"
      tabIndex="-1"
      labelledBy="registerModal"
      :model="registerModal"
      :centered="true"
      :modalTitle="modalTitle"
      :modalContent="modalContent"
      :modalCloseBtnText="$t('modalCloseBtnText')"
      :staticBackdrop="true"
    >
    </ModalItem>
  </main>
</template>
