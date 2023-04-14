<template>
    <button type="button" class="disabled:opacity-50 bg-gray-300 rounded-xl text-gray-800 dark:text-green-100 dark:bg-green-600 hover:bg-green-400 dark:hover:bg-green-700 p-2">
        <i class="fa-regular fa-at">&nbsp;</i>{{ text || "Send E-mail" }}
    </button>
</template>
<script setup lang="ts">
    const props = defineProps({ text: String });
</script>