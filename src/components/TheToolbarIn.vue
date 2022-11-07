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
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CustomToolbarItem from "./ToolbarItem.vue";
import ToolbarLinkItem from "./ToolbarLinkItem.vue";
import IconCL from "./icons/IconCL.vue";

export default defineComponent({
  name: "TheToolbarIn",
  components: {
    CustomToolbarItem,
    ToolbarLinkItem,
    IconCL,
  },
});
</script>
