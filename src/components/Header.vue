<template>
    <header class="h-16 bg-white shadow-sm flex items-center justify-between px-8 z-10">
        <div class="flex items-center text-sm text-slate-500">
            <span class="hover:text-primary cursor-pointer">SmartPay Backoffice</span>
            <ChevronRight class="w-4 h-4 mx-2" />
            <span class="hover:text-primary cursor-pointer">{{ parentTitle }}</span>
            <ChevronRight class="w-4 h-4 mx-2" />
            <span class="font-semibold text-slate-800">{{ pageTitle }}</span>
        </div>
        <div class="flex items-center space-x-4">
            <button class="p-2 text-slate-400 hover:text-primary transition-colors">
                <Bell class="w-5 h-5" />
            </button>
            <!-- Account Dropdown -->
            <div class="relative">
                <button @click="toggleDropdown" class="p-2 text-slate-400 hover:text-primary transition-colors">
                    <UserCircle class="w-6 h-6" />
                </button>
                <!-- Dropdown Menu -->
                <div v-if="showDropdown" class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50">
                    <button @click="navigateToSettings" class="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center transition-colors">
                        <Settings class="w-4 h-4 mr-2" />
                        Account Settings
                    </button>
                    <hr class="my-1 border-slate-200">
                    <button @click="handleLogout" class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center transition-colors">
                        <LogOut class="w-4 h-4 mr-2" />
                        Logout
                    </button>
                </div>
            </div>
        </div>
    </header>
</template>

<script setup>
import { ref } from 'vue';
import { ChevronRight, Bell, LogOut, UserCircle, Settings } from 'lucide-vue-next';
import { useRouter } from 'vue-router';

defineProps(['pageTitle', 'parentTitle']);

const router = useRouter();
const showDropdown = ref(false);

const toggleDropdown = () => {
    showDropdown.value = !showDropdown.value;
};

const navigateToSettings = () => {
    showDropdown.value = false;
    router.push({ name: 'account-settings' });
};

const handleLogout = () => {
    console.log('handleLogout called');
    showDropdown.value = false;
    if (window.confirm('Are you sure you want to logout?')) {
        console.log('Logging out...');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userPrefix');
        console.log('localStorage cleared, redirecting to login...');
        router.push('/login');
    }
};

// Close dropdown when clicking outside
if (typeof window !== 'undefined') {
    window.addEventListener('click', (e) => {
        if (!e.target.closest('.relative')) {
            showDropdown.value = false;
        }
    });
}
</script>
