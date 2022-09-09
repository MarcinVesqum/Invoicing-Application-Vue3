import { createRouter, createWebHistory } from "vue-router";
import Home from '../views/Home.vue';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/new-invocie',
        name: 'NewInvoice',
        component: () => import('../views/NewInvoice.vue')
    },
    {
        path: '/invoice/:invoiceId',
        name: 'Invoice',
        component: () => import('../views/InvoiceView.vue')
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/Login.vue')
    }
]


const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;