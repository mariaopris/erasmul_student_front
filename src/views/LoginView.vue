<template>
  <LayoutGuest>
    <div class="min-h-screen p-10">
      <p class="text-4xl font-bold text-center">Welcome to <span class="text-blue-600">Erasmus One</span></p>
      <p class="text-2xl font-bold text-center py-4">Login Now !</p>
      <div class="flex items-center justify-center">
        <div class="w-11/12 md:w-7/12 lg:w-6/12 xl:w-4/12 shadow-2xl rounded-md">
          <CardBox>
            <template v-if="!twoFA">
              <FormField label="Email">
                <FormControl
                  v-model="email"
                  :icon="mdiEmail"
                  name="email"
                />
              </FormField>
              <FormField label="Password" help="Please enter your password">
                <FormControl
                  v-model="password"
                  :icon="mdiAsterisk"
                  type="password"
                  name="password"
                />
              </FormField>
              <BaseButton @click="attempt_login" color="info" label="Login"/>
            </template>
            <template v-else>
              <FormField label="2FA Code" >
                <FormControl
                  v-model="twofa"
                />
              </FormField>
              <BaseButton @click="login()" color="info" label="Login"/>
            </template>
          </CardBox>
        </div>
      </div>
      <p class="text-center p-5">You don't have an account?
        <RouterLink to="register">
          <button class="text-blue-600 underline">Register here</button>
        </RouterLink>
      </p>
    </div>
  </LayoutGuest>
</template>

<script setup>
import {reactive, ref} from 'vue'
import { useRouter } from 'vue-router'
import { mdiAsterisk, mdiEmail } from '@mdi/js'
import CardBox from '@/components/CardBox.vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import BaseButton from '@/components/BaseButton.vue'
import LayoutGuest from '@/layouts/LayoutGuest.vue'
import Swal from "sweetalert2";
import {useAuthStore} from "@/stores/auth";
import axios from "axios";
import {AuthUser} from "@/types/AuthUser";
import {useCookies} from "vue3-cookies";

const name = ref('');
const email = ref('');
const password = ref('');
const twofa = ref('');

const twoFA = ref(false)
const auth = useAuthStore();
const {cookies} = useCookies();
const router = useRouter();

const attempt_login = async () =>{
  await axios.post("http://127.0.0.1:8000/api/attempt-login", {
    email: email.value,
    password: password.value,
  })
    .then(async(result)=> {
      twoFA.value = true;
    }).catch(() => {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: "Email or password are wrong!",
      })
    });
}

const login = async () =>{
  await axios.post("http://127.0.0.1:8000/api/login", {
    email: email.value,
    password: password.value,
    twofa: twofa.value
  })
    .then(async (result) => {
      axios.defaults.headers.common.Authorization = "Bearer " + result.data.token;
      cookies.set("Token", result.data.token, '5h');
      let user = new AuthUser();
      user.name = name.value;
      user.email = email.value;
      user.family_name = result.data.family_name;
      user.id = result.data.id;
      auth.setUser(JSON.stringify(user));
      await router.push('/dashboard');

    }).catch((e) => {
      Swal.fire({
        icon: 'error',
        title: 'An error has occurred!',
        text: e,
      })
    });
}
</script>
