<template>
    <div class="space-y-6">
        <!-- Action Bar -->
        <div class="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div class="flex items-center gap-4 flex-1">
                    <!-- Brand Filter -->
                    <div class="relative">
                        <select v-model="filters.brand" class="appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-2 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium">
                            <option value="ALL">Brand: All</option>
                            <option v-for="brand in globalState.brands" :key="brand.id" :value="brand.id">{{ brand.name }}</option>
                        </select>
                        <ChevronDown class="absolute right-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                    <!-- Status Filter -->
                    <div class="relative">
                        <select v-model="filters.status" class="appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-2 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium">
                            <option value="ALL">Status: All</option>
                            <option value="ACTIVE">Active</option>
                            <option value="INACTIVE">Inactive</option>
                        </select>
                        <ChevronDown class="absolute right-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                    <!-- Currency Filter -->
                    <div class="relative">
                        <select v-model="filters.currency" class="appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-2 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium">
                            <option value="ALL">Currency: All</option>
                            <option value="THB">THB</option>
                            <option value="CNY">CNY</option>
                            <option value="USD">USD</option>
                        </select>
                        <ChevronDown class="absolute right-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                    <!-- Search -->
                    <div class="relative flex-1 max-w-md">
                        <Search class="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                        <input v-model="filters.search" type="text" placeholder="Search Prefix Code..." class="w-full bg-slate-50 border border-slate-200 text-slate-700 py-2 pl-10 pr-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm">
                    </div>
                </div>
                <button @click="openCreateModal" class="bg-primary hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-md shadow-blue-500/20 flex items-center transition-all transform hover:scale-105 active:scale-95">
                    <Plus class="w-4 h-4 mr-2" /><span class="font-medium text-sm">New Agent</span>
                </button>
            </div>
        </div>

        <!-- Data Table -->
        <div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-slate-50 border-b border-slate-100 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                        <th class="px-6 py-4">Action</th>
                        <th class="px-6 py-4">Brand</th>
                        <th class="px-6 py-4">Prefix Code</th>
                        <th class="px-6 py-4">Status</th>
                        <th class="px-6 py-4">Currency</th>
                        <th class="px-6 py-4">Created By / Time</th>
                        <th class="px-6 py-4">Updated By / Time</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    <tr v-for="agent in filteredAgents" :key="agent.id" class="hover:bg-slate-50 transition-colors">
                        <td class="px-6 py-4">
                            <button @click="openEditModal(agent)" class="text-primary hover:text-blue-700 font-medium text-sm flex items-center"><Edit2 class="w-4 h-4 mr-1" /> EDIT</button>
                        </td>
                        <td class="px-6 py-4">
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded border bg-slate-50 text-slate-600 border-slate-200 text-xs font-medium">
                                {{ globalState.brands.find(b => b.id === agent.brandId)?.name || '-' }}
                            </span>
                        </td>
                        <td class="px-6 py-4 font-medium text-slate-700">{{ agent.prefix }}</td>
                        <td class="px-6 py-4">
                            <span :class="['inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold', agent.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500']">
                                <span :class="['w-2 h-2 rounded-full mr-1.5', agent.status === 'ACTIVE' ? 'bg-green-500' : 'bg-slate-400']"></span>
                                {{ agent.status }}
                            </span>
                        </td>
                        <td class="px-6 py-4 text-slate-600">{{ agent.currency }}</td>
                        <td class="px-6 py-4 text-xs text-slate-500">
                            <div class="font-medium text-slate-700">{{ agent.createdBy }}</div><div>{{ agent.createdTime }}</div>
                        </td>
                        <td class="px-6 py-4 text-xs text-slate-500">
                            <div class="font-medium text-slate-700">{{ agent.updatedBy }}</div><div>{{ agent.updatedTime }}</div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <!-- Pagination -->
            <Pagination 
                :total-items="filteredAgents.length" 
                v-model:current-page="currentPage" 
                :items-per-page="10" 
            />
        </div>

        <!-- Modal -->
        <div v-if="showModal" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click.self="closeModal">
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <!-- Modal Header -->
                <div class="px-8 py-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
                    <div>
                        <h2 class="text-xl font-bold text-slate-800">{{ isEditing ? 'Update Prefix' : 'Create New Prefix' }}</h2>
                        <p class="text-sm text-slate-500 mt-1">Setup a new platform agent</p>
                    </div>
                    <button @click="closeModal" class="text-slate-400 hover:text-slate-600 transition-colors">
                        <X class="w-6 h-6" />
                    </button>
                </div>

                <div class="p-8 space-y-8">
                    <!-- 1. Basic Information -->
                    <div class="space-y-4">
                        <div class="flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-wider">
                            <Info class="w-4 h-4" />
                            <h3>Basic Information</h3>
                        </div>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <!-- Brand -->
                            <div class="space-y-1.5">
                                <label class="block text-sm font-medium text-slate-700">Brand <span class="text-red-500">*</span></label>
                                <div class="relative">
                                    <select v-model="form.brandId" :disabled="isEditing" 
                                        class="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm appearance-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all disabled:bg-slate-50 disabled:text-slate-500">
                                        <option value="" disabled>Select Brand</option>
                                        <option v-for="brand in globalState.brands" :key="brand.id" :value="brand.id">{{ brand.name }}</option>
                                    </select>
                                    <ChevronDown class="absolute right-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                                </div>
                            </div>

                            <!-- Prefix Code -->
                            <div class="space-y-1.5">
                                <label class="block text-sm font-medium text-slate-700">Prefix Code <span class="text-red-500">*</span></label>
                                <input v-model="form.prefix" :disabled="isEditing" type="text" placeholder="e.g. OLE777" 
                                    class="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all disabled:bg-slate-50 disabled:text-slate-500">
                            </div>

                            <!-- Currency -->
                            <div class="space-y-1.5">
                                <label class="block text-sm font-medium text-slate-700">Currency <span class="text-red-500">*</span></label>
                                <div class="relative">
                                    <select v-model="form.currency" :disabled="isEditing" 
                                        class="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm appearance-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all disabled:bg-slate-50 disabled:text-slate-500">
                                        <option value="" disabled>Select Currency</option>
                                        <option value="THB">THB - Thai Baht</option>
                                        <option value="CNY">CNY - Chinese Yuan</option>
                                        <option value="USD">USD - US Dollar</option>
                                    </select>
                                    <ChevronDown class="absolute right-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        <!-- Status Toggle -->
                        <div class="flex items-center gap-3 pt-2">
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" v-model="form.isActive" class="sr-only peer">
                                <div class="w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                                <span class="ml-2 text-sm font-medium" :class="form.isActive ? 'text-green-600' : 'text-slate-400'">{{ form.isActive ? 'Active' : 'Inactive' }}</span>
                            </label>
                        </div>
                    </div>

                    <hr class="border-slate-100">

                    <!-- 2. Security Settings -->
                    <div class="space-y-4">
                        <div class="flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-wider">
                            <Shield class="w-4 h-4" />
                            <h3>Security Settings</h3>
                        </div>

                        <!-- Secret Key -->
                        <div class="space-y-1.5">
                            <label class="block text-sm font-medium text-slate-700">Agent Secret Key <span class="text-xs text-slate-400 font-normal ml-1">(Used for API authentication)</span></label>
                            <div class="flex gap-2">
                                <div class="relative flex-1">
                                    <input :type="showSecret ? 'text' : 'password'" :value="form.secretKey" readonly 
                                        class="w-full bg-slate-50 border border-slate-200 rounded-lg pl-4 pr-10 py-2.5 text-sm text-slate-600 font-mono focus:outline-none">
                                    <button @click="showSecret = !showSecret" class="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600">
                                        <component :is="showSecret ? EyeOff : Eye" class="w-4 h-4" />
                                    </button>
                                </div>
                                <button @click="copySecret" class="p-2.5 text-slate-500 hover:text-primary hover:bg-primary/5 border border-slate-200 rounded-lg transition-colors" title="Copy">
                                    <Copy class="w-4 h-4" />
                                </button>
                                <button @click="regenerateSecret" class="p-2.5 text-slate-500 hover:text-primary hover:bg-primary/5 border border-slate-200 rounded-lg transition-colors" title="Regenerate">
                                    <RefreshCw class="w-4 h-4" />
                                </button>
                            </div>
                        </div>


                    </div>

                    <hr class="border-slate-100">

                    <!-- 3. Integration & Configuration -->
                    <div class="space-y-4">
                        <div class="flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-wider">
                            <Settings class="w-4 h-4" />
                            <h3>Integration & Configuration</h3>
                        </div>

                        <!-- Callback URL -->
                        <div class="space-y-1.5">
                            <label class="block text-sm font-medium text-slate-700">Callback URL</label>
                            <div class="relative">
                                <Link class="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                <input v-model="form.callbackUrl" type="text" placeholder="https://api.platform.com/callback" 
                                    class="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all">
                            </div>
                        </div>

                        <!-- Supported Banks -->
                        <div class="space-y-2">
                            <label class="block text-sm font-medium text-slate-700">Supported Banks</label>
                            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                <label v-for="bank in availableBanksWithStatus" :key="bank.code" 
                                       :class="['flex items-center p-3 border rounded-lg transition-colors', 
                                                bank.disabled ? 'bg-slate-50 border-slate-200 cursor-not-allowed' : 'border-slate-200 cursor-pointer hover:bg-slate-50']">
                                    <input type="checkbox" 
                                           :value="bank.code" 
                                           v-model="form.supportedBanks"
                                           :disabled="bank.disabled"
                                           class="w-4 h-4 text-primary border-slate-300 rounded focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed">
                                    <span :class="['ml-2 text-sm', bank.disabled ? 'text-slate-400' : 'text-slate-600']">
                                        {{ bank.name }}
                                        <span v-if="bank.disabled" class="text-xs text-red-500 ml-1">[DISABLED]</span>
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 rounded-b-2xl">
                    <button @click="closeModal" class="px-5 py-2.5 text-slate-600 hover:text-slate-800 hover:bg-slate-200/50 rounded-lg text-sm font-medium transition-colors">Cancel</button>
                    <button @click="saveAgent" class="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-500/20 text-sm font-medium transition-all transform active:scale-95 flex items-center">
                        <Save class="w-4 h-4 mr-2" /> Save Agent
                    </button>
                </div>
            </div>
        </div>

        <!-- Toast Notification -->
        <div v-if="showToast" class="fixed bottom-8 right-8 bg-slate-800 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 z-[60] animate-fade-in-up">
            <CheckCircle class="w-5 h-5 text-green-400" />
            <span class="font-medium">Copied to clipboard!</span>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { 
    ChevronDown, Search, Plus, Edit2, X, Info, Shield, Eye, EyeOff, 
    Copy, RefreshCw, Settings, Link, Save, CheckCircle, Briefcase 
} from 'lucide-vue-next';
import Pagination from '../components/Pagination.vue';

