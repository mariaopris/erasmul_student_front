<template>
  <div>
    <div class="pt-14 w-screen transition-position lg:w-auto bg-gray-50 dark:bg-slate-800 dark:text-slate-100">
      <nav class="top-0 inset-x-0 fixed bg-gray-50 h-14 z-30 transition-position w-screen lg:w-auto dark:bg-slate-800">
        <div class="flex items-center p-5 justify-between">
          <div>
            <p class="font-bold text-xl text-blue-600 cursor-pointer">Erasmus One</p>
          </div>
          <div class="flex space-x-10">
            <RouterLink to="/dashboard">
              <p class="text-black cursor-pointer">Home</p>
            </RouterLink>
            <RouterLink to="/profile">
              <p class="text-black cursor-pointer">Profile</p>
            </RouterLink>
            <RouterLink to="/applications">
              <p class="text-black cursor-pointer">Application</p>
            </RouterLink>
            <RouterLink to="/tickets">
              <p class="text-black cursor-pointer">Tickets</p>
            </RouterLink>
          </div>
          <div>
            <p class="font-semibold cursor-pointer">{{user.name}}</p>
          </div>
        </div>
      </nav>
      <slot/>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import {AuthUser} from "@/types/AuthUser";
import {useAuthStore} from "@/stores/auth";
const auth = useAuthStore();
const user = ref(new AuthUser());

onMounted(() => {
  if(auth.user !== null)
  {
    user.value = new AuthUser(JSON.parse(auth.user));
  }
})
</script>
