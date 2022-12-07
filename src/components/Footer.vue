<script lang="ts">
// import { RouterLink } from "vue-router";
// import router from "@/router/index";
import { defineComponent } from "vue";
import { useUserStore } from "@/stores/user";
import { useSessionStore } from "@/stores/session";
import { useMessageStore } from "@/stores/message";
import FooterLinkItem from "./FooterLinkItem.vue";

export default defineComponent({
  name: "Footer-In",
  setup() {
    const userStore = useUserStore();
    const sessionStore = useSessionStore();
    const messageStore = useMessageStore();
    return { userStore, sessionStore, messageStore };
  },
  components: {
    // RouterLink,
    FooterLinkItem,
  },
  methods: {
    logoutClick(e) {
      e.preventDefault();
      // console.log("logout click !");
      this.userStore.resetUser();
      this.sessionStore.deleteSession();
      this.messageStore.deleteMessages();
      this.$router.go(0);
    },
  },
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
    "about_path": "/about",
    "footerParagraph": "©2022 CryptoLogique - Digital services company",
  },
  "fr": {
    "logout": "Se déconnecter",
    "home_path": "/accueil",
    "home": "Accueil",
    "userManagement": "Mon profil",
    "userManagement_path": "/profil",
    "about": "À Propos",
    "about_path": "/a-propos",
    "footerParagraph": "©2022 CryptoLogique - Entreprise de services du numérique (ESN)",
  }
}
</i18n>

<template>
  <div class="footer">
    <div>
      <h2>CryptoLogique</h2>
      <div>
        <FooterLinkItem :dest="$t('home_path')">
          <template #linkContent>
            {{ $t("home") }}
          </template>
        </FooterLinkItem>
        <FooterLinkItem :dest="$t('about_path')">
          <template #linkContent>
            {{ $t("about") }}
          </template>
        </FooterLinkItem>
        <!-- <a href="/plan-du-site">{{footerFirstLinkTexte}}</a>
            <a href="/mentions-legales">{{footerSecondLinkTexte}}</a> -->
      </div>
      <p>{{ $t("footerParagraph") }}</p>
    </div>
  </div>
</template>
