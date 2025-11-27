<template>
  <div class="flex w-full h-full">
    <Sidebar v-if="isLoggedIn" :menuItems="filteredMenuItems" />
    
    <main class="flex-1 flex flex-col min-w-0 bg-slate-50">
      <Header v-if="isLoggedIn" :pageTitle="pageTitle" :parentTitle="parentTitle" />
      
      <div class="flex-1 overflow-auto" :class="{ 'p-8': isLoggedIn }">
        <router-view v-slot="{ Component }">
          <keep-alive>
            <component :is="Component" :global-state="filteredGlobalState" :is-super-admin="isSuperAdmin" :user-prefix="userPrefix" />
          </keep-alive>
        </router-view>
      </div>
    </main>
  </div>
</template>

<script setup>
import { reactive, ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import Sidebar from './components/Sidebar.vue';
import Header from './components/Header.vue';

const route = useRoute();

const isLoggedIn = computed(() => route.name !== 'login');
const userPrefix = ref(localStorage.getItem('userPrefix') || '');

// Watch for route changes to update userPrefix
watch(() => route.name, () => {
    userPrefix.value = localStorage.getItem('userPrefix') || '';
});

// Check if current user is SUPERADMIN
const isSuperAdmin = computed(() => userPrefix.value === 'SUPERADMIN');

// Load globalState from localStorage or use default values
const loadGlobalState = () => {
    // Define default state
    const defaultState = {
        brands: [
            { id: 1, name: 'OGP', code: 'OGP', status: 'ACTIVE' },
            { id: 2, name: 'OLE', code: 'OLE', status: 'ACTIVE' }
        ],
        agents: [
            { id: 1, prefix: 'OLEVN', brandId: 2, status: 'ACTIVE', currency: 'THB', configMode: 'Default', createdBy: 'admin', createdTime: '2023-09-30 03:50:48', updatedBy: 'SP01', updatedTime: '2024-04-18 22:45:32', secretKey: 'sk_live_123' },
            { id: 2, prefix: 'OLEID', brandId: 2, status: 'ACTIVE', currency: 'THB', configMode: 'Custom', createdBy: 'admin', createdTime: '2023-09-06 03:25:28', updatedBy: 'SP01', updatedTime: '2023-09-27 08:32:56', secretKey: 'sk_live_456' },
            { id: 3, prefix: 'OLETH', brandId: 2, status: 'ACTIVE', currency: 'CNY', configMode: 'Default', createdBy: 'admin', createdTime: '2023-09-05 02:05:33', updatedBy: 'SP01', updatedTime: '2023-09-13 18:29:24', secretKey: 'sk_live_789' },
            { id: 4, prefix: 'LNPLAY', brandId: 1, status: 'ACTIVE', currency: 'CNY', configMode: 'Default', createdBy: 'admin', createdTime: '2023-09-02 03:58:03', updatedBy: 'SP01', updatedTime: '2023-09-21 21:12:02', secretKey: 'sk_live_000' },
            { id: 5, prefix: 'HAOLITH', brandId: 1, status: 'ACTIVE', currency: 'CNY', configMode: 'Custom', createdBy: 'admin', createdTime: '2023-09-02 03:55:11', updatedBy: 'SP01', updatedTime: '2023-09-12 18:25:38', secretKey: 'sk_live_111' }
        ],
        roles: [
            { id: 1, prefix: 'OLEVN', name: 'Administrator', isSystem: true, permissions: ['ALL'], status: 'ACTIVE', createdBy: 'System', createdTime: '2023-09-30 03:50:48', updatedBy: '-', updatedTime: '-' },
            { id: 2, prefix: 'OLEVN', name: 'Support', isSystem: false, permissions: ['bank_account:Review', 'transaction:Review'], status: 'ACTIVE', createdBy: 'admin', createdTime: '2023-10-01 10:00:00', updatedBy: '-', updatedTime: '-' },
            { id: 3, prefix: 'OLEID', name: 'Administrator', isSystem: true, permissions: ['ALL'], status: 'ACTIVE', createdBy: 'System', createdTime: '2023-09-06 03:25:28', updatedBy: '-', updatedTime: '-' },
            { id: 4, prefix: 'OLETH', name: 'Administrator', isSystem: true, permissions: ['ALL'], status: 'ACTIVE', createdBy: 'System', createdTime: '2023-09-05 02:05:33', updatedBy: '-', updatedTime: '-' },
            { id: 5, prefix: 'LNPLAY', name: 'Administrator', isSystem: true, permissions: ['ALL'], status: 'ACTIVE', createdBy: 'System', createdTime: '2023-09-02 03:58:03', updatedBy: '-', updatedTime: '-' },
            { id: 6, prefix: 'HAOLITH', name: 'Administrator', isSystem: true, permissions: ['ALL'], status: 'ACTIVE', createdBy: 'System', createdTime: '2023-09-02 03:55:11', updatedBy: '-', updatedTime: '-' }
        ],
        accounts: [
            { id: 1, username: 'OLEVN_admin', roleId: 1, prefix: 'OLEVN', isSystem: true, status: 'ACTIVE', department: 'IT', realName: 'System Admin', lastLoginIp: '-', createdBy: 'System', createdTime: '2023-09-30 03:50:48', updatedBy: '-', updatedTime: '-' },
            { id: 2, username: 'OLEID_admin', roleId: 3, prefix: 'OLEID', isSystem: true, status: 'ACTIVE', department: 'IT', realName: 'System Admin', lastLoginIp: '-', createdBy: 'System', createdTime: '2023-09-06 03:25:28', updatedBy: '-', updatedTime: '-' },
            { id: 3, username: 'OLETH_admin', roleId: 4, prefix: 'OLETH', isSystem: true, status: 'ACTIVE', department: 'IT', realName: 'System Admin', lastLoginIp: '-', createdBy: 'System', createdTime: '2023-09-05 02:05:33', updatedBy: '-', updatedTime: '-' },
            { id: 4, username: 'LNPLAY_admin', roleId: 5, prefix: 'LNPLAY', isSystem: true, status: 'ACTIVE', department: 'IT', realName: 'System Admin', lastLoginIp: '-', createdBy: 'System', createdTime: '2023-09-02 03:58:03', updatedBy: '-', updatedTime: '-' },
            { id: 5, username: 'HAOLITH_admin', roleId: 6, prefix: 'HAOLITH', isSystem: true, status: 'ACTIVE', department: 'IT', realName: 'System Admin', lastLoginIp: '-', createdBy: 'System', createdTime: '2023-09-02 03:55:11', updatedBy: '-', updatedTime: '-' }
        ],
        banks: [
            { id: 1, bank_code: 'KBANK', bank_name: 'Kasikornbank', locale_bank_name: 'ธนาคารกสิกรไทย', currency: 'THB', status: 'ACTIVE', created_by: 'SYSTEM', created_time: '2016-11-20 15:19:24', updated_by: 'SYSTEM', updated_time: '2016-11-20 15:19:24' },
            { id: 2, bank_code: 'SCB', bank_name: 'Siam Commercial', locale_bank_name: 'ธนาคารไทยพาณิชย์', currency: 'THB', status: 'ACTIVE', created_by: 'SYSTEM', created_time: '2016-11-22 15:19:24', updated_by: 'SYSTEM', updated_time: '2016-11-22 15:19:24' },
            { id: 3, bank_code: 'KTB', bank_name: 'Krungthai', locale_bank_name: 'ธนาคารกรุงไทย', currency: 'THB', status: 'ACTIVE', created_by: 'SYSTEM', created_time: '2015-11-20 15:19:24', updated_by: 'SYSTEM', updated_time: '2015-11-20 15:19:24' },
            { id: 4, bank_code: 'BBL', bank_name: 'Bangkok Bank', locale_bank_name: 'ธนาคารกรุงเทพ', currency: 'THB', status: 'ACTIVE', created_by: 'SYSTEM', created_time: '2015-11-20 15:19:24', updated_by: 'SYSTEM', updated_time: '2015-11-20 15:19:24' },
            { id: 5, bank_code: 'BAY', bank_name: 'Krungsri', locale_bank_name: 'ธนาคารกรุงศรีอยุธยา', currency: 'THB', status: 'ACTIVE', created_by: 'SYSTEM', created_time: '2015-11-20 15:19:24', updated_by: 'SYSTEM', updated_time: '2015-11-20 15:19:24' },
            { id: 6, bank_code: 'GSB', bank_name: 'Government Savings', locale_bank_name: 'ธนาคารออมสิน', currency: 'THB', status: 'ACTIVE', created_by: 'SYSTEM', created_time: '2015-11-20 15:19:24', updated_by: 'SYSTEM', updated_time: '2015-11-20 15:19:24' },
            { id: 7, bank_code: 'HSBC', bank_name: 'HSBC', locale_bank_name: '匯豐銀行', currency: 'HKD', status: 'ACTIVE', created_by: 'SYSTEM', created_time: '2016-01-15 10:00:00', updated_by: 'SYSTEM', updated_time: '2016-01-15 10:00:00' }
        ],
        prefix_banks: [
            { id: 1, prefix: 'OLEVN', bank_code: 'KBANK', status: 'ACTIVE' },
            { id: 2, prefix: 'OLEVN', bank_code: 'SCB', status: 'ACTIVE' },
            { id: 3, prefix: 'OLEVN', bank_code: 'BBL', status: 'ACTIVE' },
            { id: 4, prefix: 'OLEID', bank_code: 'KBANK', status: 'ACTIVE' },
            { id: 5, prefix: 'OLEID', bank_code: 'KTB', status: 'ACTIVE' },
            { id: 6, prefix: 'OLETH', bank_code: 'HSBC', status: 'ACTIVE' }
        ],
        user_accounts: [
            { id: 1, prefix: 'OLEVN', username: 'device01', description: 'ATM - Central', secretKey: 'sk_device_001', status: 'ACTIVE', lastLoginIp: '192.168.1.10', createdBy: 'admin', createdTime: '2023-10-01 10:00:00', updatedBy: '-', updatedTime: '-' },
            { id: 2, prefix: 'OLEID', username: 'device02', description: 'Kiosk - Mall', secretKey: 'sk_device_002', status: 'ACTIVE', lastLoginIp: '192.168.1.11', createdBy: 'admin', createdTime: '2023-10-02 11:00:00', updatedBy: '-', updatedTime: '-' }
        ],
        transactions: [
            { id: 1, prefix: 'OLEVN', transactionTime: '2025-11-23 10:30:00', transactionNo: 'TXN-001', bankCode: 'KBANK', currency: 'THB', accountNo: '123-4-56789-0', counterAccountNo: '987-6-54321-0', accountName: 'John Doe', amount: 5000.00, type: 'DEPOSIT', matchedOrderNo: 'ORD-001', status: 'MATCHED', remark: 'Auto deposit' },
            { id: 2, prefix: 'OLEVN', transactionTime: '2025-11-23 11:15:00', transactionNo: 'TXN-002', bankCode: 'SCB', currency: 'THB', accountNo: '222-3-44444-5', counterAccountNo: '111-2-33333-4', accountName: 'Jane Smith', amount: 2000.00, type: 'WITHDRAW', matchedOrderNo: 'ORD-002', status: 'MATCHED', remark: 'Withdrawal request' },
            { id: 3, prefix: 'OLEVN', transactionTime: '2025-11-22 09:45:00', transactionNo: 'TXN-003', bankCode: 'BBL', currency: 'THB', accountNo: '555-6-77777-8', counterAccountNo: '444-5-66666-7', accountName: 'Robert Brown', amount: 10000.00, type: 'DEPOSIT', matchedOrderNo: null, status: 'UNMATCHED', remark: 'Pending verification' },
            { id: 4, prefix: 'OLEID', transactionTime: '2025-11-22 14:20:00', transactionNo: 'TXN-004', bankCode: 'KBANK', currency: 'THB', accountNo: '888-9-00000-1', counterAccountNo: '777-8-99999-0', accountName: 'Michael Lee', amount: 3000.00, type: 'DEPOSIT', matchedOrderNo: 'ORD-003', status: 'MATCHED', remark: 'Instant topup' },
            { id: 5, prefix: 'OLEID', transactionTime: '2025-11-21 16:50:00', transactionNo: 'TXN-005', bankCode: 'KTB', currency: 'THB', accountNo: '333-2-11111-0', counterAccountNo: '666-5-44444-3', accountName: 'Sarah Wilson', amount: 1500.00, type: 'WITHDRAW', matchedOrderNo: null, status: 'UNMATCHED', remark: 'System error' },
            { id: 6, prefix: 'OLETH', transactionTime: '2025-11-21 08:10:00', transactionNo: 'TXN-006', bankCode: 'HSBC', currency: 'CNY', accountNo: 'HK-123456', counterAccountNo: 'HK-654321', accountName: 'David Chen', amount: 50000.00, type: 'DEPOSIT', matchedOrderNo: 'ORD-004', status: 'MATCHED', remark: 'VIP Deposit' },
            { id: 7, prefix: 'OLETH', transactionTime: '2025-11-20 13:00:00', transactionNo: 'TXN-007', bankCode: 'HSBC', currency: 'CNY', accountNo: 'HK-123456', counterAccountNo: 'HK-654321', accountName: 'David Chen', amount: 20000.00, type: 'WITHDRAW', matchedOrderNo: 'ORD-005', status: 'MATCHED', remark: 'VIP Withdraw' },
            { id: 8, prefix: 'OLEVN', transactionTime: '2025-11-20 10:05:00', transactionNo: 'TXN-008', bankCode: 'KBANK', currency: 'THB', accountNo: '123-4-56789-0', counterAccountNo: '987-6-54321-0', accountName: 'John Doe', amount: 1000.00, type: 'DEPOSIT', matchedOrderNo: null, status: 'UNMATCHED', remark: 'Duplicate transaction?' },
            { id: 9, prefix: 'OLEID', transactionTime: '2025-11-19 15:30:00', transactionNo: 'TXN-009', bankCode: 'KBANK', currency: 'THB', accountNo: '888-9-00000-1', counterAccountNo: '777-8-99999-0', accountName: 'Michael Lee', amount: 500.00, type: 'DEPOSIT', matchedOrderNo: 'ORD-006', status: 'MATCHED', remark: 'Bonus credit' },
            { id: 10, prefix: 'OLEVN', transactionTime: '2025-11-18 12:00:00', transactionNo: 'TXN-010', bankCode: 'SCB', currency: 'THB', accountNo: '222-3-44444-5', counterAccountNo: '111-2-33333-4', accountName: 'Jane Smith', amount: 4500.00, type: 'WITHDRAW', matchedOrderNo: null, status: 'UNMATCHED', remark: 'Bank maintenance' }
        ],
        orders: [
            // PENDING Orders
            { id: 1, prefix: 'OLEVN', orderTime: '2025-11-23 11:30:00', orderNo: 'ORD-20251123-001', currency: 'THB', bankCode: 'KBANK', accountNo: '123-4-56789-0', counterAccountNo: '987-6-54321-0', accountName: 'John Doe', memberAccount: 'user001', amount: 5000.00, status: 'PENDING', updateBy: null, updateTime: null, matchedTransactionNo: null },
            { id: 2, prefix: 'OLEVN', orderTime: '2025-11-23 11:35:00', orderNo: 'ORD-20251123-002', currency: 'THB', bankCode: 'SCB', accountNo: '222-3-44444-5', counterAccountNo: '111-2-33333-4', accountName: 'Jane Smith', memberAccount: 'user002', amount: 2000.00, status: 'PENDING', updateBy: null, updateTime: null, matchedTransactionNo: null },
            { id: 3, prefix: 'OLEID', orderTime: '2025-11-23 10:00:00', orderNo: 'ORD-20251123-003', currency: 'THB', bankCode: 'KBANK', accountNo: '888-9-00000-1', counterAccountNo: '777-8-99999-0', accountName: 'Michael Lee', memberAccount: 'user003', amount: 3000.00, status: 'PENDING', updateBy: null, updateTime: null, matchedTransactionNo: null },
            { id: 4, prefix: 'OLETH', orderTime: '2025-11-23 09:15:00', orderNo: 'ORD-20251123-004', currency: 'CNY', bankCode: 'HSBC', accountNo: 'HK-123456', counterAccountNo: 'HK-654321', accountName: 'David Chen', memberAccount: 'user004', amount: 10000.00, status: 'PENDING', updateBy: null, updateTime: null, matchedTransactionNo: null },
            { id: 5, prefix: 'OLEVN', orderTime: '2025-11-22 15:45:00', orderNo: 'ORD-20251122-005', currency: 'THB', bankCode: 'BBL', accountNo: '555-6-77777-8', counterAccountNo: '444-5-66666-7', accountName: 'Robert Brown', memberAccount: 'user005', amount: 1500.00, status: 'PENDING', updateBy: null, updateTime: null, matchedTransactionNo: null },

            // MATCHED Orders
            { id: 6, prefix: 'OLEVN', orderTime: '2025-11-23 10:30:00', orderNo: 'ORD-001', currency: 'THB', bankCode: 'KBANK', accountNo: '123-4-56789-0', counterAccountNo: '987-6-54321-0', accountName: 'John Doe', memberAccount: 'user001', amount: 5000.00, status: 'MATCHED', updateBy: 'system', updateTime: '2025-11-23 10:30:05', matchedTransactionNo: 'TXN-001' },
            { id: 7, prefix: 'OLEID', orderTime: '2025-11-22 14:20:00', orderNo: 'ORD-003', currency: 'THB', bankCode: 'KBANK', accountNo: '888-9-00000-1', counterAccountNo: '777-8-99999-0', accountName: 'Michael Lee', memberAccount: 'user003', amount: 3000.00, status: 'MATCHED', updateBy: 'system', updateTime: '2025-11-22 14:20:10', matchedTransactionNo: 'TXN-004' },
            { id: 8, prefix: 'OLETH', orderTime: '2025-11-21 08:10:00', orderNo: 'ORD-004', currency: 'CNY', bankCode: 'HSBC', accountNo: 'HK-123456', counterAccountNo: 'HK-654321', accountName: 'David Chen', memberAccount: 'user004', amount: 50000.00, status: 'MATCHED', updateBy: 'system', updateTime: '2025-11-21 08:10:15', matchedTransactionNo: 'TXN-006' },
            { id: 9, prefix: 'OLEID', orderTime: '2025-11-19 15:30:00', orderNo: 'ORD-006', currency: 'THB', bankCode: 'KBANK', accountNo: '888-9-00000-1', counterAccountNo: '777-8-99999-0', accountName: 'Michael Lee', memberAccount: 'user003', amount: 500.00, status: 'MATCHED', updateBy: 'system', updateTime: '2025-11-19 15:30:05', matchedTransactionNo: 'TXN-009' },
            { id: 10, prefix: 'OLEVN', orderTime: '2025-11-23 08:00:00', orderNo: 'ORD-20251123-010', currency: 'THB', bankCode: 'SCB', accountNo: '222-3-44444-5', counterAccountNo: '111-2-33333-4', accountName: 'Jane Smith', memberAccount: 'user002', amount: 1000.00, status: 'MATCHED', updateBy: 'system', updateTime: '2025-11-23 08:00:10', matchedTransactionNo: 'TXN-011' },

            // CONFIRM Orders (mix of system auto-callback and admin manual confirm)
            { id: 11, prefix: 'OLEVN', orderTime: '2025-11-20 10:00:00', orderNo: 'ORD-20251120-011', currency: 'THB', bankCode: 'KBANK', accountNo: '123-4-56789-0', counterAccountNo: '987-6-54321-0', accountName: 'John Doe', memberAccount: 'user001', amount: 2000.00, status: 'CONFIRM', updateBy: 'system', updateTime: '2025-11-20 10:05:00', matchedTransactionNo: 'TXN-012' },
            { id: 12, prefix: 'OLEID', orderTime: '2025-11-20 11:00:00', orderNo: 'ORD-20251120-012', currency: 'THB', bankCode: 'KTB', accountNo: '333-2-11111-0', counterAccountNo: '666-5-44444-3', accountName: 'Sarah Wilson', memberAccount: 'user006', amount: 1500.00, status: 'CONFIRM', updateBy: 'OLEID_admin', updateTime: '2025-11-20 11:10:00', matchedTransactionNo: 'TXN-013' },
            { id: 13, prefix: 'OLETH', orderTime: '2025-11-19 09:00:00', orderNo: 'ORD-20251119-013', currency: 'CNY', bankCode: 'HSBC', accountNo: 'HK-123456', counterAccountNo: 'HK-654321', accountName: 'David Chen', memberAccount: 'user004', amount: 5000.00, status: 'CONFIRM', updateBy: 'system', updateTime: '2025-11-19 09:05:00', matchedTransactionNo: 'TXN-014' },
            { id: 14, prefix: 'OLEVN', orderTime: '2025-11-18 14:00:00', orderNo: 'ORD-20251118-014', currency: 'THB', bankCode: 'SCB', accountNo: '222-3-44444-5', counterAccountNo: '111-2-33333-4', accountName: 'Jane Smith', memberAccount: 'user002', amount: 3000.00, status: 'CONFIRM', updateBy: 'OLEVN_admin', updateTime: '2025-11-18 14:05:00', matchedTransactionNo: 'TXN-015' },
            { id: 15, prefix: 'OLEID', orderTime: '2025-11-18 16:00:00', orderNo: 'ORD-20251118-015', currency: 'THB', bankCode: 'KBANK', accountNo: '888-9-00000-1', counterAccountNo: '777-8-99999-0', accountName: 'Michael Lee', memberAccount: 'user003', amount: 1000.00, status: 'CONFIRM', updateBy: 'system', updateTime: '2025-11-18 16:05:00', matchedTransactionNo: 'TXN-016' },

            // CANCEL Orders (mix of system timeout and admin manual reject)
            { id: 16, prefix: 'OLEVN', orderTime: '2025-11-23 12:00:00', orderNo: 'ORD-20251123-016', currency: 'THB', bankCode: 'KBANK', accountNo: '123-4-56789-0', counterAccountNo: '987-6-54321-0', accountName: 'John Doe', memberAccount: 'user001', amount: 500.00, status: 'CANCEL', updateBy: 'OLEVN_admin', updateTime: '2025-11-23 12:05:00', matchedTransactionNo: null },
            { id: 17, prefix: 'OLEID', orderTime: '2025-11-22 13:00:00', orderNo: 'ORD-20251122-017', currency: 'THB', bankCode: 'KTB', accountNo: '333-2-11111-0', counterAccountNo: '666-5-44444-3', accountName: 'Sarah Wilson', memberAccount: 'user006', amount: 2500.00, status: 'CANCEL', updateBy: 'system', updateTime: '2025-11-22 13:05:00', matchedTransactionNo: null },
            { id: 18, prefix: 'OLETH', orderTime: '2025-11-21 10:00:00', orderNo: 'ORD-20251121-018', currency: 'CNY', bankCode: 'HSBC', accountNo: 'HK-123456', counterAccountNo: 'HK-654321', accountName: 'David Chen', memberAccount: 'user004', amount: 8000.00, status: 'CANCEL', updateBy: 'OLETH_admin', updateTime: '2025-11-21 10:05:00', matchedTransactionNo: null },
            { id: 19, prefix: 'OLEVN', orderTime: '2025-11-20 09:00:00', orderNo: 'ORD-20251120-019', currency: 'THB', bankCode: 'BBL', accountNo: '555-6-77777-8', counterAccountNo: '444-5-66666-7', accountName: 'Robert Brown', memberAccount: 'user005', amount: 1200.00, status: 'CANCEL', updateBy: 'system', updateTime: '2025-11-20 09:05:00', matchedTransactionNo: null },
            { id: 20, prefix: 'OLEID', orderTime: '2025-11-19 11:00:00', orderNo: 'ORD-20251119-020', currency: 'THB', bankCode: 'KBANK', accountNo: '888-9-00000-1', counterAccountNo: '777-8-99999-0', accountName: 'Michael Lee', memberAccount: 'user003', amount: 600.00, status: 'CANCEL', updateBy: 'OLEID_admin', updateTime: '2025-11-19 11:05:00', matchedTransactionNo: null }
        ],
        configurations: [
            // GENERAL configuration (SUPERADMIN default)
            { id: 1, prefix: 'GENERAL', emailEnabled: null, emailReceivers: null, telegramEnabled: null, telegramToken: null, telegramTarget: null, transactionMatchingTimeLimit: 60, orderMatchingTimeLimit: 60, updatedBy: 'system', updatedTime: '2025-11-23 10:00:00' }
        ],
        userSettings: {
            language: 'en' // or 'zh-TW'
        }
    };

    const saved = localStorage.getItem('globalState');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            // Merge saved state with defaults, but FORCE overwrite transactions and orders to ensure date fix and new data
            return { 
                ...parsed, 
                brands: defaultState.brands, // Ensure brands are always loaded
                // Backfill brandId for existing agents if missing
                agents: parsed.agents.map(agent => ({
                    ...agent,
                    brandId: agent.brandId || (['OLEVN', 'OLEID', 'OLETH'].includes(agent.prefix) ? 2 : 1) // Default assignment logic
                })),
                transactions: defaultState.transactions,
                orders: defaultState.orders,
                configurations: defaultState.configurations 
            };
        } catch (e) {
            console.error('Failed to parse saved globalState:', e);
        }
    }
    return defaultState;
};

