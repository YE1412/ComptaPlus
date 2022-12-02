<script lang="ts">
import { defineComponent, Suspense } from "vue";
import TheToolbarIn from "../components/TheToolbarIn.vue";
import { useUserStore } from "@/stores/user";
import ProfileContent from "../components/ProfileContent.vue";
export default defineComponent({
  name: "ProfileView",
  setup() {
    const store = useUserStore();
    return { store };
  },
  data() {
    return {
      renderComponent: true,
    };
  },
  methods: {
    async forceProfileRerender() {
      // Remove MyComponent from the DOM
      this.renderComponent = false;

      // Wait for the change to get flushed to the DOM
      await this.$nextTick();

      // Add the component back in
      this.renderComponent = true;
    },
  },
  components: {
    TheToolbarIn,
    ProfileContent,
  },
});
</script>
<template>
  <main>
    <TheToolbarIn @language-changed-re-render="forceProfileRerender" />
    <div class="fullContent">
      <Suspense>
        <ProfileContent v-if="renderComponent" />
      </Suspense>
    </div>
  </main>
</template>
