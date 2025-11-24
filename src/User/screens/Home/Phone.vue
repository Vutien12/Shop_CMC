<template>
  <div class="best-deals-section">
    <div class="section-header">
      <h2 class="section-title">Best Deals</h2>
    </div>

    <div class="featured-deal-container">
      <!-- Featured Deal -->
      <div class="featured-deal-card">
        <div class="featured-image-container">
          <img
            src="https://asia.fleetcart.envaysoft.com/storage/media/fCg7qAjjYx3gc4f8IIMkvGGBOlsbWG14nBbncYOE.jpeg"
            alt="OnePlus Phone"
            class="featured-image"
          />
        </div>

        <div class="rating-container">
          <div class="stars">
            <span v-for="star in [1, 2, 3, 4, 5]" :key="star" class="material-icons star-icon"
              >star_border</span
            >
          </div>
          <span class="review-text">0 Review</span>
        </div>

        <h3 class="featured-title">
          Oneplus 7 Pro GM1910 256GB, 8GB, Dual Sim, 6.67 inch, 48MP Main Lens Triple Camera
        </h3>

        <div class="price-container">
          <span class="current-price">$450.00</span>
          <span class="original-price">$450.00</span>
        </div>

        <!-- Countdown Timer -->
        <div class="countdown-timer">
          <span class="separator">00</span><span>:</span> <span class="separator">00</span
          ><span>:</span> <span class="separator">00</span><span>:</span>
          <span class="separator">00</span>
        </div>

        <div class="availability-info">
          <span>Available: 15</span>
          <span>Sold: 14</span>
        </div>

        <div class="availability-bar">
          <div class="availability-progress"></div>
        </div>

        <div class="navigation-controls">
          <button class="nav-button">
            <span class="material-icons">chevron_left</span>
          </button>
          <span class="nav-text">PREV</span>
          <button class="nav-button">
            <span class="material-icons">chevron_right</span>
          </button>
          <span class="nav-text">NEXT</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Phone',
}
</script>


