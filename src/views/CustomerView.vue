<template>
  <main>
    <div v-if="list" class="mt-2 mb-4">
      <div class="relative m-4">
        <span class="absolute inset-y-0 left-3 flex items-center pl-2">
          <svg fill="none" stroke="#BBBBBB" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" class="w-6 h-6"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </span>
        <input v-model="search" placeholder="Search" type="text" class="border border-gray-300 ml-4 px-8 py-1 rounded-xl focus:placeholder-transparent dark:focus:placeholder-transparent dark:placeholder-gray-400 placeholder-gray-400 bg-white dark:bg-cyan-800 text-gray-800 dark:text-gray-100"/>
        <span @click="search=''" class="absolute inset-y-0 left-60 flex items-center">
          <i class="text-gray-400 dark:text-gray-300 fa-regular fa-circle-xmark"></i>
        </span>
      </div>
      <div class="inline-block space-x-6">
        {{ nbCustomers }} Customers
        <refresh-button :text="refreshText" @click="refresh"/>
        <create-button text="New customer" @click="openCreate"/>
      </div>
    </div>
    <customer-list v-if="list && loaded" @edit="getCustomer" @delete="deletion" :customers="filteredCustomers" :customers-meta="customersMeta"/>
    <customer-edit v-if="edit && customer" @cancelEdit="cancelEdit" :customer="customer" :customer-meta="customersMeta"/>
    <customer-create v-if="create" @cancelCreate="cancelCreate" @created="created" :customer-meta="customersMeta"></customer-create>
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

const loaded = ref(false);
const refreshText = ref('Refresh');
const edit = ref(false);
const create = ref(false);
const list = ref(true);
const search = ref('');
const customer = ref<CustomerInterface>();
const customers = ref<CustomerInterface[]>([{"default":"x"}]);
const customersMeta = ref<CustomerInterface>([{"default":"x"}]);
let nbCustomers = ref(0);

const isCheckAll = ref(false);
const createErrorFlag = ref(false);
const updateErrorFlag = ref(false);
const showModal = ref(false);
const showMessage = ref(false);
const message = ref('');
const createError = ref('');
const updateError = ref('');
const checkedItems = ref([]);
let customersArray = Array<CustomerInterface>([{"default":"x"}]);

console.log('CustomerView.vue');

// Data recovered before displaying results in Template
onBeforeMount( async () => {
  refreshText.value = 'Loading...';
  loaded.value = false;
  customersMeta.value = await CustomerService.getCustomersMeta();
  customers.value = await CustomerService.getCustomers();
  if (customers.value) {
    customersArray = customers.value;
    nbCustomers.value = customers.value.length
  }
  loaded.value = true;
  refreshText.value = 'Refresh';
})

// Interfaces
interface CustomerInterface {
    [key: string]: any
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
  refresh();
  create.value = false;
  list.value = true;
};

const deletion = async (id:string) => {
  await CustomerService.deleteCustomer(id);
  refresh();
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

const refresh = async () => {
  refreshText.value = 'Loading...'
  loaded.value = false;
  customersMeta.value = await CustomerService.getCustomersMeta();
  customers.value = await CustomerService.getCustomers();
  customersArray = customers.value;
  nbCustomers.value = customers.value.length
  search.value = 'X'; // only to reload filteredCustomers
  search.value = ''; // only to reload filteredCustomers (value changed here from 'X' to '')
  loaded.value = true;
  refreshText.value = 'Refresh';
};

const openCreate = () => {
  create.value = true;
  list.value = false;
};

const testCustomer = (cust: CustomerInterface) => {
  if (search.value === '') return true
  let test = false
  for (const index in customersMeta.value) {
    let custData = getCustomerDataFromMeta(customersMeta.value[index], index, cust)
    if (custData && custData.toLowerCase().includes(search.value.toLowerCase())) test=true
  }
  return test
};

// Computed variables

const filteredCustomers = computed(() => customersArray.filter((cust: CustomerInterface) => testCustomer(cust)));

</script>
