# Loading Components

## LoadingDots Component

Component loading có thể tái sử dụng với 3 chấm màu xanh có animation.

### Props

- `isLoading` (Boolean, required): Trạng thái loading
- `message` (String): Thông báo hiển thị khi loading (mặc định: "Đang tải dữ liệu")
- `minHeight` (String): Chiều cao tối thiểu của container (mặc định: "200px")
- `fullScreen` (Boolean): Hiển thị loading toàn màn hình (mặc định: false)

### Slots

- `default`: Nội dung hiển thị khi không loading

### Cách sử dụng

#### 1. Sử dụng cơ bản

```vue
<template>
  <LoadingDots :isLoading="loading">
    <div>Nội dung của bạn ở đây</div>
  </LoadingDots>
</template>

<script setup>
import { ref } from 'vue';
import LoadingDots from '@/User/components/Loading/LoadingDots.vue';

const loading = ref(true);

// Giả lập load dữ liệu
setTimeout(() => {
  loading.value = false;
}, 2000);
</script>
```

#### 2. Sử dụng với message tùy chỉnh

```vue
<template>
  <LoadingDots 
    :isLoading="loading" 
    message="Đang tải sản phẩm..."
  >
    <ProductList :products="products" />
  </LoadingDots>
</template>
```

#### 3. Sử dụng với composable useLoading

```vue
<template>
  <LoadingDots :isLoading="isLoading">
    <div>
      <h1>Danh sách sản phẩm</h1>
      <div v-for="product in products" :key="product.id">
        {{ product.name }}
      </div>
    </div>
  </LoadingDots>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import LoadingDots from '@/User/components/Loading/LoadingDots.vue';
import { useLoading } from '@/User/components/Loading/useLoading';
import { productApi } from '@/api';

const { isLoading, withLoading } = useLoading(true);
const products = ref([]);

const fetchProducts = async () => {
  const response = await productApi.getProducts();
  products.value = response.data;
};

onMounted(async () => {
  await withLoading(fetchProducts);
});
</script>
```

#### 4. Sử dụng với nhiều API calls

```vue
<script setup>
import { ref, onMounted } from 'vue';
import LoadingDots from '@/User/components/Loading/LoadingDots.vue';
import { useLoading } from '@/User/components/Loading/useLoading';

const { isLoading, withLoading } = useLoading(true);
const products = ref([]);
const categories = ref([]);

const fetchData = async () => {
  const [productsRes, categoriesRes] = await Promise.all([
    productApi.getProducts(),
    categoryApi.getCategories()
  ]);
  
  products.value = productsRes.data;
  categories.value = categoriesRes.data;
};

onMounted(async () => {
  await withLoading(fetchData);
});
</script>
```

#### 5. Loading với chiều cao tùy chỉnh

```vue
<template>
  <LoadingDots 
    :isLoading="loading" 
    message="Đang xử lý..."
    minHeight="400px"
  >
    <YourContent />
  </LoadingDots>
</template>
```

#### 6. Full screen loading

```vue
<template>
  <LoadingDots 
    :isLoading="loading" 
    message="Đang xử lý đơn hàng..."
    :fullScreen="true"
  >
    <OrderConfirmation />
  </LoadingDots>
</template>
```

## useLoading Composable

Composable để quản lý trạng thái loading một cách dễ dàng.

### API

- `isLoading`: Ref boolean - Trạng thái loading hiện tại
- `startLoading()`: Function - Bắt đầu loading
- `stopLoading()`: Function - Dừng loading
- `toggleLoading()`: Function - Toggle trạng thái loading
- `withLoading(asyncFn)`: Function - Thực hiện async function với loading state tự động

### Ví dụ

```vue
<script setup>
import { useLoading } from '@/User/components/Loading/useLoading';

const { isLoading, startLoading, stopLoading, withLoading } = useLoading();

// Manual control
const handleClick = async () => {
  startLoading();
  try {
    await someAsyncOperation();
  } finally {
    stopLoading();
  }
};

// Automatic control
const handleAutoClick = async () => {
  await withLoading(async () => {
    await someAsyncOperation();
  });
};
</script>
```

## Features

- ✨ Animation 3 chấm màu xanh mượt mà
- 🔄 Có thể tái sử dụng dễ dàng
- 📱 Responsive design
- 🎨 Có thể tùy chỉnh message, chiều cao
- 🚀 Performance tốt với animation CSS
- 💡 Composable để quản lý state dễ dàng
- 🎯 TypeScript friendly
- 🌐 Hỗ trợ full screen loading
