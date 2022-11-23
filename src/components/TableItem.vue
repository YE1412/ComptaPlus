<script lang="ts">
import { defineComponent } from "vue";
import { MDBRow, MDBInput } from "mdb-vue-ui-kit";
// import "../globals";
import { useServiceStore } from "@/stores/service";
import { useActorStore } from "@/stores/actor";
import { useOrderStore } from "@/stores/order";
import { usePaymentStore } from "@/stores/payment";
import { useInvoiceStore } from "@/stores/invoice";

export default defineComponent({
  name: "TableItem",
  inject: ["src"],
  props: {
    isForm: {
      type: Boolean,
      default: () => false,
    },
    tableHead: {
      default: () => [],
    },
    emptyTableText: {
      type: String,
      default: () => "Empty !",
    },
    addActionName: {
      type: String,
      required: true,
    },
    ident: {
      type: String,
      required: true,
    },
    updateActionName: {
      type: String,
      required: true,
    },
    deleteActionName: {
      type: String,
      required: true,
    },
    updating: {
      type: Boolean,
      required: true,
      default: () => false,
    },
    adding: {
      type: Boolean,
      required: true,
      default: () => true,
    },
    addObj: {
      required: true,
    },
    updateObj: {
      required: false,
    },
    updateObjId: {
      type: Number,
      required: false,
      default: () => 0,
    },
    admin: {
      type: Boolean,
      required: true,
      default: () => true,
    },
    display: {
      type: Boolean,
      required: true,
      default: () => true,
    },
    colSpan: {
      type: String,
      required: true,
      default: () => "1",
    },
  },
  async setup() {
    const servStore = useServiceStore();
    const actStore = useActorStore();
    const ordStore = useOrderStore();
    const payStore = usePaymentStore();
    const invStore = useInvoiceStore();
    return {
      serviceStore: servStore,
      actorStore: actStore,
      orderStore: ordStore,
      paymentStore: payStore,
      invoiceStore: invStore,
    };
  },
  data() {
    return {
      objContents: [],
      idents: [],
      contents: [],
      contentVal: "",
    };
  },
  computed: {
    objectsLength() {
      // console.log(this.objContents);
      return this.objContents.length;
    },
    contentsForDisp() {
      let ret = [];
      for (const key in this.contents) {
        ret[key] = {};
        for (const key2 in this.contents[key]) {
          if (key2 === "personne_type") {
            ret[key][key2] = this.tableActorsTypeLibelle[key];
          } else if (key2 === "facture") {
            ret[key][key2] = this.tableOrdersInvoiceLibelle(key);
          } else if (key2 === "Services") {
            ret[key][key2] = this.tableOrdersServicesLibelle(key);
          } else if (key2 === "payment_type") {
            ret[key][key2] = this.tablePaymentsTypeLibelle(key);
          } else if (key2 === "etat") {
            ret[key][key2] = this.tablePaymentsStateLibelle(key);
          } else if (key2 === "buyer") {
            ret[key][key2] = this.tableInvoicesBuyerLibelle(key);
          } else if (key2 === "seller") {
            ret[key][key2] = this.tableInvoicesSellerLibelle(key);
          } else if (key2 === "commandes") {
            ret[key][key2] = this.tableInvoicesOrdersLibelle(key);
          } else if (key2 === "devise") {
            ret[key][key2] = this.tableInvoicesDeviseLibelle(key);
          } else if (key2 === "langue") {
            ret[key][key2] = this.tableInvoicesLangueLibelle(key);
          } else if (key2 === "payments") {
            ret[key][key2] = this.tableInvoicesPaymentsLibelle(key);
          } else if (key2 === "tvaValue") {
            ret[key][key2] = this.tableInvoicesVATLibelle(key);
          } else if (key2 === "date") {
            ret[key][key2] = this.tableInvoicesDateLibelle(key);
          } else {
            ret[key][key2] = this.contents[key][key2];
          }
        }
      }
      return ret;
    },
    tableHeadForDisplay() {
      if (this.display) {
        const heads = this.tableHead;
        heads.pop();
        return heads;
      }
      return this.tableHead;
    },
    tableActorsTypeLibelle() {
      let ret = [];
      if (this.src === "actors") {
        for (const k in this.contents) {
          for (const l in this.contents[k]) {
            if (l === "personne_type") {
              let libelle =
                this.contents[k][l].seller && this.contents[k][l].buyer
                  ? this.$i18n.t("actorTypeBothLibelle")
                  : "";
              libelle =
                this.contents[k][l].seller && !this.contents[k][l].buyer
                  ? this.$i18n.t("actorTypeSellerLibelle")
                  : libelle;
              libelle =
                !this.contents[k][l].seller && this.contents[k][l].buyer
                  ? this.$i18n.t("actorTypeBuyerLibelle")
                  : libelle;
              ret[k] = libelle;
            }
          }
        }
      }
      return ret;
    },
    // tablePaymentsInvoiceLibelle() {
    //   let ret = "";
    //   if (this.src === "payments") {
    //     for (const k in this.contents) {
    //       for (const l in this.contents[k]) {
    //         if (l === "facture") {
    //           let libelle = `${this.contents[k][l].factureId} - ${this.contents[k][l].invoiceTTPrice}`;
    //           ret = libelle;
    //         }
    //       }
    //     }
    //   }
    //   return ret;
    // },
  },
  mounted() {
    this.hydrateAll();
  },
  components: {
    // MessagesItem,
    MDBRow,
    MDBInput,
  },
  methods: {
    tableOrdersInvoiceLibelle(ind: number) {
      let ret = "";
      let libelle = this.$i18n.t("emptyOrdersInvoiceLibelle");
      if (this.contents[ind]["facture"] !== null)
        libelle = `${this.contents[ind]["facture"].factureId} - ${this.contents[ind]["facture"].invoiceTTPrice}`;
      ret = libelle;
      return ret;
    },
    tableOrdersServicesLibelle(ind: number) {
      let ret = "";
      for (const m in this.contents[ind]["Services"]) {
        let libelle = `${this.contents[ind]["Services"][m].serviceId} - ${this.contents[ind]["Services"][m].nom}`;
        ret +=
          m != this.contents[ind]["Services"].length - 1
            ? `${libelle}, `
            : libelle;
      }
      return ret;
    },
    tablePaymentsTypeLibelle(ind: number) {
      let ret = "";
      let libelle = this.contents[ind]["payment_type"].cb
        ? this.$i18n.t("paymentTypeCBLibelle")
        : "";
      libelle = this.contents[ind]["payment_type"].esp
        ? this.$i18n.t("paymentTypeESPLibelle")
        : libelle;
      libelle = this.contents[ind]["payment_type"].chq
        ? this.$i18n.t("paymentTypeCHQLibelle")
        : libelle;
      ret = libelle;
      return ret;
    },
    tablePaymentsStateLibelle(ind: number) {
      let ret = "";
      let libelle =
        this.contents[ind]["etat"] === 1
          ? this.$i18n.t("paymentStateOkLibelle")
          : "";
      libelle =
        this.contents[ind]["etat"] === 0
          ? this.$i18n.t("paymentStateKoLibelle")
          : libelle;
      ret = libelle;
      return ret;
    },
    tableInvoicesBuyerLibelle(ind: number) {
      let ret = "";
      let libelle = `${this.contents[ind]["buyer"].actorId} - ${this.contents[ind]["buyer"].prenom} ${this.contents[ind]["buyer"].nom}`;
      ret = libelle;
      return ret;
    },
    tableInvoicesSellerLibelle(ind: number) {
      let ret = "";
      let libelle = `${this.contents[ind]["seller"].actorId} - ${this.contents[ind]["seller"].prenom} ${this.contents[ind]["seller"].nom}`;
      ret = libelle;
      return ret;
    },
    tableInvoicesOrdersLibelle(ind: number) {
      let ret = "";
      for (const m in this.contents[ind]["commandes"]) {
        let libelle = "";
        libelle = `${this.contents[ind]["commandes"][m].orderId} - ${this.contents[ind]["commandes"][m].priceHt}`;
        ret +=
          m != this.contents[ind]["commandes"].length - 1
            ? `${libelle}, `
            : libelle;
      }
      return ret;
    },
    tableInvoicesDeviseLibelle(ind: number) {
      let ret = "";
      let libelle = `${this.contents[ind]["devise"].symbole}`;
      ret = libelle;
      return ret;
    },
    tableInvoicesLangueLibelle(ind: number) {
      let ret = "";
      let libelle = `${this.contents[ind]["langue"].libelle}`;
      ret = libelle;
      return ret;
    },
    tableInvoicesPaymentsLibelle(ind: number) {
      let ret = "";
      for (const m in this.contents[ind]["payments"]) {
        let libelle = "";
        let state = "";
        state =
          this.contents[ind]["payments"][m].etat === 0
            ? this.$i18n.t("paymentStateKoLibelle")
            : "";
        state =
          this.contents[ind]["payments"][m].etat === 1
            ? this.$i18n.t("paymentStateOkLibelle")
            : "";
        libelle = `${this.contents[ind]["payments"][m].paymentId} - ${state} - ${this.contents[ind]["payments"][m].paymentValue}`;
        ret +=
          m != this.contents[ind]["payments"].length - 1
            ? `${libelle}, `
            : libelle;
      }
      return ret;
    },
    tableInvoicesVATLibelle(ind: number) {
      let ret = "";
      let libelle = "";
      libelle = `${this.contents[ind]["tvaValue"] * 100} %`;
      ret = libelle;
      return ret;
    },
    tableInvoicesDateLibelle(ind: number) {
      let ret = "";
      let libelle = "";
      libelle = `${this.contents[ind]["date"]}`;
      ret = libelle;
      return ret;
    },
    async hydrateObjContent() {
      let contentTab = [];
      if (this.src === "services") {
        return (contentTab = await this.serviceStore
          .getAllServices()
          .then(
            (res) => {
              return res;
            },
            (rej) => {
              return [];
            }
          )
          .catch((err) => {
            return [];
          }));
      } else if (this.src === "actors") {
        return (contentTab = await this.actorStore
          .getAllActors()
          .then(
            (res) => {
              return res;
            },
            (rej) => {
              return [];
            }
          )
          .catch((err) => {
            // MODALS (set actorModal to TRUE to active)
            // this.modalTitle = this.$i18n.t("modalTitleKo");
            // this.modalContent = this.$i18n.t("modalAddContentKo", {
            //   err: err.response.data.message || err.message,
            // });
            // this.actorModal = false;
            // // MESSAGES
            // this.store.messages.push({
            //   severity: true,
            //   content: this.$i18n.t("modalAddContentKo", {
            //     err: err.response.data.message || err.message,
            //   }),
            // });
            // this.messageVisibility = true;
            // this.store.messagesVisibility = true;
            return [];
          }));
      } else if (this.src === "orders") {
        return (contentTab = await this.orderStore
          .getAllOrders()
          .then(
            (res) => {
              return res;
            },
            (rej) => {
              return [];
            }
          )
          .catch((err) => {
            return [];
          }));
      } else if (this.src === "payments") {
        return (contentTab = await this.paymentStore
          .getAllPayments()
          .then(
            (res) => {
              return res;
            },
            (rej) => {
              return [];
            }
          )
          .catch((err) => {
            return [];
          }));
      } else if (this.src === "invoices") {
        return (contentTab = await this.invoiceStore
          .getAllInvoices()
          .then(
            (res) => {
              return res;
            },
            (rej) => {
              return [];
            }
          )
          .catch((err) => {
            return [];
          }));
      } else {
        return contentTab;
      }
      // this.objContents = contentTab;
    },
    async hydrateAll() {
      this.objContents = await this.hydrateObjContent();
      this.idents = this.shiftedIdents();
      this.contents = this.shiftedContent();
    },
    shiftedIdents() {
      var that = this;
      return this.objContents.map((val) => {
        let ret = {};
        for (const key in val) {
          if (key === this.ident) ret[key] = val[key];
        }
        return ret;
      }, that);
    },
    shiftedContent() {
      var that = this;
      // console.log(this.objContents);
      return this.objContents.map((val) => {
        // this.transformObject(val);
        // console.log(val);
        let ret = {};
        for (const key in val) {
          if (key !== this.ident) {
            // console.log(val[key]);
            ret[key] = val[key];
          }
        }
        return ret;
      }, that);
    },
    actionAddButtonClick(e: Event, forDB: boolean) {
      e.preventDefault();
      this.$emit(this.addActionName, forDB);
    },
    actionUpdateButtonClick(
      e: Event,
      forDB: boolean,
      id?: number = null,
      obj?: any = null
    ) {
      e.preventDefault();
      // console.log('update Click !');
      this.$emit(this.updateActionName, forDB, id, obj);
    },
    actionDeleteButtonClick(e: Event, id: number) {
      e.preventDefault();
      this.$emit(this.deleteActionName, id);
    },
    // inputChanges(e: Event) {
    //   console.log(e.target.value);
    //   this.$emit("inputChanges", e);
    // },
  },
});
</script>

