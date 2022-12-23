<script setup lang="ts">
  import TheWelcome from '@/components/TheWelcome.vue'
  import { useUserStore } from "@/store/user";

  const userStore = useUserStore();

  console.log('HomeView, user : ', userStore.user);

</script>

<template>
  <main>
    <TheWelcome />
    User : {{ userStore.user }}<br/>
  </main>
</template>
