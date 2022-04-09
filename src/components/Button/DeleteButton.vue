<template>
    <button class="bg-red-300 rounded-xl text-red-900 dark:bg-red-500 dark:text-red-50 hover:bg-red-400 dark:hover:bg-red-600 p-2">
        <i class="fa-regular fa-trash-can">&nbsp;</i>{{ text || "Delete" }}
    </button>
</template>
<script setup lang="ts">
    import { ref } from "vue";
    const props = defineProps({ text: String });

</script>