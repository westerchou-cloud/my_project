<template>
    <div class="space-y-6">
        <!-- Filter Panel -->
        <div class="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
            <div class="flex flex-col gap-4">
                
                <!-- Row 1: Brand & Prefix Filter (SUPERADMIN only) -->
                <div v-if="isSuperAdmin" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Brand Filter -->
                    <div>
                        <label class="block text-xs font-medium text-slate-500 mb-1">Brand</label>
                        <div class="relative">
                            <select v-model="filters.brand" class="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-2 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium">
                                <option value="ALL">ALL</option>
                                <option v-for="brand in globalState.brands" :key="brand.id" :value="brand.id">{{ brand.name }}</option>
                            </select>
                            <ChevronDown class="absolute right-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    <!-- Prefix Filter -->
                    <div>
                        <label class="block text-xs font-medium text-slate-500 mb-1">Prefix</label>
                        <div class="relative">
                            <select v-model="filters.prefix" class="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-2 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium">
                                <option value="ALL">ALL</option>
                                <option v-for="agent in filteredPrefixes" :key="agent.prefix" :value="agent.prefix">{{ agent.prefix }}</option>
                            </select>
                            <ChevronDown class="absolute right-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                    </div>
                </div>

                <!-- Row 2: Dates & Dropdowns -->
                <div :class="['grid grid-cols-1 md:grid-cols-2 gap-4', isSuperAdmin ? 'lg:grid-cols-5' : 'lg:grid-cols-4']">
                    <!-- Start Date -->
                    <div>
                        <label class="block text-xs font-medium text-slate-500 mb-1">Start Date</label>
                        <div class="relative">
                            <Calendar class="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                            <input v-model="filters.startDate" type="date" :max="filters.endDate" 
                                :class="['w-full bg-slate-50 border text-slate-700 py-2 pl-10 pr-4 rounded-lg focus:outline-none focus:ring-2 text-sm', 
                                         isDateRangeInvalid ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-primary/20 focus:border-primary']">
                        </div>
                    </div>

                    <!-- End Date -->
                    <div>
                        <label class="block text-xs font-medium text-slate-500 mb-1">End Date</label>
                        <div class="relative">
                            <Calendar class="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                            <input v-model="filters.endDate" type="date" :min="filters.startDate" 
                                :class="['w-full bg-slate-50 border text-slate-700 py-2 pl-10 pr-4 rounded-lg focus:outline-none focus:ring-2 text-sm', 
                                         isDateRangeInvalid ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-primary/20 focus:border-primary']">
                        </div>
                    </div>

                    <!-- Currency Filter (SUPERADMIN only) -->
                    <div v-if="isSuperAdmin" class="relative">
                        <label class="block text-xs font-medium text-slate-500 mb-1">Currency</label>
                        <div class="relative">
                            <select v-model="filters.currency" class="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-2 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium">
                                <option value="ALL">ALL</option>
                                <option value="THB">THB</option>
                                <option value="CNY">CNY</option>
                                <option value="USD">USD</option>
                            </select>
                            <ChevronDown class="absolute right-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    <!-- Bank Code Filter -->
                    <div class="relative">
                        <label class="block text-xs font-medium text-slate-500 mb-1">Bank Code</label>
                        <div class="relative">
                            <select v-model="filters.bankCode" class="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-2 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium">
                                <option value="ALL">ALL</option>
                                <option v-for="bank in uniqueBankCodes" :key="bank" :value="bank">{{ bank }}</option>
                            </select>
                            <ChevronDown class="absolute right-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    <!-- Status Filter -->
                    <div class="relative">
                        <label class="block text-xs font-medium text-slate-500 mb-1">Status</label>
                        <div class="relative">
                            <select v-model="filters.status" class="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-2 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium">
                                <option value="ALL">ALL</option>
                                <option value="MATCHED">Matched</option>
                                <option value="UNMATCHED">Unmatched</option>
                            </select>
                            <ChevronDown class="absolute right-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                    </div>
                </div>

                <!-- Row 3: Text Search -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input v-model="filters.accountNo" type="text" placeholder="Account No." class="bg-slate-50 border border-slate-200 text-slate-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm">
                    <input v-model="filters.counterAccountNo" type="text" placeholder="Deposit / Withdraw No." class="bg-slate-50 border border-slate-200 text-slate-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm">
                    <input v-model="filters.accountName" type="text" placeholder="Account Name" class="bg-slate-50 border border-slate-200 text-slate-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm">
                </div>
            </div>
        </div>

        <!-- Data Table -->
        <div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <!-- Table Header with Export -->
            <div class="p-4 border-b border-slate-100 flex justify-end">
                <button @click="exportCSV" class="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                    <Download class="w-4 h-4" />
                    Export CSV
                </button>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse whitespace-nowrap">
                    <thead>
                        <tr class="bg-slate-50 border-b border-slate-100 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                            <th v-if="isSuperAdmin" class="px-6 py-4">Prefix</th>
                            <th class="px-6 py-4">Transaction Time</th>
                            <th class="px-6 py-4">Transaction No.</th>
                            <th class="px-6 py-4">Bank</th>
                            <th v-if="isSuperAdmin" class="px-6 py-4">Currency</th>
                            <th class="px-6 py-4">Account No.</th>
                            <th class="px-6 py-4">Deposit / Withdraw<br>Account No.</th>
                            <th class="px-6 py-4">Account Name</th>
                            <th class="px-6 py-4 text-right">Deposit</th>
                            <th class="px-6 py-4 text-right">Withdraw</th>
                            <th class="px-6 py-4">Matched Order No.</th>
                            <th class="px-6 py-4">Status</th>
                            <th class="px-6 py-4">Remark</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        <tr v-for="tx in paginatedTransactions" :key="tx.id" class="hover:bg-slate-50 transition-colors text-sm">
                            <td v-if="isSuperAdmin" class="px-6 py-4 font-medium text-slate-700">{{ tx.prefix }}</td>
                            <td class="px-6 py-4 text-slate-600">{{ tx.transactionTime }}</td>
                            <td class="px-6 py-4 text-slate-600 font-mono">{{ tx.transactionNo }}</td>
                            <td class="px-6 py-4 text-slate-700">{{ tx.bankCode }}</td>
                            <td v-if="isSuperAdmin" class="px-6 py-4 text-slate-600">{{ tx.currency }}</td>
                            <td class="px-6 py-4 text-slate-600 font-mono">{{ tx.accountNo }}</td>
                            <td class="px-6 py-4 text-slate-600 font-mono">{{ tx.counterAccountNo }}</td>
                            <td class="px-6 py-4 text-slate-700">{{ tx.accountName }}</td>
                            <td class="px-6 py-4 text-right font-medium text-green-600">
                                {{ tx.type === 'DEPOSIT' ? formatNumber(tx.amount) : '' }}
                            </td>
                            <td class="px-6 py-4 text-right font-medium text-red-600">
                                {{ tx.type === 'WITHDRAW' ? formatNumber(tx.amount) : '' }}
                            </td>
                            <td class="px-6 py-4 text-slate-600 font-mono">{{ tx.matchedOrderNo || '' }}</td>
                            <td class="px-6 py-4">
                                <span :class="['inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold', 
                                    tx.status === 'MATCHED' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500']">
                                    {{ tx.status }}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-xs text-slate-500 max-w-xs truncate" :title="tx.remark">{{ tx.remark }}</td>
                        </tr>
                        <!-- Empty State -->
                        <tr v-if="paginatedTransactions.length === 0">
                            <td :colspan="isSuperAdmin ? 13 : 11" class="px-6 py-12 text-center text-slate-400">
                                No transactions found matching your criteria.
                            </td>
                        </tr>
                    </tbody>
                    <!-- Footer -->
                    <tfoot class="bg-green-50 border-t border-green-100">
                        <tr>
                            <td :colspan="isSuperAdmin ? 8 : 6" class="px-6 py-4 text-right font-bold text-green-800">Total Deposit:</td>
                            <td class="px-6 py-4 text-right font-bold text-green-600">{{ formatNumber(totalDeposit) }}</td>
                            <td :colspan="4"></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            <!-- Pagination -->
            <Pagination 
                :total-items="filteredTransactions.length" 
                v-model:current-page="currentPage" 
                :items-per-page="10" 
            />
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { ChevronDown, Calendar, Download } from 'lucide-vue-next';
import Pagination from '../components/Pagination.vue';

