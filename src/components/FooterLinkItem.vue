<script lang="ts">
import { defineComponent } from "vue";
import { RouterLink } from "vue-router";

export default defineComponent({
  name: "FooterLinkItem",
  props: {
    dest: {
      type: String,
      default: "",
    },
  },
  components: {
    RouterLink,
  },
});
</script>

<template>
  <RouterLink :to="dest">
    <slot name="linkContent"></slot>
  </RouterLink>
</template>
