<template>
    <div class="space-y-6">
        <!-- SUPERADMIN View: Global Default Configuration -->
        <div v-if="isSuperAdmin" class="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h2 class="text-lg font-bold text-slate-800 mb-4">Global Default Configuration</h2>
            <p class="text-sm text-slate-500 mb-6">These settings will be used as default values for all prefixes.</p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Transaction Matching Time Limit -->
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-2">Transaction Matching Time Limit</label>
                    <div class="flex items-center gap-2">
                        <input 
                            v-model.number="generalConfigForm.transactionMatchingTimeLimit" 
                            @input="validateTimeLimit('transaction', generalConfigForm.transactionMatchingTimeLimit)"
                            type="number" 
                            min="1" 
                            max="9999"
                            :class="['flex-1 border text-slate-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2', 
                                     validationErrors.transactionTime ? 'bg-red-50 border-red-500 focus:ring-red-200 focus:border-red-500' : 'bg-slate-50 border-slate-200 focus:ring-primary/20 focus:border-primary']"
                        >
                        <span class="text-sm text-slate-500">minutes</span>
                    </div>
                    <p v-if="validationErrors.transactionTime" class="mt-1 text-xs text-red-600">{{ validationErrors.transactionTime }}</p>
                </div>

                <!-- Order Matching Time Limit -->
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-2">Order Matching Time Limit</label>
                    <div class="flex items-center gap-2">
                        <input 
                            v-model.number="generalConfigForm.orderMatchingTimeLimit" 
                            @input="validateTimeLimit('order', generalConfigForm.orderMatchingTimeLimit)"
                            type="number" 
                            min="1" 
                            max="9999"
                            :class="['flex-1 border text-slate-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2', 
                                     validationErrors.orderTime ? 'bg-red-50 border-red-500 focus:ring-red-200 focus:border-red-500' : 'bg-slate-50 border-slate-200 focus:ring-primary/20 focus:border-primary']"
                        >
                        <span class="text-sm text-slate-500">minutes</span>
                    </div>
                    <p v-if="validationErrors.orderTime" class="mt-1 text-xs text-red-600">{{ validationErrors.orderTime }}</p>
                </div>
            </div>

            <div class="mt-6 flex justify-end">
                <button 
                    @click="saveGeneralConfig" 
                    :disabled="!hasGeneralChanges || hasValidationErrors"
                    :class="['px-6 py-2 rounded-lg transition-colors font-medium',
                             hasGeneralChanges && !hasValidationErrors ? 'bg-primary text-white hover:bg-primary/90 cursor-pointer' : 'bg-slate-300 text-slate-500 cursor-not-allowed']"
                >
                    Save Changes
                </button>
            </div>
        </div>

        <!-- PREFIX ADMIN View -->
        <template v-if="!isSuperAdmin">
            <!-- Default Configuration (Read-only) -->
            <div class="bg-slate-50 p-6 rounded-xl border border-slate-200">
                <h2 class="text-lg font-bold text-slate-700 mb-4">Default Configuration</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <span class="text-slate-500">Transaction Matching Time Limit:</span>
                        <span class="ml-2 font-medium text-slate-700">{{ generalConfig.transactionMatchingTimeLimit }} minutes</span>
                    </div>
                    <div>
                        <span class="text-slate-500">Order Matching Time Limit:</span>
                        <span class="ml-2 font-medium text-slate-700">{{ generalConfig.orderMatchingTimeLimit }} minutes</span>
                    </div>
                </div>
            </div>

            <!-- Custom Configuration -->
            <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-lg font-bold text-slate-800">Custom Configuration for {{ userPrefix }}</h2>
                    <button @click="resetToDefault" class="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium">
                        Reset to Default
                    </button>
                </div>

                <!-- Email Notification -->
                <div class="mb-6 p-4 bg-slate-50 rounded-lg">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-md font-semibold text-slate-800">Email Notification</h3>
                        <label class="flex items-center cursor-pointer">
                            <div class="relative">
                                <input type="checkbox" v-model="prefixConfig.emailEnabled" class="sr-only">
                                <div :class="['block w-14 h-8 rounded-full transition', prefixConfig.emailEnabled ? 'bg-green-500' : 'bg-slate-300']"></div>
                                <div :class="['dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition', prefixConfig.emailEnabled ? 'transform translate-x-6' : '']"></div>
                            </div>
                            <span :class="['ml-3 text-sm font-medium', prefixConfig.emailEnabled ? 'text-green-700' : 'text-slate-500']">
                                {{ prefixConfig.emailEnabled ? 'Enabled' : 'Disabled' }}
                            </span>
                        </label>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-2">Email Receivers</label>
                        <textarea 
                            v-model="prefixConfig.emailReceivers" 
                            :disabled="!prefixConfig.emailEnabled"
                            rows="4"
                            placeholder="email1@example.com, email2@example.com"
                            :class="['w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2', 
                                     prefixConfig.emailEnabled ? 'bg-white border-slate-200 focus:ring-primary/20 focus:border-primary' : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed']"
                        ></textarea>
                        <div class="mt-2 flex items-center gap-2">
                            <input 
                                type="file" 
                                ref="emailFileInput" 
                                @change="handleEmailFileUpload" 
                                accept=".txt,.csv"
                                :disabled="!prefixConfig.emailEnabled"
                                class="hidden"
                            >
                            <button 
                                @click="$refs.emailFileInput.click()" 
                                :disabled="!prefixConfig.emailEnabled"
                                :class="['px-3 py-1.5 text-xs rounded-lg font-medium transition-colors',
                                         prefixConfig.emailEnabled ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' : 'bg-slate-100 text-slate-400 cursor-not-allowed']"
                            >
                                <Upload class="w-3 h-3 inline mr-1" />
                                Upload File
                            </button>
                            <button 
                                @click="testEmailNotification" 
                                :disabled="!prefixConfig.emailEnabled"
                                :class="['px-3 py-1.5 text-xs rounded-lg font-medium transition-colors',
                                         prefixConfig.emailEnabled ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' : 'bg-slate-100 text-slate-400 cursor-not-allowed']"
                            >
                                Test Notification
                            </button>
                            <span class="text-xs text-slate-500">Supported: .txt, .csv</span>
                        </div>
                    </div>
                </div>

                <!-- Telegram Notification -->
                <div class="mb-6 p-4 bg-slate-50 rounded-lg">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-md font-semibold text-slate-800">Telegram Notification</h3>
                        <label class="flex items-center cursor-pointer">
                            <div class="relative">
                                <input type="checkbox" v-model="prefixConfig.telegramEnabled" class="sr-only">
                                <div :class="['block w-14 h-8 rounded-full transition', prefixConfig.telegramEnabled ? 'bg-green-500' : 'bg-slate-300']"></div>
                                <div :class="['dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition', prefixConfig.telegramEnabled ? 'transform translate-x-6' : '']"></div>
                            </div>
                            <span :class="['ml-3 text-sm font-medium', prefixConfig.telegramEnabled ? 'text-green-700' : 'text-slate-500']">
                                {{ prefixConfig.telegramEnabled ? 'Enabled' : 'Disabled' }}
                            </span>
                        </label>
                    </div>
                    
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-2">Telegram Bot Token</label>
                            <input 
                                v-model="prefixConfig.telegramToken" 
                                :disabled="!prefixConfig.telegramEnabled"
                                type="text"
                                placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz-1234567890"
                                :class="['w-full border rounded-lg p-3 text-sm font-mono focus:outline-none focus:ring-2', 
                                         prefixConfig.telegramEnabled ? 'bg-white border-slate-200 focus:ring-primary/20 focus:border-primary' : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed']"
                            >
                            <p class="mt-1 text-xs text-slate-500">Get your Bot Token from @BotFather on Telegram</p>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-2">Telegram Target IDs</label>
                            <textarea 
                                v-model="prefixConfig.telegramTarget" 
                                :disabled="!prefixConfig.telegramEnabled"
                                rows="3"
                                placeholder="-100123456789, 987654321"
                                :class="['w-full border rounded-lg p-3 text-sm font-mono focus:outline-none focus:ring-2', 
                                         prefixConfig.telegramEnabled ? 'bg-white border-slate-200 focus:ring-primary/20 focus:border-primary' : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed']"
                            ></textarea>
                            <div class="mt-2 flex items-center gap-2">
                                <input 
                                    type="file" 
                                    ref="telegramFileInput" 
                                    @change="handleTelegramFileUpload" 
                                    accept=".txt,.csv"
                                    :disabled="!prefixConfig.telegramEnabled"
                                    class="hidden"
                                >
                                <button 
                                    @click="$refs.telegramFileInput.click()" 
                                    :disabled="!prefixConfig.telegramEnabled"
                                    :class="['px-3 py-1.5 text-xs rounded-lg font-medium transition-colors',
                                             prefixConfig.telegramEnabled ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' : 'bg-slate-100 text-slate-400 cursor-not-allowed']"
                                >
                                    <Upload class="w-3 h-3 inline mr-1" />
                                    Upload File
                                </button>
                                <button 
                                    @click="testTelegramNotification" 
                                    :disabled="!prefixConfig.telegramEnabled"
                                    :class="['px-3 py-1.5 text-xs rounded-lg font-medium transition-colors',
                                             prefixConfig.telegramEnabled ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' : 'bg-slate-100 text-slate-400 cursor-not-allowed']"
                                >
                                    Test Notification
                                </button>
                            </div>
                            <p class="mt-1 text-xs text-slate-500">Group ID (negative) or User ID (positive), comma-separated</p>
                        </div>
                    </div>
                </div>

                <!-- Matching Time Limits -->
                <div class="mb-6 p-4 bg-slate-50 rounded-lg">
                    <h3 class="text-md font-semibold text-slate-800 mb-4">Matching Time Limits</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-2">Transaction Matching Time Limit</label>
                            <div class="flex items-center gap-2">
                                <input 
                                    v-model.number="prefixConfig.transactionMatchingTimeLimit" 
                                    @input="validateTimeLimit('prefixTransaction', prefixConfig.transactionMatchingTimeLimit)"
                                    type="number" 
                                    min="1" 
                                    max="9999"
                                    :class="['flex-1 border text-slate-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2', 
                                             validationErrors.prefixTransactionTime ? 'bg-red-50 border-red-500 focus:ring-red-200 focus:border-red-500' : 'bg-white border-slate-200 focus:ring-primary/20 focus:border-primary']"
                                >
                                <span class="text-sm text-slate-500">minutes</span>
                            </div>
                            <p v-if="validationErrors.prefixTransactionTime" class="mt-1 text-xs text-red-600">{{ validationErrors.prefixTransactionTime }}</p>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-2">Order Matching Time Limit</label>
                            <div class="flex items-center gap-2">
                                <input 
                                    v-model.number="prefixConfig.orderMatchingTimeLimit" 
                                    @input="validateTimeLimit('prefixOrder', prefixConfig.orderMatchingTimeLimit)"
                                    type="number" 
                                    min="1" 
                                    max="9999"
                                    :class="['flex-1 border text-slate-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2', 
                                             validationErrors.prefixOrderTime ? 'bg-red-50 border-red-500 focus:ring-red-200 focus:border-red-500' : 'bg-white border-slate-200 focus:ring-primary/20 focus:border-primary']"
                                >
                                <span class="text-sm text-slate-500">minutes</span>
                            </div>
                            <p v-if="validationErrors.prefixOrderTime" class="mt-1 text-xs text-red-600">{{ validationErrors.prefixOrderTime }}</p>
                        </div>
                    </div>
                </div>

                <!-- Save Button -->
                <div class="flex justify-end">
                    <button 
                        @click="savePrefixConfig" 
                        :disabled="!hasPrefixChanges || hasValidationErrors"
                        :class="['px-6 py-2 rounded-lg transition-colors font-medium',
                                 hasPrefixChanges && !hasValidationErrors ? 'bg-primary text-white hover:bg-primary/90 cursor-pointer' : 'bg-slate-300 text-slate-500 cursor-not-allowed']"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { Upload } from 'lucide-vue-next';
