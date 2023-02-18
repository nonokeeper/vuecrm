<script setup lang="ts">
  import router from "./router";
  import userRouter from "./router/users.routes";
  import { computed, ref } from "vue";
  import AppLink from "./components/Nav/AppLink.vue";
  import { useUserStore } from "@/store/user";

  const menu = router.options.routes;
  const userMenu = userRouter.options.routes;
  const menuOpened = ref(false);
  const userStore = useUserStore();

  // Functions

  const toggleMenu = () => {
    menuOpened.value = !menuOpened.value;
  };

  const toggleDarkMode = () => {
    const checkbox = document.querySelector("#toggle") as HTMLInputElement;
    const html = document.querySelector("html") as HTMLHtmlElement;
    if (!checkbox) return null;
    if (checkbox.checked) {
      html?.classList.add("dark");
    } else {
      html?.classList.remove("dark");
    }
  };
  
  // Computed
  const isConnected = computed( () => userStore.user?true:false);

</script>

<template>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
    integrity="sha512-9usAa10IRO0HhonpyAIVpjrylPvoDwiPUiKdWk5t3PyolY1cOd4DSE0Ga+ri4AuTroPR5aQvXU9xC6qOPnzFeg=="
    crossorigin="anonymous" referrerpolicy="no-referrer"/>
  <div class="border-b-2 border-gray-900 dark:border-gray-100 bg-white dark:bg-cyan-800 flex w-full">
    <div class="mx-4 p-2 min-w-fit">
      <RouterLink to="/">
        <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="25"/>
      </RouterLink>
    </div>
    <div v-if="isConnected" class="mx-4 p-2 hidden md:flex flex-grow">
      <AppLink v-for="(key, index) in menu" v-bind:key="index" class="mx-4"
        inactive-class="text-sky-800 dark:text-sky-200" active-class="text-yellow-600 dark:text-yellow-200"
        :to="key.path">{{ key.name }}
      </AppLink>
    </div>
    <div @click="toggleMenu" class="md:hidden my-2">
      <svg v-if="!menuOpened" viewBox="0 0 100 40" width="20" height="20">
        <g fill="white">
          <rect width="100" height="7"></rect>
          <rect y="30" width="100" height="7"></rect>
          <rect y="60" width="100" height="7"></rect>
        </g>
      </svg>
      <svg v-if="menuOpened" viewBox="0 0 100 40" width="20" height="20">
        <line x1="0" y1="0" x2="150" y2="100" stroke="white" stroke-width="7" />
        <line x1="100" y1="0" x2="-50" y2="100" stroke="white" stroke-width="7" />
      </svg>
    </div>
    <div class="mx-4 p-2 mr-4 inline-flex">
      <div v-if="isConnected" class="min-w-fit">
        <AppLink v-for="(key, index) in userMenu" v-bind:key="index" class="mx-4"
          inactive-class="text-sky-800 dark:text-sky-200" active-class="text-yellow-600 dark:text-yellow-200"
          :to="key.path">{{ key.name }}
        </AppLink>
      </div>
      <div v-if="isConnected" class="ml-4 inline-flex">
        <input checked type="checkbox" @click="toggleDarkMode" id="toggle" class="accent-green-600"/>
        <label for="toggle" class="text-gray-800 dark:text-gray-100">Night/Day</label>
      </div>
    </div>
  </div>
  <div class="m-4">
    <div v-if="menuOpened" class="mb-4 overflow-visible">
      <AppLink v-for="(key, index) in menu" v-bind:key="index" class="mx-4"
        inactive-class="text-sky-800 dark:text-sky-200" active-class="text-yellow-600 dark:text-yellow-200"
        :to="key.path">{{ key.name }}
      </AppLink>
    </div>
    <RouterView />
  </div>
</template>


