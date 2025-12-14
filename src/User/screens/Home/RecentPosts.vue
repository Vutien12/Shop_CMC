<template>
  <div style="margin-top: 40px">
    <!-- Banner - Inside Container -->
    <div class="containerx">
      <div class="banner-container-4">
        <div
          class="banner-item"
          style="
            background-image: url(https://asia.fleetcart.envaysoft.com/storage/media/kRb5N2mGVnso21KKTsxenE4GuH3fjej5r2m8vY8V.png);
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
          "
        ></div>
      </div>
    </div>

    <!-- Recent Posts Section - Full Width -->
    <div class="recent-posts-showcase-full">
      <!-- Header - Centered Container -->
      <div class="containerx">
        <div class="showcase-header">
          <h2 class="section-title">Recent Posts</h2>
          <router-link to="/blog" class="view-all-btn">
            View All
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="9 18 15 12 9 6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </router-link>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading posts...</p>
      </div>

      <!-- Posts Container - Horizontal Scroll -->
      <div v-else-if="blogPosts.length > 0" class="containerx">
        <div class="posts-scroll-wrapper">
        <div
          class="posts-container-horizontal"
          ref="postsContainer"
          @mousedown="startDrag"
          @mousemove="onDrag"
          @mouseup="endDrag"
          @mouseleave="endDrag"
        >
          <div
            v-for="post in blogPosts"
            :key="post.id"
            class="blog-card-horizontal"
            @click="goToBlogDetail(post.id)"
          >
            <!-- Blog Image -->
            <div class="blog-image-wrapper">
              <img
                v-if="post.thumbnail"
                :src="post.thumbnail"
                :alt="post.title"
                class="blog-img"
              />
              <div v-else class="no-image">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              </div>
            </div>

            <!-- Blog Content -->
            <div class="blog-content-wrapper">
              <!-- Meta Info -->
              <div class="blog-meta">
                <div class="meta-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <circle cx="12" cy="7" r="4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span>{{ post.authorName }}</span>
                </div>
                <div class="meta-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <line x1="16" y1="2" x2="16" y2="6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <line x1="8" y1="2" x2="8" y2="6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <line x1="3" y1="10" x2="21" y2="10" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span>{{ formatDate(post.createdAt) }}</span>
                </div>
              </div>

              <!-- Title -->
              <h3 class="blog-title">{{ post.title }}</h3>

              <!-- Read Post Button -->
              <button class="read-post-btn" @click.stop="goToBlogDetail(post.id)">
                Read Post
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="5" y1="12" x2="19" y2="12" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <polyline points="12 5 19 12 12 19" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        </div>
      </div>

      <!-- No Posts State -->
      <div v-else class="no-posts-state">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <p>No blog posts found.</p>
      </div>

      <!-- Pagination Dots -->
      <div v-if="blogPosts.length > 0 && maxPages > 1" class="pagination-dots">
        <button
          v-for="page in maxPages"
          :key="page"
          class="dot"
          :class="{ active: currentPage === page - 1 }"
          @click="goToPage(page - 1)"
        ></button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { searchBlogs } from '@/api/blogApi.js'

const router = useRouter()

// State
const isLoading = ref(true)
const blogPosts = ref([])
const currentPage = ref(0)
const itemsPerPage = ref(4)
const postsContainer = ref(null)
const isDragging = ref(false)
const startX = ref(0)
const scrollLeft = ref(0)
// Computed property for max pages
const maxPages = computed(() => {
  const total = blogPosts.value.length
  return Math.ceil(total / itemsPerPage.value)
})

// Fetch recent blogs
const fetchBlogs = async () => {
  isLoading.value = true
  try {
    const params = {
      page: 0,
      size: 12, // Fetch 12 posts for pagination
      sort: 'createdAt,desc'
    }
    const res = await searchBlogs(params)
    if (res.data.code === 200 && res.data.result) {
      blogPosts.value = res.data.result.content.map(post => ({
        ...post,
        thumbnail: post.thumbnail?.url || post.thumbnail
      }))
    }
  } catch (error) {
    console.error('Failed to load blogs:', error)
  } finally {
    isLoading.value = false
  }
}

// Format date
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

// Navigate to blog detail
const goToBlogDetail = (id) => {
  router.push({ name: 'BlogDetail', params: { id } })
}

// Go to specific page
const goToPage = (page) => {
  if (!postsContainer.value) return

  const container = postsContainer.value
  const cardWidth = 360 // card width + gap
  const scrollAmount = cardWidth * itemsPerPage.value * page

  container.scrollTo({ left: scrollAmount, behavior: 'smooth' })
  currentPage.value = page
}

// Drag scroll functionality
const startDrag = (e) => {
  if (!postsContainer.value) return
  isDragging.value = true
  startX.value = e.pageX - postsContainer.value.offsetLeft
  scrollLeft.value = postsContainer.value.scrollLeft
  postsContainer.value.style.cursor = 'grabbing'
}

const onDrag = (e) => {
  if (!isDragging.value || !postsContainer.value) return
  e.preventDefault()
  const x = e.pageX - postsContainer.value.offsetLeft
  const walk = (x - startX.value) * 2
  postsContainer.value.scrollLeft = scrollLeft.value - walk
}

const endDrag = () => {
  if (!postsContainer.value) return
  isDragging.value = false
  postsContainer.value.style.cursor = 'grab'

  // Update current page based on scroll position
  const container = postsContainer.value
  const cardWidth = 360
  const scrollAmount = cardWidth * itemsPerPage.value
  currentPage.value = Math.round(container.scrollLeft / scrollAmount)
}

// Fetch blogs on mount
onMounted(() => {
  fetchBlogs()
})
</script>

<style scoped>
/* No need to redefine containerx - it's already defined in Home.css */

/* Banner Section - Inside Container */
.banner-container-4 {
  width: 100%;
  margin-bottom: 40px;
  border-radius: 12px;
  overflow: hidden;
}

.banner-item {
  width: 100%;
  transition: transform 0.3s ease;
  cursor: pointer;
  display: block;
}

.banner-item:hover {
  transform: scale(1.01);
}

/* Recent Posts Showcase - Full Width Background */
.recent-posts-showcase-full {
  margin-top: 40px;
  width: 100%;
  background: #ffffff;
  padding: 50px 0;
  border-top: 1px solid #e3e6e6;
  border-bottom: 1px solid #e3e6e6;
}

/* Header */
.showcase-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.section-title {
  font-size: 28px;
  font-weight: 700;
  color: #0f1111;
  margin: 0;
}

.view-all-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #ff6b35 0%, #ff8c61 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(255, 107, 53, 0.3);
  text-decoration: none;
}

