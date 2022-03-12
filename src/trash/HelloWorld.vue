<script setup lang="ts">
  import { ref, onMounted } from 'vue'

  //const dark = ref(true)
  const toggleDarkMode = () => {
    const checkbox = document.querySelector("#toggle") as HTMLInputElement;
    //console.log('checkbox : ', checkbox);
    const html = document.querySelector("html") as HTMLHtmlElement;
    //console.log('html : ', html);
    if (!checkbox) return null;
    if (checkbox.checked) {
      html?.classList.add("dark")
      //console.log('toggle add')
    } else {
      html?.classList.remove("dark")
      //console.log('toggle remove')
    }
  }
  
  defineProps<{
    msg: string;
  }>()

</script>

<template>
  <div class="greetings">
    <h1 class="text-sky-800 dark:text-sky-300">{{ msg }}</h1>
    
    <input checked type="checkbox" @click="toggleDarkMode" id="toggle" class="accent-green-600"/>
    <label for="toggle" class="text-gray-800 dark:text-gray-100 p-2">Night/Day</label>

    <h3>
      You’ve successfully created a project with
      <a target="_blank" href="https://vitejs.dev/">Vite</a> +
      <a target="_blank" href="https://vuejs.org/">Vue 3</a>. What's next?
    </h3>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
