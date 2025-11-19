<template>
  <div class="blog-detail-page">
    <Header1 />

    <Loading v-if="isLoading" />

    <div v-else class="blog-detail-container">
      <!-- Blog Header Image -->
      <div class="blog-detail-header">
        <img :src="blogPost.image" :alt="blogPost.title" class="header-image" />
      </div>

      <!-- Blog Meta Info -->
      <div class="blog-meta-info">
        <span class="author">
          <i class="fa-solid fa-user"></i> {{ blogPost.author }}
        </span>
        <span class="date">
          <i class="fa-solid fa-calendar-days"></i> {{ blogPost.date }}
        </span>
      </div>

      <!-- Blog Title -->
      <h1 class="blog-detail-title">{{ blogPost.title }}</h1>

      <!-- Blog Content -->
      <div class="blog-detail-content">
        <p class="intro-text">
          In a world inundated with choices, the power of authentic customer testimonials cannot be overstated. 
          Dive into our "Testimonial Spotlight" series, where we shine a spotlight on the stories of satisfaction 
          and success shared by our valued customers. From heartfelt anecdotes of transformative experiences to 
          glowing reviews of exceptional service, each testimonial offers a glimpse into the profound impact our 
          products or services have had on the lives of real people.
        </p>

        <p>
          Explore the journeys of individuals who have entrusted us with their needs and aspirations, and discover 
          firsthand the unparalleled value and quality we strive to deliver. Whether it's a life-changing product 
          that exceeded expectations or a seamless customer service experience that left a lasting impression, 
          these testimonials serve as a testament to our unwavering commitment to customer satisfaction.
        </p>

        <p>
          Join us as we celebrate the voices of our customers and honor their trust in us. Through their stories, 
          we gain invaluable insights into the needs, desires, and aspirations of our community, inspiring us to 
          continuously innovate, improve, and exceed expectations. Witness the power of authentic storytelling and 
          let these testimonials serve as a beacon of trust and credibility in an ever-evolving marketplace.
        </p>
      </div>

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
  </div>
</template>

<script>
import Header1 from '../../components/Header/Header1.vue'
import Footer from '../../components/Footer/Footer.vue'
import Loading from '../../components/Loading/Loading.vue'

export default {
  name: 'BlogDetail',
  components: {
    Header1,
    Footer,
    Loading
  },
  data() {
    return {
      isLoading: true,
      blogPost: {
        id: null,
        title: '',
        author: '',
        date: '',
        image: '',
        content: ''
      }
    }
  },
  mounted() {
    this.loadBlogPost()
  },
  methods: {
    loadBlogPost() {
      // Get blog post ID from route query
      const postId = this.$route.query.id

      // Mock blog posts data (same as Blog.vue)
      const blogPosts = [
        {
          id: 1,
          image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
          author: 'Demo Admin',
          date: '16 May, 2024',
          title: 'Stories of Satisfaction and Success'
        },
        {
          id: 2,
          image: 'https://images.unsplash.com/photo-1556742393-d75f468bfcb0?w=800&h=600&fit=crop',
          author: 'Demo Admin',
          date: '16 May, 2024',
          title: 'Hear What Our Customers Have to Say'
        },
        {
          id: 3,
          image: 'https://images.unsplash.com/photo-1556742111-a301076d9d18?w=800&h=600&fit=crop',
          author: 'Demo Admin',
          date: '16 May, 2024',
          title: 'Real-Life Testimonials from Satisfied Buyers'
        },
        {
          id: 4,
          image: 'https://images.unsplash.com/photo-1556741533-6e6a62bd8b49?w=800&h=600&fit=crop',
          author: 'Demo Admin',
          date: '16 May, 2024',
          title: 'Customer Success Stories'
        },
        {
          id: 5,
          image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&h=600&fit=crop',
          author: 'Demo Admin',
          date: '15 May, 2024',
          title: 'Excellence in Customer Service'
        },
        {
          id: 6,
          image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop',
          author: 'Demo Admin',
          date: '15 May, 2024',
          title: 'Building Trust Through Quality'
        },
        {
          id: 7,
          image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=600&fit=crop',
          author: 'Demo Admin',
          date: '15 May, 2024',
          title: 'Innovation and Customer Satisfaction'
        },
        {
          id: 8,
          image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&h=600&fit=crop',
          author: 'Demo Admin',
          date: '15 May, 2024',
          title: 'Why Customers Choose Us'
        },
        {
          id: 9,
          image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop',
          author: 'Demo Admin',
          date: '14 May, 2024',
          title: 'Transforming Customer Experience'
        },
        {
          id: 10,
          image: 'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=800&h=600&fit=crop',
          author: 'Demo Admin',
          date: '14 May, 2024',
          title: 'Reviews That Inspire Confidence'
        },
        {
          id: 11,
          image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=600&fit=crop',
          author: 'Demo Admin',
          date: '14 May, 2024',
          title: 'Customer Journey to Success'
        },
        {
          id: 12,
          image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&h=600&fit=crop',
          author: 'Demo Admin',
          date: '14 May, 2024',
          title: 'Trusted by Thousands of Customers'
        }
      ]

      // Find the blog post by ID
      const post = blogPosts.find(p => p.id === parseInt(postId))
      
      if (post) {
        this.blogPost = post
      } else {
        // Default to first post if ID not found
        this.blogPost = blogPosts[0]
      }

      setTimeout(() => {
        this.isLoading = false
      }, 800)
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