.view-all-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.4);
}

.view-all-btn svg {
  width: 16px;
  height: 16px;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 16px;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #ff6b35;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-state p {
  font-size: 15px;
  color: #565959;
}

/* Posts Horizontal Scroll Container */
.posts-scroll-wrapper {
  width: 100%;
  overflow: hidden;
}

.posts-container-horizontal {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding: 20px 0;
  cursor: grab;
  user-select: none;

  /* Hide scrollbar */
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.posts-container-horizontal::-webkit-scrollbar {
  display: none;
}

.posts-container-horizontal:active {
  cursor: grabbing;
}

/* Blog Card - Horizontal (Wider than tall) */
.blog-card-horizontal {
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e3e6e6;
  display: flex;
  flex-direction: column;
  min-width: 340px;
  max-width: 340px;
  flex-shrink: 0;
}

.blog-card-horizontal:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: #ff6b35;
}

/* Blog Image - Wider aspect ratio */
.blog-image-wrapper {
  width: 100%;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f7f8f8;
  overflow: hidden;
  position: relative;
}

.blog-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.blog-card-horizontal:hover .blog-img {
  transform: scale(1.05);
}

.no-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
}

.no-image svg {
  color: #ccc;
}

/* Blog Content */
.blog-content-wrapper {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}

/* Meta Info */
.blog-meta {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #565959;
}

.meta-item svg {
  width: 14px;
  height: 14px;
  color: #ff6b35;
}

.meta-item span {
  font-weight: 500;
}

/* Blog Title */
.blog-title {
  font-size: 16px;
  font-weight: 600;
  color: #0f1111;
  line-height: 1.4;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 44px;
}

/* Read Post Button */
.read-post-btn {
  margin-top: auto;
  width: 100%;
  padding: 10px;
  background: #f7f8f8;
  border: 1px solid #e3e6e6;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #0f1111;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.read-post-btn:hover {
  background: #ff6b35;
  color: #ffffff;
  border-color: #ff6b35;
}

.read-post-btn svg {
  width: 16px;
  height: 16px;
  transition: transform 0.3s ease;
}

.read-post-btn:hover svg {
  transform: translateX(4px);
}

/* No Posts State */
.no-posts-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 16px;
}

.no-posts-state svg {
  color: #ccc;
}

.no-posts-state p {
  font-size: 15px;
  color: #565959;
}

/* Pagination Dots */
.pagination-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 24px;
  padding-bottom: 20px;
}

.pagination-dots .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #e3e6e6;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
}

.pagination-dots .dot:hover {
  background: #ff6b35;
  transform: scale(1.2);
}

.pagination-dots .dot.active {
  background: #ff6b35;
  width: 24px;
  border-radius: 4px;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .showcase-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
}

@media (max-width: 768px) {
  .section-title {
    font-size: 24px;
  }

  .blog-card-horizontal {
    min-width: 280px;
    max-width: 280px;
  }

  .blog-image-wrapper {
    height: 160px;
  }

  .blog-title {
    font-size: 14px;
  }

  .blog-content-wrapper {
    padding: 16px;
  }
}
</style>

