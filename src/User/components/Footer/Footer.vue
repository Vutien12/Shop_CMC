<template>
  <footer>
    <div class="newsletter-section">
      <div class="container newsletter-content">
        <div class="newsletter-text">
          <h2>Subscribe to Our Newsletter</h2>
          <p>Subscribe to our newsletter & get notification about discounts.</p>
        </div>
        <form class="newsletter-form">
          <input type="email" placeholder="Email address" aria-label="Email address" required>
          <button type="submit">Subscribe</button>
        </form>
      </div>
    </div>

    <div class="footer-main">
      <div class="container footer-grid">
        <div class="footer-column contact-us">
          <h3>Contact Us</h3>
          <ul>
            <li><i class="fa-solid fa-phone menu-color"></i> +99023456789</li>
            <li><i class="fa-solid fa-envelope menu-color"></i> admin@email.com</li>
            <li><i class="fa-solid fa-location-dot menu-color"></i> Dhaka, Mohammadpur</li>
          </ul>
          <div class="social-icons">
            <a href="#" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
            <a href="#" aria-label="Twitter"><i class="fa-brands fa-x-twitter"></i></a>
            <a href="#" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
            <a href="#" aria-label="YouTube"><i class="fa-brands fa-youtube"></i></a>
            <a href="#" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>
          </div>
        </div>

        <div class="footer-column">
          <h3>My Account</h3>
          <ul>
            <li><a href="#">Dashboard</a></li>
            <li><a href="#">My Orders</a></li>
            <li><a href="#">My Reviews</a></li>
            <li><a href="#">My Profile</a></li>
          </ul>
        </div>

        <div class="footer-column">
          <h3>Our Services</h3>
          <ul>
            <li><a href="#">Return Policy</a></li>
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Privacy & Policy</a></li>
            <li><a href="#">Terms Of Use</a></li>
          </ul>
        </div>

        <div class="footer-column">
          <h3>Information</h3>
          <ul>
            <li><a href="#">New Arrivals</a></li>
            <li><a href="#">Specials</a></li>
            <li><a href="#">Hot Deals</a></li>
            <li><a href="#">Backpacks</a></li>
            <!-- <li><a href="#">Men's Fashion</a></li> -->
          </ul>
        </div>

        <div class="footer-column tags">
          <h3>Tags</h3>
          <div class="tag-list">
            <!-- <span class="tag"><i class="fa-solid fa-tag"></i> Accessories</span> -->
            <span class="tag"><i class="fa-solid fa-tag"></i> Electronics</span>
            <span class="tag"><i class="fa-solid fa-tag"></i> Entertainment</span>
            <span class="tag"><i class="fa-solid fa-tag"></i> Fashion</span>
            <span class="tag"><i class="fa-solid fa-tag"></i> Gadgets</span>
            <span class="tag"><i class="fa-solid fa-tag"></i> Hot deals</span>
            <!-- <span class="tag"><i class="fa-solid fa-tag"></i> Lifestyle</span> -->
            <span class="tag"><i class="fa-solid fa-tag"></i> Smartphone</span>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter',
};
</script>

<style src="./Footer.css"></style>
