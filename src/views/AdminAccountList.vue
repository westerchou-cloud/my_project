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
                    <!-- Role Filter -->
                    <div class="relative">
                        <select v-model="filters.role" class="appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-2 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium">
                            <option value="ALL">Role: All</option>
                            <option v-for="role in uniqueRoles" :key="role" :value="role">{{ role }}</option>
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
                    <!-- Login IP Search -->
                    <div class="relative">
                        <Globe class="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                        <input v-model="filters.loginIp" type="text" placeholder="Login IP" class="bg-slate-50 border border-slate-200 text-slate-700 py-2 pl-10 pr-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm w-40">
                    </div>
                </div>
                <button @click="openCreateModal" class="bg-primary hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-md shadow-blue-500/20 flex items-center transition-all transform hover:scale-105 active:scale-95">
                    <Plus class="w-4 h-4 mr-2" /><span class="font-medium text-sm">New Account</span>
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
                        <th class="px-6 py-4">Prefix Admin</th>
                        <th class="px-6 py-4">Login ID</th>
                        <th class="px-6 py-4">Role</th>
                        <th class="px-6 py-4">Status</th>
                        <th class="px-6 py-4">Department</th>
                        <th class="px-6 py-4">Real Name</th>
                        <th class="px-6 py-4">Last Login IP</th>
                        <th class="px-6 py-4">Created By / Time</th>
                        <th class="px-6 py-4">Updated By / Time</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    <tr v-for="account in filteredAccounts" :key="account.id" class="hover:bg-slate-50 transition-colors">
                        <td class="px-6 py-4">
                            <div v-if="!account.isSystem" class="flex gap-3">
                                <button @click="openEditModal(account)" class="text-primary hover:text-blue-700 font-medium text-sm flex items-center"><Edit2 class="w-4 h-4 mr-1" /> EDIT</button>
                                <button @click="deleteAccount(account)" class="text-danger hover:text-red-700 font-medium text-sm flex items-center"><Trash2 class="w-4 h-4 mr-1" /> DEL</button>
                            </div>
                            <span v-else class="text-slate-400 text-xs italic">System Protected</span>
                        </td>
                        <td v-if="isSuperAdmin" class="px-6 py-4 font-medium text-slate-700">{{ account.prefix }}</td>
                        <td class="px-6 py-4">
                            <Check v-if="account.isSystem" class="w-5 h-5 text-green-500" />
                        </td>
                        <td class="px-6 py-4 text-slate-700">{{ account.username }}</td>
                        <td class="px-6 py-4 text-slate-600">{{ getRoleName(account.roleId) }}</td>
                        <td class="px-6 py-4">
                            <span :class="['inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold', account.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500']">
                                <span :class="['w-2 h-2 rounded-full mr-1.5', account.status === 'ACTIVE' ? 'bg-green-500' : 'bg-slate-400']"></span>
                                {{ account.status }}
                            </span>
                        </td>
                        <td class="px-6 py-4 text-slate-600">{{ account.department }}</td>
                        <td class="px-6 py-4 text-slate-600">{{ account.realName }}</td>
                        <td class="px-6 py-4 text-slate-500 text-xs font-mono">{{ account.lastLoginIp }}</td>
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
                        <h2 class="text-xl font-bold text-slate-800">{{ isEditing ? 'Update Account' : 'Create New Account' }}</h2>
                        <p class="text-sm text-slate-500 mt-1">Manage admin account details</p>
                    </div>
                    <button @click="closeModal" class="text-slate-400 hover:text-slate-600 transition-colors">
                        <X class="w-6 h-6" />
                    </button>
                </div>

                <div class="p-8 space-y-6">
                    <!-- Prefix & Role & Status -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Brand Selection (Super Admin) -->
                        <div v-if="isSuperAdmin" class="space-y-1.5">
                            <label class="block text-sm font-medium text-slate-700">Brand <span class="text-red-500">*</span></label>
                            <div class="relative">
                                <select v-model="form.brandId" :disabled="isEditing" :class="['w-full bg-white border rounded-lg px-4 py-2.5 text-sm appearance-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all disabled:bg-slate-50 disabled:text-slate-500', showErrors && !form.brandId ? 'border-red-300' : 'border-slate-200']">
                                    <option value="" disabled>Select Brand</option>
                                    <option v-for="brand in globalState.brands" :key="brand.id" :value="brand.id">{{ brand.name }}</option>
                                </select>
                                <ChevronDown class="absolute right-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                            </div>
                        </div>

                        <!-- Prefix Selection (Super Admin) -->
                        <div v-if="isSuperAdmin" class="space-y-1.5">
                            <label class="block text-sm font-medium text-slate-700">Prefix <span class="text-red-500">*</span></label>
                            <div class="relative">
                                <select v-model="form.prefix" :disabled="isEditing" :class="['w-full bg-white border rounded-lg px-4 py-2.5 text-sm appearance-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all disabled:bg-slate-50 disabled:text-slate-500', showErrors && !form.prefix ? 'border-red-300' : 'border-slate-200']">
                                    <option value="" disabled>Select Prefix</option>
                                    <option v-for="agent in filteredPrefixesForForm" :key="agent.prefix" :value="agent.prefix">{{ agent.prefix }}</option>
                                </select>
                                <ChevronDown class="absolute right-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                            </div>
                        </div>

                        <!-- Brand & Prefix Display (Prefix Admin) -->
                        <template v-else>
                            <div class="space-y-1.5">
                                <label class="block text-sm font-medium text-slate-700">Brand</label>
                                <input type="text" :value="userBrandName" disabled class="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-500 cursor-not-allowed">
                            </div>
                            <div class="space-y-1.5">
                                <label class="block text-sm font-medium text-slate-700">Prefix</label>
                                <input type="text" :value="userPrefix" disabled class="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-500 cursor-not-allowed">
                            </div>
                        </template>
                        <div class="space-y-1.5" :class="{ 'md:col-span-2': !isSuperAdmin }">
                            <div class="flex items-center justify-between">
                                <label class="block text-sm font-medium text-slate-700">Role <span class="text-red-500">*</span></label>
                                <label class="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" v-model="form.isActive" class="sr-only peer">
                                    <div class="w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                                    <span class="ml-2 text-sm font-medium" :class="form.isActive ? 'text-green-600' : 'text-slate-400'">{{ form.isActive ? 'Active' : 'Inactive' }}</span>
                                </label>
                            </div>
                            <div class="relative">
                                <select v-model="form.roleId" :class="['w-full bg-white border rounded-lg px-4 py-2.5 text-sm appearance-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all', showErrors && !form.roleId ? 'border-red-300' : 'border-slate-200']">
                                    <option value="" disabled>Select Role</option>
                                    <option v-for="role in availableRoles" :key="role.id" :value="role.id">{{ role.name }}</option>
                                </select>
                                <ChevronDown class="absolute right-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    <!-- Login ID & Password -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-1.5">
                            <label class="block text-sm font-medium text-slate-700">Login ID <span class="text-red-500">*</span></label>
                            <input 
                                v-model="form.username" 
                                :disabled="isEditing"
                                type="text" 
                                placeholder="3-50 characters (Chinese, numbers, symbols)" 
                                :class="['w-full border rounded-lg px-4 py-2.5 text-sm focus:ring-2 outline-none transition-all', 
                                         isEditing ? 'bg-slate-50 text-slate-500 cursor-not-allowed' : '',
                                         validationErrors.username ? 'bg-red-50 border-red-500 focus:ring-red-200' : 'bg-white border-slate-200 focus:ring-primary/20 focus:border-primary']"
                            >
                            <p v-if="validationErrors.username" class="text-xs text-red-600">{{ validationErrors.username }}</p>
                        </div>
                        <div class="space-y-1.5">
                            <label class="block text-sm font-medium text-slate-700">Password {{ isEditing ? '(leave blank to keep current)' : '' }} <span v-if="!isEditing" class="text-red-500">*</span></label>
                            <input v-model="form.password" type="password" placeholder="Enter password" :class="['w-full bg-white border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all', showErrors && !isEditing && !form.password ? 'border-red-300' : 'border-slate-200']">
                        </div>
                    </div>

                    <!-- Department & Real Name -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-1.5">
                            <label class="block text-sm font-medium text-slate-700">Department <span class="text-red-500">*</span></label>
                            <input 
                                v-model="form.department" 
                                type="text" 
                                placeholder="1-50 characters (Chinese, numbers, symbols)" 
                                :class="['w-full border rounded-lg px-4 py-2.5 text-sm focus:ring-2 outline-none transition-all', 
                                         validationErrors.department ? 'bg-red-50 border-red-500 focus:ring-red-200' : 'bg-white border-slate-200 focus:ring-primary/20 focus:border-primary']"
                            >
                            <p v-if="validationErrors.department" class="text-xs text-red-600">{{ validationErrors.department }}</p>
                        </div>
                        <div class="space-y-1.5">
                            <label class="block text-sm font-medium text-slate-700">Real Name <span class="text-red-500">*</span></label>
                            <input 
                                v-model="form.realName" 
                                type="text" 
                                placeholder="1-50 characters (Chinese, numbers, symbols)" 
                                :class="['w-full border rounded-lg px-4 py-2.5 text-sm focus:ring-2 outline-none transition-all', 
                                         validationErrors.realName ? 'bg-red-50 border-red-500 focus:ring-red-200' : 'bg-white border-slate-200 focus:ring-primary/20 focus:border-primary']"
                            >
                            <p v-if="validationErrors.realName" class="text-xs text-red-600">{{ validationErrors.realName }}</p>
                        </div>
                    </div>


                </div>

                <!-- Footer -->
                <div class="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 rounded-b-2xl">
                    <button @click="closeModal" class="px-5 py-2.5 text-slate-600 hover:text-slate-800 hover:bg-slate-200/50 rounded-lg text-sm font-medium transition-colors">Cancel</button>
                    <button @click="saveAccount" class="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-500/20 text-sm font-medium transition-all transform active:scale-95 flex items-center">
                        <Save class="w-4 h-4 mr-2" /> Save Account
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, watch, nextTick, onMounted } from 'vue';
import { ChevronDown, User, Briefcase, Globe, Plus, Edit2, Trash2, Save, X, Check } from 'lucide-vue-next';
import Pagination from '../components/Pagination.vue';

