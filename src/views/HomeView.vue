<template>
  <LayoutAuthenticated>
    <template v-if="is_loading">
      <p>Loading ...</p>
    </template>
    <template v-else>
      <div class="h-full bg-cover bg-center flex items-center justify-center p-6">
        <div class="flex justify-between w-full space-x-10">
          <div class="relative w-[70%] bg-white shadow-md rounded-lg p-8 space-y-6">
            <div class="text-center">
              <h1 class="text-2xl font-semibold text-gray-800">
                How does <span class="text-blue-600 font-bold">Erasmus One</span> works?
              </h1>
            </div>

            <div class="space-y-7 text-sm">
              <div class="space-y-3">
                <div class="flex justify-between border-b pb-1 hover:bg-gray-50 p-2 rounded-lg">
                  <h3 class="text-base font-semibold text-gray-700 ">📝 Before Mobility</h3>
                  <template v-if="getGeneralStatus('before') === 'not_available'">
                  <span class="text-xs font-medium px-3 py-1 bg-gray-100 text-gray-700 rounded-full whitespace-nowrap self-center">
                    Not Available
                  </span>
                  </template>
                  <template v-if="getGeneralStatus('before') === 'in_progress'">
                   <span class="text-xs font-medium px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full whitespace-nowrap self-center">
                    In Progress
                  </span>
                  </template>
                  <template v-if="getGeneralStatus('before') === 'done'">
                  <span class="text-xs font-medium px-3 before bg-green-100 text-green-700 rounded-full whitespace-nowrap self-center">
                    Done
                  </span>
                  </template>
                </div>

                <div :class="getStepStatus('1_1') === 'not_available' ? 'bg-gray-50 border-gray-100 text-gray-800 cursor-no-drop' : 'bg-blue-50 border-blue-100 text-blue-800'"
                     class="flex items-start justify-between py-2 px-4 border rounded-xl shadow-sm">
                  <div>
                    <h2 class="text-base font-semibold">Step 1: Choose University</h2>
                    <p class="text-gray-600 mt-1">
                      Select your preferred destinations from
                      <RouterLink to="/universities" class="underline text-blue-500 hover:text-blue-700">Universities</RouterLink>
                      or
                      <RouterLink to="/recommend-university" class="underline text-blue-500 hover:text-blue-700">get recommendation</RouterLink>.
                    </p>
                  </div>

                  <template v-if="getStepStatus('1_1') === 'not_available'">
                <span class="text-xs font-medium px-3 py-1 bg-gray-100 text-gray-700 rounded-full whitespace-nowrap self-center">
                  Not Available
                </span>
                  </template>
                  <template v-if="getStepStatus('1_1') === 'in_progress'">
                 <span class="text-xs font-medium px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full whitespace-nowrap self-center">
                  In Progress
                </span>
                  </template>
                  <template v-if="getStepStatus('1_1') === 'incomplete'">
                <span class="text-xs font-medium px-3 py-1 bg-red-100 text-red-700 rounded-full whitespace-nowrap self-center">
                  Incomplete
                </span>
                  </template>
                  <template v-if="getStepStatus('1_1') === 'done'">
                <span class="text-xs font-medium px-3 py-1 bg-green-100 text-green-700 rounded-full whitespace-nowrap self-center">
                  Done
                </span>
                  </template>
                </div>

                <div :class="getStepStatus('1_2') === 'not_available' ? 'bg-gray-50 border-gray-100 text-gray-800 cursor-no-drop' : 'bg-blue-50 border-blue-100 text-blue-800'"
                     class="flex items-start justify-between py-2 px-4 border rounded-xl shadow-sm">
                  <div>
                    <h2 class="text-base font-semibold">
                      Step 2: Add an
                      <RouterLink to="/applications" class="underline text-blue-500 hover:text-blue-700">Application</RouterLink>
                    </h2>
                  </div>
                  <template v-if="getStepStatus('1_2') === 'not_available'">
                <span class="text-xs font-medium px-3 py-1 bg-gray-100 text-gray-700 rounded-full whitespace-nowrap self-center">
                  Not Available
                </span>
                  </template>
                  <template v-if="getStepStatus('1_2') === 'in_progress'">
                 <span class="text-xs font-medium px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full whitespace-nowrap self-center">
                  In Progress
                </span>
                  </template>
                  <template v-if="getStepStatus('1_2') === 'incomplete'">
                <span class="text-xs font-medium px-3 py-1 bg-red-100 text-red-700 rounded-full whitespace-nowrap self-center">
                  Incomplete
                </span>
                  </template>
                  <template v-if="getStepStatus('1_2') === 'done'">
                <span class="text-xs font-medium px-3 py-1 bg-green-100 text-green-700 rounded-full whitespace-nowrap self-center">
                  Done
                </span>
                  </template>
                </div>

                <div :class="getStepStatus('1_3') === 'not_available' ? 'bg-gray-50 border-gray-100 text-gray-800 cursor-no-drop' : 'bg-blue-50 border-blue-100 text-blue-800'"
                     class="flex items-start justify-between py-2 px-4 border rounded-xl shadow-sm">
                  <div>
                    <h2 class="text-base font-semibold">Step 3: Complete your Learning Agreement (OLA)</h2>
                    <p class="text-gray-600 mt-1">
                      <span class="font-semibold">Fill</span> your OLA
                      <a href="https://www.learning-agreement.eu/" class="underline text-blue-500 hover:text-blue-700" target="_blank" rel="noopener">here</a>
                      and then <span class="font-semibold">upload</span> your OLA
                      <RouterLink to="/learning-agreement" class="underline text-blue-500 hover:text-blue-700">here</RouterLink>.
                    </p>
                  </div>
                  <template v-if="getStepStatus('1_3') === 'not_available'">
                <span class="text-xs font-medium px-3 py-1 bg-gray-100 text-gray-700 rounded-full whitespace-nowrap self-center">
                  Not Available
                </span>
                  </template>
                  <template v-if="getStepStatus('1_3') === 'in_progress'">
                 <span class="text-xs font-medium px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full whitespace-nowrap self-center">
                  In Progress
                </span>
                  </template>
                  <template v-if="getStepStatus('1_3') === 'incomplete'">
                <span class="text-xs font-medium px-3 py-1 bg-red-100 text-red-700 rounded-full whitespace-nowrap self-center">
                  Incomplete
                </span>
                  </template>
                  <template v-if="getStepStatus('1_3') === 'done'">
                <span class="text-xs font-medium px-3 py-1 bg-green-100 text-green-700 rounded-full whitespace-nowrap self-center">
                  Done
                </span>
                  </template>
                </div>

                <div :class="getStepStatus('1_4') === 'not_available' ? 'bg-gray-50 border-gray-100 text-gray-800 cursor-no-drop' : 'bg-blue-50 border-blue-100 text-blue-800'"
                     class="flex items-start justify-between py-2 px-4 border rounded-xl shadow-sm">
                  <div>
                    <h2 class="text-base font-semibold">Step 4: Finish Application</h2>
                    <p class="text-gray-600 mt-1"><span class="font-semibold">Upload</span>
                      the required documents at <a href="https://travel.upb.ro/" class="text-blue-500 underline">travel.upb</a> and then
                      <span class="font-semibold">upload</span> the
                      <RouterLink to="/travel-authorization" class="font-semibold text-blue-500">
                        Travel Authorization
                      </RouterLink>
                    </p>
                  </div>
                  <template v-if="getStepStatus('1_4') === 'not_available'">
                <span class="text-xs font-medium px-3 py-1 bg-gray-100 text-gray-700 rounded-full whitespace-nowrap self-center">
                  Not Available
                </span>
                  </template>
                  <template v-if="getStepStatus('1_4') === 'in_progress'">
                 <span class="text-xs font-medium px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full whitespace-nowrap self-center">
                  In Progress
                </span>
                  </template>
                  <template v-if="getStepStatus('1_4') === 'incomplete'">
                <span class="text-xs font-medium px-3 py-1 bg-red-100 text-red-700 rounded-full whitespace-nowrap self-center">
                  Incomplete
                </span>
                  </template>
                  <template v-if="getStepStatus('1_4') === 'done'">
                <span class="text-xs font-medium px-3 py-1 bg-green-100 text-green-700 rounded-full whitespace-nowrap self-center">
                  Done
                </span>
                  </template>
                </div>
              </div>

              <div class="space-y-3">
                <div class="flex justify-between border-b pb-1 hover:bg-gray-50 p-2 rounded-lg">
                  <h3 class="text-base font-semibold text-gray-700 ">📚 During the Mobility</h3>
                  <template v-if="getGeneralStatus('during') === 'not_available'">
                  <span class="text-xs font-medium px-3 py-1 bg-gray-100 text-gray-700 rounded-full whitespace-nowrap self-center">
                    Not Available
                  </span>
                  </template>
                  <template v-if="getGeneralStatus('during') === 'in_progress'">
                   <span class="text-xs font-medium px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full whitespace-nowrap self-center">
                    In Progress
                  </span>
                  </template>
                  <template v-if="getGeneralStatus('during')  === 'done'">
                  <span class="text-xs font-medium px-3 py-1 bg-green-100 text-green-700 rounded-full whitespace-nowrap self-center">
                    Done
                  </span>
                  </template>
                </div>

                <div :class="getStepStatus('2_1') === 'not_available' ? 'bg-gray-50 border-gray-100 text-gray-800 cursor-no-drop' : 'bg-blue-50 border-blue-100 text-blue-800'"
                     class="flex items-start justify-between py-2 px-4 border rounded-xl shadow-sm">
                  <div>
                    <h2 class="text-base space-x-1"><span class="font-semibold">Step 1: Upload Certificate of Arrival</span>
                      <RouterLink class="underline text-blue-500" to="/certificate-of-arrival">here</RouterLink>
                    </h2>
                  </div>
                  <template v-if="getStepStatus('2_1') === 'not_available'">
                <span class="text-xs font-medium px-3 py-1 bg-gray-100 text-gray-700 rounded-full whitespace-nowrap self-center">
                  Not Available
                </span>
                  </template>
                  <template v-if="getStepStatus('2_1') === 'in_progress'">
                 <span class="text-xs font-medium px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full whitespace-nowrap self-center">
                  In Progress
                </span>
                  </template>
                  <template v-if="getStepStatus('2_1') === 'incomplete'">
                <span class="text-xs font-medium px-3 py-1 bg-red-100 text-red-700 rounded-full whitespace-nowrap self-center">
                  Incomplete
                </span>
                  </template>
                  <template v-if="getStepStatus('2_1') === 'done'">
                <span class="text-xs font-medium px-3 py-1 bg-green-100 text-green-700 rounded-full whitespace-nowrap self-center">
                  Done
                </span>
                  </template>
                </div>

                <div :class="getStepStatus('2_2') === 'not_available' ? 'bg-gray-50 border-gray-100 text-gray-800 cursor-no-drop' : 'bg-blue-50 border-blue-100 text-blue-800'"
                     class="flex items-start justify-between py-2 px-4 border rounded-xl shadow-sm">
                  <div>
                    <h2 class="text-base"><span class="font-semibold">Step 2: Make changes to learning agreement
                </span>(if needed)</h2>
                    <p class="text-gray-600 mt-1">
                      <span class="font-semibold">Update</span> your OLA
                      <a href="https://www.learning-agreement.eu/" class="underline text-blue-500 hover:text-blue-700" target="_blank" rel="noopener">here</a>
                      and then <span class="font-semibold">upload</span> it
                      <RouterLink to="/learning-agreement-during" class="underline text-blue-500 hover:text-blue-700">here</RouterLink>.
                    </p>
                  </div>
                  <template v-if="getStepStatus('2_2') === 'not_available'">
                <span class="text-xs font-medium px-3 py-1 bg-gray-100 text-gray-700 rounded-full whitespace-nowrap self-center">
                  Not Available
                </span>
                  </template>
                  <template v-if="getStepStatus('2_2') === 'in_progress'">
                 <span class="text-xs font-medium px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full whitespace-nowrap self-center">
                  In Progress
                </span>
                  </template>
                  <template v-if="getStepStatus('2_2') === 'incomplete'">
                <span class="text-xs font-medium px-3 py-1 bg-red-100 text-red-700 rounded-full whitespace-nowrap self-center">
                  Incomplete
                </span>
                  </template>
                  <template v-if="getStepStatus('2_2') === 'done'">
                <span class="text-xs font-medium px-3 py-1 bg-green-100 text-green-700 rounded-full whitespace-nowrap self-center">
                  Done
                </span>
                  </template>
                </div>
              </div>

              <div class="space-y-3">
                <div class="flex justify-between border-b pb-1  hover:bg-gray-50 p-2 rounded-lg">
                  <h3 class="text-base font-semibold text-gray-700 ">🚀 After the Mobility</h3>
                  <template v-if="getGeneralStatus('after') === 'not_available'">
                  <span class="text-xs font-medium px-3 py-1 bg-gray-100 text-gray-700 rounded-full whitespace-nowrap self-center">
                    Not Available
                  </span>
                  </template>
                  <template v-if="getGeneralStatus('after') === 'in_progress'">
                   <span class="text-xs font-medium px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full whitespace-nowrap self-center">
                    In Progress
                  </span>
                  </template>
                  <template v-if="getGeneralStatus('after') === 'done'">
                  <span class="text-xs font-medium px-3 py-1 bg-green-100 text-green-700 rounded-full whitespace-nowrap self-center">
                    Done
                  </span>
                  </template>
                </div>

                <div :class="getStepStatus('3_1') === 'not_available' ? 'bg-gray-50 border-gray-100 text-gray-800 cursor-no-drop' : 'bg-blue-50 border-blue-100 text-blue-800'"
                     class="flex items-start justify-between py-2 px-4 border rounded-xl shadow-sm">
                  <div>
                    <h2 class="text-base space-x-1"><span class="font-semibold">Step 1: Upload Activity Report</span>
                      <RouterLink to="/activity-report" class="underline text-blue-500">here</RouterLink>
                    </h2>
                  </div>
                  <template v-if="getStepStatus('3_1') === 'not_available'">
                  <span class="text-xs font-medium px-3 py-1 bg-gray-100 text-gray-700 rounded-full whitespace-nowrap self-center">
                    Not Available
                  </span>
                  </template>
                  <template v-if="getStepStatus('3_1') === 'in_progress'">
                   <span class="text-xs font-medium px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full whitespace-nowrap self-center">
                    In Progress
                  </span>
                  </template>
                  <template v-if="getStepStatus('3_1') === 'incomplete'">
                  <span class="text-xs font-medium px-3 py-1 bg-red-100 text-red-700 rounded-full whitespace-nowrap self-center">
                    Incomplete
                  </span>
                  </template>
                  <template v-if="getStepStatus('3_1') === 'done'">
                  <span class="text-xs font-medium px-3 py-1 bg-green-100 text-green-700 rounded-full whitespace-nowrap self-center">
                    Done
                  </span>
                  </template>
                </div>

                <div :class="getStepStatus('3_2') === 'not_available' ? 'bg-gray-50 border-gray-100 text-gray-800 cursor-no-drop' : 'bg-blue-50 border-blue-100 text-blue-800'"
                     class="flex items-start justify-between py-2 px-4 border rounded-xl shadow-sm">
                  <div>
                    <h2 class="text-base font-semibold">Step 2: Upload Learning Agreement after-mobility
                      <RouterLink to="/learning-agreement-after" class="underline text-blue-500 font-normal">here</RouterLink>
                    </h2>
                  </div>
                  <template v-if="getStepStatus('3_2') === 'not_available'">
                <span class="text-xs font-medium px-3 py-1 bg-gray-100 text-gray-700 rounded-full whitespace-nowrap self-center">
                  Not Available
                </span>
                  </template>
                  <template v-if="getStepStatus('3_2') === 'in_progress'">
                 <span class="text-xs font-medium px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full whitespace-nowrap self-center">
                  In Progress
                </span>
                  </template>
                  <template v-if="getStepStatus('3_2') === 'incomplete'">
                <span class="text-xs font-medium px-3 py-1 bg-red-100 text-red-700 rounded-full whitespace-nowrap self-center">
                  Incomplete
                </span>
                  </template>
                  <template v-if="getStepStatus('3_2') === 'done'">
                <span class="text-xs font-medium px-3 py-1 bg-green-100 text-green-700 rounded-full whitespace-nowrap self-center">
                  Done
                </span>
                  </template>
                </div>

                <!--              <div :class="getStepStatus('3_3') === 'not_available' ? 'bg-gray-50 border-gray-100 text-gray-800 cursor-no-drop' : 'bg-blue-50 border-blue-100 text-blue-800'"-->
                <!--                   class="flex items-start justify-between py-2 px-4 border rounded-xl shadow-sm">-->
                <!--                <div>-->
                <!--                  <h2 class="text-base font-semibold">Step 3: Upload other required documents </h2>-->
                <!--                </div>-->
                <!--                <template v-if="getStepStatus('3_3') === 'not_available'">-->
                <!--                <span class="text-xs font-medium px-3 py-1 bg-gray-100 text-gray-700 rounded-full whitespace-nowrap self-center">-->
                <!--                  Not Available-->
                <!--                </span>-->
                <!--                </template>-->
                <!--                <template v-if="getStepStatus('3_3') === 'in_progress'">-->
                <!--                 <span class="text-xs font-medium px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full whitespace-nowrap self-center">-->
                <!--                  In Progress-->
                <!--                </span>-->
                <!--                </template>-->
                <!--                <template v-if="getStepStatus('3_3') === 'incomplete'">-->
                <!--                <span class="text-xs font-medium px-3 py-1 bg-red-100 text-red-700 rounded-full whitespace-nowrap self-center">-->
                <!--                  Incomplete-->
                <!--                </span>-->
                <!--                </template>-->
                <!--                <template v-if="getStepStatus('3_3') === 'done'">-->
                <!--                <span class="text-xs font-medium px-3 py-1 bg-green-100 text-green-700 rounded-full whitespace-nowrap self-center">-->
                <!--                  Done-->
                <!--                </span>-->
                <!--                </template>-->
                <!--              </div>-->
              </div>
            </div>
          </div>
          <div class="relative w-[30%] bg-white shadow-md rounded-lg p-8 space-y-6">
            <div class="bg-yellow-100 p-4 rounded-lg shadow-sm space-y-2">
              <h2 class="text-xl font-semibold text-yellow-800">Notifications</h2>
              <ul v-for="notification in notifications" class="list-disc pl-6 text-gray-700">
                <li class="text-sm">{{notification.message}}</li>
              </ul>
            </div>
            <p class="text-center text-sm text-gray-600">
              Having issues? <RouterLink to="/tickets" class="underline text-blue-500 hover:text-blue-700">Contact us</RouterLink>
            </p>
          </div>
        </div>
      </div>
    </template>
  </LayoutAuthenticated>
