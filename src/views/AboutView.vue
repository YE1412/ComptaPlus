<script lang="ts">
import { defineComponent } from "vue";
import { useUserStore } from "@/stores/user";
export default defineComponent({
  name: "HomeView",
  setup() {
    const store = useUserStore();
    console.log(store);
    return { store };
  },
});
</script>

<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
