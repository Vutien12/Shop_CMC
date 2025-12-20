<template>
  <div class="demo-container">
    <h1>LoadingDots Component Demo</h1>

    <!-- Demo 1: Basic Usage -->
    <section class="demo-section">
      <h2>1. Sử dụng cơ bản</h2>
      <button @click="toggleDemo1" class="demo-btn">
        {{ demo1Loading ? 'Dừng Loading' : 'Bắt đầu Loading' }}
      </button>
      <LoadingDots :isLoading="demo1Loading">
        <div class="content-box">
          <h3>✅ Dữ liệu đã được tải!</h3>
          <p>Đây là nội dung hiển thị sau khi loading xong.</p>
        </div>
      </LoadingDots>
    </section>

    <!-- Demo 2: Custom Message -->
    <section class="demo-section">
      <h2>2. Message tùy chỉnh</h2>
      <button @click="toggleDemo2" class="demo-btn">
        {{ demo2Loading ? 'Dừng Loading' : 'Bắt đầu Loading' }}
      </button>
      <LoadingDots 
        :isLoading="demo2Loading"
        message="Đang tải sản phẩm..."
      >
        <div class="content-box">
          <h3>🛍️ Danh sách sản phẩm</h3>
          <ul>
            <li>Sản phẩm 1</li>
            <li>Sản phẩm 2</li>
            <li>Sản phẩm 3</li>
          </ul>
        </div>
      </LoadingDots>
    </section>

    <!-- Demo 3: With useLoading Composable -->
    <section class="demo-section">
      <h2>3. Sử dụng với useLoading composable</h2>
      <button @click="simulateApiCall" class="demo-btn" :disabled="isLoading">
        {{ isLoading ? 'Đang tải...' : 'Giả lập API Call' }}
      </button>
      <LoadingDots 
        :isLoading="isLoading"
        message="Đang tải dữ liệu từ server..."
      >
        <div class="content-box">
          <h3>📊 Dữ liệu từ API</h3>
          <p>Thời gian load: {{ loadTime }}ms</p>
          <p>Status: {{ apiStatus }}</p>
        </div>
      </LoadingDots>
    </section>

    <!-- Demo 4: Custom Height -->
    <section class="demo-section">
      <h2>4. Chiều cao tùy chỉnh (minHeight: 400px)</h2>
      <button @click="toggleDemo4" class="demo-btn">
        {{ demo4Loading ? 'Dừng Loading' : 'Bắt đầu Loading' }}
      </button>
      <LoadingDots 
        :isLoading="demo4Loading"
        minHeight="400px"
        message="Loading với chiều cao lớn hơn..."
      >
        <div class="content-box tall">
          <h3>📐 Container với chiều cao tùy chỉnh</h3>
          <p>Nội dung ở đây có chiều cao lớn hơn.</p>
        </div>
      </LoadingDots>
    </section>

    <!-- Demo 5: Multiple Loading States -->
    <section class="demo-section">
      <h2>5. Nhiều trạng thái loading cùng lúc</h2>
      <div class="button-group">
        <button @click="toggleDemo5A" class="demo-btn">
          Toggle A
        </button>
        <button @click="toggleDemo5B" class="demo-btn">
          Toggle B
        </button>
      </div>
      <div class="grid-demo">
        <div class="grid-item">
          <h4>Component A</h4>
          <LoadingDots 
            :isLoading="demo5ALoading"
            message="Loading A..."
            minHeight="150px"
          >
            <div class="content-box small">Content A</div>
          </LoadingDots>
        </div>
        <div class="grid-item">
          <h4>Component B</h4>
          <LoadingDots 
            :isLoading="demo5BLoading"
            message="Loading B..."
            minHeight="150px"
          >
            <div class="content-box small">Content B</div>
          </LoadingDots>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import LoadingDots from './LoadingDots.vue';
import { useLoading } from './useLoading';

// Demo 1
const demo1Loading = ref(true);
const toggleDemo1 = () => {
  demo1Loading.value = !demo1Loading.value;
};

// Demo 2
const demo2Loading = ref(false);
const toggleDemo2 = () => {
  demo2Loading.value = !demo2Loading.value;
};

// Demo 3 - with composable
const { isLoading, withLoading } = useLoading(false);
const loadTime = ref(0);
const apiStatus = ref('Chưa load');

const simulateApiCall = async () => {
  const startTime = Date.now();
  await withLoading(async () => {
    // Giả lập API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    const endTime = Date.now();
    loadTime.value = endTime - startTime;
    apiStatus.value = 'Thành công ✅';
  });
};

// Demo 4
const demo4Loading = ref(false);
const toggleDemo4 = () => {
  demo4Loading.value = !demo4Loading.value;
};

// Demo 5
const demo5ALoading = ref(true);
const demo5BLoading = ref(false);
const toggleDemo5A = () => {
  demo5ALoading.value = !demo5ALoading.value;
};
const toggleDemo5B = () => {
  demo5BLoading.value = !demo5BLoading.value;
};
</script>

<style scoped>
.demo-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

h1 {
  font-size: 32px;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 40px;
  text-align: center;
}

.demo-section {
  margin-bottom: 60px;
  padding: 30px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.demo-section h2 {
  font-size: 24px;
  color: #374151;
  margin-bottom: 20px;
  font-weight: 600;
}

.demo-section h4 {
  font-size: 16px;
  color: #6b7280;
  margin-bottom: 12px;
}

.demo-btn {
  background: #0068e1;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 20px;
}

.demo-btn:hover:not(:disabled) {
  background: #0057c2;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 104, 225, 0.3);
}

.demo-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.content-box {
  padding: 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
  min-height: 150px;
}

.content-box.tall {
  min-height: 300px;
}

.content-box.small {
  min-height: 80px;
  padding: 20px;
  font-size: 14px;
}

.content-box h3 {
  font-size: 22px;
  margin-bottom: 12px;
}

.content-box p {
  font-size: 16px;
  line-height: 1.6;
  opacity: 0.95;
}

.content-box ul {
  list-style: none;
  padding: 0;
}

.content-box li {
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.button-group {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.grid-demo {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.grid-item {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
}

@media (max-width: 768px) {
  .demo-container {
    padding: 20px 15px;
  }

  h1 {
    font-size: 24px;
  }

  .demo-section {
    padding: 20px;
  }

  .demo-section h2 {
    font-size: 20px;
  }
}
</style>
