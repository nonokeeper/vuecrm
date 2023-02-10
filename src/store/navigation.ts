import { defineStore } from "pinia";
import { ref } from "vue";

export const useNavStore = defineStore({
    id: 'navigationData',
    state: () => ({
      entity: ""
    }),
    getters: {
        getEntity(state) {
            return state.entity;
        },
    },
    actions: {
        setEntity(entity:string) {
            this.entity = entity;
        }
    }
});
