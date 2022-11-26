<script lang="ts">
import { defineComponent } from "vue";
import { MDBRow } from "mdb-vue-ui-kit";
export default defineComponent({
  name: "ProfileContentItem",
  setup() {},
  props: {
    formObj: {
      required: true,
    },
  },
  components: {
    MDBRow,
  },
});
</script>

<template>
  <MDBRow
    v-for="(val, key) in formObj"
    v-bind:key="key"
    class="mb-4 d-flex justify-content-center"
  >
    <slot
		:name="val.name"
      	:size="val.size"
		:type="val.type"
		:ariaLabel="key"
		:required="val.required"
		:value="val.model"
		:state="val.state"
		:label="val.label"
		:invalidFeedback="val.invalidFeed"
		:validFeedback="val.validFeed"
		:isValidated="val.isValidated"
		:isValid="val.isValid"
    ></slot>
  </MDBRow>
</template>
