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
            ret[key][key2] = this.tableOrdersInvoiceLibelle;
          } else if (key2 === "Services") {
            ret[key][key2] = this.tableOrdersServicesLibelle;
          } else if (key2 === "payment_type") {
            ret[key][key2] = this.tablePaymentsTypeLibelle;
          } else if (key2 === "etat") {
            ret[key][key2] = this.tablePaymentsStateLibelle;
          } else if (key2 === "buyer") {
            ret[key][key2] = this.tableInvoicesBuyerLibelle;
          } else if (key2 === "seller") {
            ret[key][key2] = this.tableInvoicesSellerLibelle;
          } else if (key2 === "commandes") {
            ret[key][key2] = this.tableInvoicesOrdersLibelle;
          } else if (key2 === "devise") {
            ret[key][key2] = this.tableInvoicesDeviseLibelle;
          } else if (key2 === "langue") {
            ret[key][key2] = this.tableInvoicesLangueLibelle;
          } else if (key2 === "payments") {
            ret[key][key2] = this.tableInvoicesPaymentsLibelle;
          } else if (key2 === "tvaValue") {
            ret[key][key2] = this.tableInvoicesVATLibelle;
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
    tableOrdersServicesLibelle() {
      let ret = "";
      if (this.src === "orders") {
        for (const k in this.contents) {
          for (const l in this.contents[k]) {
            if (l === "Services") {
              for (const m in this.contents[k][l]) {
                let libelle = `${this.contents[k][l][m].serviceId} - ${this.contents[k][l][m].nom}`;
                ret +=
                  m != this.contents[k][l].length - 1
                    ? `${libelle}, `
                    : libelle;
              }
            }
          }
        }
      }
      return ret;
    },
    tableOrdersInvoiceLibelle() {
      let ret = "";
      if (this.src === "orders" || this.src === "payments") {
        for (const k in this.contents) {
          for (const l in this.contents[k]) {
            if (l === "facture") {
              let libelle = this.$i18n.t("emptyOrdersInvoiceLibelle");
              if (this.contents[k][l] !== null)
                libelle = `${this.contents[k][l].factureId} - ${this.contents[k][l].invoiceTTPrice}`;
              ret = libelle;
            }
          }
        }
      }
      return ret;
    },
    tablePaymentsStateLibelle() {
      let ret = "";
      if (this.src === "payments") {
        for (const k in this.contents) {
          for (const l in this.contents[k]) {
            if (l === "etat") {
              let libelle =
                this.contents[k][l] === 1
                  ? this.$i18n.t("paymentStateOkLibelle")
                  : "";
              libelle =
                this.contents[k][l] === 0
                  ? this.$i18n.t("paymentStateKoLibelle")
                  : libelle;
              ret = libelle;
            }
          }
        }
      }
      return ret;
    },
    tablePaymentsTypeLibelle() {
      let ret = "";
      if (this.src === "payments") {
        for (const k in this.contents) {
          for (const l in this.contents[k]) {
            if (l === "payment_type") {
              let libelle = this.contents[k][l].cb
                ? this.$i18n.t("paymentTypeCBLibelle")
                : "";
              libelle = this.contents[k][l].esp
                ? this.$i18n.t("paymentTypeESPLibelle")
                : libelle;
              libelle = this.contents[k][l].chq
                ? this.$i18n.t("paymentTypeCHQLibelle")
                : libelle;
              ret = libelle;
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
    tableInvoicesBuyerLibelle() {
      let ret = "";
      if (this.src === "invoices") {
        for (const k in this.contents) {
          for (const l in this.contents[k]) {
            if (l === "buyer") {
              let libelle = `${this.contents[k][l].actorId} - ${this.contents[k][l].prenom} ${this.contents[k][l].nom}`;
              ret = libelle;
            }
          }
        }
      }
      return ret;
    },
    tableInvoicesSellerLibelle() {
      let ret = "";
      if (this.src === "invoices") {
        for (const k in this.contents) {
          for (const l in this.contents[k]) {
            if (l === "seller") {
              let libelle = `${this.contents[k][l].actorId} - ${this.contents[k][l].prenom} ${this.contents[k][l].nom}`;
              ret = libelle;
            }
          }
        }
      }
      return ret;
    },
    tableInvoicesOrdersLibelle() {
      let ret = "";
      if (this.src === "invoices") {
        for (const k in this.contents) {
          for (const l in this.contents[k]) {
            if (l === "commandes") {
              for (const m in this.contents[k][l]) {
                let libelle = "";
                libelle = `${this.contents[k][l][m].orderId} - ${this.contents[k][l][m].priceHt}`;
                ret +=
                  m != this.contents[k][l].length - 1
                    ? `${libelle}, `
                    : libelle;
              }
            }
          }
        }
      }
      return ret;
    },
    tableInvoicesDeviseLibelle() {
      let ret = "";
      if (this.src === "invoices") {
        for (const k in this.contents) {
          for (const l in this.contents[k]) {
            if (l === "devise") {
              let libelle = `${this.contents[k][l].symbole}`;
              ret = libelle;
            }
          }
        }
      }
      return ret;
    },
    tableInvoicesLangueLibelle() {
      let ret = "";
      if (this.src === "invoices") {
        for (const k in this.contents) {
          for (const l in this.contents[k]) {
            if (l === "langue") {
              let libelle = `${this.contents[k][l].libelle}`;
              ret = libelle;
            }
          }
        }
      }
      return ret;
    },
    tableInvoicesPaymentsLibelle() {
      let ret = "";
      if (this.src === "invoices") {
        for (const k in this.contents) {
          for (const l in this.contents[k]) {
            if (l === "payments") {
              for (const m in this.contents[k][l]) {
                let libelle = "";
                let state = "";
                state =
                  this.contents[k][l][m].etat === 0
                    ? this.$i18n.t("paymentStateKoLibelle")
                    : "";
                state =
                  this.contents[k][l][m].etat === 1
                    ? this.$i18n.t("paymentStateOkLibelle")
                    : "";
                libelle = `${this.contents[k][l][m].paymentId} - ${state} - ${this.contents[k][l][m].paymentValue}`;
                ret +=
                  m != this.contents[k][l].length - 1
                    ? `${libelle}, `
                    : libelle;
              }
            }
          }
        }
      }
      return ret;
    },
    tableInvoicesVATLibelle() {
      let ret = "";
      if (this.src === "invoices") {
        for (const k in this.contents) {
          for (const l in this.contents[k]) {
            if (l === "tvaValue") {
              let libelle = "";
              libelle = `${this.contents[k][l] * 100} %`;
              ret = libelle;
            }
          }
        }
      }
      return ret;
    },
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
