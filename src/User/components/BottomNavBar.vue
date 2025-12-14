<template>
  <nav class="bottom-nav-bar">
    <router-link to="/" class="icon-link" exact-active-class="active">
      <svg class="svg-stroke-color" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 18V15" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M10.07 2.81997L3.13999 8.36997C2.35999 8.98997 1.85999 10.3 2.02999 11.28L3.35999 19.24C3.59999 20.66 4.95999 21.81 6.39999 21.81H17.6C19.03 21.81 20.4 20.65 20.64 19.24L21.97 11.28C22.13 10.3 21.63 8.98997 20.86 8.36997L13.93 2.82997C12.86 1.96997 11.13 1.96997 10.07 2.81997Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>
      <span>Home</span>
    </router-link>
    <router-link to="/compare" class="icon-link">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M3.58008 5.15991H17.4201C19.0801 5.15991 20.4201 6.49991 20.4201 8.15991V11.4799" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M6.74008 2L3.58008 5.15997L6.74008 8.32001" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M20.4201 18.84H6.58008C4.92008 18.84 3.58008 17.5 3.58008 15.84V12.52" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M17.26 21.9999L20.42 18.84L17.26 15.6799" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>
      <span>Compare</span>
      <span class="badge">0</span>
    </router-link>
    <router-link to="/categories" class="icon-link">
      <svg class="svg-stroke-color" xmlns="http://www.w3.org/2000/svg" width="29" height="28" viewBox="0 0 29 28" fill="none">
        <path d="M20.3333 11.6667H22.6667C25 11.6667 26.1667 10.5 26.1667 8.16668V5.83334C26.1667 3.50001 25 2.33334 22.6667 2.33334H20.3333C18 2.33334 16.8333 3.50001 16.8333 5.83334V8.16668C16.8333 10.5 18 11.6667 20.3333 11.6667Z" stroke="#626F84" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M6.33334 25.6667H8.66668C11 25.6667 12.1667 24.5 12.1667 22.1667V19.8333C12.1667 17.5 11 16.3333 8.66668 16.3333H6.33334C4.00001 16.3333 2.83334 17.5 2.83334 19.8333V22.1667C2.83334 24.5 4.00001 25.6667 6.33334 25.6667Z" stroke="#626F84" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M7.50001 11.6667C10.0773 11.6667 12.1667 9.57734 12.1667 7.00001C12.1667 4.42268 10.0773 2.33334 7.50001 2.33334C4.92268 2.33334 2.83334 4.42268 2.83334 7.00001C2.83334 9.57734 4.92268 11.6667 7.50001 11.6667Z" stroke="#626F84" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M21.5 25.6667C24.0773 25.6667 26.1667 23.5773 26.1667 21C26.1667 18.4227 24.0773 16.3333 21.5 16.3333C18.9227 16.3333 16.8333 18.4227 16.8333 21C16.8333 23.5773 18.9227 25.6667 21.5 25.6667Z" stroke="#626F84" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>
      <span>Categories</span>
    </router-link>
    <router-link to="/cart" class="icon-link">
      <svg class="svg-stroke-color" xmlns="http://www.w3.org/2000/svg" width="29" height="28" viewBox="0 0 29 28" fill="none">
        <path d="M9.25 8.94834V7.81668C9.25 5.19168 11.3617 2.61334 13.9867 2.36834C17.1133 2.06501 19.75 4.52668 19.75 7.59501V9.20501" stroke="#626F84" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M11 25.6667H18C22.69 25.6667 23.53 23.7883 23.775 21.5017L24.65 14.5017C24.965 11.655 24.1483 9.33334 19.1667 9.33334H9.83334C4.85168 9.33334 4.03501 11.655 4.35001 14.5017L5.22501 21.5017C5.47001 23.7883 6.31001 25.6667 11 25.6667Z" stroke="#626F84" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>
      <span>Cart</span>
      <span class="badge">0</span>
    </router-link>
    <router-link to="/account" class="icon-link">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="#292D32"></path>
        <path d="M11.9999 14.5C6.98991 14.5 2.90991 17.86 2.90991 22C2.90991 22.28 3.12991 22.5 3.40991 22.5H20.5899C20.8699 22.5 21.0899 22.28 21.0899 22C21.0899 17.86 17.0099 14.5 11.9999 14.5Z" fill="#292D32"></path>
      </svg>
      <span>Account</span>
    </router-link>
  </nav>
</template>

<script setup>
// Nếu muốn động số badge, import store và lấy số lượng ở đây
</script>

<!-- CSS đã có trong Header.css, không cần style riêng ở đây -->
