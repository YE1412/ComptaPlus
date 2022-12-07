<script lang="ts">
import { defineComponent } from "vue";
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);
import { useCounterStore } from "@/stores/counter";

export default defineComponent({
  name: "BarChart",
  props: {
    chartId: {
      type: String,
      default: "bar-chart",
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
  setup(props) {
    const cntStore = useCounterStore();

    return {
      counterStore: cntStore,
    };
  },
  components: {
    Bar,
  },
  data() {
    const now = new Date();
    let yearLabel = 0;
    if (now.getMonth() < 5) {
      yearLabel = now.getFullYear() - 1;
    } else {
      yearLabel = now.getFullYear();
    }
    const chartData = {
      labels: [
        this.$i18n.t("juneLabel", { year: yearLabel }),
        this.$i18n.t("julyLabel", { year: yearLabel }),
        this.$i18n.t("augustLabel", { year: yearLabel }),
        this.$i18n.t("septemberLabel", { year: yearLabel }),
        this.$i18n.t("octoberLabel", { year: yearLabel }),
        this.$i18n.t("novemberLabel", { year: yearLabel }),
        this.$i18n.t("decemberLabel", { year: yearLabel }),
        this.$i18n.t("januaryLabel", { year: yearLabel + 1 }),
        this.$i18n.t("februaryLabel", { year: yearLabel + 1 }),
        this.$i18n.t("marchLabel", { year: yearLabel + 1 }),
        this.$i18n.t("aprilLabel", { year: yearLabel + 1 }),
        this.$i18n.t("mayLabel", { year: yearLabel + 1 }),
      ],
      datasets: [
        {
          label: this.$i18n.t("datasetLabel"),
          backgroundColor: "#f87979",
          data: [
            this.getNbInvoices(
              new Date(`${yearLabel}-06-01`),
              new Date(`${yearLabel}-06-30`)
            ),
            this.getNbInvoices(
              new Date(`${yearLabel}-07-01`),
              new Date(`${yearLabel}-06-31`)
            ),
            this.getNbInvoices(
              new Date(`${yearLabel}-08-01`),
              new Date(`${yearLabel}-06-31`)
            ),
            this.getNbInvoices(
              new Date(`${yearLabel}-09-01`),
              new Date(`${yearLabel}-06-30`)
            ),
            this.getNbInvoices(
              new Date(`${yearLabel}-10-01`),
              new Date(`${yearLabel}-06-31`)
            ),
            this.getNbInvoices(
              new Date(`${yearLabel}-11-01`),
              new Date(`${yearLabel}-06-30`)
            ),
            this.getNbInvoices(
              new Date(`${yearLabel}-12-01`),
              new Date(`${yearLabel}-12-31`)
            ),
            this.getNbInvoices(
              new Date(`${yearLabel + 1}-01-01`),
              new Date(`${yearLabel + 1}-01-31`)
            ),
            this.getNbInvoices(
              new Date(`${yearLabel + 1}-02-01`),
              new Date(`${yearLabel + 1}-06-30`)
            ),
            this.getNbInvoices(
              new Date(`${yearLabel + 1}-03-01`),
              new Date(`${yearLabel + 1}-03-31`)
            ),
            this.getNbInvoices(
              new Date(`${yearLabel + 1}-04-01`),
              new Date(`${yearLabel + 1}-04-30`)
            ),
            this.getNbInvoices(
              new Date(`${yearLabel + 1}-05-01`),
              new Date(`${yearLabel + 1}-05-31`)
            ),
          ],
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
      // chartId: this.chartId,
      // width: this.width,
      // height: this.height,
      // cssClasses: this.cssClasses,
      // styles: this.styles,
      // plugins: this.plugins,
      // datasetIdKey: this.datasetIdKey,
    };
  },
  methods: {
    getNbInvoices(dateStart: Date, dateEnd: Date) {
      let ret = 0;
      for (const k in this.counterStore.getInvoicesFY) {
        const d = new Date(this.counterStore.getInvoicesFY[k].date);
        if (d >= dateStart && d <= dateEnd) ret += 1;
      }
      return ret;
    },
  },
});
</script>

<i18n>
{
	"fr": {
		"januaryLabel": "Janvier {year}",
		"februaryLabel": "Février {year}",
		"marchLabel": "Mars {year}",
		"aprilLabel": "Avril {year}",
		"mayLabel": "Mai {year}",
		"juneLabel": "Juin {year}",
		"julyLabel": "Juillet {year}",
		"augustLabel": "Août {year}",
		"septemberLabel": "Septembre {year}",
		"octoberLabel": "Octobre {year}",
		"novemberLabel": "Novembre {year}",
		"decemberLabel": "Décembre {year}",
		"datasetLabel": "Nombre de facture(s)",
		"heading": "Répartition du nombre de factures"
	},
	"en": {
		"januaryLabel": "January {year}",
		"februaryLabel": "February {year}",
		"marchLabel": "March {year}",
		"aprilLabel": "April {year}",
		"mayLabel": "May {year}",
		"juneLabel": "June {year}",
		"julyLabel": "July {year}",
		"augustLabel": "August {year}",
		"septemberLabel": "September {year}",
		"octoberLabel": "October {year}",
		"novemberLabel": "November {year}",
		"decemberLabel": "December {year}",
		"datasetLabel": "Invoice(s) number",
		"heading": "Number of invoices dispatch"
	}
}
</i18n>

<template>
  <div
    class="ms-lg-5 ms-xl-5 me-lg-5 me-xl-5 mt-lg-5 mt-xl-5 mb-lg-15 mb-xl-15"
  >
    <h2>{{ $t("heading") }}</h2>
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
  </div>
</template>
