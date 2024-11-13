<template>
  <LayoutGuest>
    <div class="min-h-screen p-10">
      <p class="text-4xl font-bold text-center">Welcome to <span class="text-blue-600">Erasmus One</span></p>
      <p class="text-2xl font-bold text-center py-3">Register Now !</p>
      <div class="flex items-center justify-center">
        <div class="w-14/15 md:w-9/15 shadow-2xl rounded-md">
          <CardBox>
            <FormField label="Full Name">
              <FormControl
                v-model="name"
                :icon="mdiAccount"
                name="name"
              />
            </FormField>
            <FormField label="Email">
              <FormControl
                v-model="email"
                :icon="mdiEmail"
                name="email"
              />
            </FormField>

            <FormField class="mb-0">
              <FormField label="Password">
                <FormControl
                  v-model="password"
                  :icon="mdiAsterisk"
                  type="password"
                  name="password"
                />
              </FormField>
              <FormField label="Repeat Password">
                <FormControl
                  v-model="password_repeat"
                  :icon="mdiAsterisk"
                  type="password"
                  name="password"
                />
              </FormField>
            </FormField>
            <div class="flex space-x-3 items-center">
              <BaseButton @click="register()" color="info" label="Create Account"/>
              <p v-if="repeatPasswordError" class="text-red-500 text-sm font-semibold">Password doesn't match!</p>
            </div>
          </CardBox>
        </div>
      </div>
      <p class="text-center mt-3">You already have an account?
        <RouterLink to="/">
          <button class="text-blue-600 underline">Login here</button>
        </RouterLink>
      </p>
    </div>
  </LayoutGuest>
</template>

<script setup>
import {ref} from 'vue'
import { useRouter } from 'vue-router'
import { mdiAccount, mdiAsterisk, mdiEmail } from '@mdi/js'
import CardBox from '@/components/CardBox.vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import BaseButton from '@/components/BaseButton.vue'
import LayoutGuest from '@/layouts/LayoutGuest.vue'
import {useAuthStore} from "@/stores/auth";
import Swal from "sweetalert2";
import axios from "axios";
import {useCookies} from "vue3-cookies";
import {AuthUser} from "@/types/AuthUser";

const auth = useAuthStore();
const router = useRouter();
const {cookies} = useCookies();

const name = ref('');
const email = ref('');
const password = ref('');
const password_repeat = ref('');
const repeatPasswordError = ref(false);

const checkRepeatPassword = () => {
  repeatPasswordError.value = password.value !== password_repeat.value;
}

const register = async () => {
  checkRepeatPassword();
  try {
    await axios.post("http://127.0.0.1:8000/api/register", {
      name: name.value,
      email: email.value,
      password: password.value
    })
      .then(async (response) => {
        let user = new AuthUser();
        user.name = name.value;
        user.email = email.value;
        user.id = response.data.id;
        // axios.defaults.headers.common.Authorization = "Bearer " + response.data.token;
        // cookies.set("Token", response.data.token,'5h');
        auth.setUser(JSON.stringify(user));
        await router.push('/dashboard');
      });
  } catch (e) {
    console.log(e);
    if (e.response?.data?.error) {
      Swal.fire({
        icon: 'error',
        title: 'Ooops..',
        text: e.response.data.error,
      })
    } else {
      if (e.response?.status !== 401) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
        })
      }
    }
  }
};
</script>
