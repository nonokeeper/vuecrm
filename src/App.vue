<template>
  <!--
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" integrity="sha512-iBBXm8fW90+nuLcSKlbmrPcLa0OT92xO1BIsZ+ywDWZCvqsWgccV3gFoRBv0z+8dLJgyAHIhR35VZc2oM/gI1w==" crossorigin="anonymous" referrerpolicy="no-referrer" />
  -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" integrity="sha512-9usAa10IRO0HhonpyAIVpjrylPvoDwiPUiKdWk5t3PyolY1cOd4DSE0Ga+ri4AuTroPR5aQvXU9xC6qOPnzFeg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
  <div class="border-b-2 border-gray-900 dark:border-gray-100 bg-white dark:bg-cyan-800 flex flex-shrink w-full">
    <div class="mx-4 p-2 min-w-fit">
      <RouterLink to="/"><img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="25" /></RouterLink>
    </div>
    <div class="mx-4 p-2">
        <AppLink class="mx-4" inactive-class="text-sky-800 dark:text-sky-200" active-class="text-yellow-600 dark:text-yellow-200" to="/">Home</AppLink>
        <AppLink class="mx-4" inactive-class="text-sky-800 dark:text-sky-200" active-class="text-yellow-600 dark:text-yellow-200" to="/about">About</AppLink>
        <AppLink class="mx-4" inactive-class="text-sky-800 dark:text-sky-200" active-class="text-yellow-600 dark:text-yellow-200" to="/customer">Customers</AppLink>
        <AppLink class="mx-4" inactive-class="text-sky-800 dark:text-sky-200" active-class="text-yellow-600 dark:text-yellow-200" to="/data">Data Explorer</AppLink>
    </div>
    <div class="mx-4 p-2 flex-1 text-right mr-4">
      <input checked type="checkbox" @click="toggleDarkMode" id="toggle" class="accent-green-600"/>
      <label for="toggle" class="text-gray-800 dark:text-gray-100 p-2">Night/Day</label>
    </div>
  </div>
  <div class="m-4">
    <RouterView />
  </div>
  
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import AppLink from '@/components/Nav/AppLink.vue'

const toggleDarkMode = () => {
  const checkbox = document.querySelector("#toggle") as HTMLInputElement;
  const html = document.querySelector("html") as HTMLHtmlElement;
  if (!checkbox) return null;
  if (checkbox.checked) {
    html?.classList.add("dark")
  } else {
    html?.classList.remove("dark")
  }
}
</script>