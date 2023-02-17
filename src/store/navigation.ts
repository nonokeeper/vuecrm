import { defineStore } from "pinia";
import { ref } from "vue";

// Interfaces
interface navInterface {
    "entity": string,
};

export const useNavStore = defineStore({
    id: 'navigationData',
    state: () => ({
      entity: ref<String>()
    }),
    getters: {
        getEntity(state) {
            return state.entity;
        },
    },
    actions: {
        setEntity(entity:string) {
            this.entity = entity;
        },
        async reset() { 
            this.entity = undefined;
        }
    }
});
