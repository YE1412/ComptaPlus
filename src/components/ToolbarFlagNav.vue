<script lang="ts">
import { defineComponent } from "vue";
import { useCounterStore } from "@/stores/counter";
export default defineComponent({
  name: "ToolbarFlagNav",
  setup() {
    const store = useCounterStore();
    // console.log(store.getLanguages);
    return { store };
  },
  data() {
    // console.log(this.$i18n.messages);
    return {
      flagDropdownVisibility: false,
      langDisplayedIndex: this.store.getLangDisplayedIndex,
      langDisplayed: this.store.getLanguages[this.store.getLangDisplayedIndex],
    };
  },
  computed: {
    classObjectI() {
      return {
        "bi-caret-down-fill": !this.flagDropdownVisibility,
        "bi-caret-up-fill": this.flagDropdownVisibility,
      };
    },
  },
  methods: {
    toggleFlagDropdownDisplay(e: Event) {
      this.flagDropdownVisibility = !this.flagDropdownVisibility;
    },
    translateLanguageTo(languageIndex, e) {
      this.langDisplayedIndex = languageIndex;
      this.langDisplayed = this.store.getLanguages[languageIndex];
      this.$i18n.locale = this.langDisplayed.lang;
      this.flagDropdownVisibility = false;
      this.store.langDisplayedIndex = languageIndex;
      this.$emit("re-rendering");
    },
  },
});
</script>

<template>
  <div>
    <div>
      <button @click="toggleFlagDropdownDisplay($event)">
        <span>
          <span class="fi" :class="`fi-${langDisplayed.class}`"> </span>
          <i class="bi" :class="classObjectI"> </i>
        </span>
      </button>
      <div class="dropdown" v-if="flagDropdownVisibility">
        <span>
          {{ $t("flagsDropdownHead1") }}
          {{ store.getLanguages[langDisplayedIndex].default }}
        </span>
        <span>
          {{ $t("flagsDropdownHead2") }}
        </span>
        <ul>
          <li
            v-for="(language, index) in store.getLanguages"
            :key="language.country"
            @click="translateLanguageTo(index, $event)"
          >
            <a :country-val="language.country" :lang-val="language.lang">
              {{ language.label }}
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
