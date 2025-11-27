<template>
    <div class="min-h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div class="text-center space-y-8 p-12">
            <!-- Logo/Icon -->
            <div class="flex justify-center">
                <div class="w-24 h-24 bg-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/30 transform hover:scale-105 transition-transform">
                    <Shield class="w-14 h-14 text-white" />
                </div>
            </div>

            <!-- Welcome Message -->
            <div class="space-y-4">
                <h1 class="text-5xl font-bold text-slate-800 tracking-tight">
                    WELCOME TO
                </h1>
                <h2 class="text-6xl font-extrabold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                    SmartPay Backoffice
                </h2>
            </div>

            <!-- User Info Card -->
            <div class="mt-12 bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto border border-slate-100">
                <div class="space-y-4">
                    <div class="flex items-center justify-between pb-4 border-b border-slate-100">
                        <span class="text-sm font-medium text-slate-500">Logged in prefix as</span>
                        <span class="text-lg font-bold text-primary">{{ userPrefix }}</span>
                    </div>
                    <p class="text-slate-600 text-sm">
                        Select a menu item from the sidebar to get started.
                    </p>
                </div>
            </div>

            <!-- Quick Stats or Info -->
            <div class="grid grid-cols-3 gap-4 max-w-2xl mx-auto mt-8">
                <div class="bg-white rounded-xl p-6 shadow-md border border-slate-100 hover:shadow-lg transition-shadow">
                    <div class="flex flex-col items-center space-y-2">
                        <Shield class="w-8 h-8 text-primary" />
                        <span class="text-xs text-slate-500 font-medium">Secure</span>
                    </div>
                </div>
                <div class="bg-white rounded-xl p-6 shadow-md border border-slate-100 hover:shadow-lg transition-shadow">
                    <div class="flex flex-col items-center space-y-2">
                        <Zap class="w-8 h-8 text-yellow-500" />
                        <span class="text-xs text-slate-500 font-medium">Fast</span>
                    </div>
                </div>
                <div class="bg-white rounded-xl p-6 shadow-md border border-slate-100 hover:shadow-lg transition-shadow">
                    <div class="flex flex-col items-center space-y-2">
                        <Check class="w-8 h-8 text-green-500" />
                        <span class="text-xs text-slate-500 font-medium">Reliable</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Shield, Zap, Check } from 'lucide-vue-next';

const props = defineProps(['userPrefix']);
</script>
