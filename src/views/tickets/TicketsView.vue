<template>
  <LayoutAuthenticated>
    <CardBoxModal @confirm="addTicket()" v-model="modalTicketActive" title="Create Ticket" button-label="Confirm" has-cancel>
      <FormField label="Department">
        <FormControl v-model="ticket.department" :options="departmentOptions"/>
      </FormField>
      <FormField label="Subject">
        <FormControl v-model="ticket.title"/>
      </FormField>
      <FormField label="Description">
        <FormControl v-model="message.message" type="textarea"/>
      </FormField>
    </CardBoxModal>
    <SectionMain>
      <div class="flex justify-between items-center">
        <SectionTitleLineWithButton :icon="mdiTicket" title="Tickets"/>
        <BaseButton @click="modalTicketActive = true" type="button" color="info" label="+ Add Ticket"/>
      </div>

      <template v-if="is_loading">
        <p>Loading ...</p>
      </template>
      <template v-else>
        <div>
          <CardBox has-table>
            <table>
              <thead>
              <tr>
                <th>Subject</th>
                <th>Created At</th>
                <th>Last Updated</th>
                <th>Status</th>
                <th />
              </tr>
              </thead>
              <tbody>
              <tr v-for="(ticket, ticket_index) in itemsPaginated">
                <td data-label="Subject">
                  {{ ticket.title }}
                </td>
                <td data-label="Created At">
                  {{ ticket.created_at }}
                </td>
                <td data-label="Last Updated">
                  {{ ticket.updated_at }}
                </td>
                <td data-label="Status">
                  <p v-if="ticket.status === 'Open'" class="text-green-500 font-semibold">{{ ticket.status }}</p>
                  <p v-if="ticket.status === 'In Progress'" class="text-yellow-500 font-semibold">{{ ticket.status }}</p>
                  <p v-if="ticket.status === 'Closed'" class="text-red-500 font-semibold">{{ ticket.status }}</p>
                </td>
                <td class="before:hidden lg:w-1 whitespace-nowrap">
                  <RouterLink :to="'view-ticket/'+ticket.id">
                    <BaseButton color="info" :icon="mdiEye" small @click="isModalActive = true" />
                  </RouterLink>
                </td>
              </tr>
              </tbody>
            </table>
            <div class="p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800">
              <BaseLevel>
                <BaseButtons>
                  <BaseButton
                    v-for="page in pagesList"
                    :key="page"
                    :active="page === currentPage"
                    :label="page + 1"
                    :color="page === currentPage ? 'lightDark' : 'whiteDark'"
                    small
                    @click="currentPage = page"
                  />
                </BaseButtons>
                <small>Page {{ currentPageHuman }} of {{ numPages }}</small>
              </BaseLevel>
            </div>
          </CardBox>
        </div>
      </template>
    </SectionMain>
  </LayoutAuthenticated>
</template>

<script setup lang="ts">
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import {mdiTicket, mdiEye} from '@mdi/js'
import SectionMain from '@/components/SectionMain.vue'
import BaseButton from '@/components/BaseButton.vue'
import {computed, onMounted, ref} from "vue";
import BaseButtons from '@/components/BaseButtons.vue'
import BaseLevel from '@/components/BaseLevel.vue'
import CardBox from '@/components/CardBox.vue'
import CardBoxModal from '@/components/CardBoxModal.vue'
import FormField from '@/components/FormField.vue';
import FormControl from '@/components/FormControl.vue';
import {Ticket} from "../../types/tickets/Ticket";
import {Message} from "../../types/tickets/Message";
import {useAuthStore} from "../../stores/auth";
import {AuthUser} from "../../types/AuthUser";
import axios from "axios";
import Swal from "sweetalert2";

const perPage = ref(10);
const currentPage = ref(0);
const itemsPaginated = computed(() =>
  tickets.value.slice(perPage.value * currentPage.value, perPage.value * (currentPage.value + 1))
);

const numPages = computed(() => Math.ceil(tickets.value.length / perPage.value))

const currentPageHuman = computed(() => currentPage.value + 1)

const pagesList = computed(() => {
  const pagesList = []

  for (let i = 0; i < numPages.value; i++) {
    pagesList.push(i)
  }

  return pagesList
})

const isModalActive = ref(false);
const modalTicketActive = ref(false);
const departmentOptions = ['Application','Documents','Support'];
const ticket = ref(new Ticket());
const message = ref(new Message());
const auth = useAuthStore();
const user = ref(new AuthUser());
const tickets = ref<Ticket[]>([]);
const is_loading = ref(true);

const addTicket = async () => {
  await axios.post("http://127.0.0.1:8000/api/tickets", {
    form: {
      'user_id': user.value.id,
      'title': ticket.value.title,
      'status': ticket.value.status,
      'department': ticket.value.department
    },
  })
    .then(async (response) => {
      if (!response.data.status) {
        await Swal.fire({
          title: 'Error ...',
          text: response.data.message,
          icon: 'error',
        })
      }
      else {
        await axios.post("http://127.0.0.1:8000/api/messages", {
          form: {
            'ticket_id': response.data.id,
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
            }
            else {
              await Swal.fire({
                title: 'Success',
                text: 'Ticket added!',
                icon: 'success',
              })
              getTickets();
            }
          })
      }
    })
}

const getTickets = async () => {
  is_loading.value = true;
  ticket.value = new Ticket();
  tickets.value = <Ticket[]>[];
  await axios.get("http://127.0.0.1:8000/api/user-tickets/"+user.value.id)
    .then(async (response) => {
      response.data.tickets.forEach((ticket: Ticket) => {
        tickets.value.push(new Ticket(ticket));
      })
    })
  is_loading.value = false;
}
onMounted(async () => {
  if (auth.user !== null) {
    user.value = new AuthUser(JSON.parse(auth.user));
  }
  await getTickets();
})
</script>
