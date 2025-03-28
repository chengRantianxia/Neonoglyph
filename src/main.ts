import { createApp } from "vue";
import { createPinia } from "pinia";
import ElementPlus from "element-plus";
import "./styles/index.scss";
import App from "./App.vue";
import router from "./router";
import i18n from "./i18n";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(ElementPlus);
app.use(i18n);

app.mount("#app");
