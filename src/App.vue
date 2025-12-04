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

        agents: [
            { id: 1, prefix: 'OLEVN', status: 'ACTIVE', currency: 'THB', configMode: 'Default', createdBy: 'admin', createdTime: '2023-09-30 03:50:48', updatedBy: 'SP01', updatedTime: '2024-04-18 22:45:32', secretKey: 'sk_live_123' },
            { id: 2, prefix: 'OLEID', status: 'ACTIVE', currency: 'THB', configMode: 'Custom', createdBy: 'admin', createdTime: '2023-09-06 03:25:28', updatedBy: 'SP01', updatedTime: '2023-09-27 08:32:56', secretKey: 'sk_live_456' },
            { id: 3, prefix: 'OLETH', status: 'ACTIVE', currency: 'CNY', configMode: 'Default', createdBy: 'admin', createdTime: '2023-09-05 02:05:33', updatedBy: 'SP01', updatedTime: '2023-09-13 18:29:24', secretKey: 'sk_live_789' },
            { id: 4, prefix: 'LNPLAY', status: 'ACTIVE', currency: 'CNY', configMode: 'Default', createdBy: 'admin', createdTime: '2023-09-02 03:58:03', updatedBy: 'SP01', updatedTime: '2023-09-21 21:12:02', secretKey: 'sk_live_000' },
            { id: 5, prefix: 'HAOLITH', status: 'ACTIVE', currency: 'CNY', configMode: 'Custom', createdBy: 'admin', createdTime: '2023-09-02 03:55:11', updatedBy: 'SP01', updatedTime: '2023-09-12 18:25:38', secretKey: 'sk_live_111' }
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
            // Existing data (11/18 - 11/23)
            { id: 1, prefix: 'OLEVN', transactionTime: '2025-11-23 10:30:00', transactionNo: 'TXN-001', bankCode: 'KBANK', currency: 'THB', accountNo: '123-4-56789-0', counterAccountNo: '987-6-54321-0', accountName: 'John Doe', amount: 5000.00, type: 'DEPOSIT', matchedOrderNo: 'ORD-001', status: 'MATCHED', remark: 'Auto deposit' },
            { id: 2, prefix: 'OLEVN', transactionTime: '2025-11-23 11:15:00', transactionNo: 'TXN-002', bankCode: 'SCB', currency: 'THB', accountNo: '222-3-44444-5', counterAccountNo: '111-2-33333-4', accountName: 'Jane Smith', amount: 2000.00, type: 'WITHDRAW', matchedOrderNo: 'ORD-002', status: 'MATCHED', remark: 'Withdrawal request' },
            { id: 3, prefix: 'OLEVN', transactionTime: '2025-11-22 09:45:00', transactionNo: 'TXN-003', bankCode: 'BBL', currency: 'THB', accountNo: '555-6-77777-8', counterAccountNo: '444-5-66666-7', accountName: 'Robert Brown', amount: 10000.00, type: 'DEPOSIT', matchedOrderNo: null, status: 'UNMATCHED', remark: 'Pending verification' },
            { id: 4, prefix: 'OLEID', transactionTime: '2025-11-22 14:20:00', transactionNo: 'TXN-004', bankCode: 'KBANK', currency: 'THB', accountNo: '888-9-00000-1', counterAccountNo: '777-8-99999-0', accountName: 'Michael Lee', amount: 3000.00, type: 'DEPOSIT', matchedOrderNo: 'ORD-003', status: 'MATCHED', remark: 'Instant topup' },
            { id: 5, prefix: 'OLEID', transactionTime: '2025-11-21 16:50:00', transactionNo: 'TXN-005', bankCode: 'KTB', currency: 'THB', accountNo: '333-2-11111-0', counterAccountNo: '666-5-44444-3', accountName: 'Sarah Wilson', amount: 1500.00, type: 'WITHDRAW', matchedOrderNo: null, status: 'UNMATCHED', remark: 'System error' },
            { id: 6, prefix: 'OLETH', transactionTime: '2025-11-21 08:10:00', transactionNo: 'TXN-006', bankCode: 'HSBC', currency: 'CNY', accountNo: 'HK-123456', counterAccountNo: 'HK-654321', accountName: 'David Chen', amount: 50000.00, type: 'DEPOSIT', matchedOrderNo: 'ORD-004', status: 'MATCHED', remark: 'VIP Deposit' },
            { id: 7, prefix: 'OLETH', transactionTime: '2025-11-20 13:00:00', transactionNo: 'TXN-007', bankCode: 'HSBC', currency: 'CNY', accountNo: 'HK-123456', counterAccountNo: 'HK-654321', accountName: 'David Chen', amount: 20000.00, type: 'WITHDRAW', matchedOrderNo: 'ORD-005', status: 'MATCHED', remark: 'VIP Withdraw' },
            { id: 8, prefix: 'OLEVN', transactionTime: '2025-11-20 10:05:00', transactionNo: 'TXN-008', bankCode: 'KBANK', currency: 'THB', accountNo: '123-4-56789-0', counterAccountNo: '987-6-54321-0', accountName: 'John Doe', amount: 1000.00, type: 'DEPOSIT', matchedOrderNo: null, status: 'UNMATCHED', remark: 'Duplicate transaction?' },
            { id: 9, prefix: 'OLEID', transactionTime: '2025-11-19 15:30:00', transactionNo: 'TXN-009', bankCode: 'KBANK', currency: 'THB', accountNo: '888-9-00000-1', counterAccountNo: '777-8-99999-0', accountName: 'Michael Lee', amount: 500.00, type: 'DEPOSIT', matchedOrderNo: 'ORD-006', status: 'MATCHED', remark: 'Bonus credit' },
            { id: 10, prefix: 'OLEVN', transactionTime: '2025-11-18 12:00:00', transactionNo: 'TXN-010', bankCode: 'SCB', currency: 'THB', accountNo: '222-3-44444-5', counterAccountNo: '111-2-33333-4', accountName: 'Jane Smith', amount: 4500.00, type: 'WITHDRAW', matchedOrderNo: null, status: 'UNMATCHED', remark: 'Bank maintenance' },
            
            // New data (11/24 - 12/4)
            // 11/24 - 4 entries
            { id: 11, prefix: 'OLEVN', transactionTime: '2025-11-24 09:15:00', transactionNo: 'TXN-20251124-001', bankCode: 'KBANK', currency: 'THB', accountNo: '123-4-56789-0', counterAccountNo: '987-6-54321-0', accountName: 'John Doe', amount: 3500.00, type: 'DEPOSIT', matchedOrderNo: null, status: 'UNMATCHED', remark: 'Regular deposit' },
            { id: 12, prefix: 'OLEID', transactionTime: '2025-11-24 11:30:00', transactionNo: 'TXN-20251124-002', bankCode: 'SCB', currency: 'THB', accountNo: '888-9-00000-1', counterAccountNo: '777-8-99999-0', accountName: 'Michael Lee', amount: 2500.00, type: 'DEPOSIT', matchedOrderNo: null, status: 'MATCHED', remark: 'Quick topup' },
            { id: 13, prefix: 'OLETH', transactionTime: '2025-11-24 14:20:00', transactionNo: 'TXN-20251124-003', bankCode: 'HSBC', currency: 'CNY', accountNo: 'HK-123456', counterAccountNo: 'HK-654321', accountName: 'David Chen', amount: 15000.00, type: 'DEPOSIT', matchedOrderNo: null, status: 'MATCHED', remark: 'Business deposit' },
            { id: 14, prefix: 'OLEVN', transactionTime: '2025-11-24 16:45:00', transactionNo: 'TXN-20251124-004', bankCode: 'BBL', currency: 'THB', accountNo: '555-6-77777-8', counterAccountNo: '444-5-66666-7', accountName: 'Robert Brown', amount: 1800.00, type: 'WITHDRAW', matchedOrderNo: null, status: 'MATCHED', remark: 'Cash withdrawal' },
            
            // 11/25 - 5 entries
            { id: 15, prefix: 'OLEID', transactionTime: '2025-11-25 08:30:00', transactionNo: 'TXN-20251125-001', bankCode: 'KBANK', currency: 'THB', accountNo: '888-9-00000-1', counterAccountNo: '777-8-99999-0', accountName: 'Michael Lee', amount: 4200.00, type: 'DEPOSIT', matchedOrderNo: null, status: 'MATCHED', remark: 'Morning deposit' },
            { id: 16, prefix: 'OLEVN', transactionTime: '2025-11-25 10:15:00', transactionNo: 'TXN-20251125-002', bankCode: 'SCB', currency: 'THB', accountNo: '222-3-44444-5', counterAccountNo: '111-2-33333-4', accountName: 'Jane Smith', amount: 3300.00, type: 'DEPOSIT', matchedOrderNo: null, status: 'UNMATCHED', remark: 'Pending review' },
            { id: 17, prefix: 'OLETH', transactionTime: '2025-11-25 12:40:00', transactionNo: 'TXN-20251125-003', bankCode: 'HSBC', currency: 'CNY', accountNo: 'HK-123456', counterAccountNo: 'HK-654321', accountName: 'David Chen', amount: 25000.00, type: 'DEPOSIT', matchedOrderNo: null, status: 'MATCHED', remark: 'Large transfer' },
            { id: 18, prefix: 'OLEVN', transactionTime: '2025-11-25 15:20:00', transactionNo: 'TXN-20251125-004', bankCode: 'KBANK', currency: 'THB', accountNo: '123-4-56789-0', counterAccountNo: '987-6-54321-0', accountName: 'John Doe', amount: 2100.00, type: 'WITHDRAW', matchedOrderNo: null, status: 'MATCHED', remark: 'ATM withdrawal' },
            { id: 19, prefix: 'OLEID', transactionTime: '2025-11-25 17:50:00', transactionNo: 'TXN-20251125-005', bankCode: 'KTB', currency: 'THB', accountNo: '333-2-11111-0', counterAccountNo: '666-5-44444-3', accountName: 'Sarah Wilson', amount: 1600.00, type: 'DEPOSIT', matchedOrderNo: null, status: 'MATCHED', remark: 'Evening deposit' },
            
            // 11/26 - 3 entries
            { id: 20, prefix: 'OLEVN', transactionTime: '2025-11-26 09:00:00', transactionNo: 'TXN-20251126-001', bankCode: 'BBL', currency: 'THB', accountNo: '555-6-77777-8', counterAccountNo: '444-5-66666-7', accountName: 'Robert Brown', amount: 5500.00, type: 'DEPOSIT', matchedOrderNo: null, status: 'MATCHED', remark: 'Regular deposit' },
            { id: 21, prefix: 'OLETH', transactionTime: '2025-11-26 13:25:00', transactionNo: 'TXN-20251126-002', bankCode: 'HSBC', currency: 'CNY', accountNo: 'HK-123456', counterAccountNo: 'HK-654321', accountName: 'David Chen', amount: 18000.00, type: 'WITHDRAW', matchedOrderNo: null, status: 'MATCHED', remark: 'Business expense' },
            { id: 22, prefix: 'OLEID', transactionTime: '2025-11-26 16:10:00', transactionNo: 'TXN-20251126-003', bankCode: 'SCB', currency: 'THB', accountNo: '888-9-00000-1', counterAccountNo: '777-8-99999-0', accountName: 'Michael Lee', amount: 2800.00, type: 'DEPOSIT', matchedOrderNo: null, status: 'UNMATCHED', remark: 'Late deposit' },
            
            // 11/27 - 4 entries
            { id: 23, prefix: 'OLEVN', transactionTime: '2025-11-27 08:45:00', transactionNo: 'TXN-20251127-001', bankCode: 'KBANK', currency: 'THB', accountNo: '123-4-56789-0', counterAccountNo: '987-6-54321-0', accountName: 'John Doe', amount: 4800.00, type: 'DEPOSIT', matchedOrderNo: null, status: 'MATCHED', remark: 'Weekly deposit' },
            { id: 24, prefix: 'OLEID', transactionTime: '2025-11-27 11:20:00', transactionNo: 'TXN-20251127-002', bankCode: 'KBANK', currency: 'THB', accountNo: '888-9-00000-1', counterAccountNo: '777-8-99999-0', accountName: 'Michael Lee', amount: 3700.00, type: 'DEPOSIT', matchedOrderNo: null, status: 'MATCHED', remark: 'Mid-week topup' },
            { id: 25, prefix: 'OLETH', transactionTime: '2025-11-27 14:35:00', transactionNo: 'TXN-20251127-003', bankCode: 'HSBC', currency: 'CNY', accountNo: 'HK-123456', counterAccountNo: 'HK-654321', accountName: 'David Chen', amount: 22000.00, type: 'DEPOSIT', matchedOrderNo: null, status: 'MATCHED', remark: 'Investment fund' },
            { id: 26, prefix: 'OLEVN', transactionTime: '2025-11-27 17:00:00', transactionNo: 'TXN-20251127-004', bankCode: 'SCB', currency: 'THB', accountNo: '222-3-44444-5', counterAccountNo: '111-2-33333-4', accountName: 'Jane Smith', amount: 1900.00, type: 'WITHDRAW', matchedOrderNo: null, status: 'MATCHED', remark: 'Daily expense' },
            
            // 11/28 - 5 entries
            { id: 27, prefix: 'OLEID', transactionTime: '2025-11-28 09:10:00', transactionNo: 'TXN-20251128-001', bankCode: 'KTB', currency: 'THB', accountNo: '333-2-11111-0', counterAccountNo: '666-5-44444-3', accountName: 'Sarah Wilson', amount: 3200.00, type: 'DEPOSIT', matchedOrderNo: null, status: 'MATCHED', remark: 'Salary deposit' },
            { id: 28, prefix: 'OLEVN', transactionTime: '2025-11-28 11:45:00', transactionNo: 'TXN-20251128-002', bankCode: 'BBL', currency: 'THB', accountNo: '555-6-77777-8', counterAccountNo: '444-5-66666-7', accountName: 'Robert Brown', amount: 2600.00, type: 'DEPOSIT', matchedOrderNo: null, status: 'UNMATCHED', remark: 'Pending verification' },
            { id: 29, prefix: 'OLETH', transactionTime: '2025-11-28 13:30:00', transactionNo: 'TXN-20251128-003', bankCode: 'HSBC', currency: 'CNY', accountNo: 'HK-123456', counterAccountNo: 'HK-654321', accountName: 'David Chen', amount: 30000.00, type: 'DEPOSIT', matchedOrderNo: null, status: 'MATCHED', remark: 'Large business deposit' },
            { id: 30, prefix: 'OLEVN', transactionTime: '2025-11-28 15:15:00', transactionNo: 'TXN-20251128-004', bankCode: 'KBANK', currency: 'THB', accountNo: '123-4-56789-0', counterAccountNo: '987-6-54321-0', accountName: 'John Doe', amount: 1500.00, type: 'WITHDRAW', matchedOrderNo: null, status: 'MATCHED', remark: 'Cash out' },
            { id: 31, prefix: 'OLEID', transactionTime: '2025-11-28 17:40:00', transactionNo: 'TXN-20251128-005', bankCode: 'SCB', currency: 'THB', accountNo: '888-9-00000-1', counterAccountNo: '777-8-99999-0', accountName: 'Michael Lee', amount: 4100.00, type: 'DEPOSIT', matchedOrderNo: null, status: 'MATCHED', remark: 'Evening topup' },
            
            // 11/29 - 4 entries
            { id: 32, prefix: 'OLEVN', transactionTime: '2025-11-29 08:20:00', transactionNo: 'TXN-20251129-001', bankCode: 'SCB', currency: 'THB', accountNo: '222-3-44444-5', counterAccountNo: '111-2-33333-4', accountName: 'Jane Smith', amount: 3900.00, type: 'DEPOSIT', matchedOrderNo: null, status: 'MATCHED', remark: 'Friday deposit' },
            { id: 33, prefix: 'OLETH', transactionTime: '2025-11-29 10:50:00', transactionNo: 'TXN-20251129-002', bankCode: 'HSBC', currency: 'CNY', accountNo: 'HK-123456', counterAccountNo: 'HK-654321', accountName: 'David Chen', amount: 12000.00, type: 'WITHDRAW', matchedOrderNo: null, status: 'MATCHED', remark: 'Weekly withdrawal' },
            { id: 34, prefix: 'OLEID', transactionTime: '2025-11-29 14:15:00', transactionNo: 'TXN-20251129-003', bankCode: 'KBANK', currency: 'THB', accountNo: '888-9-00000-1', counterAccountNo: '777-8-99999-0', accountName: 'Michael Lee', amount: 2300.00, type: 'DEPOSIT', matchedOrderNo: null, status: 'MATCHED', remark: 'Afternoon deposit' },
            { id: 35, prefix: 'OLEVN', transactionTime: '2025-11-29 16:30:00', transactionNo: 'TXN-20251129-004', bankCode: 'KBANK', currency: 'THB', accountNo: '123-4-56789-0', counterAccountNo: '987-6-54321-0', accountName: 'John Doe', amount: 5200.00, type: 'DEPOSIT', matchedOrderNo: null, status: 'UNMATCHED', remark: 'End of week deposit' },
            
            // 11/30 - 3 entries
            { id: 36, prefix: 'OLEID', transactionTime: '2025-11-30 09:30:00', transactionNo: 'TXN-20251130-001', bankCode: 'KTB', currency: 'THB', accountNo: '333-2-11111-0', counterAccountNo: '666-5-44444-3', accountName: 'Sarah Wilson', amount: 2700.00, type: 'DEPOSIT', matchedOrderNo: null, status: 'MATCHED', remark: 'Weekend deposit' },
            { id: 37, prefix: 'OLETH', transactionTime: '2025-11-30 12:00:00', transactionNo: 'TXN-20251130-002', bankCode: 'HSBC', currency: 'CNY', accountNo: 'HK-123456', counterAccountNo: 'HK-654321', accountName: 'David Chen', amount: 28000.00, type: 'DEPOSIT', matchedOrderNo: null, status: 'MATCHED', remark: 'Month-end deposit' },
            { id: 38, prefix: 'OLEVN', transactionTime: '2025-11-30 15:45:00', transactionNo: 'TXN-20251130-003', bankCode: 'BBL', currency: 'THB', accountNo: '555-6-77777-8', counterAccountNo: '444-5-66666-7', accountName: 'Robert Brown', amount: 3400.00, type: 'DEPOSIT', matchedOrderNo: null, status: 'MATCHED', remark: 'Final November deposit' },
            
            // 12/01 - 5 entries
            { id: 39, prefix: 'OLEVN', transactionTime: '2025-12-01 08:00:00', transactionNo: 'TXN-20251201-001', bankCode: 'KBANK', currency: 'THB', accountNo: '123-4-56789-0', counterAccountNo: '987-6-54321-0', accountName: 'John Doe', amount: 6000.00, type: 'DEPOSIT', matchedOrderNo: null, status: 'MATCHED', remark: 'December start' },
            { id: 40, prefix: 'OLEID', transactionTime: '2025-12-01 10:20:00', transactionNo: 'TXN-20251201-002', bankCode: 'SCB', currency: 'THB', accountNo: '888-9-00000-1', counterAccountNo: '777-8-99999-0', accountName: 'Michael Lee', amount: 4500.00, type: 'DEPOSIT', matchedOrderNo: null, status: 'MATCHED', remark: 'Monthly topup' },
            { id: 41, prefix: 'OLETH', transactionTime: '2025-12-01 12:45:00', transactionNo: 'TXN-20251201-003', bankCode: 'HSBC', currency: 'CNY', accountNo: 'HK-123456', counterAccountNo: 'HK-654321', accountName: 'David Chen', amount: 35000.00, type: 'DEPOSIT', matchedOrderNo: null, status: 'MATCHED', remark: 'New month investment' },
            { id: 42, prefix: 'OLEVN', transactionTime: '2025-12-01 14:30:00', transactionNo: 'TXN-20251201-004', bankCode: 'SCB', currency: 'THB', accountNo: '222-3-44444-5', counterAccountNo: '111-2-33333-4', accountName: 'Jane Smith', amount: 2200.00, type: 'WITHDRAW', matchedOrderNo: null, status: 'MATCHED', remark: 'Shopping expense' },
            { id: 43, prefix: 'OLEID', transactionTime: '2025-12-01 16:50:00', transactionNo: 'TXN-20251201-005', bankCode: 'KBANK', currency: 'THB', accountNo: '888-9-00000-1', counterAccountNo: '777-8-99999-0', accountName: 'Michael Lee', amount: 3100.00, type: 'DEPOSIT', matchedOrderNo: null, status: 'UNMATCHED', remark: 'Late deposit' },
            
            // 12/02 - 4 entries
            { id: 44, prefix: 'OLETH', transactionTime: '2025-12-02 09:15:00', transactionNo: 'TXN-20251202-001', bankCode: 'HSBC', currency: 'CNY', accountNo: 'HK-123456', counterAccountNo: 'HK-654321', accountName: 'David Chen', amount: 16000.00, type: 'DEPOSIT', matchedOrderNo: null, status: 'MATCHED', remark: 'Business transaction' },
            { id: 45, prefix: 'OLEVN', transactionTime: '2025-12-02 11:40:00', transactionNo: 'TXN-20251202-002', bankCode: 'KBANK', currency: 'THB', accountNo: '123-4-56789-0', counterAccountNo: '987-6-54321-0', accountName: 'John Doe', amount: 2900.00, type: 'DEPOSIT', matchedOrderNo: null, status: 'MATCHED', remark: 'Regular deposit' },
            { id: 46, prefix: 'OLEID', transactionTime: '2025-12-02 14:10:00', transactionNo: 'TXN-20251202-003', bankCode: 'KTB', currency: 'THB', accountNo: '333-2-11111-0', counterAccountNo: '666-5-44444-3', accountName: 'Sarah Wilson', amount: 3600.00, type: 'DEPOSIT', matchedOrderNo: null, status: 'MATCHED', remark: 'Mid-day deposit' },
            { id: 47, prefix: 'OLEVN', transactionTime: '2025-12-02 16:25:00', transactionNo: 'TXN-20251202-004', bankCode: 'BBL', currency: 'THB', accountNo: '555-6-77777-8', counterAccountNo: '444-5-66666-7', accountName: 'Robert Brown', amount: 1700.00, type: 'WITHDRAW', matchedOrderNo: null, status: 'MATCHED', remark: 'Cash withdrawal' },
            
            // 12/03 - 5 entries
            { id: 48, prefix: 'OLEVN', transactionTime: '2025-12-03 08:30:00', transactionNo: 'TXN-20251203-001', bankCode: 'SCB', currency: 'THB', accountNo: '222-3-44444-5', counterAccountNo: '111-2-33333-4', accountName: 'Jane Smith', amount: 4300.00, type: 'DEPOSIT', matchedOrderNo: null, status: 'MATCHED', remark: 'Morning deposit' },
            { id: 49, prefix: 'OLEID', transactionTime: '2025-12-03 10:45:00', transactionNo: 'TXN-20251203-002', bankCode: 'SCB', currency: 'THB', accountNo: '888-9-00000-1', counterAccountNo: '777-8-99999-0', accountName: 'Michael Lee', amount: 5100.00, type: 'DEPOSIT', matchedOrderNo: null, status: 'MATCHED', remark: 'Large topup' },
            { id: 50, prefix: 'OLETH', transactionTime: '2025-12-03 13:20:00', transactionNo: 'TXN-20251203-003', bankCode: 'HSBC', currency: 'CNY', accountNo: 'HK-123456', counterAccountNo: 'HK-654321', accountName: 'David Chen', amount: 19000.00, type: 'WITHDRAW', matchedOrderNo: null, status: 'MATCHED', remark: 'Business payment' },
            { id: 51, prefix: 'OLEVN', transactionTime: '2025-12-03 15:00:00', transactionNo: 'TXN-20251203-004', bankCode: 'KBANK', currency: 'THB', accountNo: '123-4-56789-0', counterAccountNo: '987-6-54321-0', accountName: 'John Doe', amount: 3800.00, type: 'DEPOSIT', matchedOrderNo: null, status: 'UNMATCHED', remark: 'Afternoon deposit' },
            { id: 52, prefix: 'OLEID', transactionTime: '2025-12-03 17:15:00', transactionNo: 'TXN-20251203-005', bankCode: 'KBANK', currency: 'THB', accountNo: '888-9-00000-1', counterAccountNo: '777-8-99999-0', accountName: 'Michael Lee', amount: 2400.00, type: 'DEPOSIT', matchedOrderNo: null, status: 'MATCHED', remark: 'Evening topup' },
            
            // 12/04 - 4 entries
            { id: 53, prefix: 'OLETH', transactionTime: '2025-12-04 09:00:00', transactionNo: 'TXN-20251204-001', bankCode: 'HSBC', currency: 'CNY', accountNo: 'HK-123456', counterAccountNo: 'HK-654321', accountName: 'David Chen', amount: 27000.00, type: 'DEPOSIT', matchedOrderNo: null, status: 'MATCHED', remark: 'Weekly business deposit' },
            { id: 54, prefix: 'OLEVN', transactionTime: '2025-12-04 11:30:00', transactionNo: 'TXN-20251204-002', bankCode: 'KBANK', currency: 'THB', accountNo: '123-4-56789-0', counterAccountNo: '987-6-54321-0', accountName: 'John Doe', amount: 4700.00, type: 'DEPOSIT', matchedOrderNo: null, status: 'MATCHED', remark: 'Mid-week deposit' },
            { id: 55, prefix: 'OLEID', transactionTime: '2025-12-04 13:45:00', transactionNo: 'TXN-20251204-003', bankCode: 'SCB', currency: 'THB', accountNo: '888-9-00000-1', counterAccountNo: '777-8-99999-0', accountName: 'Michael Lee', amount: 3300.00, type: 'DEPOSIT', matchedOrderNo: null, status: 'PENDING', remark: 'Latest deposit' },
            { id: 56, prefix: 'OLEVN', transactionTime: '2025-12-04 14:20:00', transactionNo: 'TXN-20251204-004', bankCode: 'BBL', currency: 'THB', accountNo: '555-6-77777-8', counterAccountNo: '444-5-66666-7', accountName: 'Robert Brown', amount: 2100.00, type: 'WITHDRAW', matchedOrderNo: null, status: 'PENDING', remark: 'Current withdrawal' }
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
            { id: 20, prefix: 'OLEID', orderTime: '2025-11-19 11:00:00', orderNo: 'ORD-20251119-020', currency: 'THB', bankCode: 'KBANK', accountNo: '888-9-00000-1', counterAccountNo: '777-8-99999-0', accountName: 'Michael Lee', memberAccount: 'user003', amount: 600.00, status: 'CANCEL', updateBy: 'OLEID_admin', updateTime: '2025-11-19 11:05:00', matchedTransactionNo: null },
            
            // New data (11/24 - 12/4)
            // 11/24 - 4 orders
            { id: 21, prefix: 'OLEVN', orderTime: '2025-11-24 09:10:00', orderNo: 'ORD-20251124-001', currency: 'THB', bankCode: 'KBANK', accountNo: '123-4-56789-0', counterAccountNo: '987-6-54321-0', accountName: 'John Doe', memberAccount: 'user001', amount: 3500.00, status: 'PENDING', updateBy: null, updateTime: null, matchedTransactionNo: null },
            { id: 22, prefix: 'OLEID', orderTime: '2025-11-24 11:25:00', orderNo: 'ORD-20251124-002', currency: 'THB', bankCode: 'SCB', accountNo: '888-9-00000-1', counterAccountNo: '777-8-99999-0', accountName: 'Michael Lee', memberAccount: 'user003', amount: 2500.00, status: 'MATCHED', updateBy: 'system', updateTime: '2025-11-24 11:30:05', matchedTransactionNo: 'TXN-20251124-002' },
            { id: 23, prefix: 'OLETH', orderTime: '2025-11-24 14:15:00', orderNo: 'ORD-20251124-003', currency: 'CNY', bankCode: 'HSBC', accountNo: 'HK-123456', counterAccountNo: 'HK-654321', accountName: 'David Chen', memberAccount: 'user004', amount: 15000.00, status: 'MATCHED', updateBy: 'system', updateTime: '2025-11-24 14:20:10', matchedTransactionNo: 'TXN-20251124-003' },
            { id: 24, prefix: 'OLEVN', orderTime: '2025-11-24 16:40:00', orderNo: 'ORD-20251124-004', currency: 'THB', bankCode: 'BBL', accountNo: '555-6-77777-8', counterAccountNo: '444-5-66666-7', accountName: 'Robert Brown', memberAccount: 'user005', amount: 1800.00, status: 'CONFIRM', updateBy: 'system', updateTime: '2025-11-24 16:45:15', matchedTransactionNo: 'TXN-20251124-004' },
            
            // 11/25 - 5 orders
            { id: 25, prefix: 'OLEID', orderTime: '2025-11-25 08:25:00', orderNo: 'ORD-20251125-001', currency: 'THB', bankCode: 'KBANK', accountNo: '888-9-00000-1', counterAccountNo: '777-8-99999-0', accountName: 'Michael Lee', memberAccount: 'user003', amount: 4200.00, status: 'MATCHED', updateBy: 'system', updateTime: '2025-11-25 08:30:08', matchedTransactionNo: 'TXN-20251125-001' },
            { id: 26, prefix: 'OLEVN', orderTime: '2025-11-25 10:10:00', orderNo: 'ORD-20251125-002', currency: 'THB', bankCode: 'SCB', accountNo: '222-3-44444-5', counterAccountNo: '111-2-33333-4', accountName: 'Jane Smith', memberAccount: 'user002', amount: 3300.00, status: 'PENDING', updateBy: null, updateTime: null, matchedTransactionNo: null },
            { id: 27, prefix: 'OLETH', orderTime: '2025-11-25 12:35:00', orderNo: 'ORD-20251125-003', currency: 'CNY', bankCode: 'HSBC', accountNo: 'HK-123456', counterAccountNo: 'HK-654321', accountName: 'David Chen', memberAccount: 'user004', amount: 25000.00, status: 'MATCHED', updateBy: 'system', updateTime: '2025-11-25 12:40:12', matchedTransactionNo: 'TXN-20251125-003' },
            { id: 28, prefix: 'OLEVN', orderTime: '2025-11-25 15:15:00', orderNo: 'ORD-20251125-004', currency: 'THB', bankCode: 'KBANK', accountNo: '123-4-56789-0', counterAccountNo: '987-6-54321-0', accountName: 'John Doe', memberAccount: 'user001', amount: 2100.00, status: 'CONFIRM', updateBy: 'system', updateTime: '2025-11-25 15:20:09', matchedTransactionNo: 'TXN-20251125-004' },
            { id: 29, prefix: 'OLEID', orderTime: '2025-11-25 17:45:00', orderNo: 'ORD-20251125-005', currency: 'THB', bankCode: 'KTB', accountNo: '333-2-11111-0', counterAccountNo: '666-5-44444-3', accountName: 'Sarah Wilson', memberAccount: 'user006', amount: 1600.00, status: 'MATCHED', updateBy: 'system', updateTime: '2025-11-25 17:50:07', matchedTransactionNo: 'TXN-20251125-005' },
            
            // 11/26 - 3 orders
            { id: 30, prefix: 'OLEVN', orderTime: '2025-11-26 08:55:00', orderNo: 'ORD-20251126-001', currency: 'THB', bankCode: 'BBL', accountNo: '555-6-77777-8', counterAccountNo: '444-5-66666-7', accountName: 'Robert Brown', memberAccount: 'user005', amount: 5500.00, status: 'MATCHED', updateBy: 'system', updateTime: '2025-11-26 09:00:11', matchedTransactionNo: 'TXN-20251126-001' },
            { id: 31, prefix: 'OLETH', orderTime: '2025-11-26 13:20:00', orderNo: 'ORD-20251126-002', currency: 'CNY', bankCode: 'HSBC', accountNo: 'HK-123456', counterAccountNo: 'HK-654321', accountName: 'David Chen', memberAccount: 'user004', amount: 18000.00, status: 'CONFIRM', updateBy: 'system', updateTime: '2025-11-26 13:25:14', matchedTransactionNo: 'TXN-20251126-002' },
            { id: 32, prefix: 'OLEID', orderTime: '2025-11-26 16:05:00', orderNo: 'ORD-20251126-003', currency: 'THB', bankCode: 'SCB', accountNo: '888-9-00000-1', counterAccountNo: '777-8-99999-0', accountName: 'Michael Lee', memberAccount: 'user003', amount: 2800.00, status: 'PENDING', updateBy: null, updateTime: null, matchedTransactionNo: null },
            
            // 11/27 - 4 orders
            { id: 33, prefix: 'OLEVN', orderTime: '2025-11-27 08:40:00', orderNo: 'ORD-20251127-001', currency: 'THB', bankCode: 'KBANK', accountNo: '123-4-56789-0', counterAccountNo: '987-6-54321-0', accountName: 'John Doe', memberAccount: 'user001', amount: 4800.00, status: 'MATCHED', updateBy: 'system', updateTime: '2025-11-27 08:45:09', matchedTransactionNo: 'TXN-20251127-001' },
            { id: 34, prefix: 'OLEID', orderTime: '2025-11-27 11:15:00', orderNo: 'ORD-20251127-002', currency: 'THB', bankCode: 'KBANK', accountNo: '888-9-00000-1', counterAccountNo: '777-8-99999-0', accountName: 'Michael Lee', memberAccount: 'user003', amount: 3700.00, status: 'MATCHED', updateBy: 'system', updateTime: '2025-11-27 11:20:13', matchedTransactionNo: 'TXN-20251127-002' },
            { id: 35, prefix: 'OLETH', orderTime: '2025-11-27 14:30:00', orderNo: 'ORD-20251127-003', currency: 'CNY', bankCode: 'HSBC', accountNo: 'HK-123456', counterAccountNo: 'HK-654321', accountName: 'David Chen', memberAccount: 'user004', amount: 22000.00, status: 'MATCHED', updateBy: 'system', updateTime: '2025-11-27 14:35:16', matchedTransactionNo: 'TXN-20251127-003' },
            { id: 36, prefix: 'OLEVN', orderTime: '2025-11-27 16:55:00', orderNo: 'ORD-20251127-004', currency: 'THB', bankCode: 'SCB', accountNo: '222-3-44444-5', counterAccountNo: '111-2-33333-4', accountName: 'Jane Smith', memberAccount: 'user002', amount: 1900.00, status: 'CONFIRM', updateBy: 'system', updateTime: '2025-11-27 17:00:08', matchedTransactionNo: 'TXN-20251127-004' },
            
            // 11/28 - 5 orders
            { id: 37, prefix: 'OLEID', orderTime: '2025-11-28 09:05:00', orderNo: 'ORD-20251128-001', currency: 'THB', bankCode: 'KTB', accountNo: '333-2-11111-0', counterAccountNo: '666-5-44444-3', accountName: 'Sarah Wilson', memberAccount: 'user006', amount: 3200.00, status: 'MATCHED', updateBy: 'system', updateTime: '2025-11-28 09:10:11', matchedTransactionNo: 'TXN-20251128-001' },
            { id: 38, prefix: 'OLEVN', orderTime: '2025-11-28 11:40:00', orderNo: 'ORD-20251128-002', currency: 'THB', bankCode: 'BBL', accountNo: '555-6-77777-8', counterAccountNo: '444-5-66666-7', accountName: 'Robert Brown', memberAccount: 'user005', amount: 2600.00, status: 'PENDING', updateBy: null, updateTime: null, matchedTransactionNo: null },
            { id: 39, prefix: 'OLETH', orderTime: '2025-11-28 13:25:00', orderNo: 'ORD-20251128-003', currency: 'CNY', bankCode: 'HSBC', accountNo: 'HK-123456', counterAccountNo: 'HK-654321', accountName: 'David Chen', memberAccount: 'user004', amount: 30000.00, status: 'MATCHED', updateBy: 'system', updateTime: '2025-11-28 13:30:14', matchedTransactionNo: 'TXN-20251128-003' },
            { id: 40, prefix: 'OLEVN', orderTime: '2025-11-28 15:10:00', orderNo: 'ORD-20251128-004', currency: 'THB', bankCode: 'KBANK', accountNo: '123-4-56789-0', counterAccountNo: '987-6-54321-0', accountName: 'John Doe', memberAccount: 'user001', amount: 1500.00, status: 'CONFIRM', updateBy: 'system', updateTime: '2025-11-28 15:15:09', matchedTransactionNo: 'TXN-20251128-004' },
            { id: 41, prefix: 'OLEID', orderTime: '2025-11-28 17:35:00', orderNo: 'ORD-20251128-005', currency: 'THB', bankCode: 'SCB', accountNo: '888-9-00000-1', counterAccountNo: '777-8-99999-0', accountName: 'Michael Lee', memberAccount: 'user003', amount: 4100.00, status: 'MATCHED', updateBy: 'system', updateTime: '2025-11-28 17:40:12', matchedTransactionNo: 'TXN-20251128-005' },
            
            // 11/29 - 4 orders
            { id: 42, prefix: 'OLEVN', orderTime: '2025-11-29 08:15:00', orderNo: 'ORD-20251129-001', currency: 'THB', bankCode: 'SCB', accountNo: '222-3-44444-5', counterAccountNo: '111-2-33333-4', accountName: 'Jane Smith', memberAccount: 'user002', amount: 3900.00, status: 'MATCHED', updateBy: 'system', updateTime: '2025-11-29 08:20:10', matchedTransactionNo: 'TXN-20251129-001' },
            { id: 43, prefix: 'OLETH', orderTime: '2025-11-29 10:45:00', orderNo: 'ORD-20251129-002', currency: 'CNY', bankCode: 'HSBC', accountNo: 'HK-123456', counterAccountNo: 'HK-654321', accountName: 'David Chen', memberAccount: 'user004', amount: 12000.00, status: 'CONFIRM', updateBy: 'system', updateTime: '2025-11-29 10:50:13', matchedTransactionNo: 'TXN-20251129-002' },
            { id: 44, prefix: 'OLEID', orderTime: '2025-11-29 14:10:00', orderNo: 'ORD-20251129-003', currency: 'THB', bankCode: 'KBANK', accountNo: '888-9-00000-1', counterAccountNo: '777-8-99999-0', accountName: 'Michael Lee', memberAccount: 'user003', amount: 2300.00, status: 'MATCHED', updateBy: 'system', updateTime: '2025-11-29 14:15:11', matchedTransactionNo: 'TXN-20251129-003' },
            { id: 45, prefix: 'OLEVN', orderTime: '2025-11-29 16:25:00', orderNo: 'ORD-20251129-004', currency: 'THB', bankCode: 'KBANK', accountNo: '123-4-56789-0', counterAccountNo: '987-6-54321-0', accountName: 'John Doe', memberAccount: 'user001', amount: 5200.00, status: 'PENDING', updateBy: null, updateTime: null, matchedTransactionNo: null },
            
            // 11/30 - 3 orders
            { id: 46, prefix: 'OLEID', orderTime: '2025-11-30 09:25:00', orderNo: 'ORD-20251130-001', currency: 'THB', bankCode: 'KTB', accountNo: '333-2-11111-0', counterAccountNo: '666-5-44444-3', accountName: 'Sarah Wilson', memberAccount: 'user006', amount: 2700.00, status: 'MATCHED', updateBy: 'system', updateTime: '2025-11-30 09:30:09', matchedTransactionNo: 'TXN-20251130-001' },
            { id: 47, prefix: 'OLETH', orderTime: '2025-11-30 11:55:00', orderNo: 'ORD-20251130-002', currency: 'CNY', bankCode: 'HSBC', accountNo: 'HK-123456', counterAccountNo: 'HK-654321', accountName: 'David Chen', memberAccount: 'user004', amount: 28000.00, status: 'MATCHED', updateBy: 'system', updateTime: '2025-11-30 12:00:14', matchedTransactionNo: 'TXN-20251130-002' },
            { id: 48, prefix: 'OLEVN', orderTime: '2025-11-30 15:40:00', orderNo: 'ORD-20251130-003', currency: 'THB', bankCode: 'BBL', accountNo: '555-6-77777-8', counterAccountNo: '444-5-66666-7', accountName: 'Robert Brown', memberAccount: 'user005', amount: 3400.00, status: 'MATCHED', updateBy: 'system', updateTime: '2025-11-30 15:45:12', matchedTransactionNo: 'TXN-20251130-003' },
            
            // 12/01 - 5 orders
            { id: 49, prefix: 'OLEVN', orderTime: '2025-12-01 07:55:00', orderNo: 'ORD-20251201-001', currency: 'THB', bankCode: 'KBANK', accountNo: '123-4-56789-0', counterAccountNo: '987-6-54321-0', accountName: 'John Doe', memberAccount: 'user001', amount: 6000.00, status: 'MATCHED', updateBy: 'system', updateTime: '2025-12-01 08:00:11', matchedTransactionNo: 'TXN-20251201-001' },
            { id: 50, prefix: 'OLEID', orderTime: '2025-12-01 10:15:00', orderNo: 'ORD-20251201-002', currency: 'THB', bankCode: 'SCB', accountNo: '888-9-00000-1', counterAccountNo: '777-8-99999-0', accountName: 'Michael Lee', memberAccount: 'user003', amount: 4500.00, status: 'MATCHED', updateBy: 'system', updateTime: '2025-12-01 10:20:13', matchedTransactionNo: 'TXN-20251201-002' },
            { id: 51, prefix: 'OLETH', orderTime: '2025-12-01 12:40:00', orderNo: 'ORD-20251201-003', currency: 'CNY', bankCode: 'HSBC', accountNo: 'HK-123456', counterAccountNo: 'HK-654321', accountName: 'David Chen', memberAccount: 'user004', amount: 35000.00, status: 'MATCHED', updateBy: 'system', updateTime: '2025-12-01 12:45:15', matchedTransactionNo: 'TXN-20251201-003' },
            { id: 52, prefix: 'OLEVN', orderTime: '2025-12-01 14:25:00', orderNo: 'ORD-20251201-004', currency: 'THB', bankCode: 'SCB', accountNo: '222-3-44444-5', counterAccountNo: '111-2-33333-4', accountName: 'Jane Smith', memberAccount: 'user002', amount: 2200.00, status: 'CONFIRM', updateBy: 'system', updateTime: '2025-12-01 14:30:09', matchedTransactionNo: 'TXN-20251201-004' },
            { id: 53, prefix: 'OLEID', orderTime: '2025-12-01 16:45:00', orderNo: 'ORD-20251201-005', currency: 'THB', bankCode: 'KBANK', accountNo: '888-9-00000-1', counterAccountNo: '777-8-99999-0', accountName: 'Michael Lee', memberAccount: 'user003', amount: 3100.00, status: 'PENDING', updateBy: null, updateTime: null, matchedTransactionNo: null },
            
            // 12/02 - 4 orders
            { id: 54, prefix: 'OLETH', orderTime: '2025-12-02 09:10:00', orderNo: 'ORD-20251202-001', currency: 'CNY', bankCode: 'HSBC', accountNo: 'HK-123456', counterAccountNo: 'HK-654321', accountName: 'David Chen', memberAccount: 'user004', amount: 16000.00, status: 'MATCHED', updateBy: 'system', updateTime: '2025-12-02 09:15:12', matchedTransactionNo: 'TXN-20251202-001' },
            { id: 55, prefix: 'OLEVN', orderTime: '2025-12-02 11:35:00', orderNo: 'ORD-20251202-002', currency: 'THB', bankCode: 'KBANK', accountNo: '123-4-56789-0', counterAccountNo: '987-6-54321-0', accountName: 'John Doe', memberAccount: 'user001', amount: 2900.00, status: 'MATCHED', updateBy: 'system', updateTime: '2025-12-02 11:40:10', matchedTransactionNo: 'TXN-20251202-002' },
            { id: 56, prefix: 'OLEID', orderTime: '2025-12-02 14:05:00', orderNo: 'ORD-20251202-003', currency: 'THB', bankCode: 'KTB', accountNo: '333-2-11111-0', counterAccountNo: '666-5-44444-3', accountName: 'Sarah Wilson', memberAccount: 'user006', amount: 3600.00, status: 'MATCHED', updateBy: 'system', updateTime: '2025-12-02 14:10:14', matchedTransactionNo: 'TXN-20251202-003' },
            { id: 57, prefix: 'OLEVN', orderTime: '2025-12-02 16:20:00', orderNo: 'ORD-20251202-004', currency: 'THB', bankCode: 'BBL', accountNo: '555-6-77777-8', counterAccountNo: '444-5-66666-7', accountName: 'Robert Brown', memberAccount: 'user005', amount: 1700.00, status: 'CONFIRM', updateBy: 'system', updateTime: '2025-12-02 16:25:11', matchedTransactionNo: 'TXN-20251202-004' },
            
            // 12/03 - 5 orders
            { id: 58, prefix: 'OLEVN', orderTime: '2025-12-03 08:25:00', orderNo: 'ORD-20251203-001', currency: 'THB', bankCode: 'SCB', accountNo: '222-3-44444-5', counterAccountNo: '111-2-33333-4', accountName: 'Jane Smith', memberAccount: 'user002', amount: 4300.00, status: 'MATCHED', updateBy: 'system', updateTime: '2025-12-03 08:30:13', matchedTransactionNo: 'TXN-20251203-001' },
            { id: 59, prefix: 'OLEID', orderTime: '2025-12-03 10:40:00', orderNo: 'ORD-20251203-002', currency: 'THB', bankCode: 'SCB', accountNo: '888-9-00000-1', counterAccountNo: '777-8-99999-0', accountName: 'Michael Lee', memberAccount: 'user003', amount: 5100.00, status: 'MATCHED', updateBy: 'system', updateTime: '2025-12-03 10:45:15', matchedTransactionNo: 'TXN-20251203-002' },
            { id: 60, prefix: 'OLETH', orderTime: '2025-12-03 13:15:00', orderNo: 'ORD-20251203-003', currency: 'CNY', bankCode: 'HSBC', accountNo: 'HK-123456', counterAccountNo: 'HK-654321', accountName: 'David Chen', memberAccount: 'user004', amount: 19000.00, status: 'CONFIRM', updateBy: 'system', updateTime: '2025-12-03 13:20:12', matchedTransactionNo: 'TXN-20251203-003' },
            { id: 61, prefix: 'OLEVN', orderTime: '2025-12-03 14:55:00', orderNo: 'ORD-20251203-004', currency: 'THB', bankCode: 'KBANK', accountNo: '123-4-56789-0', counterAccountNo: '987-6-54321-0', accountName: 'John Doe', memberAccount: 'user001', amount: 3800.00, status: 'PENDING', updateBy: null, updateTime: null, matchedTransactionNo: null },
            { id: 62, prefix: 'OLEID', orderTime: '2025-12-03 17:10:00', orderNo: 'ORD-20251203-005', currency: 'THB', bankCode: 'KBANK', accountNo: '888-9-00000-1', counterAccountNo: '777-8-99999-0', accountName: 'Michael Lee', memberAccount: 'user003', amount: 2400.00, status: 'MATCHED', updateBy: 'system', updateTime: '2025-12-03 17:15:11', matchedTransactionNo: 'TXN-20251203-005' },
            
            // 12/04 - 4 orders
            { id: 63, prefix: 'OLETH', orderTime: '2025-12-04 08:55:00', orderNo: 'ORD-20251204-001', currency: 'CNY', bankCode: 'HSBC', accountNo: 'HK-123456', counterAccountNo: 'HK-654321', accountName: 'David Chen', memberAccount: 'user004', amount: 27000.00, status: 'MATCHED', updateBy: 'system', updateTime: '2025-12-04 09:00:14', matchedTransactionNo: 'TXN-20251204-001' },
            { id: 64, prefix: 'OLEVN', orderTime: '2025-12-04 11:25:00', orderNo: 'ORD-20251204-002', currency: 'THB', bankCode: 'KBANK', accountNo: '123-4-56789-0', counterAccountNo: '987-6-54321-0', accountName: 'John Doe', memberAccount: 'user001', amount: 4700.00, status: 'MATCHED', updateBy: 'system', updateTime: '2025-12-04 11:30:12', matchedTransactionNo: 'TXN-20251204-002' },
            { id: 65, prefix: 'OLEID', orderTime: '2025-12-04 13:40:00', orderNo: 'ORD-20251204-003', currency: 'THB', bankCode: 'SCB', accountNo: '888-9-00000-1', counterAccountNo: '777-8-99999-0', accountName: 'Michael Lee', memberAccount: 'user003', amount: 3300.00, status: 'PENDING', updateBy: null, updateTime: null, matchedTransactionNo: null },
            { id: 66, prefix: 'OLEVN', orderTime: '2025-12-04 14:15:00', orderNo: 'ORD-20251204-004', currency: 'THB', bankCode: 'BBL', accountNo: '555-6-77777-8', counterAccountNo: '444-5-66666-7', accountName: 'Robert Brown', memberAccount: 'user005', amount: 2100.00, status: 'PENDING', updateBy: null, updateTime: null, matchedTransactionNo: null }
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
                agents: parsed.agents,
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

// Simulation: Auto-match Transactions
const autoMatchTransactions = () => {
    if (!globalState.orders || !globalState.transactions) return;

    globalState.orders.forEach(order => {
        if (order.status !== 'PENDING') return;

        // Check if Bank is Visible and Active for this Prefix
        // Logic: Must exist in prefix_banks (Visible) AND have status 'ACTIVE' (Auto-match enabled)
        const prefixBank = globalState.prefix_banks.find(pb => 
            pb.prefix === order.prefix && pb.bank_code === order.bankCode
        );

        // If bank is not in prefix_banks (not visible) OR status is not ACTIVE, skip auto-match
        if (!prefixBank || prefixBank.status !== 'ACTIVE') return;

        // Find matching UNMATCHED transaction
        // Criteria: Same Prefix, Bank, Amount, and Type
        const matchingTx = globalState.transactions.find(tx => 
            tx.status === 'UNMATCHED' &&
            tx.prefix === order.prefix &&
            tx.bankCode === order.bankCode &&
            Math.abs(tx.amount - order.amount) < 0.01 &&
            tx.type === 'DEPOSIT' // Assuming orders are deposits
        );

        if (matchingTx) {
            // Match found! Update statuses
            order.status = 'MATCHED';
            order.matchedTransactionNo = matchingTx.transactionNo;
            order.updateBy = 'System (Auto)';
            order.updateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

            matchingTx.status = 'MATCHED';
            matchingTx.matchedOrderNo = order.orderNo;
            
            console.log(`Auto-matched Order ${order.orderNo} with Tx ${matchingTx.transactionNo}`);
        }
    });
};

// Run simulation every 5 seconds
setInterval(autoMatchTransactions, 5000);

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
