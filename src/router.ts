import { createRouter, createWebHistory } from 'vue-router';
import Home from "./components/Home.vue";
import Tdk from './components/Tdk.vue';
import JsonLd from './components/JsonLd.vue';

const routes = [
    {
        path: '/',
        name: 'home',
        component: Home,
    },
    {
        path: '/tdk',
        name: 'tdk',
        component: Tdk,
    },
    {
        path: '/json',
        name: 'json',
        component: JsonLd,
    },

]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router;