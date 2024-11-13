<template>
  <LayoutGuest>
    <div class="min-h-screen p-10">
      <p class="text-4xl font-bold text-center">Welcome to <span class="text-blue-600">Erasmus One</span></p>
      <p class="text-2xl font-bold text-center py-4">Login Now !</p>
      <div class="flex items-center justify-center">
        <div class="w-11/12 md:w-7/12 lg:w-6/12 xl:w-4/12 shadow-2xl rounded-md">
          <CardBox @submit.prevent="submit">
            <FormField label="Email">
              <FormControl
                v-model="form.login"
                :icon="mdiEmail"
                name="email"
              />
            </FormField>

            <FormField label="Password" help="Please enter your password">
              <FormControl
                v-model="form.pass"
                :icon="mdiAsterisk"
                type="password"
                name="password"
              />
            </FormField>
            <BaseButton type="submit" color="info" label="Login"/>
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
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { mdiAsterisk, mdiEmail } from '@mdi/js'
import CardBox from '@/components/CardBox.vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import BaseButton from '@/components/BaseButton.vue'
import LayoutGuest from '@/layouts/LayoutGuest.vue'

const form = reactive({
  login: 'john.doe',
  pass: 'highly-secure-password-fYjUw-',
  remember: true
})

const router = useRouter()

const submit = () => {
  router.push('/dashboard')
}
</script>