const props = defineProps(['globalState', 'isSuperAdmin', 'userPrefix']);

const filters = reactive({ brand: 'ALL', prefix: 'ALL', role: 'ALL', status: 'ALL', loginId: '', department: '', loginIp: '' });
const showModal = ref(false);
const isEditing = ref(false);
const showErrors = ref(false);
const currentPage = ref(1);

const form = reactive({
    id: null,
    brandId: '',
    prefix: '',
    username: '',
    password: '',
    roleId: '',
    isActive: true,
    department: '',
    realName: ''
});

// Validation errors
const validationErrors = reactive({
    username: '',
    department: '',
    realName: ''
});

// Validation functions
const validateLoginId = (value) => {
    if (!value || value.length < 3 || value.length > 50) {
        return 'Login ID must be 3-50 characters';
    }
    return '';
};

const validateName = (value, fieldName) => {
    if (!value || value.length < 1 || value.length > 50) {
        return `${fieldName} must be 1-50 characters`;
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

// Reset Prefix in form when Brand changes
watch(() => form.brandId, () => {
    form.prefix = '';
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
    return props.globalState.accounts.filter(a => {
        // PREFIX Admin can only see their own prefix's accounts
        if (!props.isSuperAdmin && a.prefix !== props.userPrefix) {
            return false;
        }
        
        // Apply user filters
        const matchPrefix = filters.prefix === 'ALL' || a.prefix === filters.prefix;
        const roleName = getRoleName(a.roleId);
        const matchRole = filters.role === 'ALL' || roleName === filters.role;
        const matchStatus = filters.status === 'ALL' || a.status === filters.status;
        const matchLoginId = !filters.loginId || a.username.toLowerCase().includes(filters.loginId.toLowerCase());
        const matchDept = !filters.department || (a.department && a.department.toLowerCase().includes(filters.department.toLowerCase()));
        const matchIp = !filters.loginIp || (a.lastLoginIp && a.lastLoginIp.includes(filters.loginIp));

        return matchPrefix && matchRole && matchStatus && matchLoginId && matchDept && matchIp;
    });
});

const uniqueRoles = computed(() => {
    const roles = new Set(props.globalState.roles.map(r => r.name));
    return Array.from(roles);
});

const availableRoles = computed(() => {
    if (!form.prefix) return [];
    return props.globalState.roles.filter(r => r.prefix === form.prefix && r.status === 'ACTIVE');
});

const getRoleName = (roleId) => {
    const role = props.globalState.roles.find(r => r.id === roleId);
    return role ? role.name : 'Unknown';
};

const openCreateModal = () => {
    isEditing.value = false;
    showErrors.value = false;
    form.id = null;
    form.brandId = '';
    form.prefix = props.isSuperAdmin ? '' : props.userPrefix;
    form.username = '';
    form.password = '';
    form.roleId = '';
    form.isActive = true;
    form.department = '';
    form.realName = '';
    
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
    if (account.isSystem) return;
    isEditing.value = true;
    showErrors.value = false;
    form.id = account.id;
    form.prefix = account.prefix;
    form.username = account.username;
    form.password = '';
    form.roleId = account.roleId;
    form.isActive = account.status === 'ACTIVE';
    form.department = account.department;
    form.realName = account.realName;
    
    // Set brandId from the account's prefix
    const accountAgent = props.globalState.agents.find(a => a.prefix === account.prefix);
    if (accountAgent) {
        form.brandId = accountAgent.brandId;
    }
    
    showModal.value = true;
};

const closeModal = () => showModal.value = false;

const saveAccount = () => {
    // Clear previous errors
    validationErrors.username = '';
    validationErrors.department = '';
    validationErrors.realName = '';
    showErrors.value = true;
    
    // Validate required fields
    if (!form.brandId) {
        alert('Please select a brand.');
        return;
    }

    if (!form.prefix) {
        alert('Please select a prefix.');
        return;
    }
    
    if (!form.roleId) {
        alert('Please select a role.');
        return;
    }
    
    // Validate Login ID
    const usernameError = validateLoginId(form.username);
    if (usernameError) {
        validationErrors.username = usernameError;
        alert('Please fix the validation errors before saving.');
        return;
    }
    
    // Validate Department
    const departmentError = validateName(form.department, 'Department');
    if (departmentError) {
        validationErrors.department = departmentError;
        alert('Please fix the validation errors before saving.');
        return;
    }
    
    // Validate Real Name
    const realNameError = validateName(form.realName, 'Real Name');
    if (realNameError) {
        validationErrors.realName = realNameError;
        alert('Please fix the validation errors before saving.');
        return;
    }
    
    // Validate password for new accounts
    if (!isEditing.value && !form.password) {
        alert('Password is required for new accounts.');
        return;
    }

    // Check for duplicate username in the same PREFIX (case-insensitive)
    const duplicate = props.globalState.accounts.find(a => {
        // When creating new account (form.id is null), check all accounts
        // When editing (form.id exists), exclude the account being edited
        const isDifferentAccount = isEditing.value ? (a.id !== form.id) : true;
        
        const match = a.prefix?.toLowerCase() === form.prefix.toLowerCase() &&
                     a.username?.toLowerCase() === form.username.toLowerCase() &&
                     isDifferentAccount;
        return match;
    });

    if (duplicate) {
        validationErrors.username = `Login ID "${form.username}" already exists in prefix ${form.prefix}`;
        alert(`Login ID "${form.username}" already exists for prefix "${form.prefix}". Please use a different Login ID.`);
        return;
    }

    // Save account
    const accountData = {
        ...form,
        status: form.isActive ? 'ACTIVE' : 'INACTIVE'
    };
    delete accountData.isActive; // Remove temporary boolean

    if (isEditing.value) {
        const idx = props.globalState.accounts.findIndex(a => a.id === form.id);
        if (idx !== -1) {
            const updatedAccount = { ...props.globalState.accounts[idx], ...accountData };
            if (!form.password) delete updatedAccount.password;
            updatedAccount.updatedBy = 'admin';
            updatedAccount.updatedTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
            props.globalState.accounts[idx] = updatedAccount;
        }
    } else {
        const newAccount = {
            id: Date.now(),
            ...accountData,
            isSystem: false,
            lastLoginIp: '-',
            createdBy: 'admin',
            createdTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
            updatedBy: '-',
            updatedTime: '-'
        };
        props.globalState.accounts.unshift(newAccount);
    }
    
    closeModal();
};

const deleteAccount = (account) => {
    if (account.isSystem) return;
    if (confirm('Are you sure you want to delete this account?')) {
        const idx = props.globalState.accounts.findIndex(a => a.id === account.id);
        if (idx !== -1) props.globalState.accounts.splice(idx, 1);
    }
};
</script>
