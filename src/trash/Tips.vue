<template>
<!-- Button with animated spin -->
  <button class="inline-flex ml-8 mr-2 bg-yellow-600 text-white rounded-lg shadow-lg px-2 py-2 hover:bg-yellow-700">
      <svg class="animate-spin mr-2 h-auto w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-100" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Loading...
  </button>

<!-- Global Search -->
  <div class="relative m-4">
    <span class="absolute inset-y-0 left-3 flex items-center pl-2">
      <svg fill="none" stroke="#BBBBBB" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" class="w-6 h-6"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
    </span>
    <input v-model="search" placeholder="Global search" type="text" class="border border-gray-300 ml-4 px-8 py-1 rounded-xl focus:placeholder-transparent dark:focus:placeholder-transparent dark:placeholder-gray-400 placeholder-gray-400 bg-white dark:bg-cyan-800 text-gray-800 dark:text-gray-100"/>
    <span @click="search=''" class="absolute inset-y-0 left-60 flex items-center">
      <i class="text-gray-400 dark:text-gray-300 fa-regular fa-circle-xmark"></i>
    </span>
  </div>

</template>
<script setup lang="ts">
const search = ''
</script>