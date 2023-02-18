<template>
    <div class="ml-8 mb-4 container">
        Set filters
        <div class="my-2">
         <select class="dark:bg-cyan-600 mr-2" v-model="filter">
            <option class="" value="">-- Select One --</option>
            <option class="dark:bg-cyan-600" v-for="(key, index) in props.dataMeta" :key="index" :value="index">{{ key.label }}</option>
         </select>
         <select class="dark:bg-cyan-600 mr-2" v-model="operator">
            <option selected value="equals" class="dark:bg-cyan-600">Equals</option>
            <option value="contains" class="dark:bg-cyan-600">Contains</option>
         </select>
         <input class="p-1 dark:text-gray-800" v-if="filter" v-model="searchFilter" type="text"/>
        </div>
        <filter-button @click="applyFilter" class="mr-2"/>
        <cancel-button @click="resetFilter" text="Reset filter"/>
    </div>
</template>
<script setup lang="ts">

// Imports
import {ref} from 'vue';
import FilterButton from '@/components/Button/FilterButton.vue';
import CancelButton from '@/components/Button/CancelButton.vue';

// Variables
const searchFilter = ref('');
const filter = ref('');
const operator = ref('equals');

// Functions
const applyFilter = () => {
    emit('filterCreated', filter.value, operator.value, searchFilter.value);
};

const resetFilter = () => {
    searchFilter.value = '';
    filter.value = '';
    operator.value = 'equals';
    emit('resetFilter');
};

// Interfaces
interface DataInterface {
    [key: string]: any
};
interface Props {
    dataMeta: DataInterface|undefined
};

// Computed variables

// Props & Emit
const props = defineProps<Props>();

const emit = defineEmits<{
    (e: 'filterCreated', filter:string, operator:string, value:string) : void,
    (e: 'resetFilter') : void
}>();


</script>