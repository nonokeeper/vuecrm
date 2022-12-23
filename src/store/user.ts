import { defineStore } from "pinia";
import { ref } from "vue";

const baseURL = import.meta.env.VITE_BASEURL;

// Interfaces
interface userInterface {
    "_id": string,
    "firstName": string,
    "lastName": string,
    "username": string,
    "group": string,
    "accessToken": string,
    "refreshToken": string,
    "roles": object
  };

export const useUserStore = defineStore({
    id: 'userPinia',
    state: () => ({
      user: ref<userInterface>()
    }),
    actions: {
      async login(username:string, password:string) {
        const res = await fetch(baseURL+"login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });
        const user:userInterface = await res.json();
        this.user = user;
        return user;
      },
      async logout() { 
        this.$reset();
      },
    }
});