// Global State with localStorage persistence
const globalState = reactive(loadGlobalState());

// Save globalState to localStorage whenever it changes
watch(globalState, () => {
    try {
        // Use JSON.parse(JSON.stringify()) to ensure we get a clean copy
        const stateToSave = JSON.parse(JSON.stringify(globalState));
        localStorage.setItem('globalState', JSON.stringify(stateToSave));
        console.log('Saved to localStorage:', stateToSave.accounts?.length, 'accounts');
    } catch (e) {
        console.error('Failed to save globalState:', e);
    }
}, { deep: true });

const menuItems = ref([
    {
        id: 1, name: 'Admin Management', icon: 'shield-check', expanded: true, children: [
            { id: 11, name: 'Prefix List', view: 'prefix-list' },
            { id: 12, name: 'Admin Role List', view: 'admin-role-list' },
            { id: 13, name: 'Admin Account List', view: 'admin-account-list' }
        ]
    },
    {
        id: 2, name: 'User Management', icon: 'users', expanded: true, children: [
            { id: 21, name: 'Bank List', view: 'bank-list' },
            { id: 22, name: 'Device Account List', view: 'user-account-list' }
        ]
    },
    {
        id: 3, name: 'Transaction Management', icon: 'arrow-left-right', expanded: true, children: [
            { id: 31, name: 'Transaction Records', view: 'transaction-history' }
        ]
    },
    {
        id: 4, name: 'Order Management', icon: 'shopping-bag', expanded: true, children: [
            { id: 41, name: 'Deposit List', view: 'deposit-list' }
        ]
    },
    {
        id: 5, name: 'System Management', icon: 'settings', expanded: true, children: [
            { id: 51, name: 'Configuration', view: 'configuration' }
        ]
    }
]);

// Always pass the original globalState to allow modifications
// Components will handle their own filtering based on userPrefix
const filteredGlobalState = computed(() => globalState);

const filteredMenuItems = computed(() => {
    if (userPrefix.value === 'SUPERADMIN') {
        return menuItems.value;
    }
    
    // Return reactive copies to ensure Sidebar toggle works
    return menuItems.value.map(item => {
        const newItem = { ...item }; // Shallow copy to avoid mutating original
        
        if (newItem.children) {
            newItem.children = newItem.children.filter(child => child.name !== 'Prefix List');
        }
        
        return reactive(newItem); // Make the copy reactive so Sidebar can mutate .expanded
    });
});

const pageTitle = computed(() => route.meta.title || 'Dashboard');
const parentTitle = computed(() => route.meta.parent || 'Admin Management');

</script>
