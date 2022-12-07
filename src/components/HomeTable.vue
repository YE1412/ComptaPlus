<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "HomeTable",
  props: {
    headTableObj: {
      default: () => [],
    },
    contentTableObj: {
      default: () => [],
    },
    cssClasses: {
      default: "",
      type: String,
    },
  },
  setup(props) {
    return {
      headTable: props.headTableObj,
      contentTable: props.contentTableObj,
    };
  },
});
</script>

<i18n>
{
	"fr": {
		"heading": "Chiffres sur l'année fiscale"
	},
	"en": {
		"heading": "Fiscal year stats"
	}
}
</i18n>

<template>
  <div :class="cssClasses">
    <h2>{{ $t("heading") }}</h2>
    <div class="table-responsive">
      <table class="table">
        <thead class="mdb-color darken-3">
          <tr class="text-black text-center">
            <th v-for="(head, i) in headTable" v-bind:key="i">
              {{ head }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td
              v-for="(content, i) in contentTable"
              v-bind:key="i"
              class="text-center"
              style="vertical-align: middle"
            >
              {{ content }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
