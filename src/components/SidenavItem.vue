<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "SidenavItem",
  props: {
    state: {
      type: Boolean,
      required: true
    },
    icon: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    link: {
      type: String,
      required: true
    }
  },
  setup() {
  },
  data() {
    return {
      biClass: 'bi',
      customClass: this.icon,
      caretUpClass: 'bi-caret-up-fill',
      caretDownClass: 'bi-caret-down-fill',
    }
  },
  mounted() {
    
  },
  components: {
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
    <a class="collapsible-header waves-effect arrow-r" :href="link">
      <div>
        <i :class="[biClass, customClass]"></i> 
        <span>{{ title }}</span>
      </div>
      <i :class="[biClass, state ? caretUpClass : caretDownClass]"></i>
    </a>
    <div class="collapsible-body" :class="{ hidden: !state }">
        <ul>
            <li>
                <a href="#" class="waves-effect">
                {{ $t('admin') }}
                </a>
            </li>
            <li>
                <a href="#" class="waves-effect">
                {{ $t('display') }}
                </a>
            </li>
        </ul>
    </div>
  </li>
</template>