</template>

<script setup lang="ts">
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import {onMounted, ref} from "vue";
import {Step} from "@/types/home/Step";
import axios from "axios";
import Swal from "sweetalert2";
import {useAuthStore} from "../stores/auth";
import {AuthUser} from "../types/AuthUser";
import {Notificationn} from "../types/Notificationn";

const steps = ref<Step[]>([]);
const auth_user = ref(new AuthUser());
const auth = useAuthStore();
const notifications = ref<Notificationn[]>([]);
const is_loading = ref(true);

function getGeneralStatus(type: string) {
  let status = 'not_available';
  let steps_type = <Step[]>[];

  steps.value.forEach((step: Step) => {
    if (step.type === type) {
      steps_type.push(step);
    }
  });

  let i = steps_type.findIndex(item =>
    item.status === 'in_progress' || item.status === 'incomplete' || item.status === 'done'
  );

  if (i !== -1) {
    status = 'in_progress';
  }

  let j = steps_type.findIndex(item =>
    ['in_progress', 'incomplete', 'not_available'].includes(item.status)
  );

  if (j === -1) {
    status = 'done';
  }

  return status;
}

function getStepStatus(tag: string) {
  let status = '';
  let i = steps.value.findIndex(item => item.tag === tag);
  if(i >= 0) {
    status = steps.value[i].status;
  }

  return status;
}

const getSteps = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/api/steps/"+auth_user.value.id);
    response.data.steps.forEach((step: Step) => {
      steps.value.push(new Step(step));
    })
  } catch (error) {
    console.log('error', error)
    Swal.fire({
      title: 'Error!',
      text: error.response.data.message,
      icon: 'error',
    })
  }
}

const getNotifications = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/api/notifications");
    response.data.notifications.forEach((notification: Notificationn) => {
      notifications.value.push(new Notificationn(notification));
    })
  } catch (error) {
    console.log('error', error)
    Swal.fire({
      title: 'Error!',
      text: error.response.data.message,
      icon: 'error',
    })
  }
}

onMounted(async () => {
  if (auth.user !== null) {
    auth_user.value = new AuthUser(JSON.parse(auth.user));
    await getSteps();
    await getNotifications();
    is_loading.value = false;
  }
})
</script>
