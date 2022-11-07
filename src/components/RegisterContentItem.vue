<script lang="ts">
import { defineComponent } from "vue";
import { MDBCol, MDBInput, MDBCheckbox } from 'mdb-vue-ui-kit';
export default defineComponent({
	name: "RegisterContentItem",
	props: {
		label: String,
		model: String,
		invalidFeedback: String,
		placeholder: String,
		validFeedback: String,
		isValid: Boolean | undefined,
		isValidated: Boolean,
		required: Boolean,
		ariaLabel: String,
		input: {
			type: String,
			required: true
		},
		inputGroup: {
			type: Boolean,
			required: false
		},
		type: {
			type: String,
			required: true
		},
		size: {
			type: String,
			required: true
		}
	},
	components: {
		MDBCol,
		MDBInput
	},
	methods: {
		inputChanges(e: Event) {
			this.$emit(this.input, e.target.value);
		}
	}
});
</script>

<template>
	<MDBCol :md="size">
		<MDBInput
			:inputGroup="inputGroup"
			:aria-label="ariaLabel"
			aria-describedby="basic"
			:label="label"
			:value="model"
			@input="inputChanges($event)"
			:invalidFeedback="invalidFeedback"
			:validFeedback="validFeedback"
			:isValid="isValid"
			:isValidated="isValidated"
			:required="required" 
			:placeholder="placeholder"
			:type="type"
			>
			<!-- <slot name="input-prepend"></slot> -->
			<template v-if="inputGroup" v-slot:prepend>
				<span class="input-group-text" id="basic">@</span>
			</template>
        </MDBInput>
	</MDBCol>
</template>