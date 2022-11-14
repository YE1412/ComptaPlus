<script lang="ts">
import { defineComponent } from "vue";
import { MDBRow, MDBInput } from "mdb-vue-ui-kit";
// import "../globals";
import { useServiceStore } from "@/stores/service";
import { useActorStore } from "@/stores/actor";

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
    // src: {
    //   type: String,
    //   required: false,
    //   default: () => ("services")
    // }
  },
  async setup() {
    const servStore = useServiceStore();
    const actStore = useActorStore();
    // let contentTab;
    // if (this.src === "services") {
    //   contentTab = await store
    //   .getAllServices()
    //   .then(
    //     (res) => {
    //       return res;
    //     },
    //     (rej) => {
    //       return [];
    //     }
    //   )
    //   .catch((err) => {
    //     return [];
    //   });
    // }
    return { serviceStore: servStore, actorStore: actStore };
  },
  data() {
    // console.log(this.src);
    // return {
    //   idents: this.shiftedIdents(),
    //   contents: this.shiftedContent(),
    // };
    // console.log(this.objContents);
    return {
      objContents: [],
      idents: [],
      contents: [],
    };
  },
  computed: {
    objectsLength() {
      // console.log(this.objContents);
      return this.objContents.length;
    },
    tableHeadForDisplay() {
      if (this.display) {
        const heads = this.tableHead;
        heads.pop();
        return heads;
      }
      return this.tableHead;
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
  },
});
</script>

<template>
  <div class="table-responsive">
    <table class="table">
      <thead class="mdb-color darken-3">
        <tr class="text-black text-center" v-if="admin">
          <th>#</th>
          <th
            v-for="(head, ind) in tableHead"
            v-bind:key="ind"
            class="col-md-10"
          >
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
          v-for="(obj, index) in contents"
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
