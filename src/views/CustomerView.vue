<template>
  <main>
    <div v-if="list" class="mt-2 mb-4">
      {{ nbCustomers }} Customers :
      <button v-show="!loaded" class="inline-flex ml-8 mr-2 bg-yellow-600 text-white rounded-lg shadow-lg px-2 py-2 hover:bg-yellow-700">
        <svg class="animate-spin mr-2 h-auto w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-100" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading...
      </button>
      <button v-show="loaded" class="inline-flex ml-8 mr-2 bg-yellow-600 text-white rounded-lg shadow-lg px-2 py-2 hover:bg-yellow-700" v-on:click="refresh">Refresh</button>
      <button class="inline-flex ml-8 mr-2 bg-yellow-600 text-white rounded-lg shadow-lg px-2 py-2 hover:bg-yellow-700" v-on:click="openCreate"><i class="fa fa-plus-circle" aria-hidden="true">&nbsp;</i>New</button>
    </div>
    <customer-list v-if="list" @edit="getCustomer" @delete="deletion" :customers="customers" :customers-meta="customersMeta"/>
    <customer-edit v-if="edit && customer" @cancelEdit="cancelEdit" :customer="customer" :customer-meta="customersMeta"/>
    <customer-create v-if="create" @cancelCreate="cancelCreate" @created="created" :customer-meta="customersMeta"></customer-create>
  </main>

</template>

<script setup lang="ts">
import CustomerService from '@/services/CustomerService';
import CustomerList from '@/components/Customer/CustomerList.vue';
import CustomerEdit from '@/components/Customer/CustomerEdit.vue';
import CustomerCreate from '@/components/Customer/CustomerCreate.vue';
import { ref, onBeforeMount } from 'vue';

const loaded = ref(false);
const isCheckAll = ref(false);
const createErrorFlag = ref(false);
const updateErrorFlag = ref(false);
const edit = ref(false);
const create = ref(false);
const list = ref(true);
const showModal = ref(false);
const showMessage = ref(false);
const message = ref('');
const createError = ref('');
const updateError = ref('');
const search = ref('');
const delay = ref(3000);
const promise = ref([]);
const customer = ref<CustomerInterface>();
const customers = ref<CustomerInterface[]>([{"default":"x"}]);
const filteredCustomers = ref<CustomerInterface[]>([{"default":"x"}]);
const checkedItems = ref([]);
const customersMeta = ref<CustomerInterface>([{"default":"x"}]);
let customersArray = Array<CustomerInterface>([{"default":"x"}]);
let nbCustomers = ref(0);

console.log('CustomerView.vue');

// Data recovered before displaying results in Template
onBeforeMount( async () => {
  loaded.value = false;
  //console.log('beforeMount : ',customers.value[0]);
  customersMeta.value = await CustomerService.getCustomersMeta();
  customers.value = await CustomerService.getCustomers();
  filteredCustomers.value = customers.value;
  if (customers.value) {
    customersArray = customers.value;
    nbCustomers.value = customers.value.length
  }
  loaded.value = true;
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
  const levelup:string = meta.levelup
  var tab = levelup.split('.')
  if (levelup === '') return cust[index] // return the field directly if no hierarchy
  for (var i=0; i< tab.length; i++) { // loop with all levels separated by a dot
    if (!cust)
      return '' // as soon as one level does not exist, exit with empty result
    cust = cust[tab[i]]
  }
  if (cust) return cust[index]
  return '' // default empty value if the last level does not exist
}

const refresh = async () => {
  loaded.value = false;
  customersMeta.value = await CustomerService.getCustomersMeta();
  customers.value = await CustomerService.getCustomers();
  nbCustomers.value = customers.value.length
  loaded.value = true;
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

// const filteredCustomers = computed(() => customersArray.filter((cust: CustomerInterface) => testCustomer(cust)));

</script>
