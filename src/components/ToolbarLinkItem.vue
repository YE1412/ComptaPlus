<template>
  <RouterLink :to="$t('homeLinkTarget')">
    <slot name="icon"></slot>
  </RouterLink>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { RouterLink } from "vue-router";

export default defineComponent({
  name: "ToolbarLinkItem",
  components: {
    RouterLink,
  },
});
</script>
