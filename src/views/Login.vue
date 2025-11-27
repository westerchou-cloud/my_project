<template>
    <div class="min-h-screen bg-slate-50 flex flex-col">
        <!-- Header Bar -->
        <div class="h-16 bg-[#3b5998] w-full flex items-center px-8 shadow-md">
            <h1 class="text-white text-lg font-bold">SmartPay Backoffice</h1>
        </div>

        <!-- Main Content -->
        <div class="flex-1 flex flex-col items-center justify-center p-4">
            <div class="mb-8 flex items-center gap-2">
                <Shield class="w-6 h-6 text-slate-800" />
                <h2 class="text-xl font-bold text-slate-800">Welcome to SmartPay Backoffice</h2>
            </div>

            <div class="bg-white rounded-xl shadow-xl p-8 w-full max-w-[500px] border border-slate-100 relative overflow-hidden">
                <div class="space-y-6">
                    <!-- Prefix Code -->
                    <div class="space-y-1.5">
                        <label class="block text-sm font-bold text-slate-700">Prefix Code</label>
                        <input v-model="form.prefix" type="text" placeholder="Enter Prefix Code" 
                            class="w-full bg-white border border-slate-300 rounded px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#3b5998]/20 focus:border-[#3b5998] outline-none transition-all placeholder:text-slate-400">
                    </div>

                    <!-- Account -->
                    <div class="space-y-1.5">
                        <label class="block text-sm font-bold text-slate-700">Account</label>
                        <input v-model="form.account" type="text" placeholder="Enter Account" 
                            class="w-full bg-white border border-slate-300 rounded px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#3b5998]/20 focus:border-[#3b5998] outline-none transition-all placeholder:text-slate-400">
                    </div>

                    <!-- Password -->
                    <div class="space-y-1.5">
                        <label class="block text-sm font-bold text-slate-700">Password</label>
                        <input v-model="form.password" type="password" placeholder="Enter Password" 
                            class="w-full bg-white border border-slate-300 rounded px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#3b5998]/20 focus:border-[#3b5998] outline-none transition-all placeholder:text-slate-400">
                    </div>

                    <!-- Google Authenticator -->
                    <div class="space-y-1.5">
                        <label class="block text-sm font-bold text-slate-700">Google Authenticator</label>
                        <input v-model="form.otp" type="text" placeholder="Enter Google Authenticator Code" 
                            class="w-full bg-white border border-slate-300 rounded px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#3b5998]/20 focus:border-[#3b5998] outline-none transition-all placeholder:text-slate-400">
                    </div>

                    <!-- Login Button -->
                    <button @click="handleLogin" :disabled="!isFormValid"
                        class="w-full bg-[#3b5998] text-white font-bold py-3 rounded shadow-md hover:bg-[#2d4373] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4">
                        Login
                    </button>
                </div>
                
                <!-- Flash Icon Decoration -->
                <div class="absolute bottom-16 right-0 translate-x-1/2 bg-yellow-400 p-1 shadow-sm rotate-12">
                    <Zap class="w-4 h-4 text-white fill-white" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, computed, onActivated } from 'vue';
import { useRouter } from 'vue-router';
import { Shield, Zap } from 'lucide-vue-next';

const router = useRouter();

const form = reactive({
    prefix: '',
    account: '',
    password: '',
    otp: ''
});

// Clear form fields when component is activated (after logout)
// Using onActivated instead of onMounted to work with keep-alive
onActivated(() => {
    form.prefix = '';
    form.account = '';
    form.password = '';
    form.otp = '';
});

const isFormValid = computed(() => {
    return form.prefix && form.account && form.password && form.otp;
});

const handleLogin = () => {
    if (!isFormValid.value) return;
    
    // Simulate Login
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userPrefix', form.prefix.toUpperCase());
    
    router.push('/dashboard');
};
</script>
