<template>
  <main>
    <div class="inline-block space-x-6 mb-4">
      <span v-if="list">{{ nbCollections }} {{labelCollection}}</span>
      <refresh-button v-if="list" :text="refreshText" @click="refresh"/>
      <create-button v-if="list" text="Create collection" @click="openCreate" />
      <add-button v-if="list && !filter" text="Add Filter" @click="addFilter"/>
      <remove-button v-if="list && filter" text="Remove Filter" @click="removeFilter"/>
    </div>
    <div v-if="filter" class="grid grid-cols-2">
      <div class="relative">
        <input v-model="search" placeholder="Collection search" type="text" class="mx-2 border border-gray-300 px-4 py-1 rounded-xl focus:placeholder-transparent dark:focus:placeholder-transparent dark:placeholder-gray-400 placeholder-gray-400 bg-white dark:bg-cyan-800 text-gray-800 dark:text-gray-100"/>
        <reset-button class="-translate-x-8 absolute mt-1" @click="clearSearch"/>
      </div>
      <div>
        <filter-button class="-translate-x-4" @click="searchCollections(search)"/>
      </div>
    </div>
    <div>
      <collection-list v-if="list" title="Collection List" :collections="fcollections" @edit="editCollection" @delete="deleteCollection"/>
      <collection-edit v-if="edit" @cancelEdit="cancelEdit" @save="saveCollection" :collection="collectionName"/>
      <collection-create v-if="create" @cancelCreate="cancelCreate" @create="createCollection"/>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, computed } from 'vue';
import CollectionService from '@/services/CollectionService';
import CreateButton from '@/components/Button/CreateButton.vue';
import CollectionList from '@/components/Collection/CollectionList.vue';
import CollectionEdit from '@/components/Collection/CollectionEdit.vue';
import CollectionCreate from '@/components/Collection/CollectionCreate.vue';
import FilterButton from '@/components/Button/FilterButton.vue';
import RefreshButton from '@/components/Button/RefreshButton.vue';
import AddButton from '../components/Button/AddButton.vue';
import RemoveButton from '../components/Button/RemoveButton.vue';
import ResetButton from '@/components/Button/ResetButton.vue';

// Variables
const collectionName = ref('');
const search = ref('');
const collections = ref([]);
const fcollections = ref([]);
const loaded = ref(false);
const filter = ref(false);
const list = ref(true);
const edit = ref(false);
const create = ref(false);
const refreshText = ref('Refresh');

console.log('CollectionView.vue');

// Data recovered before displaying results in Template
onBeforeMount( async () => {
  loaded.value = false;
  fcollections.value = await CollectionService.findCollections();
  loaded.value = true;
})

const refresh = async () => {
  refreshText.value = 'Loading...'
  loaded.value = false;
  fcollections.value = await CollectionService.findCollections();
  search.value = 'X'; // only to reload filteredCustomers
  search.value = ''; // only to reload filteredCustomers (value changed here from 'X' to '')
  loaded.value = true;
  refreshText.value = 'Refresh';
};

const openCreate = () => {
  create.value = true;
  edit.value = false;
  list.value = false;
};

const cancelEdit = () => {
  edit.value = false;
  list.value = true;
};

const cancelCreate = () => {
  create.value = false;
  edit.value = false;
  list.value = true;
};

const saveCollection = async (collection:string, field:string, label:string) => {
  console.log('saveCollection, name = '+collection+', field = '+field+', new label = '+label);
  edit.value = false
  const res = await CollectionService.majCollection(collection, field, label);
  //console.log('save Res : ', res);
  editCollection(collection);
};

const addFilter = () => {
  filter.value = true;
};

const removeFilter = () => {
  searchCollections('');
  search.value = '';
  filter.value = false;
};

const clearSearch = () => {
  searchCollections('');
  search.value = '';
};

const editCollection = (name:string) => {
  //console.log('editCollection, name = '+name);
  list.value = false;
  edit.value = true;
  collectionName.value = name;
}

const createCollection = async (name:string) => {
  //console.log('createCollection, name = '+name);
  list.value = true;
  edit.value = true;
  //collectionName.value = name;
  const res = await CollectionService.createCollection(name);
  console.log('createCollection res : ',res);
}

const deleteCollection = async (name:string) => {
  const res = await CollectionService.deleteCollection(name);
  console.log(res);
  collections.value = await CollectionService.findCollections();
};

const searchCollections = async (name:string) => {
  loaded.value = false;
  fcollections.value = await CollectionService.findCollections(name);
  loaded.value = true;
};

// Computed variables

const nbCollections = computed(() => fcollections.value.length);

const labelCollection = computed(() => (nbCollections.value>1)? 'Collections' : 'Collection');

</script>
