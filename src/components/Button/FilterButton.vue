<template>
    <button class="bg-green-200 rounded-xl text-green-900 dark:bg-green-500 dark:text-green-50 hover:bg-green-300 dark:hover:bg-green-600 p-2">
        <i class="fas fa-filter">&nbsp;</i>{{ text || "Filter" }}
    </button>
</template>
<script setup lang="ts">
    //import { ref } from "vue";
    const props = defineProps({ text: String });
</script>