<template>
    <div class="dashboard-panel sales-analytics">
        <div class="grid-header clearfix">
            <h5>Sales Analytics</h5>
        </div>
        <div class="canvas" ref="canvasWrapper">
            <canvas ref="chartCanvas" class="chart"></canvas>

            <!-- Tooltip overlay shown on hover -->
            <div
                v-if="tooltipVisible"
                ref="tooltipEl"
                class="chart-tooltip"
                :style="{ left: tooltipLeft + 'px', top: tooltipTop + 'px' }"
                role="status"
            >
                <div class="tt-line tt-title">{{ tooltipLabel }}</div>
                <div class="tt-line">Orders: {{ tooltipOrdersDisplay }}</div>
                <div class="tt-line">Sales: {{ tooltipSalesDisplay }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue';

    const chartCanvas = ref(null);
    const canvasWrapper = ref(null);

    const props = defineProps({
        data: {
            type: Object,
            default: () => ({
                // Default to days like the screenshot
                labels: ['Saturday','Sunday','Monday','Tuesday','Wednesday','Thursday','Friday'],
                values: [0, 4200, 2500, 500, 20000, 3000, 0],
                colors: ['#6f8bff','#ffb0d6','#ff7a66','#ffb46b','#9be09a','#b59bff','#cfd8e3'],
                // optional orders array for tooltip
                orders: [0,2,1,1,8,3,0]
            })
        },
        height: {
            type: Number,
            default: 300
        }
    });

    // Tooltip state
    const tooltipVisible = ref(false);
    const tooltipLeft = ref(0);
    const tooltipTop = ref(0);
    const tooltipLabel = ref('');
    const tooltipOrders = ref(null);
    const tooltipSales = ref(null);
    const tooltipEl = ref(null);

    const tooltipOrdersDisplay = computed(() => tooltipOrders.value == null ? '-' : tooltipOrders.value);
    const tooltipSalesDisplay = computed(() => {
        if (tooltipSales.value == null) return '-';
        // Format currency with commas and 2 decimals
        return `$${Number(tooltipSales.value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    });

    let resizeObserver = null;

    const getChartMetrics = () => {
        const canvas = chartCanvas.value;
        if (!canvas) return null;
        const container = canvas.parentElement;
        const width = Math.max(300, container.offsetWidth);
        const height = props.height;
        // add a bit more top padding so tall bars and rounded corners are not clipped
        const padding = { top: 30, right: 20, bottom: 40, left: 60 };
        const chartWidth = width - padding.left - padding.right;
        const chartHeight = height - padding.top - padding.bottom;
        const labels = props.data.labels || [];
        const data = props.data.values || [];
        const itemCount = labels.length;
        const step = chartWidth / itemCount;
        const barWidth = Math.min(72, step * 0.6);

        const maxVal = Math.max(...data, 0);
        const yStep = Math.ceil(maxVal / 5 / 1000) * 1000;
        const baseTop = yStep * 5 || maxVal || 1;
        // give a small headroom so the topmost bar never touches the top exactly
        const topMax = Math.ceil(baseTop * 1.06);

        return { width, height, padding, chartWidth, chartHeight, labels, data, itemCount, step, barWidth, topMax };
    };

    const drawChart = () => {
        const canvas = chartCanvas.value;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const container = canvas.parentElement;
        const width = Math.max(300, container.offsetWidth);
        const height = props.height;

        canvas.width = Math.floor(width * devicePixelRatio);
        canvas.height = Math.floor(height * devicePixelRatio);
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        ctx.setTransform(1,0,0,1,0,0);
        ctx.scale(devicePixelRatio, devicePixelRatio);

    // mirror padding and topMax calculation from getChartMetrics to avoid mismatch
    const padding = { top: 30, right: 20, bottom: 40, left: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

        // Clear
        ctx.clearRect(0, 0, width, height);

        const labels = props.data.labels || [];
        const data = props.data.values || [];
        const colors = props.data.colors || [];

    const maxVal = Math.max(...data, 0);
    const yStep = Math.ceil(maxVal / 5 / 1000) * 1000; // nice step in thousands
    const baseTop = yStep * 5 || maxVal || 1;
    const topMax = Math.ceil(baseTop * 1.06); // small headroom to avoid clipping

        // Draw gridlines and Y labels
        ctx.font = '12px Arial';
        ctx.fillStyle = '#666';
        ctx.textAlign = 'right';

        for (let i = 0; i <= 5; i++) {
            const yVal = (topMax / 5) * i;
            const y = padding.top + chartHeight - (chartHeight * i) / 5;

            ctx.beginPath();
            ctx.strokeStyle = '#e8e8e8';
            ctx.lineWidth = 1;
            ctx.moveTo(padding.left, y + 0.5);
            ctx.lineTo(padding.left + chartWidth, y + 0.5);
            ctx.stroke();

            // Y label
            ctx.fillStyle = '#777';
            ctx.fillText(`$${Math.round(yVal).toLocaleString()}`, padding.left - 10, y + 4);
        }

        // Bars
        const itemCount = labels.length;
        const step = chartWidth / itemCount;
        const barWidth = Math.min(72, step * 0.6);

        const radius = 6;
        const drawRoundedRect = (x, y, w, h, r) => {
            ctx.beginPath();
            ctx.moveTo(x + r, y);
            ctx.arcTo(x + w, y, x + w, y + h, r);
            ctx.arcTo(x + w, y + h, x, y + h, r);
            ctx.arcTo(x, y + h, x, y, r);
            ctx.arcTo(x, y, x + w, y, r);
            ctx.closePath();
            ctx.fill();
        };

        for (let i = 0; i < itemCount; i++) {
            const val = data[i] || 0;
            const xCenter = padding.left + step * i + step / 2;
            const x = xCenter - barWidth / 2;
            // compute height and clamp so we never draw beyond the chart area
            let h = (val / topMax) * chartHeight;
            if (!isFinite(h) || h < 0) h = 0;
            h = Math.min(h, chartHeight);
            let y = padding.top + chartHeight - h;
            // ensure y does not cross padding.top (avoid negative due to rounding)
            if (y < padding.top) y = padding.top;

            ctx.fillStyle = colors[i] || '#b4c1ff';
            drawRoundedRect(x, y, barWidth, h, Math.min(radius, barWidth / 2));
        }

        // X labels
        ctx.fillStyle = '#666';
        ctx.textAlign = 'center';
        ctx.font = '12px Arial';
        for (let i = 0; i < labels.length; i++) {
            const xCenter = padding.left + step * i + step / 2;
            ctx.fillText(labels[i], xCenter, padding.top + chartHeight + 22);
        }

        // If tooltip is visible, keep it positioned (recompute)
        if (tooltipVisible.value) repositionTooltip();
    };

    const resizeHandler = () => {
        drawChart();
    };

    // Determine which bar (if any) is under given mouse offset (CSS pixels)
    const barIndexAt = (offsetX, offsetY) => {
        const metrics = getChartMetrics();
        if (!metrics) return -1;
        const { padding, chartHeight, step, barWidth, labels, data, topMax } = metrics;

        // offsetX/offsetY are relative to canvas element's top-left in CSS pixels
        // compute relative to chart area
        const x = offsetX;
        const y = offsetY;

        // check vertical bounds (inside chart area)
        const chartTop = padding.top;
        const chartBottom = padding.top + chartHeight;
        if (y < chartTop || y > chartBottom) return -1;

        for (let i = 0; i < labels.length; i++) {
            const xCenter = padding.left + step * i + step / 2;
            const barX = xCenter - barWidth / 2;
            const val = data[i] || 0;
            const h = (val / topMax) * chartHeight;
            const barY = padding.top + chartHeight - h;
            const barH = h;

            if (x >= barX && x <= barX + barWidth && y >= barY && y <= barY + barH) {
                return i;
            }
        }
        return -1;
    };

    const repositionTooltip = () => {
        const canvas = chartCanvas.value;
        const wrapper = canvasWrapper.value || canvas.parentElement;
        const rect = wrapper.getBoundingClientRect();
        const metrics = getChartMetrics();
        if (!metrics) return;
        const { padding, chartHeight, step, barWidth } = metrics;

        // find index currently stored in tooltipLabel by matching label text
        const idx = props.data.labels.indexOf(tooltipLabel.value);
        const i = idx >= 0 ? idx : 0;
        const xCenter = padding.left + step * i + step / 2;
        // place tooltip centered horizontally at bar center
        // measure tooltip element if present
        let ttWidth = 140;
        let ttHeight = 56;
        if (tooltipEl.value) {
            const ttRect = tooltipEl.value.getBoundingClientRect();
            ttWidth = ttRect.width || ttWidth;
            ttHeight = ttRect.height || ttHeight;
        }

        // compute the y based on the bar top
        const val = props.data.values[i] || 0;
        const topMax = metrics.topMax;
        let h = (val / topMax) * chartHeight;
        if (!isFinite(h) || h < 0) h = 0;
        h = Math.min(h, chartHeight);
        let barY = padding.top + chartHeight - h;

        // center tooltip horizontally over bar center (xCenter is in CSS px relative to wrapper)
        let leftPx = Math.round(xCenter - ttWidth / 2);
        const wrapperWidth = rect.width;
        // clamp horizontally so tooltip stays inside wrapper with small margin
        const margin = 6;
        if (leftPx < margin) leftPx = margin;
        if (leftPx + ttWidth + margin > wrapperWidth) leftPx = Math.max(margin, wrapperWidth - ttWidth - margin);
        tooltipLeft.value = leftPx;

        // place tooltip above the bar with an 8px gap; if not enough room, clamp to margin
        let topPx = Math.round(barY - ttHeight - 8);
        if (topPx < margin) topPx = margin;
        tooltipTop.value = topPx;
    };

    const onMouseMove = (ev) => {
        const canvas = chartCanvas.value;
        if (!canvas) return;
        // get CSS coords relative to the canvas
        const rect = canvas.getBoundingClientRect();
        const offsetX = ev.clientX - rect.left;
        const offsetY = ev.clientY - rect.top;

        const idx = barIndexAt(offsetX, offsetY);
        if (idx === -1) {
            tooltipVisible.value = false;
            return;
        }

        // populate tooltip
        tooltipLabel.value = props.data.labels[idx] || '';
        tooltipOrders.value = (props.data.orders && props.data.orders[idx] != null) ? props.data.orders[idx] : null;
        tooltipSales.value = props.data.values && props.data.values[idx] != null ? props.data.values[idx] : null;

        // position tooltip centered at bar
        // set label/data then position using repositionTooltip which measures tooltip
        tooltipVisible.value = true;
        // next tick ensure tooltip element exists, then compute
        setTimeout(() => repositionTooltip(), 0);
    };

    const onMouseLeave = () => {
        tooltipVisible.value = false;
    };

    onMounted(() => {
        drawChart();
        window.addEventListener('resize', resizeHandler);
        // also observe parent size changes
        if (chartCanvas.value && window.ResizeObserver) {
            resizeObserver = new ResizeObserver(() => drawChart());
            resizeObserver.observe(chartCanvas.value.parentElement);
        }

        // attach mouse events
        if (chartCanvas.value) {
            chartCanvas.value.addEventListener('mousemove', onMouseMove);
            chartCanvas.value.addEventListener('mouseleave', onMouseLeave);
        }
    });

    onBeforeUnmount(() => {
        window.removeEventListener('resize', resizeHandler);
        if (resizeObserver && chartCanvas.value) resizeObserver.disconnect();
        if (chartCanvas.value) {
            chartCanvas.value.removeEventListener('mousemove', onMouseMove);
            chartCanvas.value.removeEventListener('mouseleave', onMouseLeave);
        }
    });

    watch(() => props.data, () => drawChart(), { deep: true });

</script>

<style scoped>
.dashboard-panel {
    background: #fff;
    border: 1px solid #e8e8e8;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
}

.grid-header {
    margin-bottom: 20px;
    border-bottom: 1px solid #e8e8e8;
    padding-bottom: 15px;
}

.grid-header h5 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #333;
}

.canvas {
    width: 100%;
    overflow: hidden;
}

.chart {
    width: 100%;
    height: auto;
}

.canvas {
    position: relative; /* for tooltip positioning */
}

.chart-tooltip {
    position: absolute;
    z-index: 20;
    width: 160px;
    pointer-events: none;
    background: rgba(38,36,36,0.96);
    color: #fff;
    padding: 8px 10px;
    border-radius: 6px;
    box-shadow: 0 6px 18px rgba(0,0,0,0.25);
    transform: translateX(0);
    font-size: 12px;
    transition: transform 120ms ease, opacity 120ms ease;
}

.chart-tooltip .tt-line { margin: 2px 0; }
.chart-tooltip .tt-title { font-weight: 600; margin-bottom: 6px; }

/* small caret pointing down from tooltip */
.chart-tooltip::after {
    content: '';
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: -6px; /* sits just below the tooltip box */
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid rgba(38,36,36,0.96);
}
</style>
