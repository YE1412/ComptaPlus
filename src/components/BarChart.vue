<script lang="ts">
import { defineComponent } from "vue";
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default defineComponent({
	name: "BarChart",
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
	setup(props) {
	    const chartData = {
			labels: [
				'January',
			    'February',
			    'March',
			    'April',
			    'May',
			    'June',
			    'July',
			    'August',
			    'September',
			    'October',
			    'November',
			    'December'
			],
	      	datasets: [
		        {
					label: 'Data One',
					backgroundColor: '#f87979',
					data: [40, 20, 12, 39, 10, 40, 39, 80, 40, 20, 12, 11]
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
	},
	components: {
		Bar,
	}
});
</script>

<template>
	<Bar
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