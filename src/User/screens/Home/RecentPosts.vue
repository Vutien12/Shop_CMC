<template>
  <div class="containerx" style="margin-top: 40px">
    <div class="banner-container-4">
      <div
        class="banner-item"
        style="
          height: 270px;
          background-image: url(https://asia.fleetcart.envaysoft.com/storage/media/kRb5N2mGVnso21KKTsxenE4GuH3fjej5r2m8vY8V.png);
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        "
      ></div>
    </div>
    <div class="recent-posts-container">
      <div class="section-header">
        <h2 class="section-title">Recent Posts</h2>
        <button class="view-all-btn">View All</button>
      </div>

      <div class="posts-grid">
        <div v-for="post in posts" :key="trackByPostId(post)" class="post-card">
          <div class="post-image-container">
            <img :src="post.image" :alt="post.title" class="post-image" />
            <div class="image-overlay"></div>
          </div>

          <div class="post-content">
            <div class="post-meta">
              <div class="author-info">
                <span class="material-icons author-icon">person</span>
                <span class="author-name">{{ post.author }}</span>
              </div>
              <div class="date-info">
                <span class="material-icons date-icon">calendar_today</span>
                <span class="post-date">{{ post.date }}</span>
              </div>
            </div>

            <h3 class="post-title">{{ post.title }}</h3>

            <div class="post-actions">
              <button class="read-post-btn">
                Read Post
                <span class="material-icons read-icon">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RecentPosts',
  data() {
    return {
      posts: [
        {
          id: 1,
          title: 'Stories of Satisfaction and Success',
          author: 'Demo Admin',
          date: '09 Aug, 2025',
          image:
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
          excerpt:
            'Discover how our customers achieved their goals through innovative solutions and dedicated support.',
        },
        {
          id: 2,
          title: 'Hear What Our Customers Have to Say',
          author: 'Demo Admin',
          date: '09 Aug, 2025',
          image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
          excerpt:
            'Real testimonials from satisfied customers who have experienced exceptional service and results.',
        },
        {
          id: 3,
          title: 'Real-Life Testimonials from Satisfied Buyers',
          author: 'Demo Admin',
          date: '09 Aug, 2025',
          image:
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop',
          excerpt:
            'Authentic stories from buyers who found exactly what they were looking for and more.',
        },
        {
          id: 4,
          title: 'Key Trends Set to Dominate the E-commerce Landscape',
          author: 'Demo Admin',
          date: '09 Aug, 2025',
          image: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400&h=300&fit=crop',
          excerpt:
            'Explore the emerging trends that are reshaping the future of online commerce and digital business.',
        },
        {
          id: 5,
          title: "What's Driving the Evolution of E-commerce?",
          author: 'Demo Admin',
          date: '09 Aug, 2025',
          image:
            'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
          excerpt:
            'An in-depth analysis of the factors and technologies transforming the e-commerce industry.',
        },
      ],
    }
  },
  methods: {
    trackByPostId(post) {
      return post.id
    },
  },
}
</script>