import { useRoute } from 'vue-router';

const props = defineProps(['globalState', 'isSuperAdmin', 'userPrefix']);
const route = useRoute();

// Validation errors
const validationErrors = reactive({
    transactionTime: '',
    orderTime: '',
    prefixTransactionTime: '',
    prefixOrderTime: ''
});

// Get GENERAL configuration
const generalConfig = computed(() => {
    return props.globalState.configurations?.find(c => c.prefix === 'GENERAL') || {
        transactionMatchingTimeLimit: 60,
        orderMatchingTimeLimit: 60
    };
});

// SUPERADMIN form (for change tracking)
const generalConfigForm = reactive({
    transactionMatchingTimeLimit: 60,
    orderMatchingTimeLimit: 60
});

// Get or create PREFIX configuration
const prefixConfig = reactive({
    emailEnabled: false,
    emailReceivers: '',
    telegramEnabled: false,
    telegramToken: '',
    telegramTarget: '',
    transactionMatchingTimeLimit: 60,
    orderMatchingTimeLimit: 60
});

// Store original PREFIX config for change tracking
const originalPrefixConfig = reactive({});

// Function to load configuration data
const loadConfigData = () => {
    // Clear validation errors
    validationErrors.transactionTime = '';
    validationErrors.orderTime = '';
    validationErrors.prefixTransactionTime = '';
    validationErrors.prefixOrderTime = '';

    if (props.isSuperAdmin) {
        // Always reload from globalState to discard unsaved changes
        generalConfigForm.transactionMatchingTimeLimit = generalConfig.value.transactionMatchingTimeLimit;
        generalConfigForm.orderMatchingTimeLimit = generalConfig.value.orderMatchingTimeLimit;
    } else {
        // Always reload from globalState to discard unsaved changes
        const existing = props.globalState.configurations?.find(c => c.prefix === props.userPrefix);
        if (existing) {
            // Deep copy to avoid reference issues
            const configCopy = JSON.parse(JSON.stringify(existing));
            Object.keys(prefixConfig).forEach(key => {
                prefixConfig[key] = configCopy[key];
            });
        } else {
            // Use GENERAL defaults
            prefixConfig.emailEnabled = false;
            prefixConfig.emailReceivers = '';
            prefixConfig.telegramEnabled = false;
            prefixConfig.telegramToken = '';
            prefixConfig.telegramTarget = '';
            prefixConfig.transactionMatchingTimeLimit = generalConfig.value.transactionMatchingTimeLimit;
            prefixConfig.orderMatchingTimeLimit = generalConfig.value.orderMatchingTimeLimit;
        }
        // Store original values for change tracking (deep copy)
        const originalCopy = JSON.parse(JSON.stringify(prefixConfig));
        Object.keys(originalPrefixConfig).forEach(key => delete originalPrefixConfig[key]);
        Object.assign(originalPrefixConfig, originalCopy);
    }
};

