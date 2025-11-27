<template>
    <div class="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
        <div>Showing {{ startItem }} to {{ endItem }} of {{ totalItems }} entries</div>
        <div class="flex gap-2">
            <button 
                @click="$emit('update:currentPage', currentPage - 1)" 
                :disabled="currentPage === 1"
                class="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50 text-slate-600 transition-colors">
                Previous
            </button>
            
            <!-- Simple implementation: just show current page for now as per original design -->
            <button class="px-3 py-1 bg-primary text-white rounded shadow-sm">
                {{ currentPage }}
            </button>

            <button 
                @click="$emit('update:currentPage', currentPage + 1)" 
                :disabled="currentPage >= totalPages"
                class="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50 text-slate-600 transition-colors">
                Next
            </button>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    totalItems: {
        type: Number,
        required: true
    },
    currentPage: {
        type: Number,
        default: 1
    },
    itemsPerPage: {
        type: Number,
        default: 10
    }
});

defineEmits(['update:currentPage']);

const totalPages = computed(() => Math.ceil(props.totalItems / props.itemsPerPage) || 1);

const startItem = computed(() => {
    if (props.totalItems === 0) return 0;
    return (props.currentPage - 1) * props.itemsPerPage + 1;
});

const endItem = computed(() => {
    const end = props.currentPage * props.itemsPerPage;
    return end > props.totalItems ? props.totalItems : end;
});
</script>
