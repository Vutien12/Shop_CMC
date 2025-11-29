<template>
    <div class="col-lg-3 col-md-6 col-sm-6 stat-col">
        <div class="single-grid" :class="cardClass">
            <div class="card-content">
                <span class="count" :title="fullValue">{{ displayValue }}</span>
                <span class="title">{{ title }}</span>
            </div>
            <div class="single-grid-icon">
                <div class="icon-inner" v-html="icon"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    title: {
        type: String,
        required: true
    },
    value: {
        type: [Number, String],
        required: true
    },
    cardClass: {
        type: String,
        default: ''
    },
    icon: {
        type: String,
        required: true
    },
    format: {
        type: String,
        default: 'number' // 'number' or 'currency'
    }
});

const displayValue = computed(() => {
    if (props.format === 'currency') {
        const num = Number(props.value) || 0;
        // Always show full formatted VND value
        return new Intl.NumberFormat('vi-VN').format(num) + ' đ';
    }
    return props.value;
});

const fullValue = computed(() => {
    if (props.format === 'currency') {
        return new Intl.NumberFormat('vi-VN').format(Number(props.value) || 0) + ' đ';
    }
    return String(props.value);
});
</script>

<style scoped>
.single-grid {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 22px 24px;
    border-radius: 8px;
    color: #fff;
    margin-bottom: 18px;
    min-height: 96px;
}

.single-grid .card-content {
    display: flex;
    flex-direction: column;
}

.single-grid .count {
    font-size: 26px;
    font-weight: 700;
    color: #fff;
    margin-bottom: 6px;
}

.single-grid .title {
    font-size: 12px;
    color: rgba(255,255,255,0.9);
    font-weight: 600;
    letter-spacing: 0.5px;
}

.single-grid-icon {
    display: flex;
    align-items: center;
    justify-content: center;
}

.single-grid-icon .icon-inner {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 6px 20px rgba(0,0,0,0.08);
}

.single-grid-icon .icon-inner :deep(svg) {
    width: 28px;
    height: 28px;
}

/* Card Colors */
.total-sales { background: linear-gradient(90deg,#4361ee,#2f56d2); }
.total-orders { background: linear-gradient(90deg,#ff4d81,#ff2f6b); }
.total-products { background: linear-gradient(90deg,#ff7a3d,#ff6930); }
.total-customers { background: linear-gradient(90deg,#45d17f,#2fb86b); }

/* make svg icons inherit color from .icon-inner */
.single-grid-icon .icon-inner :deep(svg) {
    fill: currentColor;
}

.total-sales .icon-inner { color: #4361ee; }
.total-orders .icon-inner { color: #ff4d81; }
.total-products .icon-inner { color: #ff7a3d; }
.total-customers .icon-inner { color: #45d17f; }

/* Make columns a bit tighter on small screens */
.stat-col { padding-left: 8px; padding-right: 8px; }
</style>
