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
  components: {
    TheToolbarIn,
    ProfileContent,
  },
});
</script>
<template>
  <main>
    <TheToolbarIn />
    <div class="fullContent">
      <Suspense>
        <ProfileContent />
      </Suspense>
    </div>
  </main>
</template>
