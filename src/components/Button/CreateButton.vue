<template>
    <button class="bg-cyan-200 rounded-xl text-cyan-900 dark:bg-cyan-500 dark:text-cyan-50 hover:bg-cyan-300 dark:hover:bg-cyan-600 p-2 m-1">
        <i class="fa-regular fa-square-plus">&nbsp;</i>{{ text || "Create" }}
    </button>
</template>
<script setup lang="ts">
    import { ref } from "vue";
    const props = defineProps({ text: String });

</script>