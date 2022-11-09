<script lang="ls">
import {
	MDBModal,
	MDBModalHeader,
	MDBModalTitle,
	MDBModalBody,
	MDBModalFooter,
	MDBBtn,
} from 'mdb-vue-ui-kit';
import { defineComponent } from "vue";

export default defineComponent({
	name: "ModalItem",
	props: {
		id: {
			type: String,
			required: true
		},
		tabIndex: {
			type: String,
			required: true
		},
		labelledBy: {
			type: String,
			required: true
		},
		centered: {
			type: Boolean,
			required: true
		},
		model: {
			type: Boolean,
			required: true
		},
		modalTitle: {
			type: String,
			required: true
		},
		modalContent: {
			type: String,
			required: true
		},
		modalCloseBtnText: {
			type: String,
			required: true
		},
		input: {
			type: String,
			required: true
		},
		staticBackdrop: {
			type: Boolean,
			required: false
		}
	},
	components: {
		MDBModal,
	    MDBModalHeader,
	    MDBModalTitle,
	    MDBModalBody,
	    MDBModalFooter,
	    MDBBtn,
	},
	data() {
		return {
			loginModal: false
		};
	},
	methods: {
		inputChanges(e) {
			this.$emit(this.input, false);
		}
	}
});
</script>

<template>
  <MDBModal
    :id="id"
    :tabindex="tabIndex"
    :labelledby="labelledBy"
    :modelValue="model"
    :centered="centered"
    :staticBackdrop="staticBackdrop"
  >
    <MDBModalHeader>
      <MDBModalTitle :id="labelledBy">
        {{ modalTitle }}
      </MDBModalTitle>
    </MDBModalHeader>
    <MDBModalBody>
      <p>
        {{ modalContent }}
      </p>
    </MDBModalBody>
    <MDBModalFooter>
      <MDBBtn color="secondary" @click="inputChanges($event)">
        {{ modalCloseBtnText }}
      </MDBBtn>
    </MDBModalFooter>
  </MDBModal>
</template>
