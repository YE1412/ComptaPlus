<script lang="ts">
/*global __CRYPTAPI__, __KEY__*/
import { defineComponent } from "vue";
import {
  MDBCol,
  MDBRow,
  MDBBtn,
  MDBListGroup,
  MDBListGroupItem,
} from "mdb-vue-ui-kit";
import RegisterContentItem from "./RegisterContentItem.vue";
import userAxiosService from "../services/user.service";
import ModalItem from "./ModalItem.vue";
import router from "@/router/index";
import { useMessageStore } from "@/stores/message";
import MessagesItem from "../components/MessagesItem.vue";
// import { genMod, cryptMod } from "../WasmModules";
import "../globals";

export default defineComponent({
  name: "RegisterContent",
  setup() {
    const messageStore = useMessageStore();

    return {
      messageStore,
    };
  },
  data() {
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
      registerModal: false,
      modalTitle: "",
      modalContent: "",
    };
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
  },
  methods: {
    lastnameChanges(text: String) {
      this.lastname = text;
    },
    firstnameChanges(text: String) {
      this.firstname = text;
    },
    loginChanges(text: String) {
      this.login = text;
    },
    emailChanges(text: String) {
      this.email = text;
    },
    emailConfirmChanges(text: String) {
      this.email_confirm = text;
    },
    passwordChanges(text: String) {
      this.password = text;
    },
    passwordConfirmChanges(text: String) {
      this.password_confirm = text;
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
    registerNewUser() {
      const obj = {
        lastname: this.lastname,
        firstname: this.firstname,
        login: this.login,
        email: this.email,
        password: this.password,
        type: 2,
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
          <MDBCol
            col="6"
            class="justify-content-center mb-4 text-center"
            style="text-align: center"
          >
            <MDBBtn color="primary" type="submit">
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
