<template>
  <LayoutAuthenticated>
    <template v-if="is_loading">
      <p>Loading ...</p>
    </template>
    <template v-else>
      <SectionMain>
        <div class="justify-between mb-3 flex">
          <div class="flex space-x-6 items-center">
            <RouterLink to="/tickets">
              <PillTag label="Back" :icon="mdiBackburger" />
            </RouterLink>
            <p class="leading-tight text-2xl">{{ticket.title}}</p>
          </div>
          <div class="flex space-x-3 items-center">
            <p class="text-sm text-gray-500">Status:</p>
            <p v-if="ticket.status === 'Open'" class="bg-green-400 rounded-xl text-white px-2 py-1.5">Open</p>
            <p v-if="ticket.status === 'Closed'" class="bg-red-400 rounded-xl text-white px-2 py-1.5">Closed</p>
            <p v-if="ticket.status === 'In Progress'" class="bg-yellow-400 rounded-xl text-white px-2 py-1.5">In Progress</p>
          </div>
        </div>
        <p class="mb-10 ml-28">Department: <span class="font-semibold">{{ticket.department}}</span></p>
        <div class="h-[370px] overflow-auto">
          <template v-for="(message, message_index) in messages">
            <template v-if="message.user_type === 1">
              <div class="flex space-x-3">
                <div class="rounded-full bg-green-700 h-fit w-fit p-2 justify-center text-center font-bold text-white">EO</div>
                <div class="px-3 md:py-2 mb-6 last:mb-0 border rounded-lg transition-colors duration-150 bg-green-100 border-1 border-green-500 w-fit">
                  <span class="text-left md:text-left md:py-2 text-xs font-semibold"><slot/>Erasmus One Support</span>
                  <BaseLevel>
                    <div class="flex flex-col md:flex-row items-center">
                      <span class="text-left md:text-left md:py-2"><slot/>{{message.message}}</span>
                    </div>
                  </BaseLevel>
                </div>
              </div>
              <p class="text-xs text-gray-500 flex ml-12 mt-5">{{message.created_at}}</p>
            </template>
            <template v-if="message.user_type === 0">
              <div class="mr-20">
                <div class="flex space-x-3 items-center justify-end">
                  <div class="px-3 md:py-2 mb-6 last:mb-0 border rounded-lg transition-colors duration-150 bg-blue-100 border-1 border-blue-500 w-fit">
                    <span class="text-right md:text-right md:py-2 text-xs font-bold"><slot/>{{user.name}}</span>
                    <BaseLevel>
                      <div class="flex flex-col md:flex-row items-center">
                        <span class="text-right md:text-right md:py-2"><slot/>{{message.message}}</span>
                      </div>
                    </BaseLevel>
                  </div>
                  <div class="rounded-full bg-blue-700 h-fit w-fit p-2 justify-center text-center font-bold text-white uppercase">{{user.name[0]}}{{user.name[1]}}</div>
                </div>
                <p class="text-xs text-gray-500 justify-end flex mr-12 mb-5">{{message.created_at}}</p>
              </div>
            </template>
          </template>
        </div>

        <div v-if="ticket.status !== 'Closed'" class="bottom-0 fixed flex items-center space-x-6">
          <FormField class="w-[900px]">
            <FormControl v-model="message.message" type="textarea" placeholder="Write a message ..." />
          </FormField>
          <BaseButton @click="addMessage()" type="button" color="info" label="Send" class="w-fit h-fit"/>
        </div>
        <div v-else>
          <p class="text-center text-sm text-gray-700">This issue is closed! You can no longer send messages!</p>
        </div>
      </SectionMain>
    </template>
  </LayoutAuthenticated>
</template>

<script setup lang="ts">
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import {mdiBackburger} from '@mdi/js'
import SectionMain from '@/components/SectionMain.vue'
import BaseLevel from '@/components/BaseLevel.vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import BaseButton from '@/components/BaseButton.vue'
import PillTag from '@/components/PillTag.vue'
import {onMounted, ref} from "vue";
import axios from "axios";
import {Ticket} from "../../types/tickets/Ticket";
import {useRoute} from "vue-router";
import {Message} from "../../types/tickets/Message";
import {useAuthStore} from "../../stores/auth";
import {AuthUser} from "../../types/AuthUser";
import Swal from "sweetalert2";

const is_loading = ref(true);
const route = useRoute();
const ticket = ref(new Ticket());
const messages = ref<Message[]>([]);
const auth = useAuthStore();
const user = ref(new AuthUser());
const message = ref(new Message());

const addMessage = async () => {
  await axios.post("http://127.0.0.1:8000/api/messages", {
    form: {
      'ticket_id': ticket.value.id,
      'user_type': 0,
      'message': message.value.message
    },
  })
    .then(async (response) => {
      if (!response.data.status) {
        await Swal.fire({
          title: 'Error ...',
          text: response.data.message,
          icon: 'error',
        })
      } else {
        message.value = new Message();
        await getTicket();
      }
    })
}

const getTicket = async () => {
  is_loading.value = true;
  ticket.value = new Ticket();
  messages.value = <Message[]>[];

  await axios.get("http://127.0.0.1:8000/api/tickets/" + route.params.id)
    .then(async (response) => {
      ticket.value = new Ticket(response.data.ticket);
      response.data.ticket.messages.forEach((message: Message) => {
        messages.value.push(new Message(message));
      })
    })
  is_loading.value = false;
}

onMounted(() => {
  if (auth.user !== null) {
    user.value = new AuthUser(JSON.parse(auth.user));
  }
  getTicket();
})
</script>
