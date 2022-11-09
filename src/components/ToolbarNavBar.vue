<script lang="ts">
// import { useI18n } from 'vue-i18n';
import { RouterLink } from "vue-router";
import { defineComponent } from "vue";
// const { t } = i18n_toolbar.global;
export default defineComponent({
  name: "ToolbarNavBar",
  components: {
    RouterLink,
  },
});
</script>

<i18n>
{
  "en": {
    "login": "Sign In",
    "not_yet": "Not registred yet?",
    "register": "Sign Up",
    "logout": "Logout",
    "login_path": "/home",
    "register_path": "/register"
  },
  "fr": {
    "login": "Se connecter",
    "not_yet": "Pas encore inscrit ?",
    "register": "S'inscrire",
    "logout": "Se déconnecter",
    "login_path": "/accueil",
    "register_path": "/inscription"
  }
}
</i18n>

<template>
  <div class="navBar">
    <ul>
      <li>
        <div>
          <RouterLink :to="$t('login_path')">
            {{ $t("login") }}
          </RouterLink>
        </div>
      </li>
      <li>
        <div>
          <RouterLink :to="$t('register_path')">
            {{ $t("register") }}
          </RouterLink>
        </div>
      </li>
    </ul>
  </div>
</template>
