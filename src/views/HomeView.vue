<script setup lang="ts">
  import { useUserStore } from "@/store/user";
  import LoginView from '@/components/Login/LoginView.vue';
  const userStore = useUserStore();

  console.log('HomeView, user : ', userStore.user);

</script>

<template>
  <main>
    <LoginView/>
  </main>
</template>
