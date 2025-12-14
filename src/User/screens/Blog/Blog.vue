<template>
  <div class="blog-page">
    <Header />

    <Loading v-if="isLoading" />

    <div v-else class="blog-container">
      <div class="blog-header">
        <h1 class="blog-page-title">Blog</h1>
      </div>

      <div class="blog-grid">
        <div
          v-for="post in blogPosts"
          :key="post.id"
          class="blog-card"
          @click="goToBlogDetail(post.id)"
        >
          <div class="blog-image">
            <img :src="post.thumbnail" :alt="post.title" />
          </div>
          <div class="blog-content">
            <div class="blog-meta">
              <span class="author">
                <i class="fa-solid fa-user"></i> {{ post.authorName }}
              </span>
              <span class="date">
                <i class="fa-solid fa-calendar-days"></i> {{ new Date(post.createdAt).toLocaleDateString() }}
              </span>
            </div>
            <h3 class="blog-title">{{ post.title }}</h3>
            <a :href="`/blogdetail/${post.id}`" class="read-more">Read Post</a>
          </div>
        </div>
      </div>

      <div v-if="totalPages > 1" class="blog-pagination">
        <button class="page-btn" @click="goPrev" :disabled="page === 0">Prev</button>
        <span class="page-status">Trang {{ page + 1 }} / {{ totalPages }}</span>
        <button class="page-btn" @click="goNext" :disabled="page >= totalPages - 1">Next</button>
      </div>
    </div>

    <Footer />
    <Chatbot />
    <BottomNavBar />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Header from '@/User/components/Header1/Header.vue';
import Footer from '../../components/Footer/Footer.vue';
import Loading from '../../components/Loading/Loading.vue';
import { searchBlogs } from '@/api/blogApi.js';
import Chatbot from '@/User/components/Chatbot/Chatbot.vue'
import BottomNavBar from '@/User/components/BottomNavBar.vue'
import { useRouter } from 'vue-router';
const router = useRouter();

const isLoading = ref(true);
const blogPosts = ref([]);
const page = ref(0);
const size = ref(8);
const totalPages = ref(0);


const fetchBlogs = async () => {
  isLoading.value = true;
  try {
    const params = {
      page: page.value,
      size: size.value,
      sort: 'createdAt,desc'
    };
    const res = await searchBlogs(params);
    if (res.data.code === 200 && res.data.result) {
      blogPosts.value = res.data.result.content;
      totalPages.value = res.data.result.totalPages;
    }
  } catch (error) {
    console.error('Failed to load blogs:', error);
  } finally {
    isLoading.value = false;
  }
};

const changePage = (newPage) => {
  if (newPage >= 0 && newPage < totalPages.value) {
    page.value = newPage;
    fetchBlogs();
  }
};

const goNext = () => changePage(page.value + 1);
const goPrev = () => changePage(page.value - 1);

const goToBlogDetail = (id) => {
  router.push({ name: 'BlogDetail', params: { id } });
};


onMounted(() => {
  fetchBlogs();
});
</script>

<style scoped>
@import './Blog.css';
.blog-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 20px;
}
.page-btn {
  padding: 10px 20px;
  border: none;
  background-color: #2563eb;
  color: white;
  border-radius: 6px;
  cursor: pointer;
}
.page-btn:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}
.page-status {
  font-size: 16px;
  font-weight: 500;
}
</style>
