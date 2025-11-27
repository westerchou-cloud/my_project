<template>
    <div class="space-y-6">
        <!-- Action Bar -->
        <div class="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div class="flex items-center gap-4 flex-1 flex-wrap">
                    <!-- Brand Filter (SUPERADMIN only) -->
                    <div v-if="isSuperAdmin" class="relative">
                        <select v-model="filters.brand" class="appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-2 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium">
                            <option value="ALL">Brand: All</option>
                            <option v-for="brand in globalState.brands" :key="brand.id" :value="brand.id">{{ brand.name }}</option>
                        </select>
                        <ChevronDown class="absolute right-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                    <!-- Prefix Filter (SUPERADMIN only) -->
                    <div v-if="isSuperAdmin" class="relative">
                        <select v-model="filters.prefix" class="appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-2 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium">
                            <option value="ALL">Prefix: All</option>
                            <option v-for="agent in filteredPrefixes" :key="agent.prefix" :value="agent.prefix">{{ agent.prefix }}</option>
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
                    <!-- Login ID Search -->
                    <div class="relative">
                        <User class="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                        <input v-model="filters.loginId" type="text" placeholder="Login ID" class="bg-slate-50 border border-slate-200 text-slate-700 py-2 pl-10 pr-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm w-40">
                    </div>
                    <!-- Department Search -->
                    <div class="relative">
                        <Briefcase class="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                        <input v-model="filters.department" type="text" placeholder="Department" class="bg-slate-50 border border-slate-200 text-slate-700 py-2 pl-10 pr-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm w-40">
                    </div>
                </div>
                <button @click="openCreateModal" class="bg-primary hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-md shadow-blue-500/20 flex items-center transition-all transform hover:scale-105 active:scale-95">
                    <Plus class="w-4 h-4 mr-2" /><span class="font-medium text-sm">New Device Account</span>
                </button>
            </div>
        </div>

        <!-- Data Table -->
        <div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-slate-50 border-b border-slate-100 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                        <th class="px-6 py-4">Action</th>
                        <th v-if="isSuperAdmin" class="px-6 py-4">Prefix</th>
                        <th class="px-6 py-4">Login ID</th>
                        <th class="px-6 py-4">Device Name / Description</th>
                        <th class="px-6 py-4">Department</th>
                        <th class="px-6 py-4">Status</th>
                        <th class="px-6 py-4">Created By / Time</th>
                        <th class="px-6 py-4">Updated By / Time</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    <tr v-for="account in filteredAccounts" :key="account.id" class="hover:bg-slate-50 transition-colors">
                        <td class="px-6 py-4">
                            <div class="flex gap-3">
                                <button @click="openEditModal(account)" class="text-primary hover:text-blue-700 font-medium text-sm flex items-center"><Edit2 class="w-4 h-4 mr-1" /> EDIT</button>
                                <button @click="deleteAccount(account)" class="text-danger hover:text-red-700 font-medium text-sm flex items-center"><Trash2 class="w-4 h-4 mr-1" /> DEL</button>
                            </div>
                        </td>
                        <td v-if="isSuperAdmin" class="px-6 py-4 font-medium text-slate-700">{{ account.prefix }}</td>
                        <td class="px-6 py-4 text-slate-700">{{ account.username }}</td>
                        <td class="px-6 py-4 text-slate-600">{{ account.description || '-' }}</td>
                        <td class="px-6 py-4 text-slate-600">{{ account.department || '-' }}</td>
                        <td class="px-6 py-4">
                            <span :class="['inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold', account.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500']">
                                <span :class="['w-2 h-2 rounded-full mr-1.5', account.status === 'ACTIVE' ? 'bg-green-500' : 'bg-slate-400']"></span>
                                {{ account.status }}
                            </span>
                        </td>
                        <td class="px-6 py-4 text-xs text-slate-500">
                            <div class="font-medium text-slate-700">{{ account.createdBy }}</div><div>{{ account.createdTime }}</div>
                        </td>
                        <td class="px-6 py-4 text-xs text-slate-500">
                            <div class="font-medium text-slate-700">{{ account.updatedBy }}</div><div>{{ account.updatedTime }}</div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <!-- Pagination -->
            <Pagination 
                :total-items="filteredAccounts.length" 
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
                        <h2 class="text-xl font-bold text-slate-800">{{ isEditing ? 'Update Device Account' : 'Create New Device Account' }}</h2>
                        <p class="text-sm text-slate-500 mt-1">Manage device login credentials</p>
                    </div>
                    <button @click="closeModal" class="text-slate-400 hover:text-slate-600 transition-colors">
                        <X class="w-6 h-6" />
                    </button>
                </div>

                <div class="p-8 space-y-6">
                    <!-- Brand & Prefix (Super Admin Only) -->
                    <div v-if="isSuperAdmin" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Brand Selection -->
                        <div class="space-y-1.5">
                            <label class="block text-sm font-medium text-slate-700">Brand <span class="text-red-500">*</span></label>
                            <div class="relative">
                                <select v-model="form.brandId" :disabled="isEditing" class="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm appearance-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all disabled:bg-slate-50 disabled:text-slate-500">
                                    <option value="" disabled>Select Brand</option>
                                    <option v-for="brand in globalState.brands" :key="brand.id" :value="brand.id">{{ brand.name }}</option>
                                </select>
                                <ChevronDown class="absolute right-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                            </div>
                        </div>
                        <!-- Prefix Selection -->
                        <div class="space-y-1.5">
                            <label class="block text-sm font-medium text-slate-700">Prefix <span class="text-red-500">*</span></label>
                            <div class="relative">
                                <select v-model="form.prefix" :disabled="isEditing" class="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm appearance-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all disabled:bg-slate-50 disabled:text-slate-500">
                                    <option value="" disabled>Select Prefix</option>
                                    <option v-for="agent in filteredPrefixesForForm" :key="agent.prefix" :value="agent.prefix">{{ agent.prefix }}</option>
                                </select>
                                <ChevronDown class="absolute right-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                    <!-- Brand & Prefix Display (Prefix Admin - Read Only) -->
                    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-1.5">
                            <label class="block text-sm font-medium text-slate-700">Brand</label>
                            <input type="text" :value="userBrandName" disabled class="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-500 cursor-not-allowed">
                        </div>
                        <div class="space-y-1.5">
                            <label class="block text-sm font-medium text-slate-700">Prefix</label>
                            <input type="text" :value="userPrefix" disabled class="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-500 cursor-not-allowed">
                        </div>
                    </div>

                    <!-- Login ID -->
                    <div class="space-y-1.5">
                        <label class="block text-sm font-medium text-slate-700">Login ID <span class="text-red-500">*</span></label>
                        <div class="relative">
                            <User class="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                            <input 
                                v-model="form.username" 
                                :disabled="isEditing"
                                type="text" 
                                placeholder="3-50 characters (Chinese, numbers, symbols)" 
                                :class="['w-full border rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 outline-none transition-all',
                                         isEditing ? 'bg-slate-50 text-slate-500 cursor-not-allowed' : '',
                                         validationErrors.username ? 'bg-red-50 border-red-500 focus:ring-red-200' : 'bg-white border-slate-200 focus:ring-primary/20 focus:border-primary']"
                            >
                        </div>
                        <p v-if="validationErrors.username" class="text-xs text-red-600">{{ validationErrors.username }}</p>
                    </div>

                    <!-- Device Name / Description -->
                    <div class="space-y-1.5">
                        <label class="block text-sm font-medium text-slate-700">Device Name / Description</label>
                        <div class="relative">
                            <Monitor class="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                            <input v-model="form.description" type="text" placeholder="e.g. ATM - Central Station" 
                                class="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all">
                        </div>
                    </div>

                    <!-- Secret Key -->
                    <div class="space-y-1.5">
                        <label class="block text-sm font-medium text-slate-700">Secret Key <span class="text-xs text-slate-400 font-normal ml-1">(Used for device authentication)</span></label>
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

                    <!-- Status Toggle -->
                    <div class="flex items-center justify-between pt-2">
                        <label class="block text-sm font-medium text-slate-700">Status</label>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" v-model="form.isActive" class="sr-only peer">
                            <div class="w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                            <span class="ml-2 text-sm font-medium" :class="form.isActive ? 'text-green-600' : 'text-slate-400'">{{ form.isActive ? 'Active' : 'Inactive' }}</span>
                        </label>
                    </div>
                </div>

                <!-- Footer -->
                <div class="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 rounded-b-2xl">
                    <button @click="closeModal" class="px-5 py-2.5 text-slate-600 hover:text-slate-800 hover:bg-slate-200/50 rounded-lg text-sm font-medium transition-colors">Cancel</button>
                    <button @click="saveAccount" class="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-500/20 text-sm font-medium transition-all transform active:scale-95 flex items-center">
                        <Save class="w-4 h-4 mr-2" /> Save Device Account
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
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { 
    ChevronDown, User, Plus, Edit2, Trash2, X, Save, Check, 
    Monitor, Eye, EyeOff, Copy, RefreshCw, CheckCircle, Briefcase 
} from 'lucide-vue-next';
import Pagination from '../components/Pagination.vue';

