<script lang="ts">
import { defineComponent } from "vue";
import { Pie } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale)

export default defineComponent({
	name: "PieChart",
	props: {
	    chartId: {
	      type: String,
	      default: 'pie-chart'
	    },
	    datasetIdKey: {
			type: String,
			default: 'label'
		},
	    width: {
	      type: Number,
	      default: 400
	    },
	    height: {
	      type: Number,
	      default: 400
	    },
	    cssClasses: {
	      default: '',
	      type: String
	    },
	    styles: {
	      default: () => {}
	    },
	    plugins: {
	      default: () => []
	    }
	},
	components: {
		Pie,
	},
	setup(props) {
	    const chartData = {
	      labels: ['VueJs', 'EmberJs', 'ReactJs', 'AngularJs'],
	      datasets: [
	        {
	          backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
	          data: [40, 20, 80, 10]
	        }
	      ]
	    };

	    const chartOptions = {
	      responsive: true,
	      maintainAspectRatio: false
	    };

	    return {
	        chartData,
	        chartOptions,
	        chartId: props.chartId,
	        width: props.width,
	        height: props.height,
	        cssClasses: props.cssClasses,
	        styles: props.styles,
	        plugins: props.plugins,
	        datasetIdKey: props.datasetIdKey,
		};
	}
});
</script>

<template>
	<Pie
	    :chart-options="chartOptions"
	    :chart-data="chartData"
	    :chart-id="chartId"
	    :dataset-id-key="datasetIdKey"
	    :plugins="plugins"
	    :css-classes="cssClasses"
	    :styles="styles"
	    :width="width"
	    :height="height"
  	/>
</template>