<script lang="ts">
import { defineComponent } from "vue";
import { MDBRow, MDBTable, MDBCheckbox } from "mdb-vue-ui-kit";

export default defineComponent({
	name: "ExportContent",
	setup() {

	},
	mounted() {

	},
	data() {
    	return {
    		checkbox1: false
    	};
  	},
	components: {
		MDBRow,
		MDBTable,
		MDBCheckbox
	},
});
</script>

<i18n>
{
	"fr": {
		"exportButtonText": "Exporter",
	},
	"en": {
		"exportButtonText": "Export",
	}
}
</i18n>

<template>
	<div class="container">
		<div class="responsive">
			<MDBTable>
		    <thead>
		      <tr>
		        <th scope="col">
		          <MDBCheckbox v-model="checkbox1" />
		        </th>
		        <th scope="col">Lorem</th>
		        <th scope="col">Ipsum</th>
		        <th scope="col">Dolor</th>
		      </tr>
		    </thead>
		    <tbody>
		      <tr>
		        <th scope="row">
		          <MDBCheckbox v-model="checkbox1" />
		        </th>
		        <td>Sit</td>
		        <td>Amet</td>
		        <td><a href="#"><button type="button" class="btn btn-primary btn-rounded btn-sm my-0">{{ $t("exportButtonText") }}</button></a></td>
		      </tr>
		      <tr>
		        <th scope="row">
		          <MDBCheckbox v-model="checkbox1" />
		        </th>
		        <td>Adipisicing</td>
		        <td>Elit</td>
		        <td><a href="#"><button type="button" class="btn btn-primary btn-rounded btn-sm my-0">{{ $t("exportButtonText") }}</button></a></td>
		      </tr>
		      <tr>
		        <th scope="row">
		          <MDBCheckbox v-model="checkbox1" />
		        </th>
		        <td>Hic</td>
		        <td>Fugiat</td>
		        <td>Temporibus</td>
		        <td><a href="#"><button type="button" class="btn btn-primary btn-rounded btn-sm my-0">{{ $t("exportButtonText") }}</button></a></td>
		      </tr>
		    </tbody>
		  </MDBTable>
		</div>
	</div>
</template>