const props = defineProps(['globalState', 'isSuperAdmin', 'userPrefix']);

// Date Helper
const formatDate = (date) => date.toISOString().split('T')[0];
const today = new Date();
const sevenDaysAgo = new Date(today);
sevenDaysAgo.setDate(today.getDate() - 7);

const filters = reactive({
    brand: 'ALL',
    prefix: 'ALL',
    startDate: formatDate(sevenDaysAgo),
    endDate: formatDate(today),
    currency: 'ALL',
    bankCode: 'ALL',
    status: 'ALL',
    accountNo: '',
    counterAccountNo: '',
    accountName: ''
});

const currentPage = ref(1);

// Get unique bank codes for filter
const uniqueBankCodes = computed(() => {
    if (props.isSuperAdmin) {
        // For SuperAdmin, show all available banks
        return props.globalState.banks?.map(b => b.bank_code).sort() || [];
    } else {
        // For Prefix Admin, show only banks assigned to their prefix
        const prefixBanks = props.globalState.prefix_banks?.filter(pb => pb.prefix === props.userPrefix) || [];
        return prefixBanks.map(pb => pb.bank_code).sort();
    }
});

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

// Date Validation
const isDateRangeInvalid = computed(() => filters.startDate > filters.endDate);

// Filter Logic
const filteredTransactions = computed(() => {
    let txs = props.globalState.transactions || [];

    // 1. Role Filter
    if (!props.isSuperAdmin) {
        txs = txs.filter(t => t.prefix === props.userPrefix);
    }

    // 2. Date Range Logic Check
    if (filters.startDate > filters.endDate) {
        return []; // Invalid range, return empty to prevent logic errors
    }

    // 3. Apply Filters
    return txs.filter(t => {
        const txDate = t.transactionTime.split(' ')[0];
        const matchDate = txDate >= filters.startDate && txDate <= filters.endDate;
        
        // Brand Filter Logic
        let matchBrand = true;
        if (props.isSuperAdmin && filters.brand !== 'ALL') {
            const agent = props.globalState.agents.find(a => a.prefix === t.prefix);
            matchBrand = agent && String(agent.brandId) === String(filters.brand);
        }

        const matchPrefix = filters.prefix === 'ALL' || t.prefix === filters.prefix;
        const matchCurrency = filters.currency === 'ALL' || t.currency === filters.currency;
        const matchBank = filters.bankCode === 'ALL' || t.bankCode === filters.bankCode;
        const matchStatus = filters.status === 'ALL' || t.status === filters.status;
        
        const matchAccount = !filters.accountNo || t.accountNo.includes(filters.accountNo);
        const matchCounter = !filters.counterAccountNo || t.counterAccountNo.includes(filters.counterAccountNo);
        const matchName = !filters.accountName || t.accountName.toLowerCase().includes(filters.accountName.toLowerCase());

        return matchDate && matchBrand && matchPrefix && matchCurrency && matchBank && matchStatus && matchAccount && matchCounter && matchName;
    });
});

