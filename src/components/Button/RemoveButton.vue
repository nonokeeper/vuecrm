<template>
    <button class="bg-orange-200 rounded-xl text-orange-900 dark:bg-orange-500 dark:text-orange-50 hover:bg-orange-300 dark:hover:bg-orange-600 p-2 m-1">
        <i class="fa-regular fa-square-minus">&nbsp;</i>{{ text || "Remove" }}
    </button>
</template>
<script setup lang="ts">
    import { ref } from "vue";
    const props = defineProps({ text: String });

</script>