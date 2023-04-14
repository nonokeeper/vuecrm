<template>
    <button type="button" class="bg-gray-300 rounded-xl text-gray-800 dark:text-gray-100 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-700 p-2">
        <i class="fa-solid fa-ban">&nbsp;</i>{{ text || "Cancel" }}
    </button>
</template>
<script setup lang="ts">
    import { ref } from "vue";
    const props = defineProps({ text: String });
</script>