// Initialize forms on mount
onMounted(() => {
    loadConfigData();
});

// Watch route changes to reload data
watch(() => route.path, (newPath) => {
    if (newPath === '/configuration') {
        loadConfigData();
    }
});

// Track changes for SUPERADMIN
const hasGeneralChanges = computed(() => {
    if (!props.isSuperAdmin) return false;
    return generalConfigForm.transactionMatchingTimeLimit !== generalConfig.value.transactionMatchingTimeLimit ||
           generalConfigForm.orderMatchingTimeLimit !== generalConfig.value.orderMatchingTimeLimit;
});

// Track changes for PREFIX ADMIN
const hasPrefixChanges = computed(() => {
    if (props.isSuperAdmin) return false;
    return JSON.stringify(prefixConfig) !== JSON.stringify(originalPrefixConfig);
});

// Check if there are any validation errors
const hasValidationErrors = computed(() => {
    return Object.values(validationErrors).some(error => error !== '');
});

// Validate time limit
const validateTimeLimit = (field, value) => {
    const errorField = field === 'transaction' ? 'transactionTime' :
                       field === 'order' ? 'orderTime' :
                       field === 'prefixTransaction' ? 'prefixTransactionTime' : 'prefixOrderTime';
    
    if (!value || value < 1 || value > 9999 || !Number.isInteger(value)) {
        validationErrors[errorField] = 'Please enter a valid integer between 1 and 9999.';
    } else {
        validationErrors[errorField] = '';
    }
};

