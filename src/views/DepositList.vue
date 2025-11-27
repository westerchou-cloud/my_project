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
                                <option value="PENDING">Pending</option>
                                <option value="MATCHED">Matched</option>
                                <option value="CONFIRM">Confirm</option>
                                <option value="CANCEL">Cancel</option>
                            </select>
                            <ChevronDown class="absolute right-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                    </div>
                </div>

                <!-- Row 3: Text Search -->
                <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <input v-model="filters.orderNo" type="text" placeholder="Order No." class="bg-slate-50 border border-slate-200 text-slate-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm">
                    <input v-model="filters.accountNo" type="text" placeholder="Account No." class="bg-slate-50 border border-slate-200 text-slate-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm">
                    <input v-model="filters.counterAccountNo" type="text" placeholder="Deposit No." class="bg-slate-50 border border-slate-200 text-slate-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm">
                    <input v-model="filters.accountName" type="text" placeholder="Account Name" class="bg-slate-50 border border-slate-200 text-slate-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm">
                    <input v-model="filters.memberAccount" type="text" placeholder="Member Account" class="bg-slate-50 border border-slate-200 text-slate-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm">
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
                            <th class="px-6 py-4">Order Time</th>
                            <th class="px-6 py-4">Order No.</th>
                            <th v-if="isSuperAdmin" class="px-6 py-4">Currency</th>
                            <th class="px-6 py-4">Bank</th>
                            <th class="px-6 py-4">Account No.</th>
                            <th class="px-6 py-4">Deposit No.</th>
                            <th class="px-6 py-4">Account Name</th>
                            <th class="px-6 py-4">Member Account</th>
                            <th class="px-6 py-4 text-right">Amount</th>
                            <th class="px-6 py-4">Status</th>
                            <th class="px-6 py-4">Update By / Time</th>
                            <th class="px-6 py-4">Matched Transaction No.</th>
                            <th class="px-6 py-4 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        <tr v-for="order in paginatedOrders" :key="order.id" class="hover:bg-slate-50 transition-colors text-sm">
                            <td v-if="isSuperAdmin" class="px-6 py-4 font-medium text-slate-700">{{ order.prefix }}</td>
                            <td class="px-6 py-4 text-slate-600">{{ order.orderTime }}</td>
                            <td class="px-6 py-4 text-slate-600 font-mono">{{ order.orderNo }}</td>
                            <td v-if="isSuperAdmin" class="px-6 py-4 text-slate-600">{{ order.currency }}</td>
                            <td class="px-6 py-4 text-slate-700">{{ order.bankCode }}</td>
                            <td class="px-6 py-4 text-slate-600 font-mono">{{ order.accountNo }}</td>
                            <td class="px-6 py-4 text-slate-600 font-mono">{{ order.counterAccountNo }}</td>
                            <td class="px-6 py-4 text-slate-700">{{ order.accountName }}</td>
                            <td class="px-6 py-4 text-slate-700">{{ order.memberAccount }}</td>
                            <td class="px-6 py-4 text-right font-medium text-green-600">{{ formatNumber(order.amount) }}</td>
                            <td class="px-6 py-4">
                                <span :class="['inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold', getStatusClass(order.status)]">
                                    {{ order.status }}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-slate-500 text-xs">
                                <template v-if="order.updateBy">
                                    {{ order.updateBy }} / {{ order.updateTime }}
                                </template>
                                <template v-else>-</template>
                            </td>
                            <td class="px-6 py-4 text-slate-600 font-mono">{{ order.matchedTransactionNo || '-' }}</td>
                            <td class="px-6 py-4">
                                <div class="flex items-center justify-center gap-2">
                                    <!-- PENDING Actions -->
                                    <template v-if="order.status === 'PENDING'">
                                        <button @click="handleAction(order, 'CONFIRM')" class="text-blue-600 hover:text-blue-800 font-medium text-xs">Confirm</button>
                                        <button @click="handleAction(order, 'REJECT')" class="text-red-600 hover:text-red-800 font-medium text-xs">Reject</button>
                                    </template>
                                    
                                    <!-- MATCHED Actions -->
                                    <template v-if="order.status === 'MATCHED'">
                                        <button @click="handleAction(order, 'REJECT')" class="text-red-600 hover:text-red-800 font-medium text-xs">Reject</button>
                                        <button @click="handleAction(order, 'RECALL')" class="text-indigo-600 hover:text-indigo-800 font-medium text-xs">Recall</button>
                                    </template>
                                </div>
                            </td>
                        </tr>
                        <!-- Empty State -->
                        <tr v-if="paginatedOrders.length === 0">
                            <td :colspan="isSuperAdmin ? 14 : 12" class="px-6 py-12 text-center text-slate-400">
                                No orders found matching your criteria.
                            </td>
                        </tr>
                    </tbody>
                    <!-- Footer -->
                    <tfoot class="bg-green-50 border-t border-green-100">
                        <tr>
                            <td :colspan="isSuperAdmin ? 9 : 7" class="px-6 py-4 text-right font-bold text-green-800">Total Amount:</td>
                            <td class="px-6 py-4 text-right font-bold text-green-600">{{ formatNumber(totalAmount) }}</td>
                            <td :colspan="4"></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            <!-- Pagination -->
            <Pagination 
                :total-items="filteredOrders.length" 
                v-model:current-page="currentPage" 
                :items-per-page="10" 
            />
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue';
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
    orderNo: '',
    accountNo: '',
    counterAccountNo: '',
    accountName: '',
    memberAccount: ''
});

