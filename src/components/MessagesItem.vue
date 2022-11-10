<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "MessagesItem",
  props: {
    messages: {
      required: false,
      default: () => [],
    },
  },
  setup() {
    return {
      mess: this.messages,
    };
  },
  // data() {
  // },
  components: {},
  methods: {
    resetMessages() {
      this.mess = [];
    },
  },
});
</script>

<template>
  <app-messages>
    <div class="messages">
      <div
        v-for="(msg, index) in mess"
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
  </app-messages>
</template>
