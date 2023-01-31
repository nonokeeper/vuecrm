<template>
    <div class="ml-8 mb-4 container">
        <div>
            <span @click="cancel" class="text-yellow-800 dark:text-yellow-200 cursor-pointer hover:font-semibold w-1/3">Back to the {{ props.entity }} list</span>
            <span :class="{ invisible: !showMessage}" class="ml-4 rounded border-l-4 bg-yellow-500 text-sm text-white px-3 py-2 border-yellow-800 shadow-xl items-center">
            {{ message }}<i @click="showMessage = false" class="ml-2 far fa-times-circle"></i>
            </span>
        </div>
        <form @submit.prevent="createData" method="POST">
            <div class="mt-8 mb-6 grid grid-cols-3 gap-8">
                <div class="relative flex items-center" v-for="(meta, index) in props.dataMeta" v-bind:key="index">
                    <label :id="'label-'+index.toString()" :for="index.toString()" :class="labelClass">{{ meta.label }}</label>
                    <svg v-if="index.toString() === 'email'" xmlns="http://www.w3.org/2000/svg" class="pointer-events-none w-7 h-7 absolute top-1/2 transform -translate-y-1/2 left-2" viewBox="0 0 20 20" fill="gray">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <input @focusout="focusChange" :class="emailPadding(index.toString())" :type="metaType(index.toString())" :required="meta.required" :id="index.toString()" class="required:border-l-red-500 pr-2 text-sm border rounded-md py-2 text-gray-800 focus:outline-none dark:border-2 dark:focus:border-yellow-200 focus:border-yellow-800"/>
                </div>
            </div>
            <div class="inline-block space-x-6">
                <cancel-button @click="cancel"/>
                <save-button/>
            </div>
        </form>
    </div>
</template>
<script setup lang="ts">

// Imports
import DataService from '@/services/DataService';
import { ref, computed, onMounted } from 'vue';
import CancelButton from "@/components/Button/CancelButton.vue";
import SaveButton from "@/components/Button/SaveButton.vue";

// Variables
const message = ref('');
const showMessage = ref(false);
const insertDataReturn = ref<insertDataInterface>();
const labelClass = ref('absolute left-1 -top-6 dark:text-gray-100 text-gray-800 text-sm');
const textError = ref('absolute left-1 -top-6 dark:text-red-400 text-red-600 text-sm');
const emailInput = ref<HTMLInputElement>();
const labelEmailInput = ref<HTMLInputElement>();

onMounted(() => {
    emailInput.value = <HTMLInputElement>document.getElementById("email");
    labelEmailInput.value = <HTMLInputElement>document.getElementById("label-email")
});

// Functions

// Determine input email field padding
const emailPadding = (index:string) => {
    if (index === 'email') {
            return 'pl-10'
        } else return 'pl-2'
};

// Update one attribute value with a given path inside the JSON object
const setNestedObject = (nestedObj:any, pathArr:Array<string>, input:any) => {
    var len = pathArr.length;
    for(var i = 0; i < len-1; i++) {
        var elem = pathArr[i];
        if( !nestedObj[elem] ) nestedObj[elem] = {}
        nestedObj = nestedObj[elem];
    }
    nestedObj[pathArr[len-1]] = input;
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

// Insert this new Data record
const createData = async () => {
    let body = {};
    let metas = props.dataMeta;
    var email = emailInput?.value;
    console.log(email?.value);
    if (metas) {
        for (let meta in metas) {
            updateBody(body, meta, metas[meta].levelup);
        }
    };
    // Test check Email
    if (email?.value === 'toto@toto') {
        showMessage.value = true;
        message.value = 'Email Invalid!';
        email.focus();
        labelEmailInput.value?.setAttribute('class', textError.value);
    } else {
        insertDataReturn.value = await DataService.insertData(body, props.entity);
        //console.log('Return after creation : ',insertCustReturn);
        if (insertDataReturn.value.status === 201) {
            created();
        } else {
            showMessage.value = true;
            message.value = 'Customer creation issue :(';
        }
    }
};

const focusChange = () => {
    showMessage.value = false
    labelEmailInput.value?.setAttribute('class', labelClass.value);
};

// Determine the input Type for a meta
const metaType = (index: string) => {
    if (index === 'email') {
        return 'email'
    } else return ''
};

// Interfaces
interface DataInterface {
    [key: string]: any
};
interface Props {
    dataMeta: DataInterface|undefined
    entity: string|undefined
};
interface insertDataInterface {
    data: string,
    status: number,
    statusText: string
};

// Computed variables

const emailValid = computed(() => {
        // TODO
    }
);

// Props & Emit
const props = defineProps<Props>();

const emit = defineEmits<{
    (e: 'cancelCreate') : void,
    (e: 'created') : void
}>();

const cancel = () => {
    emit('cancelCreate');
};

const created = () => {
    emit('created');
};

</script>