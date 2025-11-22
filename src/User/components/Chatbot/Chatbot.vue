<template>
  <div>
    <!-- Chatbot Button -->
    <button class="chatbot-button" @click="toggleChatbot">
      <svg class="chatbot-icon" viewBox="0 0 24 24" fill="white">
        <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 3 .97 4.29L2 22l5.71-.97C9 21.64 10.46 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.38 0-2.68-.28-3.87-.78l-.28-.12-2.85.48.48-2.85-.12-.28C4.78 14.68 4.5 13.38 4.5 12c0-4.14 3.36-7.5 7.5-7.5s7.5 3.36 7.5 7.5-3.36 7.5-7.5 7.5zm4-9.5h-8c-.28 0-.5.22-.5.5s.22.5.5.5h8c.28 0 .5-.22.5-.5s-.22-.5-.5-.5zm0 2.5h-8c-.28 0-.5.22-.5.5s.22.5.5.5h8c.28 0 .5-.22.5-.5s-.22-.5-.5-.5zm-3 2.5h-5c-.28 0-.5.22-.5.5s.22.5.5.5h5c.28 0 .5-.22.5-.5s-.22-.5-.5-.5z"/>
      </svg>
      <span class="chatbot-text">Chatbot</span>
    </button>

    <!-- Chatbot Window -->
    <div v-if="isOpen" class="chatbot-window">
      <div class="chatbot-header">
        <div class="chatbot-header-content">
          <svg class="chatbot-header-icon" viewBox="0 0 24 24" fill="white">
            <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 3 .97 4.29L2 22l5.71-.97C9 21.64 10.46 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.38 0-2.68-.28-3.87-.78l-.28-.12-2.85.48.48-2.85-.12-.28C4.78 14.68 4.5 13.38 4.5 12c0-4.14 3.36-7.5 7.5-7.5s7.5 3.36 7.5 7.5-3.36 7.5-7.5 7.5z"/>
          </svg>
          <div>
            <h3>Chat Support</h3>
            <span class="chatbot-status" :class="connectionStatus">{{ statusLabel }}</span>
          </div>
        </div>
        <button class="chatbot-close" @click="toggleChatbot">
          <svg viewBox="0 0 24 24" fill="white" width="24" height="24">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>

      <div class="chatbot-messages" ref="messagesContainer">
        <div v-for="(message, index) in messages" :key="index" :class="['message', message.type]">
          <div class="message-content">
            <div v-html="formatMessage(message.text)"></div>
            <span class="message-time">{{ message.time }}</span>
          </div>
        </div>
      </div>

      <div class="chatbot-input">
        <input
          v-model="inputMessage"
          @keyup.enter="sendMessage"
          type="text"
          placeholder="Nhập tin nhắn..."
        />
        <button @click="sendMessage" class="send-button">
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, computed, watch, onBeforeUnmount } from 'vue'
// Removed SockJS import - using native WebSocket for true streaming

const isOpen = ref(false)
const inputMessage = ref('')
const messagesContainer = ref(null)
const messages = ref([])

// WebSocket state
const models = ['gemini-2.5-flash', 'command-a-03-2025', 'open-router']
const selectedModel = ref(models[0])
const wsRef = ref(null)
const connectionStatus = ref('offline')
const reconnectTimer = ref(null)


const statusLabel = computed(() => {
  switch (connectionStatus.value) {
    case 'connecting':
      return 'Đang kết nối...'
    case 'online':
      return 'Online'
    default:
      return 'Offline'
  }
})

const formatMessage = (text) => {
  let html = text

  // Chuyển **text** thành <strong>
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')

  // Xóa dấu * ở đầu dòng (không tạo <li>)
  html = html.replace(/^\* /gm, '')

  // Chuyển các dòng thành <p>
  html = html.split('\n').map(line => {
    line = line.trim()
    if (!line) return '<br>'
    return '<p>' + line + '</p>'
  }).join('')

  // Dọn dẹp <p> trống
  html = html.replace(/<p><\/p>/g, '')

  return html
}

const toggleChatbot = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value && connectionStatus.value === 'offline') {
    connect()
  }
}

