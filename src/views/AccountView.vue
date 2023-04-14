<template>
  <div>
    <h1>Account Page</h1>
    <form @submit.prevent="sendEmail">
      <div class="mt-8 relative flex">
        <div class="flex-none">
          <input required v-model="email" type="text" id="email" v-on:change="resetSending"
          class="w-96 block px-2.5 pb-2.5 pt-4 text-sm text-gray-900 bg-white dark:border-cyan-800 border-cyan-100 dark:bg-gray-800 rounded-lg border-2 appearance-none dark:text-white dark:focus:border-cyan-300 focus:outline-none focus:ring-0 focus:border-cyan-300 peer" placeholder=" " />
          <label for="email" class="absolute rounded-2xl text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 z-10 top-2 origin-[20px] bg-white dark:bg-gray-800 px-2 peer-focus:px-2 peer-focus:text-cyan-400 peer-focus:dark:text-gray-200 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">
            E-mail
          </label>
        </div>
        <div v-if="!invalidEmail()" class="shrink ml-2 px-2.5 pb-2.5 pt-4">
          <i class="fa-solid fa-check"></i>
        </div>
      </div>
      <div v-if="!loading" class="pt-4 mb-4 pb-1">
        <email-button :disabled="invalidEmail()" type="submit" text="Send" class="px-4 fade-out"/>
      </div>
      <div v-if="loading" class="pt-4 mb-4 pb-1">
        <img src="@/assets/three-dots.svg" alt="3 dots" />
      </div>
      <div v-if="emailSent && success">
        <i class="fa-solid fa-check-to-slot">&nbsp;</i>{{ emailMessage }}
      </div>
      <div v-if="emailSent && !success" class="text-orange-400">
        <i class="fa-solid fa-triangle-exclamation">&nbsp;</i>{{ emailMessage }}
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import EmailButton from '@/components/Button/EmailButton.vue';
  import EmailService from '@/services/EmailService';

  //console.log('AccountView.vue');
  const email = ref('');
  const loading = ref(false);
  const emailSent = ref(false);
  const success = ref(false);
  const emailMessage = ref('');

  const invalidEmail = () => {
    let result = false;
    if (!isValidEmail(email.value)) result = true;
    return result;
  }

/* To manage multiple emails
  const invalidEmails = () => {
    var result = false;
    const items = isolateItems(email.value);
    for (let i=0; i < items.length; i++) {
      if (!isValidEmail(items[i])) result = true
    }
    return result;
  }
  const isolateItems = (str: string): string[] => {
    const items = str.split(/[;,]/);
    return items.map(item => item.trim());
  };
*/
  const isValidEmail = (email: string):boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const sendEmail = async () => {
    // TODO hide button
    // Hide Email Send Button
    loading.value = true;
    emailMessage.value = '';
    console.log('AccountView > SendEmail > email : ', email.value);
    const res = await EmailService.sendEmail(email.value)
    console.log('AccountView > SendEmail > res : ', res);
    emailMessage.value = res?.data;
    if (emailMessage.value === 'E-mail sent') success.value = true;
    loading.value = false;
    emailSent.value = true;
  };

  const resetSending = () => {
    emailSent.value = false;
    emailMessage.value = '';
  }
</script>