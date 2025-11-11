<script></script>

<template>
  <router-view></router-view>
  <ToastContainer />
</template>

<style>
body {
  max-width: 1400px; /* Đặt chiều rộng tối đa cho khung */
  margin: 0 auto; /* Căn giữa khung */
  background-color: white;
}
h1 {
  margin-bottom: 15px;
  font-weight: bold;
}
.register button, .login button, add button {
  text-align: center;
  width: 320px;
  height: 40px;
  margin-left: auto;
  margin-right: auto;
  display: block;
  border: 1px solid skyblue;
  background: skyblue;
}
.register input, .login input, .add input, .add textarea{
  width: 300px;
  height: 40px;
  display: block;
  padding-left: 20px;
  margin-bottom: 30px;
  margin-left: auto;
  margin-right: auto;
}
.add textarea{
  height: auto!important;;
}
.btn-login {
  text-align: center;
  margin-top: 10px;
  font-weight: bold;
}

.list-post {
  margin-top: 5px;
}
</style>
