<template>
    <div class="space-y-6">
        <!-- Filter Panel -->
        <div class="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <!-- Currency Filter -->
                <div v-if="isSuperAdmin" class="relative">
                    <select v-model="filters.currency" class="appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-2 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium w-full">
                        <option value="ALL">Currency: All</option>
                        <option value="THB">THB</option>
                        <option value="HKD">HKD</option>
                        <option value="CNY">CNY</option>
                        <option value="USD">USD</option>
                    </select>
                    <ChevronDown class="absolute right-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>

                <!-- Status Filter -->
                <div class="relative">
                    <select v-model="filters.status" class="appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-2 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium w-full">
                        <option value="ALL">Status: All</option>
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                    </select>
                    <ChevronDown class="absolute right-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>

                <!-- Bank Code Search -->
                <input v-model="filters.bankCode" type="text" placeholder="Bank Code" 
                    class="bg-slate-50 border border-slate-200 text-slate-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm">

                <!-- Bank Name Search -->
                <input v-model="filters.bankName" type="text" placeholder="Bank Name" 
                    class="bg-slate-50 border border-slate-200 text-slate-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm">

                <!-- Locale Bank Name Search -->
                <input v-model="filters.localeName" type="text" placeholder="Locale Bank Name" 
                    class="bg-slate-50 border border-slate-200 text-slate-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm">
            </div>


        </div>

        <!-- Data Table -->
        <div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-slate-50 border-b border-slate-100 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                        <th v-if="isSuperAdmin" class="px-6 py-4">Currency</th>
                        <th class="px-6 py-4">Bank Code</th>
                        <th class="px-6 py-4">Bank Name</th>
                        <th class="px-6 py-4">Locale Bank Name</th>
                        <th class="px-6 py-4">Status</th>
                        <th class="px-6 py-4">Created By / Time</th>
                        <th class="px-6 py-4">Updated By / Time</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    <tr v-for="bank in paginatedBanks" :key="bank.id" class="hover:bg-slate-50 transition-colors">
                        <td v-if="isSuperAdmin" class="px-6 py-4 font-medium text-slate-700">{{ bank.currency }}</td>
                        <td class="px-6 py-4 font-medium text-slate-700">{{ bank.bank_code }}</td>
                        <td class="px-6 py-4 text-slate-700">{{ bank.bank_name }}</td>
                        <td class="px-6 py-4 text-slate-600">{{ bank.locale_bank_name }}</td>
                        <td class="px-6 py-4">
                            <!-- Toggle Switch -->
                            <label class="relative inline-flex items-center cursor-pointer" @click.prevent="toggleBankStatus(bank)">
                                <input type="checkbox" 
                                    :checked="getBankStatus(bank)" 
                                    class="sr-only peer">
                                <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                <span class="ml-3 text-sm font-medium" :class="getBankStatus(bank) ? 'text-green-600' : 'text-slate-400'">
                                    {{ getBankStatus(bank) ? 'ACTIVE' : 'INACTIVE' }}
                                </span>
                            </label>
                        </td>
                        <td class="px-6 py-4 text-xs text-slate-500">
                            <div class="font-medium text-slate-700">{{ bank.created_by }}</div>
                            <div>{{ bank.created_time }}</div>
                        </td>
                        <td class="px-6 py-4 text-xs text-slate-500">
                            <div class="font-medium text-slate-700">{{ bank.updated_by }}</div>
                            <div>{{ bank.updated_time }}</div>
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- Pagination -->
            <Pagination 
                :total-items="filteredBanks.length" 
                v-model:current-page="currentPage" 
                :items-per-page="10" 
            />
        </div>

        <!-- Confirmation Modal -->
        <div v-if="showConfirmModal" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click.self="closeConfirmModal">
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                <div class="px-8 py-6 border-b border-slate-100">
                    <h2 class="text-xl font-bold text-slate-800">
                        {{ pendingBank?.targetStatus ? 'Activate' : 'Deactivate' }} Bank
                    </h2>
                </div>

                <div class="p-8 space-y-4">
                    <p class="text-slate-700">
                        Are you sure you want to <strong>{{ pendingBank?.targetStatus ? 'activate' : 'deactivate' }}</strong> <strong>{{ pendingBank?.bank?.bank_name }}</strong>?
                    </p>
                    
                    <div v-if="!pendingBank?.targetStatus" class="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
                        <AlertTriangle class="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <p class="text-sm text-amber-800">
                            This will prevent new transactions and deposits from being created for this bank. 
                            Existing data will continue to be processed.
                        </p>
                    </div>
                </div>

                <div class="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 rounded-b-2xl">
                    <button @click="closeConfirmModal" class="px-5 py-2.5 text-slate-600 hover:text-slate-800 hover:bg-slate-200/50 rounded-lg text-sm font-medium transition-colors">
                        Cancel
                    </button>
                    <button @click="confirmToggle" class="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-500/20 text-sm font-medium transition-all transform active:scale-95">
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { ChevronDown, AlertTriangle } from 'lucide-vue-next';
import Pagination from '../components/Pagination.vue';