const props = defineProps(['globalState', 'isSuperAdmin', 'userPrefix']);

const filters = reactive({ brand: 'ALL', prefix: 'ALL', status: 'ALL', loginId: '', department: '' });
const showModal = ref(false);
const isEditing = ref(false);
const showSecret = ref(false);
const showToast = ref(false);
const currentPage = ref(1);

const form = reactive({
    id: null,
    brandId: '',
    prefix: '',
    username: '',
    description: '',
    secretKey: '',
    isActive: true
});

// Validation errors
const validationErrors = reactive({
    username: ''
});

// Validation functions
const validateLoginId = (value) => {
    if (!value || value.length < 3 || value.length > 50) {
        return 'Login ID must be 3-50 characters';
    }
    return '';
};

// Cascading Filter: Filter Prefixes based on selected Brand
const filteredPrefixes = computed(() => {
    if (filters.brand === 'ALL') {
        return props.globalState.agents;
    }
    return props.globalState.agents.filter(agent => String(agent.brandId) === String(filters.brand));
});

// Reset Prefix when Brand changes
watch(() => filters.brand, () => {
    filters.prefix = 'ALL';
});

// Filter accounts based on user role and filters
// Reset Prefix when Brand changes
watch(() => form.brandId, () => {
    form.prefix = '';
});

