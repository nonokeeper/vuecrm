<template>
    <button class="bg-sky-200 rounded-xl text-sky-900 dark:bg-sky-500 dark:text-sky-50 hover:bg-sky-300 dark:hover:bg-sky-600 p-2 m-1">
        <i class="fa-regular fa-floppy-disk">&nbsp;</i>{{ text || "Save" }}
    </button>
</template>
<script setup lang="ts">
import { ref } from 'vue';
const props = defineProps({ text: String });

</script>