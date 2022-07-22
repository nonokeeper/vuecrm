<template>
    <div class="ml-8 mb-4 container">
        <div>
            <span @click="cancel" class="text-yellow-800 dark:text-yellow-200 cursor-pointer hover:font-semibold w-1/3">Back to Collection List</span>
            <span :class="{ invisible: !showMessage}" class="ml-4 rounded border-l-4 bg-green-400 text-sm text-white px-2 py-3 border-green-800 shadow-xl items-center">
            {{ message }}<i @click="showMessage = false" class="ml-2 far fa-times-circle"></i>
            </span>
        </div>
        <div>
            {{ props.collection }}
        </div>
        <div class="flex flex-col">
            <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div class="py-2 inline-block sm:px-6 lg:px-8">
                    <div class="overflow-hidden">
                        <table>
                            <thead class="dark:bg-cyan-600 dark:text-white bg-cyan-100 text-gray-800 border-b">
                                <tr>
                                    <th scope="col" class="text-sm font-medium px-6 py-4 text-left">
                                        #
                                    </th>
                                    <th scope="col" class="text-sm font-medium px-6 py-4 text-left">
                                        Name
                                    </th>
                                    <th scope="col" class="text-sm font-medium px-6 py-4 text-left">
                                        Label
                                    </th>
                                    <th scope="col" class="text-sm font-medium px-6 py-4 text-left">
                                        Type
                                    </th>
                                    <th scope="col" class="text-sm font-medium px-6 py-4 text-left">
                                        Group
                                    </th>
                                    <th scope="col" class="text-sm font-medium px-6 py-4 text-left">
                                        Required
                                    </th>
                                    <th scope="col" class="text-sm font-medium px-6 py-4 text-left">
                                        *
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(infos, field, index) in collectionInfos" :key="field" class="bg-white dark:bg-cyan-900 dark:text-white border-b">
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">{{ index+1 }}</td>
                                    <td class="text-sm font-light px-6 py-4 whitespace-nowrap">
                                        {{ field }}
                                    </td>
                                    <td class="text-sm font-light px-6 py-4 whitespace-nowrap">
                                        <form v-if="editCollection && field==fieldName">
                                            <div><input :id="fieldName" v-model="fieldLabel" class="dark:text-white dark:bg-cyan-600"/></div>
                                            <div><button type="button" @click="saveCollection">Save</button><span @click="cancelEdit">Cancel</span></div>
                                        </form>
                                        <span v-else>{{ infos.label}}&nbsp;&nbsp;<i @click="edit(field, infos)" class="fas fa-edit text-yellow-400 cursor-pointer" title="edit"></i></span></td>
                                    <td class="text-sm font-light px-6 py-4 whitespace-nowrap">{{ infos.type}}</td>
                                    <td class="text-sm font-light px-6 py-4 whitespace-nowrap">{{ infos.levelup}}</td>
                                    <td class="text-sm font-light px-6 py-4 whitespace-nowrap">{{ infos.required}}</td>
                                    <td class="text-sm font-light px-6 py-4 whitespace-nowrap">
                                        <i @click="deletion(field)" class="fas fa-trash text-red-600 cursor-pointer" title="delete"></i>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <div>
            <CreateButton text="New Field" @click="createField = true"/>
        </div>

        <div v-if="createField" class="mt-2 p-4 border-2 border-cyan-500 rounded">
            <div class="relative">
                <input v-model="newField" type="text" id="name" 
                class="block px-2.5 pb-2.5 pt-4 w-2/3 text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none dark:text-white dark:border-gray-400 dark:focus:border-cyan-800 focus:outline-none focus:ring-0 focus:border-cyan-500 peer" placeholder=" " />
                <label for="name" class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-800 px-2 peer-focus:px-2 peer-focus:text-cyan-600 peer-focus:dark:text-gray-200 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">
                    Field Name
                </label>
            </div>
            <div class="relative mt-4">
                <input v-model="newLabel" type="text" id="label" 
                class="block px-2.5 pb-2.5 pt-4 w-2/3 text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none dark:text-white dark:border-gray-400 dark:focus:border-cyan-800 focus:outline-none focus:ring-0 focus:border-cyan-500 peer" placeholder=" " />
                <label for="label" class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-800 px-2 peer-focus:px-2 peer-focus:text-cyan-600 peer-focus:dark:text-gray-200 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">
                    Label
                </label>
            </div>
            <div class="relative mt-4 dark:text-gray-200 ">
                Type : <select class="dark:bg-gray-800 border-2 border-gray-400 rounded" v-model="newType">
                <option value="String">String</option>
                <option value="Boolean">Boolean</option>
                <option value="Number">Number</option>
                <option value="Date">Date</option>
                <option value="Array">Array</option>
                </select>
            </div>
            <div class="relative mt-4">
                <input v-model="newGroup" type="text" id="group" 
                class="block px-2.5 pb-2.5 pt-4 w-2/3 text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none dark:text-white dark:border-gray-400 dark:focus:border-cyan-800 focus:outline-none focus:ring-0 focus:border-cyan-500 peer" placeholder=" " />
                <label for="group" class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-800 px-2 peer-focus:px-2 peer-focus:text-cyan-600 peer-focus:dark:text-gray-200 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">
                    Group
                </label>
            </div>
            <p id="group" class="mt-2 text-xs text-gray-500 dark:text-gray-400">Format : level1.level2. Leave empty if not embedded data</p>
            <div class="relative mt-4">
                <input id="required" type="checkbox" v-model="newRequired" class="mx-2"/>
                <label for="required">Required</label>
            </div>
            <div class="relative mt-4 w-1/2"><SaveButton text="Save" @click="createNewField" class="w-32 mr-4"/><CancelButton text="Cancel" @click="cancelNewField" class="w-32"/></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import CollectionService from '@/services/CollectionService';