// Save GENERAL configuration
const saveGeneralConfig = () => {
    const config = props.globalState.configurations.find(c => c.prefix === 'GENERAL');
    if (config) {
        config.transactionMatchingTimeLimit = generalConfigForm.transactionMatchingTimeLimit;
        config.orderMatchingTimeLimit = generalConfigForm.orderMatchingTimeLimit;
        config.updatedBy = props.userPrefix || 'admin';
        config.updatedTime = new Date().toISOString().replace('T', ' ').split('.')[0];
    }
    alert('Global configuration saved successfully!');
};

// Save PREFIX configuration
const savePrefixConfig = () => {
    const index = props.globalState.configurations.findIndex(c => c.prefix === props.userPrefix);
    const now = new Date().toISOString().replace('T', ' ').split('.')[0];
    
    const configData = {
        id: index !== -1 ? props.globalState.configurations[index].id : Date.now(),
        prefix: props.userPrefix,
        ...prefixConfig,
        updatedBy: props.userPrefix,
        updatedTime: now
    };

    if (index !== -1) {
        props.globalState.configurations[index] = configData;
    } else {
        props.globalState.configurations.push(configData);
    }

    // Update original config
    Object.assign(originalPrefixConfig, prefixConfig);
    
    alert('Configuration saved successfully!');
};

