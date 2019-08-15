import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import vuetify from './plugins/vuetify';


import Routes from './routes'


Vue.use(VueRouter);


const router = new VueRouter({
  routes: Routes,
  mode: 'history'
});

Vue.config.productionTip = false

new Vue({
  vuetify,
  render: h => h(App),
  router: router
}).$mount('#app')
