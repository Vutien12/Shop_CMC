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
            <span class="chatbot-status">Online</span>
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
            <p>{{ message.text }}</p>
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
import { ref, nextTick } from 'vue'

const isOpen = ref(false)
const inputMessage = ref('')
const messagesContainer = ref(null)
const messages = ref([
  {
    type: 'bot',
    text: 'Xin chào! Tôi có thể giúp gì cho bạn?',
    time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  }
])

const toggleChatbot = () => {
  isOpen.value = !isOpen.value
}

const sendMessage = () => {
  if (inputMessage.value.trim()) {
    const currentTime = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })

    messages.value.push({
      type: 'user',
      text: inputMessage.value,
      time: currentTime
    })

    const userMsg = inputMessage.value.toLowerCase()
    inputMessage.value = ''

    // Scroll to bottom
    nextTick(() => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
      }
    })

    // Auto reply
    setTimeout(() => {
      let botReply = 'Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất có thể!'

      if (userMsg.includes('giá') || userMsg.includes('bao nhiêu')) {
        botReply = 'Vui l      òng cho tôi biết sản phẩm bạn quan tâm để tôi có thể cung cấp thông tin giá chính xác nhất.'
      } else if (userMsg.includes('giao hàng') || userMsg.includes('ship')) {
        botReply = 'Chúng tôi hỗ trợ giao hàng toàn quốc. Miễn phí ship cho đơn hàng trên 300k!'
      } else if (userMsg.includes('bảo hành')) {
        botReply = 'Tất cả sản phẩm đều có chế độ bảo hành chính hãng. Thời gian bảo hành tùy thuộc vào từng loại sản phẩm.'
      } else if (userMsg.includes('xin chào') || userMsg.includes('hello') || userMsg.includes('hi')) {
        botReply = 'Xin chào! Rất vui được hỗ trợ bạn. Bạn cần tư vấn về sản phẩm nào?'
      }

      messages.value.push({
        type: 'bot',
        text: botReply,
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      })

      nextTick(() => {
        if (messagesContainer.value) {
          messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
        }
      })
    }, 1000)
  }
}
</script>

<style scoped src="./Chatbot.css"></style>
