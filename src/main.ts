import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config';
import App from './App.vue'
import Material from '@primeuix/themes/material';
import { definePreset } from '@primeuix/themes';

const app = createApp(App)

const MyPreset = definePreset(Material, {
  semantic: {
    primary: {
      50: '{purple.50}',
      100: '{purple.100}',
      200: '{purple.200}',
      300: '{purple.300}',
      400: '{purple.400}',
      500: '{purple.500}',
      600: '{purple.600}',
      700: '{purple.700}',
      800: '{purple.800}',
      900: '{purple.900}',
      950: '{purple.950}'
    }
  }
});

app.use(PrimeVue, {
  theme: {
    preset: MyPreset
  }
}).use(createPinia())

app.mount('#app')