// Cascading Filter for Form: Filter Prefixes based on selected Brand in form
const filteredPrefixesForForm = computed(() => {
    if (!props.isSuperAdmin) {
        // Prefix Admin: only show their own prefix
        return props.globalState.agents.filter(a => a.prefix === props.userPrefix);
    }
    if (!form.brandId) {
        return props.globalState.agents;
    }
    return props.globalState.agents.filter(agent => String(agent.brandId) === String(form.brandId));
});

// Computed property for Prefix Admin's Brand name
const userBrandName = computed(() => {
    if (props.isSuperAdmin) return '';
    const userAgent = props.globalState.agents.find(a => a.prefix === props.userPrefix);
    if (!userAgent) return '';
    const brand = props.globalState.brands.find(b => String(b.id) === String(userAgent.brandId));
    return brand ? brand.name : '';
});

const filteredAccounts = computed(() => {
    let accounts = props.globalState.user_accounts || [];

    // Filter by Role (Super Admin sees all, Prefix Admin sees own)
    if (!props.isSuperAdmin) {
        accounts = accounts.filter(acc => acc.prefix === props.userPrefix);
    }

    // Apply UI Filters
    return accounts.filter(acc => {
        // Brand Filter Logic
        let matchBrand = true;
        if (props.isSuperAdmin && filters.brand !== 'ALL') {
            const agent = props.globalState.agents.find(a => a.prefix === acc.prefix);
            matchBrand = agent && String(agent.brandId) === String(filters.brand);
        }

        const matchPrefix = filters.prefix === 'ALL' || acc.prefix === filters.prefix;
        const matchStatus = filters.status === 'ALL' || acc.status === filters.status;
        const matchLoginId = !filters.loginId || acc.username.toLowerCase().includes(filters.loginId.toLowerCase());
        const matchDept = !filters.department || (acc.department && acc.department.toLowerCase().includes(filters.department.toLowerCase()));

        return matchBrand && matchPrefix && matchStatus && matchLoginId && matchDept;
    });
});

