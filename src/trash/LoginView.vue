<template>
  <div v-if="!userStore.user">
    <section class="h-full gradient-form bg-gray-200 dark:bg-gray-800">
      <div class="container py-12 px-6 h-full">
        <div class="flex justify-center items-center flex-wrap h-full g-6 dark:text-gray-200 text-gray-800">
          <div class="xl:w-10/12">
            <div v-if="!userStore.user" class="block dark:bg-cyan-800 bg-cyan-100 shadow-lg rounded-lg">
              <div class="lg:flex lg:flex-wrap g-0">
                <div class="lg:w-6/12 px-4 md:px-0">
                  <div class="md:p-12 md:mx-6">
                    <div class="text-center">
                      <img class="mx-auto w-24 logo" alt="Vue logo" src="@/assets/logo.svg" width="25"/>
                      <h4 class="text-xl font-semibold mt-1 mb-12 pb-1">Login Page</h4>
                    </div>
                    <form @submit.prevent="login">
                      <div class="relative">
                          <input v-model="username" type="text" id="name"
                          class="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-white dark:border-cyan-800 border-cyan-100 dark:bg-gray-800 rounded-lg border-2 appearance-none dark:text-white dark:focus:border-cyan-300 focus:outline-none focus:ring-0 focus:border-cyan-300 peer" placeholder=" " />
                          <label for="name" class="absolute rounded-2xl text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-800 px-2 peer-focus:px-2 peer-focus:text-cyan-400 peer-focus:dark:text-gray-200 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">
                            Username
                          </label>
                      </div>
                      <div class="relative mt-4">
                          <input v-model="password" type="password" id="label"
                          class="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-white dark:border-cyan-800 border-cyan-100 dark:bg-gray-800 rounded-lg border-2 appearance-none dark:text-white dark:focus:border-cyan-300 focus:outline-none focus:ring-0 focus:border-cyan-300 peer" placeholder=" " />
                          <label for="label" class="absolute rounded-2xl text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-800 px-2 peer-focus:px-2 peer-focus:text-cyan-400 peer-focus:dark:text-gray-200 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">
                            Password
                          </label>
                      </div>
                      <div class="text-center pt-1 mb-12 pb-1">
                        <login-button type="submit" text="Login" class="px-4" @click="login"/>
                      </div>
                    </form>
                    <div class="flex items-center justify-between pb-6">
                      <a class="dark:text-gray-200 text-gray-800" href="#!">Forgot password?</a>
                    </div>
                  </div>
                </div>
                <div class="lg:w-6/12 flex items-center lg:rounded-r-lg rounded-b-lg lg:rounded-bl-none"
                  style="background: linear-gradient(to right, #155e75, #0891b2,  #155e75);">
                  <div class="dark:text-white text-gray-800 px-4 py-6 md:p-12 md:mx-6">
                    <h4 class="text-xl font-semibold mb-6">We are more than just a company</h4>
                    <p class="text-sm">
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                      quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                      consequat.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
  <div v-if="userStore.user">
    Welcome {{ userStore.user.firstName }}!
    <div class="text-center pt-1 mb-12 pb-1">
      <login-button type="submit" text="Logout" class="px-4" @click="logout"/>
    </div>
  </div>
</template>
  
<script setup lang="ts">
    import LoginButton from "@/components/Button/LoginButton.vue";
    import { ref } from "vue";
    import { useUserStore } from "@/store/user";
    import { useRouter } from 'vue-router'

    console.log('LoginView.vue');

    const userStore = useUserStore();
    const router = useRouter();

    const username = ref('');
    const password = ref('');
    const connected = ref(false);

    const login = async() => {
      const state = await userStore.login(username.value, password.value);
      console.log('LoginView user logged in : ', state);
      connected.value = true;
      router.push('/');
    };
    const logout = () => {
      userStore.logout();
      console.log('LoginView user logged out');
      connected.value = false;
      router.push('/');
    };
  </script>