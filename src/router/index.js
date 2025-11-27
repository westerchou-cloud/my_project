import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import PrefixList from '../views/PrefixList.vue'
import AdminRoleList from '../views/AdminRoleList.vue'
import AdminAccountList from '../views/AdminAccountList.vue'
import BankList from '../views/BankList.vue'
import Login from '../views/Login.vue'

const routes = [
    {
        path: '/login',
        name: 'login',
        component: Login,
        meta: { title: 'Login' }
    },
    {
        path: '/',
        redirect: '/dashboard'
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: Dashboard,
        meta: { title: 'Dashboard', parent: 'Home', requiresAuth: true }
    },
    {
        path: '/prefix-list',
        name: 'prefix-list',
        component: PrefixList,
        meta: { title: 'Prefix List', parent: 'Admin Management', requiresAuth: true }
    },
    {
        path: '/admin-role-list',
        name: 'admin-role-list',
        component: AdminRoleList,
        meta: { title: 'Admin Role List', parent: 'Admin Management', requiresAuth: true }
    },
    {
        path: '/admin-account-list',
        name: 'admin-account-list',
        component: AdminAccountList,
        meta: { title: 'Admin Account List', parent: 'Admin Management', requiresAuth: true }
    },
    {
        path: '/user-account-list',
        name: 'user-account-list',
        component: () => import('../views/UserAccountList.vue'),
        meta: { title: 'User Account List', parent: 'User Management' }
    },
    {
        path: '/transaction-history',
        name: 'transaction-history',
        component: () => import('../views/TransactionList.vue'),
        meta: { title: 'Transaction Records', parent: 'Transaction Management' }
    },
    {
        path: '/deposit-list',
        name: 'deposit-list',
        component: () => import('../views/DepositList.vue'),
        meta: { title: 'Deposit List', parent: 'Order Management' }
    },
    {
        path: '/configuration',
        name: 'configuration',
        component: () => import('../views/Configuration.vue'),
        meta: { title: 'Configuration', parent: 'System Management' }
    },
    {
        path: '/account-settings',
        name: 'account-settings',
        component: () => import('../views/AccountSettings.vue'),
        meta: { title: 'Account Settings', parent: 'Settings' }
    },
    {
        path: '/bank-list',
        name: 'bank-list',
        component: BankList,
        meta: { title: 'Bank List', parent: 'User Management', requiresAuth: true }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/login');
    } else if (to.path === '/login' && isAuthenticated) {
        next('/dashboard');
    } else {
        next();
    }
});

export default router
