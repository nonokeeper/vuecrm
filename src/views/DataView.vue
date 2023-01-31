<template>
  <main>
    <div v-if="list && authorized" class="mt-2 mb-4">
      <div class="inline-block space-x-6">
        <refresh-button :text="refreshText" @click="refresh()" />
        <create-button text="New" @click="openCreate" />
        <add-button v-if="!filter" text="Add Filter" @click="addFilter" />
        <remove-button v-if="filter" text="Remove Filter" @click="removeFilter" />
      </div>
      <!--
        <div v-if="filter" class="">
          <data-filter @reset-filter="resetFilter" @filter-created="filterData" :data-meta="dataMeta"/>
        </div>
        -->
    </div>
    <div v-if="loaded && list && !authorized" class="mt-2 mb-4">NOT AUTHORIZED</div>
    <div v-if="loaded && authorized" class="grid grid-cols-4 gap-4">
      <div class="ml-4 col-span-2">
        Showing
        <span v-if="nbTotalData > 0">{{ beginCursor }} to {{ endCursor }} of </span
        >{{ nbTotalData }} results
      </div>
      <div>
        <label for="size"># max results </label>
        <select id="size" class="dark:text-black" v-model="size" @change="refresh()">
          <option selected value="20">20</option>
          <option selected value="50">50</option>
          <option selected value="100">100</option>
        </select>
      </div>
      <div class="text-right mr-4">
        <i class="cursor-pointer fa-solid fa-backward-step" @click="first">&nbsp;</i
        >&nbsp;
        <i class="cursor-pointer fa-solid fa-angle-left" @click="previous">&nbsp;</i>Page
        <input
          class="dark:text-black w-16"
          type="number"
          v-model="pageNumber"
          @change="refresh()"
        />
        / {{ pageTotal }}&nbsp;
        <i class="cursor-pointer fa-solid fa-angle-right" @click="next">&nbsp;</i>&nbsp;
        <i class="cursor-pointer fa-solid fa-forward-step" @click="last">&nbsp;</i>
      </div>
    </div>

    <data-list
      v-if="list && loaded && authorized"
      @edit="getData"
      @delete="deletion"
      :data="dataFiltered?.data"
      :data-meta="dataMeta"
    />
    <!--
        <data-edit v-if="edit && data" @cancelEdit="cancelEdit" :data="data" :data-meta="dataMeta"/>
    -->
      <data-create v-if="create" @cancelCreate="cancelCreate" @created="created" :data-meta="dataMeta" :entity="entity"/>
      
  </main>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, computed } from "vue";
import DataService from "@/services/DataService";
import { useUserStore } from "@/store/user";
import { useRouter } from "vue-router";

import DataList from "@/components/Data/DataList.vue";
import DataCreate from '@/components/Data/DataCreate.vue';

/* 
import DataEdit from '@/components/Data/DataEdit.vue';
import DataFilter from '@/components/Data/DataFilter.vue';
*/

  import RefreshButton from "@/components/Button/RefreshButton.vue";
import CreateButton from "@/components/Button/CreateButton.vue";
import AddButton from "@/components/Button/AddButton.vue";
import RemoveButton from "@/components/Button/RemoveButton.vue";

const FIRSTPAGE = 1;
const NBMAX = 20;
const loaded = ref(false);
const authorized = ref(true);
const filter = ref(false);

let metaFilter = ref("");
let operatorFilter = ref("");
let valFilter = ref("");
const refreshText = ref("Refresh");
const edit = ref(false);
const create = ref(false);
const list = ref(true);
const search = ref("");
const data = ref<DataInterface>();
const dataFiltered = ref<DataArrayInterface>();
const dataMeta = ref<DataInterface>();
const nbTotalData = ref(0);
const pageNumber = ref(FIRSTPAGE);
const size = ref(NBMAX);
const metaType = ref("String");
const entity = useRouter().currentRoute.value.query.entity?.toString();

console.log("DataView > Entity : ", entity);
const userStore = useUserStore();
const token = userStore.user
  ? userStore.user.accessToken + " " + userStore.user.refreshToken
  : "";

console.log("DataView.vue, user : ", userStore.user);

