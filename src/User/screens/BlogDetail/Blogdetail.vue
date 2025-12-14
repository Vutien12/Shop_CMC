<template>
  <div class="blog-detail-page">
    <Header />

    <Loading v-if="isLoading" />

    <div v-else-if="error" class="error-container">
      <p class="error-message">{{ error }}</p>
      <button @click="$router.push('/blog')" class="back-btn">Quay lại Blog</button>
    </div>

    <div v-else class="blog-detail-container">
      <!-- Blog Header Image -->
      <div v-if="blogPost.thumbnail" class="blog-detail-header">
        <img :src="blogPost.thumbnail" :alt="blogPost.title" class="header-image" />
      </div>

      <!-- Blog Meta Info -->
      <div class="blog-meta-info">
        <span class="author">
          <i class="fa-solid fa-user"></i> {{ blogPost.authorName || 'Unknown' }}
        </span>
        <span class="date">
          <i class="fa-solid fa-calendar-days"></i> {{ formatDate(blogPost.createdAt) }}
        </span>
        <span v-if="blogPost.updatedAt !== blogPost.createdAt" class="updated">
          <i class="fa-solid fa-clock"></i> Cập nhật: {{ formatDate(blogPost.updatedAt) }}
        </span>
      </div>

      <!-- Blog Title -->
      <h1 class="blog-detail-title">{{ blogPost.title }}</h1>

      <!-- Blog Content (render HTML safely) -->
      <div class="blog-detail-content" v-html="sanitizedContent"></div>

      <!-- Social Share -->
      <div class="social-share">
        <strong>Share:</strong>
        <button @click="shareOnSocial('facebook')" class="share-btn">
          <i class="fa-brands fa-facebook-f"></i>
        </button>
        <button @click="shareOnSocial('twitter')" class="share-btn">
          <i class="fa-brands fa-x-twitter"></i>
        </button>
        <button @click="shareOnSocial('linkedin')" class="share-btn">
          <i class="fa-brands fa-linkedin-in"></i>
        </button>
        <button @click="shareOnSocial('tumblr')" class="share-btn">
          <i class="fa-brands fa-tumblr"></i>
        </button>
      </div>
    </div>

    <Footer />
    <BottomNavBar />
  </div>
</template>

<script>
import Header from '@/User/components/Header1/Header.vue'
import Footer from '../../components/Footer/Footer.vue'
import Loading from '../../components/Loading/Loading.vue'
import axiosInstance from '@/api/axiosInstance'
import DOMPurify from 'dompurify'
import BottomNavBar from '@/User/components/BottomNavBar.vue'

export default {
  name: 'BlogDetail',
  components: {
    Header,
    Footer,
    Loading,
    BottomNavBar
  },
  data() {
    return {
      isLoading: true,
      error: null,
      blogPost: {
        id: null,
        title: '',
        content: '',
        thumbnail: '',
        authorId: null,
        authorName: '',
        isPublished: true,
        createdAt: '',
        updatedAt: ''
      }
    }
  },
  computed: {
    sanitizedContent() {
      // Sanitize HTML content to prevent XSS attacks
      return DOMPurify.sanitize(this.blogPost.content || '', {
        ALLOWED_TAGS: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'strong', 'em', 'u', 'a', 'img', 'br', 'div', 'span', 'blockquote', 'pre', 'code', 'iframe'],
        ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'style', 'class', 'id', 'width', 'height', 'frameborder', 'allowfullscreen', 'allow']
      })
    }
  },
  mounted() {
    this.loadBlogPost()
  },
  methods: {
    async loadBlogPost() {
      try {
        this.isLoading = true
        this.error = null

        // Get blog ID from route params
        const blogId = this.$route.params.id

        if (!blogId) {
          throw new Error('Không tìm thấy ID bài viết')
        }

        // Fetch blog detail from API
        const response = await axiosInstance.get(`/blogs/${blogId}`)

        if (response.data.code === 200 && response.data.result) {
          const result = response.data.result
          this.blogPost = {
            ...result,
            thumbnail: result.thumbnail?.url || result.thumbnail
          }
        } else {
          throw new Error(response.data.message || 'Không thể tải bài viết')
        }
      } catch (err) {
        console.error('Error loading blog post:', err)
        this.error = err.response?.data?.message || err.message || 'Không thể tải bài viết. Vui lòng thử lại sau.'
      } finally {
        this.isLoading = false
      }
    },
    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    shareOnSocial(platform) {
      const url = window.location.href
      const title = this.blogPost.title

      let shareUrl = ''
      switch(platform) {
        case 'facebook':
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
          break
        case 'twitter':
          shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
          break
        case 'linkedin':
          shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`
          break
        case 'tumblr':
          shareUrl = `https://www.tumblr.com/share/link?url=${encodeURIComponent(url)}&name=${encodeURIComponent(title)}`
          break
      }

      if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400')
      }
    }
  }
}
</script>

<style scoped>
@import './Blogdetail.css';
</style>