const props = defineProps(['globalState']);

const filters = reactive({ brand: 'ALL', status: 'ALL', currency: 'ALL', search: '' });
const showModal = ref(false);
const isEditing = ref(false);
const showSecret = ref(false);
const showToast = ref(false);
const currentPage = ref(1);

const form = reactive({
    id: null,
    brandId: '',
    prefix: '',
    currency: '',
    isActive: true,
    secretKey: '',
    callbackUrl: '',
    supportedBanks: []
});

const availableBanks = [
    { code: 'SCB', name: 'SCB (Siam Commercial)', currency: 'THB' },
    { code: 'KBANK', name: 'KBANK (Kasikorn)', currency: 'THB' },
    { code: 'KTB', name: 'KTB (Krungthai)', currency: 'THB' },
    { code: 'BBL', name: 'BBL (Bangkok Bank)', currency: 'THB' },
    { code: 'BAY', name: 'BAY (Krungsri)', currency: 'THB' },
    { code: 'TTB', name: 'TTB (TMBThanachart)', currency: 'THB' },
    { code: 'HSBC', name: 'HSBC', currency: 'HKD' },
    { code: 'BOC', name: 'Bank of China', currency: 'CNY' }
];

// Add status information to banks based on globalState and filter by currency
const availableBanksWithStatus = computed(() => {
    return availableBanks
        .filter(bank => !form.currency || bank.currency === form.currency)
        .map(bank => {
            const bankInGlobalState = props.globalState.banks?.find(b => b.bank_code === bank.code);
            return {
                ...bank,
                disabled: bankInGlobalState?.status === 'INACTIVE'
            };
        });
});

