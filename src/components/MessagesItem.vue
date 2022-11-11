<script lang="ts">
import { defineComponent } from "vue";
import { useServiceStore } from "@/stores/service";

export default defineComponent({
  name: "MessagesItem",
  props: {
    messages: {
      required: false,
      default: () => [],
    },
  },
  setup() {
    const store = useServiceStore();
    return { store };
  },
  // data() {
  // },
  components: {},
  methods: {
    resetMessages(e: Event) {
      this.store.deleteMessages();
    },
  },
});
</script>

<template>
  <div class="messages">
    <div
      v-for="(msg, index) in store.getMessages"
      v-bind:key="index"
      :class="[{ severityOk: !msg.severity }, { severityKo: msg.severity }]"
    >
      <span
        :class="[{ severityOk: !msg.severity }, { severityKo: msg.severity }]"
      >
        {{ msg.content }}
      </span>
      <button type="button" class="clear" @click="resetMessages($event)">
        <i class="bi bi-x-circle"></i>
      </button>
    </div>
  </div>
</template>
