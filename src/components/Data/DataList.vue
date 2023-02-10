<template>
<div class="mt-2 mb-4" :class="showConfirmDialog? 'blur-sm' : ''">
    Collection : {{ props.entity  }}
    <table v-if="props.data">
        <thead>
            <tr class="text-left text-white">
                <th class="px-3 py-2">
                    
                </th>
                <th class="text-yellow-800 dark:text-yellow-100 px-3 py-2" v-for="(meta, index) in props.dataMeta" v-bind:key="index">
                    <span class="whitespace-nowrap">{{ meta?.label }}</span>
                </th>
                <th colspan=2 class="px-3 py-2"> <!-- 2 operations -->
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="data in props.data" v-bind:key="data._id">
                <td class="px-3 py-2">
                    <input class="accent-yellow-600" type="checkbox" v-bind:value='data._id'>
                </td>
                <td class="px-3 py-2" v-for="(meta, index) in props.dataMeta" :set="dataValues = getDataFrom(data, meta.levelup, index)" v-bind:key="index">
                    {{ dataValues }}
                </td>
                <td class="px-3 py-2">
                    <i @click="edit(data)" class="fas fa-edit text-yellow-400 cursor-pointer" title="edit"></i>
                </td>
                <td class="px-3 py-2">
                    <i @click="deletion(data._id)" class="fas fa-trash text-red-600 cursor-pointer" title="delete"></i>
                </td>
            </tr>
        </tbody>
    </table>
</div>
<div v-if="showConfirmDialog" class="fixed text-center inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="deleteDataModal">
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div v-if="noDeletion" class="mt-3 text-center">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Are you sure to delete this document? <br/>(id = {{ dataToDelete }})?</h3>
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
let dataValues = '';
//let searchIndex = ref('');
const showConfirmDialog = ref(false);
const noDeletion = ref(true);
const dataToDelete = ref('');
//const searchSubmit = ref(false);

// Functions
// Key function which gets the attribute value based on its name and its hierarchy
const getNestedObject = (nestedObj:object, pathArr:Array<string>) => {
    return pathArr.reduce((obj:any, key: string | number) =>
        (obj && obj[key] !== 'undefined') ? obj[key] : undefined, nestedObj);
};

// Get the data for one attribute
const getDataFrom = (data:DataInterface, level:string, index:string|number) => {
    let fieldValue = '';
    let field = '';
    let array = [''];
    if (data) {
        if (level === '' || !level) {
            field = index.toString();
            fieldValue = data[field];
        } else {
            field = level + '.' + index;
            array = field.split('.');
            fieldValue = getNestedObject(data, array)
        }
    }
    return fieldValue
};
// Interfaces
interface DataInterface {
    [key: string]: any
};
interface Props {
    data: DataInterface[]|undefined
    dataMeta: DataMeta|undefined
    entity: string
};
interface DataMeta {
    [key: string]: any
};

const emit = defineEmits<{
    (e: 'edit', data: DataInterface|undefined) : void,
    (e: 'delete', id:string) : void
}>();

const props = defineProps<Props>();

const edit = (data: DataInterface|undefined) => {
    // emit edit event to the parent DataView.vue
    // data info transmitted
    emit('edit', data);
};

const deletion = (id:string) => {
    showConfirmDialog.value = true;
    dataToDelete.value = id;
};

const confirmDelete = () => {
    noDeletion.value = false;
    emit('delete', dataToDelete.value);
    showConfirmDialog.value = false;
    noDeletion.value = true;
};

const cancelDelete = () => {
    showConfirmDialog.value = false;
};

</script>