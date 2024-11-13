<template>
  <LayoutAuthenticated>
    <div class="h-[670px] bg-cover bg-center flex items-center justify-center p-6" :style="{ backgroundImage: 'url(/public/dashboard.png)' }">
      <div class="absolute inset-0 bg-black opacity-40"></div>

      <div class="flex justify-between w-full space-x-10">
        <div class="relative w-[70%] bg-white shadow-md rounded-lg p-8 space-y-6">
          <div class="text-center">
            <h1 class="text-2xl font-semibold text-gray-800">
              How does <span class="text-blue-600 font-bold">Erasmus One</span> works?
            </h1>
          </div>

          <div class="space-y-4">
            <div class="p-4 bg-blue-50 rounded-lg shadow-sm">
              <h2 class="text-lg font-medium text-blue-800">Step 1: Choose University</h2>
              <p class="text-gray-600 mt-2">
                Select your preferred destinations from <RouterLink to='/universities' class="underline text-blue-500">Universities</RouterLink> or
                <RouterLink to="/recommend-university" class="underline text-blue-500">get recommendation</RouterLink>
              </p>
            </div>

            <div class="p-4 bg-green-50 rounded-lg shadow-sm">
              <h2 class="text-lg font-medium text-green-800">Step 2: Add an <RouterLink to="/applications" class="underline text-blue-500">Application</RouterLink></h2>
            </div>

            <div class="p-4 bg-yellow-50 rounded-lg shadow-sm">
              <h2 class="text-lg font-medium text-yellow-800">Step 3: Complete your Learning Agreement (OLA)</h2>
              <p class="text-gray-600 mt-2">
                Fill your learning agreement <a href="https://www.learning-agreement.eu/" class="underline text-blue-500">here</a>.
              </p>
            </div>

            <div class="p-4 bg-purple-50 rounded-lg shadow-sm">
              <h2 class="text-lg font-medium text-purple-800">Step 4: Finish Application</h2>
              <p class="text-gray-600 mt-2">
                Get more info. (travel.upb)
              </p>
            </div>
          </div>
          <p class="text-sm text-center">If you have any problems with the app
            <RouterLink to="/tickets"><span class="underline text-blue-500">contact us</span></RouterLink>.
          </p>
        </div>
        <div class="relative w-[30%] bg-white shadow-md rounded-lg p-8 space-y-6">
          <div class="bg-yellow-100 p-4 rounded-lg shadow-sm space-y-2">
            <h2 class="text-xl font-semibold text-yellow-800">Announcements</h2>
            <ul class="list-disc pl-6 text-gray-700">
              <li>Our system will undergo maintenance on Friday, 9 PM - 11 PM.</li>
              <li>New features are coming soon! Stay tuned for updates.</li>
              <li>Check out the new user guidelines in the Help section.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </LayoutAuthenticated>
</template>

<script setup>
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import NotificationBar from '@/components/NotificationBar.vue'
import {mdiAlert} from '@mdi/js';

</script>
