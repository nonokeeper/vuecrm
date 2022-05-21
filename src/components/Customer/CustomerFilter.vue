<template>
    <div class="ml-8 mb-4 container">
        Set filters
        <div class="my-2">
         <select class="dark:bg-cyan-600 mr-2" v-model="filter">
            <option class="" value="">-- Select One --</option>
            <option class="dark:bg-cyan-600" v-for="(key, index) in props.customerMeta" :value="index">{{ key.label }}</option>
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
import FilterButton from '../Button/FilterButton.vue';
import CancelButton from '../Button/CancelButton.vue';

// Variables
const searchFilter = ref('');
const filter = ref('');
const operator = ref('equals');

// Functions
const applyFilter = () => {
    emit('filterCreated', filter.value, operator.value, searchFilter.value);
    //console.log('CustomerFilter / filter meta : '+filter.value);
};

const resetFilter = () => {
    searchFilter.value = '';
    filter.value = '';
    operator.value = 'equals';
    emit('resetFilter');
};

/*
const fullMeta = (level:string , meta:string|number) => {
    return (level !== '' && level !== undefined) ? level+'.'+meta : meta;
};
*/
// Interfaces
interface CustomerInterface {
    [key: string]: any
};
interface Props {
    customerMeta: CustomerInterface|undefined
};

// Computed variables

// Props & Emit
const props = defineProps<Props>();

const emit = defineEmits<{
    (e: 'filterCreated', a:string, b:string, c:string) : void,
    (e: 'resetFilter') : void
}>();


</script>