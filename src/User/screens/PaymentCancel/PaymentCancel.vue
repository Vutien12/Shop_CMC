<template>
  <div class="payment-wrapper">
    <Header />

    <div class="payment-container">
      <div class="cancel-box">
        <div class="cancel-icon">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        </div>

        <h1>Payment Cancelled</h1>
        <p class="message">Your payment transaction has been cancelled.</p>

        <div class="info-box">
          <p><strong>Reason:</strong> You declined or exited the payment page</p>
          <p><strong>Session:</strong> Will expire in 24 hours</p>
        </div>

        <div class="actions">
          <router-link to="/checkout" class="btn-primary">Return to Payment</router-link>
          <router-link to="/cart" class="btn-secondary">Return to Cart</router-link>
        </div>
      </div>
    </div>

    <Footer />
    <BottomNavBar />
  </div>
</template>

<script setup>
import Header from '@/User/components/Header1/Header.vue'
import Footer from '@/User/components/Footer/Footer.vue'
import BottomNavBar from '@/User/components/BottomNavBar.vue'
</script>

<style scoped>
.payment-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(to bottom, #f9fafb 0%, #ffffff 100%);
}

.payment-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.cancel-box {
  background: white;
  border-radius: 12px;
  padding: 50px 40px;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
}

.cancel-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 30px;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

h1 {
  font-size: 28px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 10px;
}

.message {
  font-size: 16px;
  color: #6b7280;
  margin-bottom: 30px;
  line-height: 1.6;
}

.info-box {
  background-color: #fef2f2;
  border: 1px solid #fee2e2;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
  text-align: left;
}

.info-box p {
  font-size: 14px;
  color: #991b1b;
  margin: 8px 0;
}

.info-box strong {
  font-weight: 600;
}

.actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.btn-primary,
.btn-secondary {
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-block;
}

.btn-primary {
  background: linear-gradient(135deg, #0068e1, #0052b3);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 104, 225, 0.3);
}

.btn-secondary {
  background-color: #e5e7eb;
  color: #374151;
}

.btn-secondary:hover {
  background-color: #d1d5db;
}

@media (max-width: 640px) {
  .cancel-box {
    padding: 30px 20px;
  }

  h1 {
    font-size: 24px;
  }

  .actions {
    flex-direction: column;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
  }
}
</style>

