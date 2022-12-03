<script lang="ts">
import { defineComponent } from "vue";
import WelcomeItem from "./WelcomeItem.vue";
import DocumentationIcon from "./icons/IconDocumentation.vue";
import ToolingIcon from "./icons/IconTooling.vue";
import EcosystemIcon from "./icons/IconEcosystem.vue";
import CommunityIcon from "./icons/IconCommunity.vue";
import SupportIcon from "./icons/IconSupport.vue";
import { useMessageStore } from "@/stores/message";
import { useCounterStore } from "@/stores/counter";
import { useUserStore } from "@/stores/user";
import MessagesItem from "./MessagesItem.vue";
import BarChart from "./BarChart.vue";
import PieChart from "./PieChart.vue";
import HomeTable from "./HomeTable.vue";

export default defineComponent({
  name: "TheWelcome",
  async setup() {
    const msgStore = useMessageStore();
    const cntStore = useCounterStore();
    const usrStore = useUserStore();
    // await cntStore.getFinancialYearIncomes(usrStore.getUser.userId);
    // await cntStore.getFinancialYearPaymentsIncomes(usrStore.getUser.userId);
    await cntStore.getFinancialYearInvoices(usrStore.getUser.userId);
    return {
      counterStore: cntStore,
      messageStore: msgStore,
      userStore: usrStore,
    };
  },
  components: {
    WelcomeItem,
    DocumentationIcon,
    ToolingIcon,
    EcosystemIcon,
    CommunityIcon,
    SupportIcon,
    MessagesItem,
    BarChart,
    PieChart,
    HomeTable
  },
  data() {
    const devise = this.userStore.getUser.devise.symbole;
    const headTableObj = [
      this.$i18n.t("totalFiscalYearHTIncomes"),
      this.$i18n.t("totalFiscalYearTTIncomes"),
      this.$i18n.t("totalFiscalYearPaymentsIncomes"),
    ];
    let contentTableObj = [];
    if (this.userStore.getUser.devise.deviseId == 3)
    {
      contentTableObj.push(
          `${this.getHtFYI()} ${devise}`,
          `${this.getTtFYI()} ${devise}`,
          `${this.getPayFYI()} ${devise}`,
        );
    } else {
      contentTableObj.push(
          `${devise} ${this.getHtFYI()}`,
          `${devise} ${this.getTtFYI()}`,
          `${devise} ${this.getPayFYI()}`,
        );
    }
    return {
      head: headTableObj,
      content: contentTableObj
    };
  },
  methods: {
    getHtFYI() {
      let ret = 0.0;
      for(const k in this.counterStore.getInvoicesFY){
        ret += this.counterStore.getInvoicesFY[k].invoiceHTPrice;
      }
      return ret;
    },
    getTtFYI() {
      let ret = 0.0;
      for(const k in this.counterStore.getInvoicesFY){
        ret += this.counterStore.getInvoicesFY[k].invoiceTTPrice;
      }
      return ret;
    },
    getPayFYI() {
      let ret = 0.0;
      for(const k in this.counterStore.getInvoicesFY){
        for (const l in this.counterStore.getInvoicesFY[k]["payments"])
        { 
          if (this.counterStore.getInvoicesFY[k]["payments"][l].etat === 1){
            ret += this.counterStore.getInvoicesFY[k]["payments"][l].paymentValue;
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
    "totalFiscalYearHTIncomes": "Revenus Hors taxes sur l'année fiscale",
    "totalFiscalYearTTIncomes": "Revenus TTC sur l'année fiscale",
    "totalFiscalYearPaymentsIncomes": "Encaissements sur l'année fiscale",
  },
  "en": {
    "totalFiscalYearHTIncomes": "Total fiscal year incomes excl. taxes",
    "totalFiscalYearTTIncomes": "Total fiscal year incomes incl. taxes",
    "totalFiscalYearPaymentsIncomes": "Withdrawal in the fiscal year",
  }
}
</i18n>

<template>
  <div class="container">
    <MessagesItem v-if="messageStore.getMessagesVisibility"></MessagesItem>
    <HomeTable :headTableObj="head" :contentTableObj="content" />
    <BarChart />
    <PieChart />
  </div>
  
  <!-- <WelcomeItem>
    <template #icon>
      <DocumentationIcon />
    </template>
    <template #heading>Documentation</template>

    Vue’s
    <a href="https://vuejs.org/" target="_blank" rel="noopener"
      >official documentation</a
    >
    provides you with all information you need to get started.
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <ToolingIcon />
    </template>
    <template #heading>Tooling</template>

    This project is served and bundled with
    <a
      href="https://vitejs.dev/guide/features.html"
      target="_blank"
      rel="noopener"
      >Vite</a
    >. The recommended IDE setup is
    <a href="https://code.visualstudio.com/" target="_blank" rel="noopener"
      >VSCode</a
    >
    +
    <a
      href="https://github.com/johnsoncodehk/volar"
      target="_blank"
      rel="noopener"
      >Volar</a
    >. If you need to test your components and web pages, check out
    <a href="https://www.cypress.io/" target="_blank" rel="noopener">Cypress</a>
    and
    <a href="https://on.cypress.io/component" target="_blank"
      >Cypress Component Testing</a
    >.

    <br />

    More instructions are available in <code>README.md</code>.
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <EcosystemIcon />
    </template>
    <template #heading>Ecosystem</template>

    Get official tools and libraries for your project:
    <a href="https://pinia.vuejs.org/" target="_blank" rel="noopener">Pinia</a>,
    <a href="https://router.vuejs.org/" target="_blank" rel="noopener"
      >Vue Router</a
    >,
    <a href="https://test-utils.vuejs.org/" target="_blank" rel="noopener"
      >Vue Test Utils</a
    >, and
    <a href="https://github.com/vuejs/devtools" target="_blank" rel="noopener"
      >Vue Dev Tools</a
    >. If you need more resources, we suggest paying
    <a
      href="https://github.com/vuejs/awesome-vue"
      target="_blank"
      rel="noopener"
      >Awesome Vue</a
    >
    a visit.
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <CommunityIcon />
    </template>
    <template #heading>Community</template>

    Got stuck? Ask your question on
    <a href="https://chat.vuejs.org" target="_blank" rel="noopener">Vue Land</a
    >, our official Discord server, or
    <a
      href="https://stackoverflow.com/questions/tagged/vue.js"
      target="_blank"
      rel="noopener"
      >StackOverflow</a
    >. You should also subscribe to
    <a href="https://news.vuejs.org" target="_blank" rel="noopener"
      >our mailing list</a
    >
    and follow the official
    <a href="https://twitter.com/vuejs" target="_blank" rel="noopener"
      >@vuejs</a
    >
    twitter account for latest news in the Vue world.
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <SupportIcon />
    </template>
    <template #heading>Support Vue</template>

    As an independent project, Vue relies on community backing for its
    sustainability. You can help us by
    <a href="https://vuejs.org/sponsor/" target="_blank" rel="noopener"
      >becoming a sponsor</a
    >.
  </WelcomeItem> -->
</template>