const filteredAgents = computed(() => {
    return props.globalState.agents.filter(a =>
        (filters.brand === 'ALL' || String(a.brandId) === String(filters.brand)) &&
        (filters.status === 'ALL' || a.status === filters.status) &&
        (filters.currency === 'ALL' || a.currency === filters.currency) &&
        a.prefix.toLowerCase().includes(filters.search.toLowerCase())
    ).map(agent => ({
        ...agent,
        configMode: getConfigMode(agent.prefix)
    }));
});

// Calculate CONFIG MODE based on configuration
const getConfigMode = (prefix) => {
    const config = props.globalState.configurations?.find(c => c.prefix === prefix);
    if (!config) return 'DEFAULT';
    
    const general = props.globalState.configurations?.find(c => c.prefix === 'GENERAL');
    if (!general) return 'DEFAULT';
    
    // Check if any field differs from GENERAL defaults
    const hasCustomEmail = config.emailEnabled !== null || config.emailReceivers !== null;
    const hasCustomTelegram = config.telegramEnabled !== null || config.telegramToken !== null || config.telegramTarget !== null;
    const hasCustomTime = config.transactionMatchingTimeLimit !== general.transactionMatchingTimeLimit || 
                          config.orderMatchingTimeLimit !== general.orderMatchingTimeLimit;
    
    return (hasCustomEmail || hasCustomTelegram || hasCustomTime) ? 'CUSTOM' : 'DEFAULT';
};

