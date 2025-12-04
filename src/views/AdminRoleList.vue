<template>
    <div class="space-y-6">
        <!-- Action Bar -->
        <div class="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div class="flex items-center gap-4 flex-1">

                    <!-- Prefix Filter (SUPERADMIN only) -->
                    <div v-if="isSuperAdmin" class="relative">
                        <select v-model="filters.prefix" class="appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-2 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium">
                            <option value="ALL">Prefix: All</option>
                            <option v-for="agent in globalState.agents" :key="agent.prefix" :value="agent.prefix">{{ agent.prefix }}</option>
                        </select>
                        <ChevronDown class="absolute right-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                    <!-- Search -->
                    <div class="relative flex-1 max-w-md">
                        <Search class="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                        <input v-model="filters.search" type="text" placeholder="Search Role Name..." class="w-full bg-slate-50 border border-slate-200 text-slate-700 py-2 pl-10 pr-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm">
                    </div>
                </div>
                <button @click="openCreateModal" class="bg-primary hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-md shadow-blue-500/20 flex items-center transition-all transform hover:scale-105 active:scale-95">
                    <Plus class="w-4 h-4 mr-2" /><span class="font-medium text-sm">New Role</span>
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
                        <th class="px-6 py-4">Role Name</th>
                        <th class="px-6 py-4">Status</th>
                        <th class="px-6 py-4">Created By / Time</th>
                        <th class="px-6 py-4">Updated By / Time</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    <tr v-for="role in filteredRoles" :key="role.id" class="hover:bg-slate-50 transition-colors">
                        <td class="px-6 py-4">
                            <div v-if="!role.isSystem" class="flex gap-3">
                                <button @click="openEditModal(role)" class="text-primary hover:text-blue-700 font-medium text-sm flex items-center"><Edit2 class="w-4 h-4 mr-1" /> EDIT</button>
                                <button @click="deleteRole(role)" class="text-danger hover:text-red-700 font-medium text-sm flex items-center"><Trash2 class="w-4 h-4 mr-1" /> DEL</button>
                            </div>
                            <span v-else class="text-slate-400 text-xs italic">System Protected</span>
                        </td>
                        <td v-if="isSuperAdmin" class="px-6 py-4 font-medium text-slate-700">{{ role.prefix }}</td>
                        <td class="px-6 py-4">
                            <Check v-if="role.isSystem" class="w-5 h-5 text-green-500" />
                        </td>
                        <td class="px-6 py-4 text-slate-700">{{ role.name }}</td>
                        <td class="px-6 py-4">
                            <span :class="['inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold', role.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500']">
                                <span :class="['w-2 h-2 rounded-full mr-1.5', role.status === 'ACTIVE' ? 'bg-green-500' : 'bg-slate-400']"></span>
                                {{ role.status }}
                            </span>
                        </td>
                        <td class="px-6 py-4 text-xs text-slate-500">
                            <div class="font-medium text-slate-700">{{ role.createdBy }}</div><div>{{ role.createdTime }}</div>
                        </td>
                        <td class="px-6 py-4 text-xs text-slate-500">
                            <div class="font-medium text-slate-700">{{ role.updatedBy }}</div><div>{{ role.updatedTime }}</div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <!-- Pagination -->
            <Pagination 
                :total-items="filteredRoles.length" 
                v-model:current-page="currentPage" 
                :items-per-page="10" 
            />
        </div>

        <!-- Modal -->
        <div v-if="showModal" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click.self="closeModal">
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <!-- Modal Header -->
                <div class="px-8 py-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
                    <div>
                        <h2 class="text-xl font-bold text-slate-800">{{ isEditing ? 'Update Role' : 'Create New Role' }}</h2>
                        <p class="text-sm text-slate-500 mt-1">Define permissions for this role</p>
                    </div>
                    <button @click="closeModal" class="text-slate-400 hover:text-slate-600 transition-colors">
                        <X class="w-6 h-6" />
                    </button>
                </div>

                <div class="p-8 space-y-8">
                    <!-- Basic Info -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Brand Selection (Super Admin only) -->

                        <!-- Prefix Selection -->
                        <div class="space-y-1.5">
                            <label class="block text-sm font-medium text-slate-700">Prefix <span class="text-red-500">*</span></label>
                            <div class="relative">
                                <select v-model="form.prefix" :disabled="isEditing || !isSuperAdmin" class="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm appearance-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all disabled:bg-slate-50 disabled:text-slate-500">
                                    <option value="" disabled>Select Prefix</option>
                                    <option v-for="agent in globalState.agents" :key="agent.prefix" :value="agent.prefix">{{ agent.prefix }}</option>
                                </select>
                                <ChevronDown class="absolute right-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                            </div>
                        </div>
                        <!-- Role Name -->
                        <div class="space-y-1.5">
                            <label class="block text-sm font-medium text-slate-700">Role Name <span class="text-red-500">*</span></label>
                            <input v-model="form.name" type="text" placeholder="e.g. Finance Manager" class="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all">
                        </div>
                    </div>

                    <!-- Permission Matrix -->
                    <div class="space-y-4">
                        <div class="flex items-center justify-between">
                            <h3 class="text-sm font-bold text-slate-800 uppercase tracking-wider">Permission Settings</h3>
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" v-model="form.isActive" class="sr-only peer">
                                <div class="w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                                <span class="ml-2 text-sm font-medium" :class="form.isActive ? 'text-green-600' : 'text-slate-400'">{{ form.isActive ? 'Active' : 'Inactive' }}</span>
                            </label>
                        </div>

                        <div class="border border-slate-200 rounded-xl overflow-hidden">
                            <table class="w-full text-sm text-left">
                                <thead class="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                                    <tr>
                                        <th class="px-6 py-3 w-1/4">Module</th>
                                        <th class="px-6 py-3">Permissions</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-100">
                                    <tr v-for="module in permissionModules" :key="module.id" class="hover:bg-slate-50">
                                        <td class="px-6 py-4 font-medium text-slate-700">{{ module.name }}</td>
                                        <td class="px-6 py-4">
                                            <div class="flex flex-wrap gap-6 items-center">
                                                <label class="flex items-center gap-2 cursor-pointer select-none">
                                                    <input type="checkbox" 
                                                        :checked="isAllModuleSelected(module)"
                                                        @change="toggleAllModule(module)"
                                                        class="w-4 h-4 text-primary border-slate-300 rounded focus:ring-primary">
                                                    <span class="text-sm font-medium text-slate-700">All</span>
                                                </label>
                                                <label v-for="action in module.actions" :key="action" class="flex items-center gap-2 cursor-pointer select-none">
                                                    <input type="checkbox" 
                                                        :value="module.id + ':' + action" 
                                                        v-model="form.permissions"
                                                        class="w-4 h-4 text-primary border-slate-300 rounded focus:ring-primary">
                                                    <span class="text-sm text-slate-600 capitalize">{{ action }}</span>
                                                </label>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 rounded-b-2xl">
                    <button @click="closeModal" class="px-5 py-2.5 text-slate-600 hover:text-slate-800 hover:bg-slate-200/50 rounded-lg text-sm font-medium transition-colors">Cancel</button>
                    <button @click="saveRole" class="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-500/20 text-sm font-medium transition-all transform active:scale-95 flex items-center">
                        <Save class="w-4 h-4 mr-2" /> Save Role
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue';
import { ChevronDown, Search, Plus, Edit2, Trash2, Check, X, Save } from 'lucide-vue-next';
import Pagination from '../components/Pagination.vue';

