<template>
  <template v-if="is_loading">
    <p>Loading ...</p>
  </template>
  <template v-else>
    <RouterView />
  </template>
</template>
<script setup>
import { RouterView } from 'vue-router'
import axios from "axios";
import {onMounted, ref} from "vue";
import {useCookies} from "vue3-cookies";
import {useRouter} from 'vue-router';
import {useRoute} from "vue-router";
import {useAuthStore} from "@/stores/auth";
import {AuthUser} from "./types/AuthUser";

document.documentElement.classList.forEach((token) => {
  if (token.indexOf('style') === 0) {
    document.documentElement.classList.replace(token, `style-white`)
  }
})

const {cookies} = useCookies();
const router = useRouter();
const route = useRoute();
const auth = useAuthStore();
const is_loading = ref(true);

onMounted(async () => {
  axios.interceptors.response.use((response) => {
    return response
  }, function(error) {
    return Promise.reject(error)
  })

  let my_cookie_value = cookies.get("Token");

  axios.defaults.headers.common.Authorization  =  "Bearer " + my_cookie_value;

  await axios.get("http://127.0.0.1:8000/api/getUser")
    .then((result)=> {
      let user = new AuthUser();
      user.name = result.data.name;
      user.email = result.data.email;
      user.family_name = result.data.family_name;
      user.id = result.data.id;
      auth.setUser(JSON.stringify(user));
    })
    .catch((error) => {
      console.log('eroare: ',error);
      if(route.name) {
        if(route.name !== 'login' && route.name !== 'register'){
          if (error.response?.status === 401) {
            router.push('/login');
          }
        }
      }
    })
  is_loading.value = false;
})

</script>
