<template>
<div class="mt-2 mb-4">
    <table id="customers">
    <thead>
        <tr class="text-left text-white">
        <th class="px-3 py-2">
            &nbsp;
        </th>
        <th class="text-yellow-800 dark:text-yellow-100 px-3 py-2" v-for="(meta, index) in props.customersMeta" v-bind:key="index"><span>{{ meta?.label }}</span></th>
        <th colspan=2 class="px-3 py-2">
        </th>
        </tr>
    </thead>
    <tbody v-if="props.customers">
        <tr v-for="cust in props.customers" v-bind:key="cust._id">
            <td class="px-3 py-2">
                <input class="accent-yellow-600" type="checkbox" v-bind:value='cust._id'>
            </td>
            <td class="px-3 py-2" v-for="(meta, index) in props.customersMeta" :set="custData = getDataFrom(cust, meta.levelup, index)" v-bind:key="index">
                {{ custData }}
            </td>
            <td class="px-3 py-2">
                <i @click="edit(cust)" class="fas fa-edit text-yellow-600 cursor-pointer" title="edit"></i>
            </td>
            <td class="px-3 py-2">
                <i @click="deletion(cust._id)" class="fas fa-trash text-red-600 cursor-pointer" title="delete"></i>
            </td>
        </tr>
    </tbody>
    </table>
</div>
<div v-if="showConfirmDialog"
    class="fixed text-center inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
	id="deleteCustomerModal">
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div v-if="noDeletion" class="mt-3 text-center">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Are you sure to delete this customer?</h3>
            <div class="mt-2 px-7 py-3">
                <p class="text-sm text-gray-500">
                    All data linked to it will also be deleted!
                </p>
            </div>
            <div class="flex flex-auto px-4 py-3">
                <button	@click="confirmDelete"
                    class="mr-2 px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-600 focus:outline-none">
                    <i class="fa-solid fa-trash-can"/>&nbsp;Yes
                </button>
                <button @click="cancelDelete"
                    class="ml-2 px-4 py-2 bg-gray-200 text-gray-800 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-300 focus:outline-none">
                    Cancel
                </button>
            </div>
        </div>
        <div v-if="!noDeletion" class="mt-3 text-center">
            <button disabled class="m-4 px-4 py-2 bg-gray-200 text-gray-800 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-300 focus:outline-none">
                Deletion in progress...
            </button>
        </div>
    </div>
</div>
</template>
<script setup lang="ts">
import { ref } from 'vue';

// Variables
let custData = '';
const showConfirmDialog = ref(false);
const noDeletion = ref(true);
const customerToDelete = ref('');

// Functions
// Key function which gets the attribute value based on its name and its hierarchy
const getNestedObject = (nestedObj:object, pathArr:Array<string>) => {
    return pathArr.reduce((obj:any, key: string | number) =>
        (obj && obj[key] !== 'undefined') ? obj[key] : undefined, nestedObj);
};

// Get the data for one attribute
const getDataFrom = (cust:CustomerInterface, level:string, index:string|number) => {
    let fieldValue = '';
    let field = '';
    let array = [''];
    if (cust) {
        if (level === '' || !level) {
            field = index.toString();
            fieldValue = cust[field];
        } else {
            field = level + '.' + index;
            array = field.split('.');
            fieldValue = getNestedObject(cust, array)
        }
    }
    return fieldValue
};
// Interfaces
interface CustomerInterface {
    [key: string]: any
};
interface Props {
    customers: CustomerInterface[]|undefined
    customersMeta: CustomerInterface|undefined
};

const emit = defineEmits<{
    (e: 'edit', customer: CustomerInterface|undefined) : void,
    (e: 'delete', id:string) : void
}>();

const props = defineProps<Props>();

const edit = (cust: CustomerInterface|undefined) => {
    // emit edit event to the parent CustomerView.vue
    // customer infos transmitted
    emit('edit', cust);
};

const deletion = (id:string) => {
    showConfirmDialog.value = true;
    customerToDelete.value = id;
};

const confirmDelete = () => {
    noDeletion.value = false;
    emit('delete', customerToDelete.value);
    showConfirmDialog.value = false;
    noDeletion.value = true;
};

const cancelDelete = () => {
    showConfirmDialog.value = false;
}


</script>