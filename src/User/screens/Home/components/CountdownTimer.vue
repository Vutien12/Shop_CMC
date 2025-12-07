<template>
  <div class="countdown-timer">
    <div class="time-unit">
      <span class="time-value">{{ days }}</span>
      <span class="time-label">Days</span>
    </div>
    <span class="separator">:</span>
    <div class="time-unit">
      <span class="time-value">{{ hours }}</span>
      <span class="time-label">Hours</span>
    </div>
    <span class="separator">:</span>
    <div class="time-unit">
      <span class="time-value">{{ minutes }}</span>
      <span class="time-label">Mins</span>
    </div>
    <span class="separator">:</span>
    <div class="time-unit">
      <span class="time-value">{{ seconds }}</span>
      <span class="time-label">Secs</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'

const props = defineProps({
  endTime: {
    type: String,
    required: true
  }
})

const now = ref(Date.now())
let intervalId = null

onMounted(() => {
  intervalId = setInterval(() => {
    now.value = Date.now()
  }, 1000)
})

onBeforeUnmount(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})

const timeLeft = computed(() => {
  const end = new Date(props.endTime).getTime()
  const diff = end - now.value

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000)
  }
})

const days = computed(() => String(timeLeft.value.days).padStart(2, '0'))
const hours = computed(() => String(timeLeft.value.hours).padStart(2, '0'))
const minutes = computed(() => String(timeLeft.value.minutes).padStart(2, '0'))
const seconds = computed(() => String(timeLeft.value.seconds).padStart(2, '0'))
</script>

<style scoped>
.countdown-timer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  background: #fff5f5;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #ffe0e0;
  width: fit-content;
  margin: 12px auto;
}

.time-unit {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  min-width: 34px;
  background: #ffffff;
  padding: 4px 5px;
  border-radius: 4px;
  border: 1px solid #f0f0f0;
}

.time-value {
  font-size: 15px;
  font-weight: 700;
  color: #ef4444;
  text-align: center;
  line-height: 1;
}

.time-label {
  font-size: 8px;
  color: #9ca3af;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.separator {
  font-size: 15px;
  font-weight: 700;
  color: #ef4444;
  line-height: 1;
  padding: 0 1px;
  animation: blink 1.5s infinite;
}

@keyframes blink {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0.4; }
}

@media (max-width: 768px) {
  .countdown-timer {
    gap: 4px;
    padding: 8px 10px;
    max-width: 240px;
  }

  .time-unit {
    min-width: 32px;
  }

  .time-value {
    font-size: 16px;
  }

  .time-label {
    font-size: 8px;
  }

  .separator {
    font-size: 16px;
  }
}
</style>

