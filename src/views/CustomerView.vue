<template>
  <main>
    <div v-if="list && authorized" class="mt-2 mb-4">
      <div class="inline-block space-x-6">
        <span v-if="loaded">{{ nbTotalCustomers }} Customers</span>
        <refresh-button :text="refreshText" @click="refresh(pageNumber)"/>
        <create-button text="New customer" @click="openCreate"/>
        <add-button v-if="!filter" text="Add Filter" @click="addFilter"/>
        <remove-button v-if="filter" text="Remove Filter" @click="removeFilter"/>
      </div>
      <div v-if="filter" class="">
        <customer-filter @reset-filter="resetFilter" @filter-created="filterCustomers" :customer-meta="customersMeta"/>
      </div>
    </div>
    <div v-if="loaded && list && !authorized" class="mt-2 mb-4">
      NOT AUTHORIZED
    </div>
    <div v-if="loaded && authorized" class="grid grid-cols-4 gap-4">
      <div class="ml-4 col-span-2">Showing <span v-if="nbTotalCustomers > 0">{{ beginCursor }} to {{ endCursor }} of </span>{{ nbTotalCustomers }} results</div>
      <div>
        <label for="size"># max results </label>
        <select id="size" class="dark:text-black" v-model="size" @change="refresh(pageNumber)">
          <option selected value="20">20</option>
          <option selected value="50">50</option>
          <option selected value="100">100</option>
        </select>
      </div>
      <div class="text-right mr-4">
        <i class="cursor-pointer fa-solid fa-backward-step" @click="first">&nbsp;</i>&nbsp;
        <i class="cursor-pointer fa-solid fa-angle-left" @click="previous">&nbsp;</i>Page 
        <input class="dark:text-black w-16" type="number" v-model="pageNumber" @change="refresh(pageNumber)"/>
         / {{ pageTotal }}&nbsp;
        <i class="cursor-pointer fa-solid fa-angle-right" @click="next">&nbsp;</i>&nbsp;
        <i class="cursor-pointer fa-solid fa-forward-step" @click="last">&nbsp;</i>
      </div>
    </div>
    <customer-list v-if="list && loaded && authorized" @edit="getCustomer" @delete="deletion" :customers="customersFiltered?.data" :customer-meta="customersMeta"/>
    <customer-edit v-if="edit && customer" @cancelEdit="cancelEdit" :customer="customer" :customer-meta="customersMeta"/>
    <customer-create v-if="create" @cancelCreate="cancelCreate" @created="created" :customer-meta="customersMeta"/>
  </main>

</template>

<script setup lang="ts">
import { ref, onBeforeMount, computed } from 'vue';
import CustomerService from '@/services/CustomerService';
import { useUserStore } from "@/store/user";

import CustomerList from '@/components/Customer/CustomerList.vue';
import CustomerEdit from '@/components/Customer/CustomerEdit.vue';
import CustomerCreate from '@/components/Customer/CustomerCreate.vue';
import RefreshButton from '@/components/Button/RefreshButton.vue';
import CreateButton from '@/components/Button/CreateButton.vue';
import CustomerFilter from '@/components/Customer/CustomerFilter.vue';
import AddButton from '@/components/Button/AddButton.vue';
import RemoveButton from '@/components/Button/RemoveButton.vue';

const FIRSTPAGE = 1;
const NBMAX = 20;
const loaded = ref(false);
const authorized = ref(false);
const filter = ref(false);
let numberOrString:any;
//let filters = {meta: '', operator: '', val: numberOrString};
let metaFilter = ref('');
let operatorFilter = ref('');
let valFilter = ref('');
const refreshText = ref('Refresh');
const edit = ref(false);
const create = ref(false);
const list = ref(true);
const search = ref('');
const customer = ref<CustomerInterface>();
const customersFiltered = ref<CustomerArrayInterface>();
const customersMeta = ref<CustomerInterface>();
const nbTotalCustomers = ref(0);
const pageNumber = ref(FIRSTPAGE);
const size = ref(NBMAX);
const metaType = ref('String');

const isCheckAll = ref(false);
const checkedItems = ref([]);

const userStore = useUserStore();
const user = userStore.user;
const token = user ? user.accessToken + ' ' + user.refreshToken : '';

console.log('CustomerView.vue, user : ', userStore.user);

