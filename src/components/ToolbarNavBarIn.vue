<script lang="ts">
import { RouterLink } from "vue-router";
import router from "@/router/index";
import { defineComponent } from "vue";
import { useUserStore } from "@/stores/user";
export default defineComponent({
  name: "ToolbarNavBarIn",
  setup() {
    const store = useUserStore()
    return { store };
  },
  components: {
    RouterLink,
  },
  methods: {
    logoutClick(e) {
      e.preventDefault();
      console.log("logout click !");
      this.store.user = {};
      this.store.connected = false;
      router.push('/');
    }
  }
});
</script>

<i18n>
{
  "en": {
    "logout": "Logout",
    "home_path": "/home",
    "home": "Home",
    "userManagement": "My profile",
    "userManagement_path": "/profile",
    "about": "About",
    "about_path": "/about"
  },
  "fr": {
    "logout": "Se déconnecter",
    "home_path": "/accueil",
    "home": "Accueil",
    "userManagement": "Mon profil",
    "userManagement_path": "/profil",
    "about": "À Propos",
    "about_path": "/a-propos"
  }
}
</i18n>

<template>
  <div class="navBar">
    <ul>
      <li>
        <div>
          <RouterLink :to="$t('home_path')">
            {{ $t("home") }}
          </RouterLink>
        </div>
      </li>
      <li>
        <div>
          <RouterLink :to="$t('userManagement_path')">
            {{ $t("userManagement") }}
          </RouterLink>
        </div>
      </li>
      <li>
        <div>
          <RouterLink :to="$t('about_path')">
            {{ $t("about") }}
          </RouterLink>
        </div>
      </li>
      <li>
        <div>
          <a href="/" @click="logoutClick($event)">
            {{ $t("logout") }}
          </a>
        </div>
      </li>
    </ul>
  </div>
</template>
