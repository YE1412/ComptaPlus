<script lang="ts">
import { defineComponent } from "vue";
import CustomToolbarItem from "./ToolbarItem.vue";
import ToolbarLinkItem from "./ToolbarLinkItem.vue";
import ToolbarNavBar from "./ToolbarNavBarIn.vue";
import ToolbarFlagNav from "./ToolbarFlagNav.vue";
import IconCL from "./icons/IconCL.vue";

export default defineComponent({
  name: "TheToolbarIn",
  components: {
    CustomToolbarItem,
    ToolbarLinkItem,
    IconCL,
    ToolbarFlagNav,
    ToolbarNavBar,
  },
  methods: {
    handle_re_render() {
      this.$emit("language-changed-re-render");
    },
  },
});
</script>

<template>
  <div class="toolbar">
    <div>
      <div>
        <CustomToolbarItem> </CustomToolbarItem>
        <ToolbarLinkItem>
          <template #icon>
            <IconCL />
          </template>
        </ToolbarLinkItem>
      </div>
      <ToolbarNavBar />
    </div>
    <ToolbarFlagNav @re-rendering="handle_re_render" />
  </div>
</template>