// Data recovered before displaying results in Template
onBeforeMount( async () => {
  refreshText.value = 'Loading...';
  loaded.value = false;
  if (token != '') {
    customersMeta.value = await CustomerService.getCustomersMeta();
    customersFiltered.value = await CustomerService.getCustomers(FIRSTPAGE, size.value, metaFilter.value, operatorFilter.value, valFilter.value, token);
    console.log('CustomerView > onBeforeMount > customersFiltered : ',customersFiltered.value);
    nbTotalCustomers.value = customersFiltered.value!.nb;
    if (user) {authorized.value = true}
  }
  search.value = 'X'; // only to force calculation of filteredCustomers
  search.value = ''; // only to force calculation of filteredCustomers (value changed here from 'X' to '')
  loaded.value = true;
  refreshText.value = 'Refresh';
})

interface CustomerInterface {
    [key: string]: any
};

// Interfaces
interface CustomerArrayInterface {
    "data": Array<CustomerInterface>,
    "nb": number
}

// Functions
const getCustomer = (customerInterface: CustomerInterface|undefined) => {
  //console.log('CustomerView -- getCustomer, cust : ', cust);
  customer.value = customerInterface;
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
  refresh(FIRSTPAGE);
  create.value = false;
  list.value = true;
};

const deletion = async (id:string) => {
  await CustomerService.deleteCustomer(id);
  refresh(FIRSTPAGE);
};

// Interfaces

const filterCustomers = async (meta:string, operator:string, val:string) => {
  refreshText.value = 'Loading...';
  loaded.value = false;
  pageNumber.value = FIRSTPAGE;
  metaFilter.value = meta;
  operatorFilter.value = operator;
  valFilter.value = val;

  const metaList = await CustomerService.getCustomersMeta();
  metaType.value = metaList[meta].type;
  console.log('CustomerView.vue / filterCustomers() / metaType : ', metaType.value);

  //console.log('CustomerView.vue / function filterCustomers - filters : ', filters);
  console.log('CustomerView.vue / function filterCustomers - token : ', token);
  if (token != '') {
  //customersFiltered.value = await CustomerService.searchCustomers(FIRSTPAGE, size.value, filters);
    customersFiltered.value = await CustomerService.getCustomers(FIRSTPAGE, size.value, metaFilter.value, operatorFilter.value, valFilter.value, token);
    console.log('CustomerView.vue > filterCustomers() > #customersFiltered : ', customersFiltered.value!.nb);
    nbTotalCustomers.value = customersFiltered.value!.nb;
  }
  search.value = 'X'; // only to force calculation of filteredCustomers
  search.value = ''; // only to force calculation of filteredCustomers (value changed here from 'X' to '')
  loaded.value = true;
  refreshText.value = 'Refresh';

}

const resetFilter = () => {
  metaFilter.value = '';
  operatorFilter.value = '';
  valFilter.value = '';
  //filterCustomer.value = '';
  refresh(FIRSTPAGE);
};

const refresh = async (page: number) => {
  refreshText.value = 'Loading...'
  loaded.value = false;
  customersMeta.value = await CustomerService.getCustomersMeta();
  customersFiltered.value = await CustomerService.getCustomers(FIRSTPAGE, size.value, metaFilter.value, operatorFilter.value, valFilter.value, token);
  nbTotalCustomers.value = customersFiltered.value!.nb;
  search.value = 'X'; // only to reload filteredCustomers
  search.value = ''; // only to reload filteredCustomers (value changed here from 'X' to '')
  loaded.value = true;
  refreshText.value = 'Refresh';
};

const next = () => {
  if (pageNumber.value < pageTotal.value) {
    pageNumber.value ++;
    refresh(pageNumber.value);
  }
}

const last = () => {
  if (pageNumber.value < pageTotal.value) {
    pageNumber.value = pageTotal.value;
    refresh(pageNumber.value);
  }
}

const previous = () => {
  if (pageNumber.value > 1) {
    pageNumber.value --;
    refresh(pageNumber.value);
  }
}

const first = () => {
  if (pageNumber.value > 1) {
    pageNumber.value = 1;
    refresh(FIRSTPAGE);
  }
}

const openCreate = () => {
  create.value = true;
  list.value = false;
};

const addFilter = () => {
  filter.value = true;
};

const removeFilter = () => {
  filter.value = false;
  metaFilter.value = '';
  operatorFilter.value = '';
  valFilter.value = '';
  refresh(FIRSTPAGE);
};

// Computed variables
const pageTotal = computed(() => ~~(nbTotalCustomers.value / size.value) + 1);
const beginCursor = computed(() => size.value * (pageNumber.value - 1) + 1);
const endCursor = computed(() => (size.value * pageNumber.value < nbTotalCustomers.value)? size.value * pageNumber.value : nbTotalCustomers.value);
</script>
