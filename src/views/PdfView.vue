<script lang="ts">
import { defineComponent } from "vue";
import { useUserStore } from "@/stores/user";
import { jsPDF } from "jspdf";

export default defineComponent({
	name: "PdfView",
	setup() {
		const store = useUserStore();
    	return { store }; 
	}
});
</script>