const appendMessage = (type, text) => {
  messages.value.push({
    type,
    text,
    time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  })
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const streamingMessageId = ref(null)

const updateLastBotMessage = (text) => {
  const lastMsg = messages.value[messages.value.length - 1]

  // Check if last message is a streaming response (not welcome/error message)
  const isStreamingMessage = lastMsg &&
                             lastMsg.type === 'bot' &&
                             lastMsg.id === streamingMessageId.value

  if (isStreamingMessage) {
    // Append to existing streaming message
    lastMsg.text += text
  } else {
    // Create new streaming message
    const newMsgId = Date.now()
    streamingMessageId.value = newMsgId
    messages.value.push({
      id: newMsgId,
      type: 'bot',
      text,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    })
  }

  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const connect = () => {
  const token = localStorage.getItem('accessToken')
  if (!token) {
    // Only show login message once - check if messages array is empty
    if (messages.value.length === 0) {
      appendMessage('bot', 'Bạn cần đăng nhập để sử dụng chatbot.')
    }
    return
  }

  if (wsRef.value) {
    wsRef.value.close()
  }

  connectionStatus.value = 'connecting'

  // Native WebSocket for true streaming (no SockJS buffering)
  const baseUrl = import.meta.env.VITE_API_BASE_URL
  const wsUrl = baseUrl.replace(/^http/, 'ws') + `/ws/chat?token=${encodeURIComponent(token)}`

  wsRef.value = new WebSocket(wsUrl)

  wsRef.value.onopen = () => {
    connectionStatus.value = 'online'
    console.log('[Chatbot] WebSocket connected:', wsUrl)
    console.log('[Chatbot] Origin:', window.location.origin)

    // Show welcome message only after successful connection
    if (messages.value.length === 0) {
      appendMessage('bot', 'Xin chào! Tôi là trợ lý ảo của Shop CMC. Bạn cần tư vấn về sản phẩm nào?')
    }
  }

  wsRef.value.onmessage = (event) => {
    const data = event.data
    console.log('%c[Chatbot] MESSAGE', 'background: #4CAF50; color: white; font-weight: bold; padding: 2px 6px', data)

    if (!data) return

    if (data === '[DONE]') {
      console.log('%c[Chatbot] DONE', 'background: #2196F3; color: white; font-weight: bold; padding: 2px 6px')
      streamingMessageId.value = null
      return
    }

    if (data.startsWith('[ERROR]')) {
      console.error('%c[Chatbot] ERROR', 'background: #F44336; color: white; font-weight: bold; padding: 2px 6px', data)
      appendMessage('bot', data.replace('[ERROR]', 'Lỗi: '))
      return
    }

    // Stream chunks từ backend
    updateLastBotMessage(data)
  }

  wsRef.value.onclose = () => {
    connectionStatus.value = 'offline'
    if (isOpen.value) {
      scheduleReconnect()
    }
  }

  wsRef.value.onerror = (err) => {
    console.error('[Chatbot] WebSocket error', err)
    console.error('[Chatbot] URL:', wsUrl)
    console.error('[Chatbot] Origin:', window.location.origin)
    console.error('[Chatbot] Possible causes:')
    console.error('  1. Backend not running on localhost:8080')
    console.error('  2. CORS not configured for', window.location.origin)
    console.error('  3. Token expired or invalid')
    appendMessage('bot', 'Có lỗi xảy ra với kết nối chatbot. Đang thử kết nối lại...')
    wsRef.value?.close()
  }
}

const scheduleReconnect = () => {
  if (reconnectTimer.value) return
  reconnectTimer.value = setTimeout(() => {
    reconnectTimer.value = null
    if (connectionStatus.value === 'offline') {
      connect()
    }
  }, 2000)
}

const sendMessage = () => {
  const message = inputMessage.value.trim()
  if (!message) return

  appendMessage('user', message)

  // Native WebSocket readyState: WebSocket.OPEN = 1
  if (!wsRef.value || wsRef.value.readyState !== WebSocket.OPEN) {
    appendMessage('bot', 'Kết nối chưa sẵn sàng, đang thử kết nối lại...')
    connect()
    return
  }

  // Gửi payload theo format backend: {model: string, message: string}
  const payload = {
    model: selectedModel.value,
    message: message
  }

  console.log('[Chatbot] Sending:', payload)
  wsRef.value.send(JSON.stringify(payload))
  inputMessage.value = ''
}

// Đóng WebSocket khi đóng chatbot
watch(isOpen, (open) => {
  if (!open && wsRef.value) {
    wsRef.value.close()
  }
})

// Cleanup khi component unmount
onBeforeUnmount(() => {
  if (wsRef.value) {
    wsRef.value.close()
  }
  if (reconnectTimer.value) {
    clearTimeout(reconnectTimer.value)
  }
})
</script>

<style scoped src="./Chatbot.css"></style>