// Reset to Default
const resetToDefault = () => {
    if (confirm('Are you sure you want to reset to default configuration? All custom settings will be lost.')) {
        const index = props.globalState.configurations.findIndex(c => c.prefix === props.userPrefix);
        if (index !== -1) {
            props.globalState.configurations.splice(index, 1);
        }
        
        // Reset to GENERAL defaults
        prefixConfig.emailEnabled = false;
        prefixConfig.emailReceivers = '';
        prefixConfig.telegramEnabled = false;
        prefixConfig.telegramToken = '';
        prefixConfig.telegramTarget = '';
        prefixConfig.transactionMatchingTimeLimit = generalConfig.value.transactionMatchingTimeLimit;
        prefixConfig.orderMatchingTimeLimit = generalConfig.value.orderMatchingTimeLimit;
        
        // Update original config
        Object.assign(originalPrefixConfig, prefixConfig);
        
        alert('Configuration reset to default successfully!');
    }
};

// File Upload Handlers
const handleEmailFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const content = e.target.result;
        const emails = content.split(/[\n,]/).map(email => email.trim()).filter(email => email);
        prefixConfig.emailReceivers = emails.join(', ');
    };
    reader.readAsText(file);
};

const handleTelegramFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const content = e.target.result;
        const ids = content.split(/[\n,]/).map(id => id.trim()).filter(id => id);
        prefixConfig.telegramTarget = ids.join(', ');
    };
    reader.readAsText(file);
};

// Test Email Notification
const testEmailNotification = () => {
    if (!prefixConfig.emailReceivers) {
        alert('Please configure Email Receivers first.');
        return;
    }
    alert(`Test email would be sent to:\n${prefixConfig.emailReceivers}`);
};

// Test Telegram Notification
const testTelegramNotification = () => {
    if (!prefixConfig.telegramToken || !prefixConfig.telegramTarget) {
        alert('Please configure both Telegram Token and Target IDs first.');
        return;
    }
    alert(`Test message would be sent to:\nToken: ${prefixConfig.telegramToken}\nTargets: ${prefixConfig.telegramTarget}`);
};
</script>

<style scoped>
.dot {
    transition: transform 0.3s ease;
}
</style>
