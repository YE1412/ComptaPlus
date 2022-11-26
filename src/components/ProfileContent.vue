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
import ProfileContentItem from "./ProfileContentItem.vue";
import "../globals";
import vSelect from "vue-select";

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
      userStore: usrStore,
      counterStore: cntStore,
      messageStore: msgStore,
      devisesObj: devises,
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
    vSelect,
    MDBFile,
    MDBInput,
  },
  data() {
    const formObj = {
      login: {
        name: "formInput",
        size: "6",
        required: true,
        value: "",
        state: true,
        label: "",
        invalidFeedback: "",
        validFeedback: "",
        isValidated: true,
        isValid: true,
        type: "text",
      },
      email: {
        name: "formInput",
        size: "6",
        required: true,
        value: "",
        state: true,
        label: "",
        invalidFeedback: "",
        validFeedback: "",
        isValidated: true,
        isValid: true,
        type: "email",
      },
      firstName: {
        name: "formInput",
        size: "6",
        required: true,
        value: "",
        state: false,
        label: "",
        invalidFeedback: "",
        validFeedback: "",
        isValidated: true,
        isValid: true,
        type: "text",
      },
      lastName: {
        name: "formInput",
        size: "6",
        required: true,
        value: "",
        state: false,
        label: "",
        invalidFeedback: "",
        validFeedback: "",
        isValidated: true,
        isValid: true,
        type: "text",
      },
      pass: {
        name: "formInput",
        size: "6",
        required: true,
        value: "",
        state: false,
        label: "",
        invalidFeedback: "",
        validFeedback: "",
        isValidated: true,
        isValid: true,
        type: "password",
      },
      companyName: {
        name: "formInput",
        size: "6",
        required: true,
        value: "",
        state: false,
        label: "",
        invalidFeedback: "",
        validFeedback: "",
        isValidated: true,
        isValid: true,
        type: "text",
      },
      companyLogo: {
        name: "formFileInput",
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
      },
    };
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
      obj: formObj,
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
      password: "",
      password_valid: false,
      password_validMsg: "",
      password_valid_errorMsg: "",
      companyname: "",
      companyname_valid: false,
      companyname_validMsg: "",
      companyname_valid_errorMsg: "",
      companylogo: [],
      companylogo_valid: false,
      companylogo_validMsg: "",
      companylogo_valid_errorMsg: "",
      selectedMainDeviseCurrency: null,
      mainDeviseCurrencyOption: mainDeviseCurrencyOpt,
    };
  },
  methods: {
    userUpdateForm: function (e: Event) {
      e.preventDefault();
    },
    checkForm() {},
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
    // checkExistingEmail() {
    //   const email = this.transformValue(this.email);
    //   return userAxiosService
    //     .checkEmail(email)
    //     .then((res) => {
    //       if (res.data.length) return true;
    //       else return false;
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //       return true;
    //     });
    // },
    // checkExistingLogin: function () {
    //   const login = this.transformValue(this.login);
    //   return userAxiosService
    //     .checkLogin(login)
    //     .then((res) => {
    //       if (res.data.length) return true;
    //       else return false;
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //       return true;
    //     });
    // },
    updateUser() {
      const obj = {
        lastname: this.lastname,
        firstname: this.firstname,
        // login: this.login,
        // email: this.email,
        password: this.password,
        type: 2,
      };
      this.transformObject(obj);
      return userAxiosService
        .update(obj)
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
    inputChanges(e: Event) {
      // console.log(e.target.getAttribute("aria-label"));
      // console.log(e.target.value);
      switch (e.target.getAttribute("aria-label")) {
        // case "contenuAdditionnel":
        //   this.contenuAdditionnel = e.target.value;
        //   break;
        // case "services":
        //   this.services = e.target.value;
        //   break;
        default:
          break;
      }
    },
    // modalChange(val: Boolean) {
    //   this.registerModal = val;
    // },
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
    "companyLogoLabelText": "Logo de la société",
    "companyLogoPlaceholder": "Logo (.png/.jpg/.ico)",
    "emptyCompanyLogoErrorMsg": "Logo de la société requis !",
    "errorCompanyLogoMsg": "Fichier de logo incorrect !",

    "submit_buttonText": "Mettre à jour",
    "errorListTitle": "Veuillez corriger l'/les erreur(s) suivante(s) :",
    "modalTitleOk": "Cool !",
    "modalContentOk": "Inscription résussie !",
    "modalTitleKo": "Oups !",
    "modalContentKo": "Une erreur est survenue lors de l'inscription : {err} !",
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
    "companyLogoLabelText": "Company icon",
    "companyLogoPlaceholder": "Icon (.png/.jpg/.ico)",
    "emptyCompanyLogoErrorMsg": "Company icon required !",
    "errorCompanyLogoMsg": "Bad company icon file supplied !",

    "submit_buttonText": "Update",
    "errorListTitle": "Please correct the following error(s) : ",
  "modalTitleOk": "Great !",
    "modalContentOk": "Update completed !",
    "modalTitleKo": "Error !",
    "modalContentKo": "An error occured while updating : {err} !",
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
            }"
          >
            <MDBRow class="g-3 d-flex justify-content-center">
              <MDBCol :md="size" class="input-group">
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
                  @input="inputChanges($event)"
                >
                </MDBInput>
              </MDBCol>
            </MDBRow>
          </template>
          <template #formDeviseSelect="{ size, ariaLabel, required }">
            <MDBRow class="g-3 d-flex justify-content-center">
              <MDBCol :md="size" class="input-group">
                <label for="devises">{{ $t("deviseLabelText") }}</label>
                <vSelect
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
                </vSelect>
              </MDBCol>
            </MDBRow>
          </template>
          <template #formFileInput="{ size, label }">
            <MDBRow class="g-3 d-flex justify-content-center">
              <MDBCol :md="size" class="input-group">
                <MDBFile
                  v-model="companylogo"
                  :label="label"
                  :isValid="companylogo_valid"
                  :isValidated="true"
                  :invalidFeedback="companylogo_validMsg"
                  :validFeedback="companylogo_valid_errorMsg"
                  size="lg"
                />
              </MDBCol>
            </MDBRow>
          </template>
        </ProfileContentItem>
      </MDBRow>
    </div>
  </main>
</template>