import { onBeforeMount, ref } from 'vue';
import CreateButton from '../Button/CreateButton.vue';
import SaveButton from '../Button/SaveButton.vue';
import CancelButton from '../Button/CancelButton.vue';

//Variables
const message = ref('');
const fieldLabel = ref('');
const fieldName = ref('');
const editCollection = ref(false);
const showMessage = ref(false);
const createField = ref(false);
const collectionInfos = ref<metaInterface>();

const [newField, newLabel, newType, newGroup] = [ref(''),ref(''),ref(''),ref(''),ref('')];
const newRequired = ref(false);

// Data recovered before displaying results in Template
onBeforeMount( async () => {
  collectionInfos.value = await CollectionService.getCollectionInfos(props.collection)
})
/*
onAfterUpdate ( () => {
    console.log('onBeforeUpdate');
    console.log('value : ',collectionInfos.value)
})
*/
// Interfaces
interface metaInterface {
    [key: string]: {
        "type": string
        "label": string,
        "levelup": string,
        "required": boolean
    }
};

interface Props {
    collection: string
    //Meta: MetaInterface|undefined
};

// Props & Emit
const props = defineProps<Props>();

const emit = defineEmits<{
    (e: 'cancelEdit') : void
    (e: 'save', collection:string, field:string, label:string) : void
}>();

// Functions

const cancel = () => {
    emit('cancelEdit');
};

const cancelEdit = () => {
    editCollection.value = false;
};

const createNewField = async() => {
    createField.value = false;
    const res = await CollectionService.addFieldCollection(props.collection, newField.value, newLabel.value, newType.value, newGroup.value, newRequired.value)
    console.log('res : ', res);
    collectionInfos.value = await CollectionService.getCollectionInfos(props.collection);
    newField.value = newLabel.value = newType.value = newGroup.value = '';
    newRequired.value = false;
}

const cancelNewField = () => {
    createField.value = false;
    newField.value = newLabel.value = newType.value = newGroup.value = '';
    newRequired.value = false;
}

/* A creuser événement pour sortir de l'input difficile à gérer
const exit = () => {
    console.log('focus : ', focusInput.value);
    console.log('edit : ', editCollection.value);
    if (editCollection.value && focusInput.value) {
        console.log('exit');
        cancelEdit();
        focusInput.value = false;
    }
}
*/
const saveCollection = async () => {
    editCollection.value = false;
    emit('save', props.collection, fieldName.value, fieldLabel.value);
};

const edit = (field: any, infos: {label:string}) => {
    fieldLabel.value = infos.label;
    fieldName.value = field;
    editCollection.value = true;
    console.log(field)
};

const deletion = async (field:any) => {
    const res = await CollectionService.deleteField(props.collection, field)
    console.log('res : ', res);
    collectionInfos.value = await CollectionService.getCollectionInfos(props.collection)
}

// Computed

</script>