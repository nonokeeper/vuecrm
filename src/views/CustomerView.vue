<template>
  <main>
    <div v-if="list" class="mt-2 mb-4">
      <div class="relative m-4">
        <span class="absolute inset-y-0 left-3 flex items-center pl-2">
          <svg fill="none" stroke="#BBBBBB" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" class="w-6 h-6"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </span>
        <input v-model="search" placeholder="Global search" type="text" class="border border-gray-300 ml-4 px-8 py-1 rounded-xl focus:placeholder-transparent dark:focus:placeholder-transparent dark:placeholder-gray-400 placeholder-gray-400 bg-white dark:bg-cyan-800 text-gray-800 dark:text-gray-100"/>
        <span @click="search=''" class="absolute inset-y-0 left-60 flex items-center">
          <i class="text-gray-400 dark:text-gray-300 fa-regular fa-circle-xmark"></i>
        </span>
      </div>
      <div class="inline-block space-x-6">
        <span v-if="loaded">{{ nbTotalCustomers }} Customers</span>
        <span v-else>? Customers</span>
        <refresh-button :text="refreshText" @click="refresh(pageNumber)"/>
        <create-button text="New customer" @click="openCreate"/>
        <add-button v-if="!filter" text="Add Filter" @click="addFilter"/>
        <remove-button v-if="filter" text="Remove Filter" @click="removeFilter"/>
      </div>
      <div v-if="filter" class="">
        <customer-filter @reset-filter="resetFilter" @filter-created="filterCustomers" :customer-meta="customersMeta"/>
      </div>
    </div>
    <div v-if="loaded" class="grid grid-cols-4 gap-4">
      <div class="ml-4 col-span-2">Showing {{ beginCursor }} to {{ endCursor }} of {{ nbTotalCustomers }} results</div>
      <div><label for="size"># max results </label>
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
    <customer-list v-if="list && loaded" @edit="getCustomer" @delete="deletion" :customers="customersFiltered!.data" :customer-meta="customersMeta"/>
    <customer-edit v-if="edit && customer" @cancelEdit="cancelEdit" :customer="customer" :customer-meta="customersMeta"/>
    <customer-create v-if="create" @cancelCreate="cancelCreate" @created="created" :customer-meta="customersMeta"/>
  </main>

</template>

<script setup lang="ts">
import { ref, onBeforeMount, computed } from 'vue';
import CustomerService from '@/services/CustomerService';

import CustomerList from '@/components/Customer/CustomerList.vue';
import CustomerEdit from '@/components/Customer/CustomerEdit.vue';
import CustomerCreate from '@/components/Customer/CustomerCreate.vue';
import RefreshButton from '@/components/Button/RefreshButton.vue';
import CreateButton from '@/components/Button/CreateButton.vue';
import CustomerFilter from '@/components/Customer/CustomerFilter.vue';
import AddButton from '../components/Button/AddButton.vue';
import RemoveButton from '../components/Button/RemoveButton.vue';

const loaded = ref(false);
const filter = ref(false);
const filters = ref<FilterInterface>();
const filterCustomer = ref('');
const refreshText = ref('Refresh');
const edit = ref(false);
const create = ref(false);
const list = ref(true);
const search = ref('');
const customer = ref<CustomerInterface>();
// const customers = ref<CustomerArrayInterface>();
const customersFiltered = ref<CustomerArrayInterface>();
const customersMeta = ref<CustomerInterface>();
let customersArray = Array<CustomerInterface>();
const nbTotalCustomers = ref(0);
const pageNumber = ref(1);
const size = ref(20);



const isCheckAll = ref(false);
const checkedItems = ref([]);

console.log('CustomerView.vue');

