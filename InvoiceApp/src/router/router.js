import { createRouter, createWebHistory } from "vue-router";
import Home from '../views/Home.vue';
import { auth } from '../firebase/init.js'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/new-invocie',
        name: 'NewInvoice',
        component: () => import('../views/NewInvoice.vue'),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/invoice/:invoiceId',
        name: 'Invoice',
        component: () => import('../views/InvoiceView.vue'),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/auth/Login.vue')
    },
    {
        path: '/register',
        name: 'RegisterStaff',
        component: () => import('../views/auth/Register.vue')
    }
]


const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    if (to.path === '/login' && auth.currentUser) {
        next('/')
        return;
    } 
    if (to.matched.some(record => record.meta.requiresAuth) && !auth.currentUser) {
        next('/login');
        return;
    }

    next()
})

export default router;