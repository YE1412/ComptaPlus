<script lang="ts">
import { defineComponent } from "vue";
import { useUserStore } from "@/stores/user";
import TheToolbarIn from "../components/TheToolbarIn.vue";
import AboutContent from "../components/AboutContent.vue";
export default defineComponent({
  name: "AboutView",
  setup() {
    const store = useUserStore();
    // console.log(store);
    return { store };
  },
  mounted() {},
  components: {
    TheToolbarIn,
    AboutContent,
  },
});
</script>

<template>
  <main>
    <TheToolbarIn />
    <div class="fullContent">
      <div class="about">
        <h1>This is an about page</h1>
      </div>
      <AboutContent />
    </div>
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