// Data recovered before displaying results in Template
onBeforeMount( async () => {
  refreshText.value = 'Loading...';
  loaded.value = false;
  customersMeta.value = await CustomerService.getCustomersMeta();
  customersFiltered.value = await CustomerService.getCustomers(1,size.value);
  console.log('customersFiltered : ',customersFiltered.value);
  nbTotalCustomers.value = customersFiltered.value!.nb;
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
const getCustomer = (cust: CustomerInterface|undefined) => {
  //console.log('CustomerView -- getCustomer, cust : ', cust);
  customer.value = cust;
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
  refresh(1);
  create.value = false;
  list.value = true;
};

const deletion = async (id:string) => {
  await CustomerService.deleteCustomer(id);
  refresh(1);
};

// Interfaces
interface FilterInterface {
  meta:string,
  operator:string,
  val:string
};

const applyFilter = (a:string, b:string, c:string) => {
  filters.value = {
    meta : a,
    operator : b,
    val : c
  };
};

const filterCustomers = async (a:string, b:string, c:string) => {
  refreshText.value = 'Loading...';
  loaded.value = false;
  if (b == 'equals') {
    filterCustomer.value = '{"'+a+'": "'+c+'"}';
  };
  //console.log('CustomerView function filterCustomers - filterCustomer : ', filterCustomer.value);
  customersFiltered.value = await CustomerService.getCustomers(1, size.value, filterCustomer.value);
  //console.log('function filterCustomers - #customersFiltered : ', customersFiltered.value!.nb);

  nbTotalCustomers.value = customersFiltered.value!.nb;
  search.value = 'X'; // only to force calculation of filteredCustomers
  search.value = ''; // only to force calculation of filteredCustomers (value changed here from 'X' to '')
  loaded.value = true;
  refreshText.value = 'Refresh';

}

const resetFilter = () => {
  filters.value = {
    meta : '',
    operator : 'equals',
    val : ''
  };
  filterCustomer.value = '';
  refresh(1);
};

const getCustomerDataFromMeta = (meta:{levelup:string}, index:string, cust:CustomerInterface) => {
  const levelup:string = meta?.levelup
  var tab = levelup?.split('.')
  if (levelup === '') return cust[index] // return the field directly if no hierarchy
  if (tab?.length >= 0)
    for (var i=0; i< tab.length; i++) { // loop with all levels separated by a dot
      if (!cust)
        return '' // as soon as one level does not exist, exit with empty result
      cust = cust[tab[i]]
    }
  if (cust) return cust[index]
  return '' // default empty value if the last level does not exist
}

const refresh = async (page: number, filter?: {}) => {
  refreshText.value = 'Loading...'
  loaded.value = false;
  customersMeta.value = await CustomerService.getCustomersMeta();
  customersFiltered.value = await CustomerService.getCustomers(page, size.value, filter);
  nbTotalCustomers.value = customersFiltered.value!.nb;
  search.value = 'X'; // only to reload filteredCustomers
  search.value = ''; // only to reload filteredCustomers (value changed here from 'X' to '')
  loaded.value = true;
  refreshText.value = 'Refresh';
};

const next = () => {
  if (pageNumber.value < pageTotal.value) {
    pageNumber.value ++;
    refresh(pageNumber.value, filterCustomer.value);
  }
}

const last = () => {
  if (pageNumber.value < pageTotal.value) {
    pageNumber.value = pageTotal.value;
    refresh(pageNumber.value, filterCustomer.value);
  }
}

const previous = () => {
  if (pageNumber.value > 1) {
    pageNumber.value --;
    refresh(pageNumber.value, filterCustomer.value);
  }
}

const first = () => {
  if (pageNumber.value > 1) {
    pageNumber.value = 1;
    refresh(1, filterCustomer.value);
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
  filters.value = {
    meta : '',
    operator : '',
    val : ''
  };
  filterCustomer.value = '';
  refresh(1);
};

const testCustomer = (cust: CustomerInterface) => {
  var meta = filters?.value?.meta;
  var operator = filters?.value?.operator;
  var val = filters?.value?.val;
  var custData = '';

//console.log('operator : ',filters?.value?.operator);

  let test = false;
  if (search.value === '') test=true;
  for (const index in customersMeta.value) {
    if (search.value !== '') {
      custData = getCustomerDataFromMeta(customersMeta.value[index], index, cust);
      if (custData) {
        let data = custData.toString().toLowerCase();
        if (data.includes(search.value.toLowerCase())) test=true;
      }
    }
    if (meta && operator && val) {
      let custFilterData = getCustomerDataFromMeta(customersMeta.value[meta], meta, cust);
      switch (operator) {
        case 'equals':
          (custFilterData && custFilterData == val) ? test=true : test=false;
          break;
        case 'contains':
          (custFilterData && custFilterData.toLowerCase().includes(val.toLowerCase())) ? test=true : test=false;
          break;
        default:
          break;
      }
    }
  }
  return test
};

// Computed variables

// const filteredCustomers = computed(() => customersArray.filter((cust: CustomerInterface) => testCustomer(cust)));

const pageTotal = computed(() => ~~(nbTotalCustomers.value / size.value) + 1);

const beginCursor = computed(() => size.value * (pageNumber.value - 1) + 1);

const endCursor = computed(() => (size.value * pageNumber.value < nbTotalCustomers.value)? size.value * pageNumber.value : nbTotalCustomers.value);

// const nbCustomers = computed(() => filteredCustomers.value.length);

</script>
