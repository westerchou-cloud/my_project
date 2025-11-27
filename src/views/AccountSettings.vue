<template>
    <div class="space-y-6">
        <!-- Change Password Section -->
        <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h2 class="text-lg font-bold text-slate-800 mb-4">Change Password</h2>
            
            <div class="space-y-4 max-w-md">
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-2">Current Password</label>
                    <input 
                        v-model="passwordForm.currentPassword" 
                        type="password"
                        class="w-full bg-slate-50 border border-slate-200 text-slate-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                </div>

                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-2">New Password</label>
                    <input 
                        v-model="passwordForm.newPassword" 
                        type="password"
                        class="w-full bg-slate-50 border border-slate-200 text-slate-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                    <p class="mt-1 text-xs text-slate-500">Password must be at least 8 characters</p>
                </div>

                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-2">Confirm New Password</label>
                    <input 
                        v-model="passwordForm.confirmPassword" 
                        type="password"
                        :class="['w-full border text-slate-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2',
                                 passwordMismatch ? 'bg-red-50 border-red-500 focus:ring-red-200' : 'bg-slate-50 border-slate-200 focus:ring-primary/20 focus:border-primary']"
                    >
                    <p v-if="passwordMismatch" class="mt-1 text-xs text-red-600">Passwords do not match</p>
                </div>

                <button 
                    @click="changePassword" 
                    :disabled="!canChangePassword"
                    :class="['px-6 py-2 rounded-lg transition-colors font-medium',
                             canChangePassword ? 'bg-primary text-white hover:bg-primary/90 cursor-pointer' : 'bg-slate-300 text-slate-500 cursor-not-allowed']"
                >
                    Change Password
                </button>
            </div>
        </div>

        <!-- Language Settings Section -->
        <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h2 class="text-lg font-bold text-slate-800 mb-4">Language Settings</h2>
            
            <div class="space-y-3 max-w-md">
                <label class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
                       :class="language === 'en' ? 'border-primary bg-primary/5' : 'border-slate-200'">
                    <input 
                        type="radio" 
                        v-model="language" 
                        value="en"
                        class="w-4 h-4 text-primary border-slate-300 focus:ring-primary"
                    >
                    <span class="ml-3 text-sm font-medium text-slate-700">English</span>
                </label>

                <label class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
                       :class="language === 'zh-TW' ? 'border-primary bg-primary/5' : 'border-slate-200'">
                    <input 
                        type="radio" 
                        v-model="language" 
                        value="zh-TW"
                        class="w-4 h-4 text-primary border-slate-300 focus:ring-primary"
                    >
                    <span class="ml-3 text-sm font-medium text-slate-700">繁體中文</span>
                </label>

                <button 
                    @click="saveLanguage" 
                    :disabled="!languageChanged"
                    :class="['px-6 py-2 rounded-lg transition-colors font-medium',
                             languageChanged ? 'bg-primary text-white hover:bg-primary/90 cursor-pointer' : 'bg-slate-300 text-slate-500 cursor-not-allowed']"
                >
                    Save Language
                </button>
            </div>
        </div>

        <!-- Logout Section -->
        <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h2 class="text-lg font-bold text-slate-800 mb-4">Account Actions</h2>
            
            <button 
                @click="handleLogout" 
                class="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center"
            >
                <LogOut class="w-4 h-4 mr-2" />
                Logout
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { LogOut } from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const props = defineProps(['globalState']);
const router = useRouter();

// Password form
const passwordForm = ref({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
});

// Language setting
const language = ref('en');
const originalLanguage = ref('en');

// Load language from globalState
onMounted(() => {
    if (props.globalState.userSettings?.language) {
        language.value = props.globalState.userSettings.language;
        originalLanguage.value = props.globalState.userSettings.language;
    }
});

// Computed properties
const passwordMismatch = computed(() => {
    return passwordForm.value.confirmPassword && 
           passwordForm.value.newPassword !== passwordForm.value.confirmPassword;
});

const canChangePassword = computed(() => {
    return passwordForm.value.currentPassword &&
           passwordForm.value.newPassword &&
           passwordForm.value.newPassword.length >= 8 &&
           passwordForm.value.confirmPassword &&
           !passwordMismatch.value;
});

const languageChanged = computed(() => {
    return language.value !== originalLanguage.value;
});

// Methods
const changePassword = () => {
    // In a real app, this would call an API
    // For demo purposes, we'll just simulate success
    alert('Password changed successfully!');
    
    // Reset form
    passwordForm.value.currentPassword = '';
    passwordForm.value.newPassword = '';
    passwordForm.value.confirmPassword = '';
};

const saveLanguage = () => {
    // Save to globalState
    if (!props.globalState.userSettings) {
        props.globalState.userSettings = {};
    }
    props.globalState.userSettings.language = language.value;
    originalLanguage.value = language.value;
    
    alert(`Language changed to ${language.value === 'en' ? 'English' : '繁體中文'}`);
};

const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userPrefix');
        router.push('/login');
    }
};
</script>