// Data recovered before displaying results in Template
onBeforeMount(async () => {
  refreshText.value = "Loading...";
  loaded.value = false;
  //if (token != '') {
  dataMeta.value = await DataService.getDataMeta(entity);
  dataFiltered.value = await DataService.getData(
    entity,
    FIRSTPAGE,
    size.value,
    metaFilter.value,
    operatorFilter.value,
    valFilter.value,
    token
  );
  console.log("DataView > onBeforeMount > dataFiltered : ", dataFiltered.value);
  console.log("DataView > onBeforeMount > dataMeta : ", dataMeta.value);
  nbTotalData.value = dataFiltered.value!.nb;
  if (nbTotalData.value >= 0) {
    authorized.value = true;
  }
  //}
  search.value = "X"; // only to force calculation of filteredData
  search.value = ""; // only to force calculation of filteredData (value changed here from 'X' to '')
  loaded.value = true;
  refreshText.value = "Refresh";
});

interface DataInterface {
  [key: string]: any;
}

// Interfaces
interface DataArrayInterface {
  data: Array<DataInterface>;
  nb: number;
}

// Functions
const getData = (dataInterface: DataInterface | undefined) => {
  //console.log('DataView -- getData, data : ', data);
  data.value = dataInterface;
  list.value = false;
  edit.value = true;
};

const cancelEdit = () => {
  edit.value = false;
  list.value = true;
};

const cancelCreate = () => {
  create.value = false;
  list.value = true;
};

const created = () => {
  refresh();
  create.value = false;
  list.value = true;
};

const deletion = async (id: string) => {
  await DataService.deleteData(id, entity);
  refresh();
};

// Interfaces

const filterData = async (meta: string, operator: string, val: string) => {
  refreshText.value = "Loading...";
  loaded.value = false;
  pageNumber.value = FIRSTPAGE;
  metaFilter.value = meta;
  operatorFilter.value = operator;
  valFilter.value = val;

  const metaList = await DataService.getDataMeta();
  metaType.value = metaList[meta].type;
  console.log("DataView.vue / filterData() / metaType : ", metaType.value);

  //console.log('DataView.vue / function filterData - filters : ', filters);
  console.log("DataView.vue / function filterData - token : ", token);
  if (token != "") {
    dataFiltered.value = await DataService.getData(
      FIRSTPAGE,
      size.value,
      metaFilter.value,
      operatorFilter.value,
      valFilter.value,
      token
    );
    console.log("DataView.vue > filterData() > #dataFiltered : ", dataFiltered.value!.nb);
    nbTotalData.value = dataFiltered.value!.nb;
  }
  search.value = "X"; // only to force calculation of filterData
  search.value = ""; // only to force calculation of filterData (value changed here from 'X' to '')
  loaded.value = true;
  refreshText.value = "Refresh";
};

const resetFilter = () => {
  metaFilter.value = "";
  operatorFilter.value = "";
  valFilter.value = "";
  refresh();
};

const refresh = async () => {
  refreshText.value = "Loading...";
  loaded.value = false;
  dataMeta.value = await DataService.getDataMeta(entity);
  dataFiltered.value = await DataService.getData(
    entity,
    FIRSTPAGE,
    size.value,
    metaFilter.value,
    operatorFilter.value,
    valFilter.value,
    token
  );
  nbTotalData.value = dataFiltered.value!.nb;
  search.value = "X"; // only to reload filteredData
  search.value = ""; // only to reload filteredData (value changed here from 'X' to '')
  loaded.value = true;
  refreshText.value = "Refresh";
};

const next = () => {
  if (pageNumber.value < pageTotal.value) {
    pageNumber.value++;
    refresh();
  }
};

const last = () => {
  if (pageNumber.value < pageTotal.value) {
    pageNumber.value = pageTotal.value;
    refresh();
  }
};

const previous = () => {
  if (pageNumber.value > 1) {
    pageNumber.value--;
    refresh();
  }
};

const first = () => {
  if (pageNumber.value > 1) {
    pageNumber.value = 1;
    refresh();
  }
};

const openCreate = () => {
  create.value = true;
  list.value = false;
};

const addFilter = () => {
  filter.value = true;
};

const removeFilter = () => {
  filter.value = false;
  metaFilter.value = "";
  operatorFilter.value = "";
  valFilter.value = "";
  refresh();
};

// Computed variables
const pageTotal = computed(() => ~~(nbTotalData.value / size.value) + 1);
const beginCursor = computed(() => size.value * (pageNumber.value - 1) + 1);
const endCursor = computed(() =>
  size.value * pageNumber.value < nbTotalData.value
    ? size.value * pageNumber.value
    : nbTotalData.value
);
</script>