const currentPage = ref(1);

// Get unique bank codes for filter
const uniqueBankCodes = computed(() => {
    if (props.isSuperAdmin) {
        return props.globalState.banks?.map(b => b.bank_code).sort() || [];
    } else {
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
const filteredOrders = computed(() => {
    let orders = props.globalState.orders || [];

    // 1. Role Filter
    if (!props.isSuperAdmin) {
        orders = orders.filter(o => o.prefix === props.userPrefix);
    }

    // 2. Date Range Logic Check
    if (filters.startDate > filters.endDate) {
        return [];
    }

    // 3. Apply Filters
    return orders.filter(o => {
        const orderDate = o.orderTime.split(' ')[0];
        const matchDate = orderDate >= filters.startDate && orderDate <= filters.endDate;
        
        // Brand Filter Logic
        let matchBrand = true;
        if (props.isSuperAdmin && filters.brand !== 'ALL') {
            const agent = props.globalState.agents.find(a => a.prefix === o.prefix);
            matchBrand = agent && String(agent.brandId) === String(filters.brand);
        }

        const matchPrefix = filters.prefix === 'ALL' || o.prefix === filters.prefix;
        const matchCurrency = filters.currency === 'ALL' || o.currency === filters.currency;
        const matchBank = filters.bankCode === 'ALL' || o.bankCode === filters.bankCode;
        const matchStatus = filters.status === 'ALL' || o.status === filters.status;
        
        const matchOrderNo = !filters.orderNo || o.orderNo.includes(filters.orderNo);
        const matchAccount = !filters.accountNo || o.accountNo.includes(filters.accountNo);
        const matchCounter = !filters.counterAccountNo || o.counterAccountNo.includes(filters.counterAccountNo);
        const matchName = !filters.accountName || o.accountName.toLowerCase().includes(filters.accountName.toLowerCase());
        const matchMember = !filters.memberAccount || o.memberAccount.toLowerCase().includes(filters.memberAccount.toLowerCase());

        return matchDate && matchBrand && matchPrefix && matchCurrency && matchBank && matchStatus && matchOrderNo && matchAccount && matchCounter && matchName && matchMember;
    });
});

// Pagination
const paginatedOrders = computed(() => {
    const start = (currentPage.value - 1) * 10;
    const end = start + 10;
    return filteredOrders.value.slice(start, end);
});

// Total Amount Calculation
const totalAmount = computed(() => {
    return filteredOrders.value.reduce((sum, o) => sum + o.amount, 0);
});

// Number Formatter
const formatNumber = (num) => {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// Status Class Helper
const getStatusClass = (status) => {
    switch (status) {
        case 'MATCHED': return 'bg-green-100 text-green-700';
        case 'CONFIRM': return 'bg-blue-100 text-blue-700';
        case 'CANCEL': return 'bg-red-100 text-red-700';
        case 'PENDING': return 'bg-yellow-100 text-yellow-700';
        default: return 'bg-slate-100 text-slate-500';
    }
};

// Action Handler
const handleAction = (order, action) => {
    console.log('handleAction called', order, action);
    const now = new Date().toISOString().replace('T', ' ').split('.')[0];
    const currentUser = localStorage.getItem('userPrefix') || 'admin';
    
    if (action === 'CONFIRM') {
        if (window.confirm('Are you sure you want to confirm this order?')) {
            console.log('Confirming order...');
            order.status = 'CONFIRM';
            order.updateBy = currentUser;
            order.updateTime = now;
        }
    } else if (action === 'REJECT') {
        if (order.status === 'MATCHED') {
            // Simulate callback failure for demo purposes (50% chance)
            // In real app, this would be an API call
            const callbackSuccess = Math.random() > 0.5;
            if (callbackSuccess) {
                if (window.confirm('Are you sure you want to reject this order?')) {
                    console.log('Rejecting matched order...');
                    order.status = 'CANCEL';
                    order.updateBy = currentUser;
                    order.updateTime = now;
                }
            } else {
                alert('Callback notification failed! Status remains MATCHED.');
            }
        } else {
            // PENDING -> REJECT always succeeds
            if (window.confirm('Are you sure you want to reject this order?')) {
                console.log('Rejecting pending order...');
                order.status = 'CANCEL';
                order.updateBy = currentUser;
                order.updateTime = now;
            }
        }
    } else if (action === 'RECALL') {
        // Recall logic: Retry callback -> CONFIRM
        if (window.confirm('Are you sure you want to recall (retry callback) for this order?')) {
            console.log('Recalling order...');
            // Simulate success
            alert('Callback successful!');
            order.status = 'CONFIRM';
            order.updateBy = currentUser;
            order.updateTime = now;
        }
    }
};

// Export CSV
const exportCSV = () => {
    const columns = [
        { header: 'Order Time', key: 'orderTime' },
        { header: 'Order No.', key: 'orderNo' },
        { header: 'Bank', key: 'bankCode' },
        { header: 'Account No.', key: 'accountNo' },
        { header: 'Deposit No.', key: 'counterAccountNo' },
        { header: 'Account Name', key: 'accountName' },
        { header: 'Member Account', key: 'memberAccount' },
        { header: 'Amount', key: 'amount' },
        { header: 'Status', key: 'status' },
        { header: 'Update Time', key: 'updateTime' },
        { header: 'Matched Transaction No.', key: 'matchedTransactionNo' }
    ];

    if (props.isSuperAdmin) {
        columns.unshift({ header: 'Prefix', key: 'prefix' });
        columns.splice(4, 0, { header: 'Currency', key: 'currency' });
    }

    const data = filteredOrders.value.map(o => {
        const row = {
            prefix: o.prefix,
            orderTime: o.orderTime,
            orderNo: o.orderNo,
            bankCode: o.bankCode,
            currency: o.currency,
            accountNo: `"${o.accountNo}"`,
            counterAccountNo: `"${o.counterAccountNo}"`,
            accountName: `"${o.accountName.replace(/"/g, '""')}"`,
            memberAccount: `"${o.memberAccount.replace(/"/g, '""')}"`,
            amount: o.amount.toFixed(2),
            status: o.status,
            updateTime: o.updateTime || '',
            matchedTransactionNo: o.matchedTransactionNo || ''
        };
        return row;
    });

    const headerRow = columns.map(col => `"${col.header}"`).join(',');
    const rows = data.map(row => {
        return columns.map(col => {
            const val = row[col.key];
            return val === undefined || val === null ? '' : val;
        }).join(',');
    });

    const csvContent = [headerRow, ...rows].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    link.setAttribute('href', url);
    link.setAttribute('download', `deposit_orders_${timestamp}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
</script>
