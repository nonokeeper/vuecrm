<template>
    <div class="ml-8 mb-4 container">
        <div>
            <span @click="cancel" class="text-yellow-800 dark:text-yellow-200 cursor-pointer hover:font-semibold w-1/3">Back to Collection List</span>
            <span :class="{ invisible: !showMessage}" class="ml-4 rounded border-l-4 bg-green-400 text-sm text-white px-2 py-3 border-green-800 shadow-xl items-center">
            {{ message }}<i @click="showMessage = false" class="ml-2 far fa-times-circle"></i>
            </span>
        </div>
        <div>
            Attributes
            <table>
                <thead>
                    <th>Name</th>
                    <th>Label</th>
                    <th>Type</th>
                    <th>Group</th>
                    <th>Required</th>
                    <th></th>
                </thead>
                <tbody class="text-left">
                    <tr>
                        <td class="px-3 py-2"><input v-model="name"/></td>
                        <td class="px-3 py-2"><input v-model="label"/></td>
                        <td class="px-3 py-2"></td>
                        <td class="px-3 py-2"></td>
                        <td class="px-3 py-2"></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div>
            <CreateButton text="Create Collection" @click="save"/>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CreateButton from '../Button/CreateButton.vue';

//Variables
const message = ref('');
const name = ref('');
const label = ref('');
const showMessage = ref(false);

const emit = defineEmits<{
    (e: 'cancelCreate') : void
    (e: 'create', collection: any) : void
}>();

// Functions

const cancel = () => {
    emit('cancelCreate');
};

const save = () => {
    console.log('CollectionCreate > save, name = ', name.value);

    if(name.value === '' || name.value.includes(' ')) {
        message.value = 'Bad collection name entered : not empty and no space please';
        showMessage.value = true;
    } else emit('create', name.value);
};

</script>