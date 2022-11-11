<script lang="ts">
import { defineComponent } from "vue";
import { RouterLink } from "vue-router";

export default defineComponent({
  name: "side-navItem",
  props: {
    state: {
      type: Boolean,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    src: {
      type: String,
      required: true,
    },
  },
  setup() {},
  data() {
    return {
      biClass: "bi",
      customClass: this.icon,
      caretUpClass: "bi-caret-up-fill",
      caretDownClass: "bi-caret-down-fill",
    };
  },
  mounted() {},
  components: {
    RouterLink,
  },
  methods: {
    handleAdminClick(e: Event) {
      this.$emit("show-admin", this.src);
    },
    handleDisplayClick(e: Event) {
      // console.log(`Display SidenavItem - ${this.src}`);
      this.$emit("show-display", this.src);
    },
  },
});
</script>

<i18n>
{
  "fr": {
    "admin": "Administration",
    "display": "Affichage"
  },
  "en": {
    "admin": "Administration",
    "display": "Display"
  }
}
</i18n>

<template>
  <li>
    <RouterLink class="collapsible-header waves-effect arrow-r" :to="link">
      <!-- <a class="collapsible-header waves-effect arrow-r" :href="link"> -->
      <div>
        <i :class="[biClass, customClass]"></i>
        <span>{{ title }}</span>
      </div>
      <i :class="[biClass, state ? caretUpClass : caretDownClass]"></i>
      <!-- </a> -->
    </RouterLink>
    <div class="collapsible-body" :class="{ hidden: !state }">
      <ul>
        <li>
          <a href="#" @click="handleAdminClick($event)" class="waves-effect">
            {{ $t("admin") }}
          </a>
        </li>
        <li>
          <a href="#" @click="handleDisplayClick($event)" class="waves-effect">
            {{ $t("display") }}
          </a>
        </li>
      </ul>
    </div>
  </li>
</template>
