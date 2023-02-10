<template>
<div class="mt-2 mb-4" :class="showConfirmDialog? 'blur-sm' : ''">
    <table id="collections" v-if="props.collections">
        <thead>
            <tr class="text-left text-white">
                <th class="px-3 py-2">
                    {{ props.title }}
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="coll in props.collections" v-bind:key="coll?.name">
                <td class="px-3 py-2">
                    {{ coll?.name }}
                </td>
                <td class="px-3 py-2">
                    <i @click="edit(coll?.name)" class="fas fa-edit text-yellow-400 cursor-pointer" title="edit"></i>
                </td>
                <td class="px-3 py-2">
                    <i @click="deletion(coll?.name)" class="fas fa-trash text-red-600 cursor-pointer" title="delete"></i>
                </td>
                <td class="px-3 py-2">
                    <open-button type="submit" text="Open Collection" @click="open(coll?.name)"/>
                </td>
            </tr>
        </tbody>
    </table>
</div>
<div v-if="showConfirmDialog"
    class="fixed text-center inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
	id="deleteCollectionModal">
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div v-if="noDeletion" class="mt-3 text-center">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Are you sure to delete the collection "{{ collectionToDelete }}"?</h3>
            <div class="mt-2 px-7 py-3">
                <p class="text-sm text-gray-500">
                    All documents inside this collection will also be deleted!
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
import OpenButton from '@/components/Button/OpenButton.vue';

// Variables
const showConfirmDialog = ref(false);
const collectionToDelete = ref('');
const noDeletion = ref(true);

console.log('CollectionList.vue called');

// Functions
const deletion = (name:string) => {
    showConfirmDialog.value = true;
    collectionToDelete.value = name;
};

const edit = (name:string) => {
    emit('edit', name);
}

const open = (name:string) => {
    emit('open', name);
}

const confirmDelete = () => {
    noDeletion.value = false;
    emit('delete', collectionToDelete.value);
    showConfirmDialog.value = false;
    noDeletion.value = true;
};

const cancelDelete = () => {
    showConfirmDialog.value = false;
};

// Interfaces

interface CollectionInterface {
    name: string,
    type: string,
    info: {
        readOnly: boolean
        uuid: string
    }
};

interface Props {
    collections: CollectionInterface[]|undefined,
    title: string
};

const emit = defineEmits<{
    (e: 'edit', name:string) : void
    (e: 'delete', name:string) : void
    (e: 'open', name:string) : void
}>();

const props = defineProps<Props>();

</script>