const props = defineProps(['globalState', 'isSuperAdmin', 'userPrefix']);

const filters = reactive({ prefix: 'ALL', search: '' });
const showModal = ref(false);
const isEditing = ref(false);
const currentPage = ref(1);

const form = reactive({
    id: null,
    prefix: '',
    name: '',
    isActive: true,
    permissions: []
});

const PERMISSION_MODULES = [
    { id: 'prefix', name: 'Prefix List', actions: ['Create', 'Review', 'Update', 'Delete'] },
    { id: 'admin_role', name: 'Admin Role List', actions: ['Create', 'Review', 'Update', 'Delete'] },
    { id: 'admin_account', name: 'Admin Account List', actions: ['Create', 'Review', 'Update', 'Delete'] },
    { id: 'bank', name: 'Bank List', actions: ['Create', 'Review', 'Update', 'Delete'] },
    { id: 'device_account', name: 'Device Account List', actions: ['Create', 'Review', 'Update', 'Delete'] },
    { id: 'transaction', name: 'Transaction Records', actions: ['Review', 'Export'] },
    { id: 'deposit', name: 'Deposit List', actions: ['Review', 'Update', 'Export'] },
    { id: 'configuration', name: 'Configuration', actions: ['Review', 'Update'] }
];

const permissionModules = PERMISSION_MODULES;





