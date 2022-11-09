<script lang="ts">
import { defineComponent } from "vue";
import useServiceStore from "@/stores/service";

export default defineComponent({
  name: "ServiceContent",
  props: {
    serviceForm: {
      type: Boolean,
      default: () => true,
    },
  },
  setup() {
    const store = useServiceStore();
    store
      .getAllServices()
      .then(
        (res) => {
          console.log(res);
          console.log(store.getServices);
        },
        (ret) => {
          console.log(ret);
        }
      )
      .catch((err) => {
        console.log(err);
      });
    return { store };
  },
  // data() {

  // },
  components: {},
});
</script>

<template>
  <div class="container"></div>
</template>