// Pagination
const paginatedTransactions = computed(() => {
    const start = (currentPage.value - 1) * 10;
    const end = start + 10;
    return filteredTransactions.value.slice(start, end);
});

// Total Deposit Calculation
const totalDeposit = computed(() => {
    return filteredTransactions.value
        .filter(t => t.type === 'DEPOSIT')
        .reduce((sum, t) => sum + t.amount, 0);
});

// Number Formatter
const formatNumber = (num) => {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// Export CSV
const exportCSV = () => {
    // 1. Define Columns
    const columns = [
        { header: 'Transaction Time', key: 'transactionTime' },
        { header: 'Transaction No.', key: 'transactionNo' },
        { header: 'Bank', key: 'bankCode' },
        { header: 'Account No.', key: 'accountNo' },
        { header: 'Deposit / Withdraw Account No.', key: 'counterAccountNo' },
        { header: 'Account Name', key: 'accountName' },
        { header: 'Deposit', key: 'deposit' },
        { header: 'Withdraw', key: 'withdraw' },
        { header: 'Matched Order No.', key: 'matchedOrderNo' },
        { header: 'Status', key: 'status' },
        { header: 'Remark', key: 'remark' }
    ];

    // Add SuperAdmin columns if needed
    if (props.isSuperAdmin) {
        columns.unshift({ header: 'Prefix', key: 'prefix' });
        columns.splice(4, 0, { header: 'Currency', key: 'currency' });
    }

    // 2. Format Data
    const data = filteredTransactions.value.map(tx => {
        const row = {
            prefix: tx.prefix,
            transactionTime: tx.transactionTime,
            transactionNo: tx.transactionNo,
            bankCode: tx.bankCode,
            currency: tx.currency,
            accountNo: `"${tx.accountNo}"`, // Force string to prevent scientific notation in Excel
            counterAccountNo: `"${tx.counterAccountNo}"`,
            accountName: `"${tx.accountName.replace(/"/g, '""')}"`, // Escape quotes
            deposit: tx.type === 'DEPOSIT' ? tx.amount.toFixed(2) : '',
            withdraw: tx.type === 'WITHDRAW' ? tx.amount.toFixed(2) : '',
            matchedOrderNo: tx.matchedOrderNo || '',
            status: tx.status,
            remark: `"${tx.remark.replace(/"/g, '""')}"`
        };
        return row;
    });

    // 3. Generate CSV Content
    const headerRow = columns.map(col => `"${col.header}"`).join(',');
    const rows = data.map(row => {
        return columns.map(col => {
            const val = row[col.key];
            return val === undefined || val === null ? '' : val;
        }).join(',');
    });

    const csvContent = [headerRow, ...rows].join('\n');

    // 4. Trigger Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    link.setAttribute('href', url);
    link.setAttribute('download', `transactions_${timestamp}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
</script>
