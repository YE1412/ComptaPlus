<script lang="ts">
/*global __CRYPTAPI__, __KEY__, __DECRYPTAPI__*/
import { defineComponent } from "vue";
import router from "@/router/index";
import { RouterLink } from "vue-router";
import { useUserStore } from "@/stores/user";
import StartContentLoginItem from "./StartContentLoginItem.vue";
import UserIcon from "./icons/IconUser.vue";
import LockIcon from "./icons/IconLock.vue";
import ModalItem from "./ModalItem.vue";
import "../globals";

export default defineComponent({
  name: "StartContent",
  setup() {
    const store = useUserStore();
    return { store };
  },
  mounted(){
    // console.log(__KEY__);
    // console.log(__GENKEYAPI__);
    // console.log(__SECRET__);
    // console.log(__CRYPTAPI__);
  },
  components: {
    RouterLink,
    StartContentLoginItem,
    UserIcon,
    LockIcon,
    ModalItem,
  },
  data() {
    return {
      login: "",
      password: "",
      loginModal: false,
    };
  },
  methods: {
    loginUser(e: Event) {
      if (this.login !== "" && this.password !== "") {
        const login = this.transformValue(this.login);
        const pass = this.transformValue(this.password);
        this.store
        .loginUser(login, pass)
        .then((res) => {
            // console.log("OK !");
            this.store.connected = true;
            this.store.user = this.transformObj(res);
            router.push(this.$i18n.t('home_path'));
            // console.log(this.store);
          },
          () => {
            // console.log("KO !");
            this.store.connected = false;
            this.loginModal = true;
            // console.log(this.store);
        })
        .catch((err) => {
          // console.log("KO ! - catch");
          // console.log(err);
          this.store.connected = false;
          this.loginModal = true;
          // console.log(this.store);
        });
      } else {
        // console.log("empty strings !");
        this.loginModal = true;
      }
    },
    modalChange(val: Boolean) {
      this.loginModal = val;
    },
    transformValue(obj: string) {
      return __CRYPTAPI__.crypt(obj, __KEY__);
    },
    transformObj(obj) {
      let ret = {};
      for (const key in obj){
        if(typeof obj[key] === "string"){
          ret[key] = __DECRYPTAPI__.decrypt(obj[key]);
        }else{
          ret[key] = obj[key];
        }
      }
      // console.log(ret);
      return ret;
    },
  },
});
</script>

<i18n>
{
  "en": {
    "login_submit_text": "Sign In",
    "login_placeholder": "Login or email",
    "password_placeholder": "Password",
    "not_yet": "Not registred yet?",
    "register": "Sign Up",
    "register_path": "/register",
    "modalTitle": "Error !",
    "modalContent": "Error while siging in : Bad Login and/or password !",
    "modalCloseBtnText": "Close",
    "home_path": "/home"
  },
  "fr": {
    "login_submit_text": "Se connecter",
    "login_placeholder": "Login ou email",
    "password_placeholder": "Mot de passe",
    "not_yet": "Pas encore inscrit ?",
    "register": "S'inscrire",
    "register_path": "/inscription",
    "modalTitle": "Erreur !",
    "modalContent": "Erreur lors de la connexion : Login et/ou Mot de passe incorrect !",
    "modalCloseBtnText": "Fermer",
    "home_path": "/accueil"
  }
}
</i18n>

<template>
  <div class="cont">
    <div class="demo">
      <div class="login">
        <div class="login__check"></div>
        <div class="login__form">
          <StartContentLoginItem>
            <template #loginIcon>
              <UserIcon />
            </template>
            <template #loginInput>
              <input
                v-model="login"
                type="text"
                class="login__input name"
                :placeholder="$t('login_placeholder')"
              />
            </template>
          </StartContentLoginItem>
          <StartContentLoginItem>
            <template #loginIcon>
              <LockIcon />
            </template>
            <template #loginInput>
              <input
                v-model="password"
                type="password"
                class="login__input pass"
                :placeholder="$t('password_placeholder')"
              />
            </template>
          </StartContentLoginItem>
          <button @click="loginUser($event)" type="button" class="login__submit">
            {{ $t("login_submit_text") }}
          </button>
          <p class="login__signup">
            {{ $t("not_yet") }} &nbsp;
            <RouterLink :to="$t('register_path')">{{
              $t("register")
            }}</RouterLink>
          </p>
        </div>
      </div>
    </div>
  </div>
  <ModalItem
    @loginModal="modalChange"
    input="loginModal"
    id="loginModal"
    tabIndex="-1"
    labelledBy="loginModal"
    :model="loginModal"
    :centered="true"
    :modalTitle="$t('modalTitle')"
    :modalContent="$t('modalContent')"
    :modalCloseBtnText="$t('modalCloseBtnText')"
    :staticBackdrop="true"
  >
  </ModalItem>
</template>