const generateSecret = () => 'sk_live_' + Math.random().toString(36).substr(2, 16);

const openCreateModal = () => {
    isEditing.value = false;
    form.id = null;
    form.brandId = '';
    form.prefix = '';
    form.currency = '';
    form.isActive = true;
    form.secretKey = generateSecret();
    form.callbackUrl = '';
    form.supportedBanks = [];
    showModal.value = true;
};

const openEditModal = (agent) => {
    isEditing.value = true;
    Object.assign(form, agent);
    form.isActive = agent.status === 'ACTIVE';
    if (!form.supportedBanks) form.supportedBanks = [];
    showModal.value = true;
};

const closeModal = () => showModal.value = false;

const regenerateSecret = () => {
    if (confirm('Updating the Agent Secret Key will invalidate the old key immediately. Are you sure you want to proceed?')) {
        form.secretKey = generateSecret();
    }
};

const copySecret = () => {
    navigator.clipboard.writeText(form.secretKey);
    showToast.value = true;
    setTimeout(() => showToast.value = false, 3000);
};

const saveAgent = () => {
    // Check for duplicate Prefix (must be globally unique)
    const isDuplicatePrefix = props.globalState.agents.some(a => 
        a.prefix.toLowerCase() === form.prefix.toLowerCase() && a.id !== form.id
    );
    
    if (isDuplicatePrefix) {
        alert('此 Prefix 代碼已存在，請使用不同的名稱。\nThis Prefix code already exists, please use a different name.');
        return;
    }

    // Validation
    if (!form.brandId || !form.prefix || !form.currency) {
        alert('Please fill in the required fields.');
        return;
    }

    if (isEditing.value) {
        const idx = props.globalState.agents.findIndex(a => a.id === form.id);
        if (idx !== -1) {
            const updatedAgent = { ...props.globalState.agents[idx], ...form };
            updatedAgent.status = form.isActive ? 'ACTIVE' : 'INACTIVE';
            updatedAgent.updatedBy = 'admin';
            updatedAgent.updatedTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
            props.globalState.agents[idx] = updatedAgent;
            
            // Synchronize supportedBanks with prefix_banks table
            if (form.supportedBanks) {
                // Remove all existing prefix_banks for this prefix
                props.globalState.prefix_banks = props.globalState.prefix_banks.filter(
                    pb => pb.prefix !== form.prefix
                );
                
                // Add new prefix_banks based on supportedBanks
                form.supportedBanks.forEach(bankCode => {
                    props.globalState.prefix_banks.push({
                        id: Date.now() + Math.random(),
                        prefix: form.prefix,
                        bank_code: bankCode,
                        status: 'ACTIVE'
                    });
                });
            }
        }
    } else {
        // Create New Agent
        const newAgent = {
            id: Date.now(),
            ...form,
            status: form.isActive ? 'ACTIVE' : 'INACTIVE',
            configMode: 'Default',
            createdBy: 'admin',
            createdTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
            updatedBy: '-',
            updatedTime: '-'
        };
        props.globalState.agents.unshift(newAgent);

        // --- AUTO-CREATE SYSTEM ROLE & ACCOUNT ---
        const roleId = Date.now() + 1;
        const newRole = {
            id: roleId,
            prefix: form.prefix,
            name: 'Administrator',
            isSystem: true,
            permissions: ['ALL'],
            status: 'ACTIVE',
            createdBy: 'System',
            createdTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
            updatedBy: '-',
            updatedTime: '-'
        };
        props.globalState.roles.push(newRole);

        const newAccount = {
            id: Date.now() + 2,
            username: `${form.prefix}_admin`,
            roleId: roleId,
            prefix: form.prefix,
            isSystem: true,
            status: 'ACTIVE',
            department: 'IT',
            realName: 'System Admin',
            lastLoginIp: '-',
            createdBy: 'System',
            createdTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
            updatedBy: '-',
            updatedTime: '-'
        };
        props.globalState.accounts.push(newAccount);
        
        // Add prefix_banks for new prefix
        if (form.supportedBanks) {
            form.supportedBanks.forEach(bankCode => {
                props.globalState.prefix_banks.push({
                    id: Date.now() + Math.random(),
                    prefix: form.prefix,
                    bank_code: bankCode,
                    status: 'ACTIVE'
                });
            });
        }
    }
    closeModal();
};
</script>