const props = defineProps(['globalState', 'isSuperAdmin', 'userPrefix']);

const filters = reactive({
    currency: 'ALL',
    status: 'ALL',
    bankCode: '',
    bankName: '',
    localeName: ''
});

const currentPage = ref(1);
const showConfirmModal = ref(false);
const pendingBank = ref(null);

// Get available banks based on user role
const availableBanks = computed(() => {
    if (props.isSuperAdmin) {
        // SUPERADMIN sees all banks
        return props.globalState.banks;
    } else {
        // PREFIX Admin sees only assigned banks where banks.status = ACTIVE
        const prefixBankCodes = props.globalState.prefix_banks
            .filter(pb => pb.prefix === props.userPrefix)
            .map(pb => pb.bank_code);
        
        return props.globalState.banks.filter(bank => 
            bank.status === 'ACTIVE' && prefixBankCodes.includes(bank.bank_code)
        );
    }
});

// Filter banks based on search criteria
const filteredBanks = computed(() => {
    return availableBanks.value.filter(bank => {
        const matchCurrency = filters.currency === 'ALL' || bank.currency === filters.currency;
        const matchStatus = filters.status === 'ALL' || getBankStatus(bank) === (filters.status === 'ACTIVE');
        const matchBankCode = !filters.bankCode || bank.bank_code.toLowerCase().includes(filters.bankCode.toLowerCase());
        const matchBankName = !filters.bankName || bank.bank_name.toLowerCase().includes(filters.bankName.toLowerCase());
        const matchLocaleName = !filters.localeName || bank.locale_bank_name.includes(filters.localeName);

        return matchCurrency && matchStatus && matchBankCode && matchBankName && matchLocaleName;
    });
});

// Paginated banks
const paginatedBanks = computed(() => {
    const start = (currentPage.value - 1) * 10;
    const end = start + 10;
    return filteredBanks.value.slice(start, end);
});

// Get bank status based on user role
const getBankStatus = (bank) => {
    if (props.isSuperAdmin) {
        // SUPERADMIN sees banks.status
        return bank.status === 'ACTIVE';
    } else {
        // PREFIX Admin sees prefix_banks.status
        const prefixBank = props.globalState.prefix_banks.find(
            pb => pb.prefix === props.userPrefix && pb.bank_code === bank.bank_code
        );
        return prefixBank?.status === 'ACTIVE';
    }
};

// Toggle bank status
const toggleBankStatus = (bank) => {
    const currentStatus = getBankStatus(bank);
    pendingBank.value = {
        bank: bank,
        targetStatus: !currentStatus
    };
    showConfirmModal.value = true;
};

// Confirm toggle
const confirmToggle = () => {
    const bank = pendingBank.value.bank;
    const newStatus = pendingBank.value.targetStatus ? 'ACTIVE' : 'INACTIVE';

    if (props.isSuperAdmin) {
        // Update banks.status in globalState
        const bankInGlobalState = props.globalState.banks.find(b => b.bank_code === bank.bank_code);
        if (bankInGlobalState) {
            bankInGlobalState.status = newStatus;
            bankInGlobalState.updated_by = 'admin';
            bankInGlobalState.updated_time = new Date().toISOString().slice(0, 19).replace('T', ' ');
        }
    } else {
        // Update prefix_banks.status
        const prefixBank = props.globalState.prefix_banks.find(
            pb => pb.prefix === props.userPrefix && pb.bank_code === bank.bank_code
        );
        if (prefixBank) {
            prefixBank.status = newStatus;
        }
    }

    closeConfirmModal();
};

// Close confirmation modal
const closeConfirmModal = () => {
    showConfirmModal.value = false;
    pendingBank.value = null;
};
</script>
