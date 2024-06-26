import { defineStore } from "pinia";
import { ref } from "vue";

export const useApiEndpointStore = defineStore("api-endpoint", () => {
  const apiEndpoint = ref("http://localhost:8000/api");
  return {
    apiEndpoint,
  };
});
