<template>
  <div>
    <div class="pt-14 w-screen transition-position lg:w-auto bg-gray-50 dark:bg-slate-800 dark:text-slate-100">
      <nav class="top-0 inset-x-0 fixed bg-gray-50 h-14 z-30 transition-position w-screen lg:w-auto dark:bg-slate-800">
        <div class="flex items-center p-5 justify-between">
          <div>
            <RouterLink to="/dashboard">
              <p class="font-bold text-xl text-blue-600 cursor-pointer">
                Erasmus One
              </p>
            </RouterLink>

          </div>
          <div class="flex space-x-10">
            <RouterLink to="/universities">
              <p class="text-black cursor-pointer">Universities</p>
            </RouterLink>
            <RouterLink to="/recommendations">
              <p class="text-black cursor-pointer">Recommendations</p>
            </RouterLink>
            <RouterLink to="/tickets">
              <p class="text-black cursor-pointer">Tickets</p>
            </RouterLink>
          </div>
          <div class="flex space-x-3 items-center">
            <RouterLink to="/profile">
              <p class="text-black cursor-pointer">{{user.name}}</p>
            </RouterLink>
            <BaseButton :icon="mdiLogout" @click="logOut()"></BaseButton>
          </div>
        </div>

        <template v-if="!user.is_complete && !is_loading">
          <div class="bg-red-100 border-b border-red-300 text-red-900 z-50 shadow-md">
            <div class="flex items-center justify-center p-1 gap-3">
              <svg
                class="w-6 h-6 text-red-600 mt-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
                />
              </svg>
              <div>
                <p class="text-sm">
                  <span class="font-semibold">Your profile is incomplete.</span>
                  Before doing anything else, please complete your <RouterLink to="/profile" class="underline font-semibold">profile</RouterLink>
                  to get the most out of your experience.
                </p>
              </div>
            </div>
          </div>
        </template>
      </nav>
      <slot/>
    </div>

  </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import {AuthUser} from "@/types/AuthUser";
import {useAuthStore} from "@/stores/auth";
import axios from "axios";
import Swal from "sweetalert2";
import {User} from "@/types/user/User";
import BaseButton from '@/components/BaseButton.vue'
import {mdiLogout} from '@mdi/js'
import {useCookies} from "vue3-cookies";
import router from "@/router";

const auth = useAuthStore();
const auth_user = ref(new AuthUser());
const user = ref(new User());
const is_loading = ref(true);
const {cookies} = useCookies();

const logOut = async () => {
  try {
    await axios.post("http://127.0.0.1:8000/api/logout")
      .then(async (response) => {
        delete axios.defaults.headers.common.Authorization;
        cookies.remove('Token', response.data.token);
        auth_user.value = new AuthUser();

        await router.push('/login');
      });
  }
  catch (e) {
    console.log(e);
    if (e.response?.data?.error) {
      await Swal.fire({
        icon: 'error',
        title: 'Ooops..',
        text: e.response.data.error,
      })
    } else {
      await Swal.fire({
        icon: 'error',
        title: 'Ooops..',
        text: "An unknown error has occured",
      })
    }
  }
}

const getUser = async () => {
  try {
    const response = await axios.get(`http://127.0.0.1:8000/api/user/${user.value.id}`);
    user.value = new User(response.data.user);
  } catch (error) {
    console.log('error', error)
    Swal.fire({
      title: 'Error!',
      text: error.response.data.message,
      icon: 'error',
    })
  }
  is_loading.value = false;
}

onMounted(() => {
  if(auth.user !== null)
  {
    auth_user.value = new AuthUser(JSON.parse(auth.user));
    user.value.id = auth_user.value.id;
    getUser();
  }
})
</script>
