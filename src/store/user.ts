import { defineStore } from "pinia";
import { ref } from "vue";

const baseURL = import.meta.env.VITE_BASEURL;

// Interfaces
interface userInterface {
    "_id": string,
    "firstName": string,
    "lastName": string,
    "username": string,
    "email": string,
    "group": string,
    "roles": object,
    "accessToken": string,
    "refreshToken": string,
    "errorMessage": string
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
        })
        const user:userInterface = await res.json();

        //console.log('store/user.ts > res.status : ', res.status);

        if (res.status == 200) {
          this.user = user;
        }
        //console.log('store/user.ts > user : ', user)
        return user
      },
      async logout() { 
        this.$reset();
      },
    }
});
