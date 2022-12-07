<script lang="ts">
import { defineComponent } from "vue";
import { useUserStore } from "@/stores/user";
import TheToolbarIn from "../components/TheToolbarIn.vue";
import AboutContent from "../components/AboutContent.vue";
import FooterIn from "../components/Footer.vue";

export default defineComponent({
  name: "AboutView",
  setup() {
    const store = useUserStore();
    // console.log(store);
    return { store };
  },
  data() {
    return {
      renderComponent: true,
    };
  },
  methods: {
    async forceAboutRerender() {
      // Remove MyComponent from the DOM
      this.renderComponent = false;

      // Wait for the change to get flushed to the DOM
      await this.$nextTick();

      // Add the component back in
      this.renderComponent = true;
    },
  },
  mounted() {},
  components: {
    TheToolbarIn,
    AboutContent,
    FooterIn,
  },
});
</script>

<template>
  <main>
    <TheToolbarIn @language-changed-re-render="forceAboutRerender" />
    <div class="fullContent">
      <div class="about">
        <h1>This is an about page</h1>
      </div>
      <AboutContent v-if="renderComponent" />
    </div>
    <FooterIn />
  </main>
</template>

<style>
/*@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}*/
</style>
