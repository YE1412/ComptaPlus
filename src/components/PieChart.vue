<script lang="ts">
import { defineComponent } from "vue";
import { Pie } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
} from "chart.js";
import { useCounterStore } from "@/stores/counter";

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

export default defineComponent({
  name: "PieChart",
  props: {
    chartId: {
      type: String,
      default: "pie-chart",
    },
    datasetIdKey: {
      type: String,
      default: "label",
    },
    width: {
      type: Number,
      default: 400,
    },
    height: {
      type: Number,
      default: 400,
    },
    cssClasses: {
      default: "",
      type: String,
    },
    styles: {
      default: () => {},
    },
    plugins: {
      default: () => [],
    },
  },
  components: {
    Pie,
  },
  setup(props) {
    const cntStore = useCounterStore();

    return {
      counterStore: cntStore,
    };
  },
  data() {
    const payStats = this.getPaymentsStats();
    const cbVal = ((payStats.cb * 100) / payStats.all).toFixed(0);
    const cashVal = ((payStats.cash * 100) / payStats.all).toFixed(0);
    const chqVal = ((payStats.chq * 100) / payStats.all).toFixed(0);
    const chartData = {
      labels: [
        this.$i18n.t("cbLabel"),
        this.$i18n.t("cashLabel"),
        this.$i18n.t("chqLabel"),
      ],
      datasets: [
        {
          // backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
          // data: [40, 20, 80, 10]
          backgroundColor: ["#41B883", "#E46651", "#00D8FF"],
          data: [cbVal, cashVal, chqVal],
        },
      ],
    };

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
    };

    return {
      chartData,
      chartOptions,
      // chartId: props.chartId,
      // width: props.width,
      // height: props.height,
      // cssClasses: props.cssClasses,
      // styles: props.styles,
      // plugins: props.plugins,
      // datasetIdKey: props.datasetIdKey,
    };
  },
  methods: {
    getPaymentsStats() {
      let ret = { cb: 0, cash: 0, chq: 0, all: 0 };
      for (const k in this.counterStore.getInvoicesFY) {
        for (const l in this.counterStore.getInvoicesFY[k]["payments"]) {
          if (this.counterStore.getInvoicesFY[k]["payments"][l].etat) {
            switch (
              this.counterStore.getInvoicesFY[k]["payments"][l].paymentType
            ) {
              case 1:
                ret.cb += 1;
                ret.all += 1;
                break;
              case 2:
                ret.cash += 1;
                ret.all += 1;
                break;
              case 3:
                ret.chq += 1;
                ret.all += 1;
                break;
              default:
                break;
            }
          }
        }
      }
      return ret;
    },
  },
});
</script>

<i18n>
{
	"fr": {
		"cbLabel": "Carte bleue",
		"cashLabel": "Espèces",
		"chqLabel": "Chèques",
		"heading": "Répatition du type de paiement reçu"
	},
	"en": {
		"cbLabel": "Credit card",
		"cashLabel": "Cash",
		"chqLabel": "Check",
		"heading": "Received payment type dispatch"
	}
}
</i18n>

<template>
  <div
    class="ms-lg-5 ms-xl-5 me-lg-5 me-xl-5 mt-lg-5 mt-xl-5 mb-lg-15 mb-xl-15"
  >
    <h2>{{ $t("heading") }}</h2>
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
  </div>
</template>
