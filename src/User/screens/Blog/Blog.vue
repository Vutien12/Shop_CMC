<template>
  <div class="blog-page">
    <Header1 />
    
    <div class="blog-container">
      <div class="blog-header">
        <h1 class="blog-page-title">Blog</h1>
      </div>
      
      <div class="blog-grid">
        <div v-for="post in blogPosts" :key="post.id" class="blog-card">
          <div class="blog-image">
            <img :src="post.image" :alt="post.title" />
          </div>
          <div class="blog-content">
            <div class="blog-meta">
              <span class="author">
                <i class="fa-solid fa-user"></i> {{ post.author }}
              </span>
              <span class="date">
                <i class="fa-solid fa-calendar-days"></i> {{ post.date }}
              </span>
            </div>
            <h3 class="blog-title">{{ post.title }}</h3>
            <a href="#" class="read-more">Read Post</a>
          </div>
        </div>
      </div>
    </div>
    
    <Footer />
  </div>
</template>

<script>
import Header1 from '../../components/Header/Header1.vue'
import Footer from '../../components/Footer/Footer.vue'
export default {
  name: 'Blog',
  components: {
    Header1,
    Footer
  },
  data() {
    return {
      blogPosts: [
        // Row 1
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
        // Row 2
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
        // Row 3
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
    };
  }
};
</script>

<style scoped>
@import './Blog.css';
</style>
