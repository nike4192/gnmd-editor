import { createApp } from "vue";
import { createPinia } from "pinia";
import PrimeVue from "primevue/config";
import ToastService from 'primevue/toastservice';
import FocusTrap from 'primevue/focustrap';
import router from "./router";
import App from "./App.vue";

import "primeicons/primeicons.css";
import "primevue/resources/themes/aura-dark-green/theme.css";
import 'primeflex/primeflex.css';




const pinia = createPinia();
const app = createApp(App);


app.use(pinia);
app.use(router);
app.use(ToastService);
app.use(PrimeVue);

app.directive('focustrap', FocusTrap);

app.mount("#app");