const generateSecret = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 16; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

const openCreateModal = () => {
    isEditing.value = false;
    showErrors.value = false;
    form.id = null;
    form.brandId = '';
    form.prefix = props.isSuperAdmin ? '' : props.userPrefix;
    form.username = '';
    form.description = '';
    form.secretKey = generateSecret();
    form.isActive = true;
    
    // For Prefix Admin, auto-fill brandId
    if (!props.isSuperAdmin) {
        const userAgent = props.globalState.agents.find(a => a.prefix === props.userPrefix);
        if (userAgent) {
            form.brandId = userAgent.brandId;
        }
    }
    
    showModal.value = true;
};

const openEditModal = (account) => {
    isEditing.value = true;
    showErrors.value = false;
    form.id = account.id;
    form.prefix = account.prefix;
    form.username = account.username;
    form.description = account.description;
    form.secretKey = account.secretKey;
    form.isActive = account.status === 'ACTIVE';
    
    // Set brandId from the account's prefix
    const accountAgent = props.globalState.agents.find(a => a.prefix === account.prefix);
    if (accountAgent) {
        form.brandId = accountAgent.brandId;
    }
    
    showModal.value = true;
};

const closeModal = () => showModal.value = false;

const regenerateSecret = () => {
    if (confirm('Regenerating the secret key will invalidate the old one immediately. Are you sure?')) {
        form.secretKey = generateSecret();
    }
};

const copySecret = () => {
    navigator.clipboard.writeText(form.secretKey);
    showToast.value = true;
    setTimeout(() => showToast.value = false, 3000);
};

const showErrors = ref(false);

const saveAccount = () => {
    // Clear previous errors
    validationErrors.username = '';
    showErrors.value = true;
    
    // Validation
    if (!form.brandId || !form.prefix || !form.username) {
        alert('Please fill in all required fields (Brand, Prefix, and Login ID).');
        return;
    }
    
    // Validate Login ID
    const usernameError = validateLoginId(form.username);
    if (usernameError) {
        validationErrors.username = usernameError;
        alert('Please fix the validation errors before saving.');
        return;
    }

    // Duplicate Check (Same Prefix cannot have same Login ID)
    const duplicate = props.globalState.user_accounts?.find(acc => 
        acc.prefix === form.prefix && 
        acc.username.toLowerCase() === form.username.toLowerCase() && 
        acc.id !== form.id
    );

    if (duplicate) {
        validationErrors.username = `Login ID "${form.username}" already exists in prefix ${form.prefix}`;
        alert(`Login ID "${form.username}" already exists in prefix ${form.prefix}.`);
        return;
    }

    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const currentUser = props.isSuperAdmin ? 'Super Admin' : props.userPrefix + ' Admin';

    if (isEditing.value) {
        const idx = props.globalState.user_accounts.findIndex(a => a.id === form.id);
        if (idx !== -1) {
            Object.assign(props.globalState.user_accounts[idx], {
                username: form.username,
                description: form.description,
                secretKey: form.secretKey,
                status: form.isActive ? 'ACTIVE' : 'INACTIVE',
                updatedBy: currentUser,
                updatedTime: timestamp
            });
        }
    } else {
        if (!props.globalState.user_accounts) props.globalState.user_accounts = [];
        props.globalState.user_accounts.push({
            id: Date.now(),
            prefix: form.prefix,
            username: form.username,
            description: form.description,
            secretKey: form.secretKey,
            status: form.isActive ? 'ACTIVE' : 'INACTIVE',
            lastLoginIp: '-',
            createdBy: currentUser,
            createdTime: timestamp,
            updatedBy: '-',
            updatedTime: '-'
        });
    }
    closeModal();
};

const deleteAccount = (account) => {
    if (confirm(`Are you sure you want to delete account "${account.username}"?`)) {
        const idx = props.globalState.user_accounts.findIndex(a => a.id === account.id);
        if (idx !== -1) {
            props.globalState.user_accounts.splice(idx, 1);
        }
    }
};
</script>