<i18n>
{
  "fr": {
    "actorTypeBothLibelle": "Acheteur, Vendeur",
    "actorTypeSellerLibelle": "Vendeur",
    "actorTypeBuyerLibelle": "Acheteur",
    "paymentTypeCBLibelle": "Carte bancaire",
    "paymentTypeESPLibelle": "Espèces",
    "paymentTypeCHQLibelle": "Chèque",
    "paymentStateOkLibelle": "Payé",
    "paymentStateKoLibelle": "Impayé",
    "emptyOrdersInvoiceLibelle": "Aucune"
  },
  "en": {
    "actorTypeBothLibelle": "Buyer, Seller",
    "actorTypeSellerLibelle": "Seller",
    "actorTypeBuyerLibelle": "Buyer",
    "paymentTypeCBLibelle": "Credit card",
    "paymentTypeESPLibelle": "Cash",
    "paymentTypeCHQLibelle": "Check",
    "paymentStateOkLibelle": "Paid",
    "paymentStateKoLibelle": "Not paid",
    "emptyOrdersInvoiceLibelle": "None"    
  }
}
</i18n>

<template>
  <div class="table-responsive">
    <table class="table">
      <thead class="mdb-color darken-3">
        <tr class="text-black text-center" v-if="admin">
          <th>#</th>
          <th v-for="(head, ind) in tableHead" v-bind:key="ind">
            {{ head }}
          </th>
        </tr>
        <tr class="text-black text-center" v-if="display">
          <th>#</th>
          <th v-for="(head, ind) in tableHeadForDisplay" v-bind:key="ind">
            {{ head }}
          </th>
        </tr>
      </thead>

      <tbody v-if="!objectsLength && !isForm">
        <tr>
          <td class="text-center" :colspan="colSpan">{{ emptyTableText }}</td>
          <td class="text-center" v-if="admin">
            <a href="#" @click="actionAddButtonClick($event, false)">
              <slot name="actionAddButton"></slot>
            </a>
          </td>
        </tr>
      </tbody>
      <tbody v-if="objectsLength && !isForm">
        <tr
          v-for="(obj, index) in contentsForDisp"
          v-bind:key="index"
          class="text-center"
        >
          <th scope="row" style="vertical-align: middle">
            {{ idents[index][ident] }}
          </th>
          <td
            v-for="(val, key) in obj"
            v-bind:key="key"
            style="vertical-align: middle"
          >
            {{ val }}
          </td>
          <td style="vertical-align: middle" v-if="admin">
            <div class="" role="group">
              <a href="#" @click="actionAddButtonClick($event, false)">
                <slot name="actionAddButton"></slot>
              </a>
              <a
                href="#"
                @click="
                  actionUpdateButtonClick(
                    $event,
                    false,
                    idents[index][ident],
                    obj
                  )
                "
              >
                <slot name="actionUpdateButton"></slot>
              </a>
              <a
                href="#"
                @click="actionDeleteButtonClick($event, idents[index][ident])"
              >
                <slot name="actionDeleteButton"></slot>
              </a>
            </div>
          </td>
        </tr>
      </tbody>
      <!-- new form with one line for updating -->
      <tbody v-if="isForm && updating">
        <tr class="text-center">
          <th scope="row" style="vertical-align: middle">
            <MDBInput :label="updateObjId.toString()" readonly />
          </th>
          <td
            v-for="(val, key) in updateObj"
            v-bind:key="key"
            style="vertical-align: middle"
          >
            <slot
              :name="val.name"
              :size="val.size"
              :inputGroup="false"
              :ariaLabel="key"
              :label="val.value.toString()"
              :model="val.value"
              :invalidFeedback="val.invalidFeed"
              :validFeedback="val.validFeed"
              :isValid="val.isValid"
              :isValidated="true"
              :required="val.required"
              :placeholder="val.placeholder"
              :type="val.type"
              :disabled="val.disabled"
              :counter="val.counter"
              :maxlength="val.maxLength"
            ></slot>
          </td>
          <td class="text-center" style="vertical-align: middle">
            <a href="#" @click="actionUpdateButtonClick($event, true)">
              <slot name="actionUpdateButton"></slot>
            </a>
          </td>
        </tr>
      </tbody>
      <!-- New form with one line for adding -->
      <tbody v-if="isForm && adding">
        <tr class="text-center">
          <th class="text-center" scope="row" style="vertical-align: middle">
            <MDBRow class="d-flex justify-content-center">#</MDBRow>
          </th>
          <td
            class="text-center"
            v-for="(obj, key) in addObj"
            v-bind:key="key"
            style="vertical-align: middle"
          >
            <slot
              :name="obj.name"
              :size="obj.size"
              :inputGroup="false"
              :ariaLabel="key"
              :label="obj.label"
              :model="obj.value"
              :invalidFeedback="obj.invalidFeed"
              :validFeedback="obj.validFeed"
              :isValid="obj.isValid"
              :isValidated="true"
              :required="obj.required"
              :placeholder="obj.placeholder"
              :type="obj.type"
              :disabled="obj.disabled"
              :counter="obj.counter"
              :maxlength="obj.maxLength"
            ></slot>
          </td>
          <td
            class="text-center align-items-center"
            style="vertical-align: middle"
          >
            <a href="#" @click="actionAddButtonClick($event, true)">
              <slot name="actionAddButton"></slot>
            </a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
