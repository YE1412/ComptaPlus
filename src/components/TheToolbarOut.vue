<script lang="ts">
import { defineComponent } from "vue";
import CustomToolbarItem from "./ToolbarItem.vue";
import ToolbarLinkItem from "./ToolbarLinkItem.vue";
import ToolbarNavBar from "./ToolbarNavBar.vue";
import ToolbarFlagNav from "./ToolbarFlagNav.vue";
import IconCL from "./icons/IconCL.vue";
export default defineComponent({
  name: "TheToolbarOut",
  components: {
    CustomToolbarItem,
    ToolbarLinkItem,
    ToolbarNavBar,
    ToolbarFlagNav,
    IconCL,
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
    <ToolbarFlagNav />
  </div>
</template>
