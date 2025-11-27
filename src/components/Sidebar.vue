<template>
    <aside class="w-64 bg-sidebar text-white flex flex-col flex-shrink-0 transition-all duration-300">
        <div class="h-16 flex items-center justify-center border-b border-slate-700 cursor-pointer hover:bg-slate-800 transition-colors" @click="navigateToDashboard">
            <h1 class="text-xl font-bold tracking-wider">SmartPay<span class="text-primary">Admin</span></h1>
        </div>

        <nav class="flex-1 overflow-y-auto py-4">
            <ul class="space-y-1">
                <li v-for="item in menuItems" :key="item.id">
                    <!-- Parent Menu Item -->
                    <div @click="toggleMenu(item)"
                        :class="['flex items-center px-6 py-3 cursor-pointer hover:bg-slate-700 transition-colors', isParentActive(item) ? 'bg-slate-700 border-l-4 border-primary' : 'border-l-4 border-transparent']">
                        <component :is="getIcon(item.icon)" class="w-5 h-5 mr-3" />
                        <span class="text-sm font-medium flex-1">{{ item.name }}</span>
                        <component v-if="item.children" :is="item.expanded ? ChevronDown : ChevronRight" class="w-4 h-4 opacity-50" />
                    </div>
                    <!-- Submenu Items -->
                    <ul v-if="item.children && item.expanded" class="bg-slate-900 py-1">
                        <li v-for="subItem in item.children" :key="subItem.id">
                            <a href="#" @click.prevent="navigate(subItem.view)"
                                :class="['flex items-center pl-14 pr-6 py-2 text-sm text-slate-400 hover:text-white transition-colors', currentRouteName === subItem.view ? 'text-white font-medium' : '']">
                                {{ subItem.name }}
                            </a>
                        </li>
                    </ul>
                </li>
            </ul>
        </nav>

        <div class="p-4 border-t border-slate-700">
            <div class="flex items-center">
                <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold">SA
                </div>
                <div class="ml-3">
                    <p class="text-sm font-medium">Super Admin</p>
                    <p class="text-xs text-slate-400">Online</p>
                </div>
            </div>
        </div>
    </aside>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ShieldCheck, Users, ArrowLeftRight, ShoppingBag, Settings, ChevronDown, ChevronRight } from 'lucide-vue-next';

const props = defineProps(['menuItems']);
const router = useRouter();
const route = useRoute();

const currentRouteName = computed(() => route.name);

const getIcon = (name) => {
    if (name === 'shield-check') return ShieldCheck;
    if (name === 'users') return Users;
    if (name === 'arrow-left-right') return ArrowLeftRight;
    if (name === 'shopping-bag') return ShoppingBag;
    if (name === 'settings') return Settings;
    return ShieldCheck; // default
};

const isParentActive = (item) => {
    return item.children && item.children.some(child => child.view === currentRouteName.value);
};

const toggleMenu = (item) => {
    item.expanded = !item.expanded;
};

const navigate = (viewName) => {
    router.push({ name: viewName });
};

const navigateToDashboard = () => {
    router.push({ name: 'dashboard' });
};
</script>
