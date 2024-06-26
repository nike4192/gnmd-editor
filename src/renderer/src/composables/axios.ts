import axios, { AxiosError } from "axios";
import { storeToRefs } from "pinia";
import { useStorage } from "@vueuse/core/index";
import { ref } from "vue";
import { watch } from "vue-demi";

export const apiEndpoint = useStorage("api-endpoint", "http://localhost:8000/api");
export const apiEndpointStatus = ref<'secondary' | 'success' | 'danger'>('secondary');

const apiEndpointStatusInterval = ref<any>(null);


const axiosInstance = axios.create({
  baseURL: apiEndpoint.value,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  async config => {
    config.baseURL = apiEndpoint.value;
    return config;
  },
  error => Promise.reject(error)
);

async function checkApiEndpointStatus() {
  try {
    axios.all([
      axiosInstance.get('/health'),
      axiosInstance.get('/'),
    ]).then(axios.spread((data1, data2) => {
      // output of req.
      console.log('data1', data1, 'data2', data2)
    }));
    const response = await axiosInstance.get('/health');
    if (response.status === 200) {
      apiEndpointStatus.value = 'success';
    } else {
      apiEndpointStatus.value = 'danger';
    }
  } catch (e) {
    if (e && e instanceof AxiosError) {
      apiEndpointStatus.value = 'danger';
    } else {
      throw e;
    }
  }
}

watch(apiEndpoint, async () => {
  await checkApiEndpointStatus();
}, {
  immediate: true
})

export function useAxios() {

  if (!apiEndpointStatusInterval.value) {
    apiEndpointStatusInterval.value = setInterval(checkApiEndpointStatus, 5000);
  }

  return {
    axiosInstance,
  };
}