const filteredRoles = computed(() => {
    return props.globalState.roles.filter(r => {
        // PREFIX Admin can only see their own prefix's roles
        if (!props.isSuperAdmin && r.prefix !== props.userPrefix) {
            return false;
        }
        
        // Apply user filters
        const matchPrefix = filters.prefix === 'ALL' || r.prefix === filters.prefix;
        const matchSearch = r.name.toLowerCase().includes(filters.search.toLowerCase());
        
        return matchPrefix && matchSearch;
    });
});

const openCreateModal = () => {
    isEditing.value = false;
    form.id = null;
    form.prefix = props.isSuperAdmin ? '' : props.userPrefix;
    form.name = '';
    form.isActive = true;
    form.permissions = [];
    

    
    showModal.value = true;
};

const openEditModal = (role) => {
    if (role.isSystem) return; // Guard
    isEditing.value = true;
    form.id = role.id;
    form.prefix = role.prefix;
    form.name = role.name;
    form.isActive = role.status === 'ACTIVE';
    form.permissions = [...role.permissions];
    

    
    showModal.value = true;
};

const closeModal = () => showModal.value = false;

const isAllModuleSelected = (module) => {
    const moduleActions = module.actions.map(a => module.id + ':' + a);
    return moduleActions.every(a => form.permissions.includes(a));
};

const toggleAllModule = (module) => {
    const moduleActions = module.actions.map(a => module.id + ':' + a);
    const isAll = isAllModuleSelected(module);
    if (isAll) {
        // Deselect all
        form.permissions = form.permissions.filter(p => !moduleActions.includes(p));
    } else {
        // Select all
        const newPerms = [...form.permissions];
        moduleActions.forEach(a => {
            if (!newPerms.includes(a)) newPerms.push(a);
        });
        form.permissions = newPerms;
    }
};

const saveRole = () => {
    if (!form.brandId || !form.prefix || !form.name) {
        alert('Please fill in required fields (Brand, Prefix, and Role Name).');
        return;
    }

    // Check for duplicate role name in same prefix
    const duplicate = props.globalState.roles.find(r => 
        r.prefix === form.prefix && 
        r.name.toLowerCase() === form.name.toLowerCase() && 
        r.id !== form.id
    );

    if (duplicate) {
        alert(`Role name "${form.name}" already exists in prefix ${form.prefix}`);
        return;
    }

    // Check at least one permission is selected
    if (!form.permissions || form.permissions.length === 0) {
        alert('Please select at least one permission');
        return;
    }

    if (isEditing.value) {
        const idx = props.globalState.roles.findIndex(r => r.id === form.id);
        if (idx !== -1) {
            const updatedRole = { ...props.globalState.roles[idx], ...form };
            updatedRole.status = form.isActive ? 'ACTIVE' : 'INACTIVE';
            updatedRole.updatedBy = 'admin';
            updatedRole.updatedTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
            props.globalState.roles[idx] = updatedRole;
        }
    } else {
        const newRole = {
            ...form,
            id: Date.now(),
            isSystem: false,
            status: form.isActive ? 'ACTIVE' : 'INACTIVE',
            createdBy: 'admin',
            createdTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
            updatedBy: '-',
            updatedTime: '-'
        };
        props.globalState.roles.unshift(newRole);
    }
    closeModal();
};

const deleteRole = (role) => {
    if (role.isSystem) return;
    if (confirm('Are you sure you want to delete this role?')) {
        const idx = props.globalState.roles.findIndex(r => r.id === role.id);
        if (idx !== -1) props.globalState.roles.splice(idx, 1);
    }
};
</script>
