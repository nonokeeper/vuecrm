<template>
    <button class="bg-yellow-200 rounded-xl text-yellow-900 dark:bg-yellow-500 dark:text-yellow-50 hover:bg-yellow-300 dark:hover:bg-yellow-600 p-2">
        <i class="fa-solid fa-rotate">&nbsp;</i>{{ text || "Refresh" }}
    </button>
</template>
<script setup lang="ts">
    import { ref } from "vue";
    const props = defineProps({ text: String });
</script>