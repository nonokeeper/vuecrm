<template>
    <div class="ml-8 mb-4 container">
        <div>
            <span @click="cancel" class="text-yellow-800 dark:text-yellow-200 cursor-pointer hover:font-semibold w-1/3">Back to Customers List</span>
            <span :class="{ invisible: !showMessage}" class="ml-4 rounded border-l-4 bg-green-400 text-sm text-white px-2 py-3 border-green-800 shadow-xl items-center">
            {{ message }}<i @click="showMessage = false" class="ml-2 far fa-times-circle"></i>
            </span>
        </div>
        <form name="update" ref="updateForm" @submit.prevent="updateCust(true)">
            <div class="mt-8 mb-6 grid grid-cols-3 gap-8">
            <div class="" v-for="(meta, index) in props.customerMeta" :set="custData = getDataFrom(meta.levelup, index)" v-bind:key="index">
                <label :for="index.toString()" class="block left-1 -top-2 dark:text-gray-100 text-gray-800 text-sm">{{ meta.label }}</label>
                <input :required="meta.required" :id="index.toString()" class="py-2 text-sm border rounded-md px-2 text-gray-800 focus:outline-none dark:border-2 dark:focus:border-yellow-200 focus:border-yellow-800" :value="custData" />
            </div>
            </div>
            <div class="flex items-stretch">
            <button type="reset" class="rounded px-2 py-1 text-gray-100 bg-gray-500 hover:bg-gray-600" @click="cancel">Cancel</button>
            <button class="disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed rounded ml-4 px-2 py-1 text-gray-100 bg-yellow-600 hover:bg-yellow-700" type="button" @click="updateCust(false)">Save</button>
            <button class="disabled:opacity-50 disabled:cursor-not-allowed rounded ml-4 px-2 py-1 text-gray-100 bg-blue-600 hover:bg-blue-700" type="submit">Save and Quit</button>
            </div>
        </form>
    </div>

</template>
<script setup lang="ts">
import CustomerService from '@/services/CustomerService';
import { ref } from 'vue';

// Variables
const message = ref('');
const showMessage = ref(false);
let custData = '';

// Functions
// Update Customer data based on edited values in Form
const updateCust = async (quit: Boolean) => {
    let body = props.customer as any;
    let metas = props.customerMeta;
    if (metas) {
        for (let meta in metas) {
            //console.log('level de meta : '+metas[meta].levelup);
            updateBody(body, meta, metas[meta].levelup);
        }
    }
    if (props.customer) {
        console.log('body : '+JSON.stringify(body));
        if (quit) {
            await CustomerService.updateCustomer(body)
            emit('cancelEdit');
        } else {
            await CustomerService.updateCustomer(body)
        }
    }
};
// Key function which gets the attribute value based on its name and its hierarchy
const getNestedObject = (nestedObj:object, pathArr:Array<string>) => {
    return pathArr.reduce((obj:any, key: string | number) =>
        (obj && obj[key] !== 'undefined') ? obj[key] : undefined, nestedObj);
};
// Key function to update one attribute value inside the JSON object
const setNestedObject = (nestedObj:any, pathArr:Array<string>, input:any) => {
    var len = pathArr.length;
    for(var i = 0; i < len-1; i++) {
        var elem = pathArr[i];
        if( !nestedObj[elem] ) nestedObj[elem] = {}
        nestedObj = nestedObj[elem];
    }
    nestedObj[pathArr[len-1]] = input;
};

// Get the data for one attribute
const getDataFrom = (level:string, index:string|number) => {
    let fieldValue = '';
    let field = '';
    let array = [''];
    if (props.customer) {
        if (level === '' || !level) {
            field = index.toString();
            fieldValue = props.customer[field];
        } else {
            field = level + '.' + index;
            array = field.split('.');
            fieldValue = getNestedObject(props.customer, array)
        }
    }
    // console.log('field : '+ field + ' et index : ' + index + ' : ' + fieldValue);
    // console.log('array : '+ array);
    return fieldValue
};

// Main function to update the final body for the MongoDB Update
const updateBody = (body:any, index:string, level:string) => {
    let indexInput = document.getElementById(index);
    if (indexInput) {
        let input = (indexInput as HTMLInputElement).value
        if (level) {
            let field = level + '.' + index;
            let array = field.split('.');
            setNestedObject(body, array, input);
        } else {
            body[index] = input;
        }
    }
    return body;
};

// Interfaces
interface CustomerInterface {
    [key: string]: any
};
interface Props {
    customer: CustomerInterface|undefined
    customerMeta: CustomerInterface|undefined
};

// Props & Emit
const props = defineProps<Props>();

const emit = defineEmits<{
    (e: 'cancelEdit') : void
}>();

const cancel = () => {
    emit('cancelEdit');
};

</script>