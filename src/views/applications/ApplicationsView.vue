<template>
  <LayoutAuthenticated>
    <SectionMain>
      <div class="flex justify-between items-center">
        <SectionTitleLineWithButton :icon="mdiFileDocument" title="Applications"/>
        <RouterLink to="/add-application">
          <BaseButton type="button" color="info" label="+ Add Application"/>
        </RouterLink>
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
                <th>Student Name</th>
                <th>Faculty</th>
                <th>Mobility</th>
                <th>Status</th>
                <th>Submitted At</th>
                <th>Selection Score</th>
                <th>Destination</th>
                <th />
              </tr>
              </thead>
              <tbody>
              <tr v-for="(application, application_index) in itemsPaginated">
                <td data-label="Student Name">
                  {{ application.first_name }} {{application.last_name}}
                </td>
                <td data-label="Faculty">
                  {{application.faculty.name}}
                </td>
                <td data-label="Mobility">
                  <p v-if="application.mobility_program === 'long'">Long-term</p>
                  <p v-else-if="application.mobility_program === 'short'">Short-term</p>
                  <p v-else-if="application.mobility_program === 'placement'">Placement</p>
                  {{application.academic_year}}
                </td>
                <td data-label="Status">
                  <p v-if="application.status === 'Waiting for approval'" class="font-semibold text-yellow-500">{{application.status}}</p>
                  <p v-else-if="application.status === 'Issues'" class="font-semibold text-red-500">{{application.status}}</p>
                  <p v-else-if="application.status === 'Accepted'" class="font-semibold text-green-500">{{application.status}}</p>
                  <p v-else class="font-semibold">{{application.status}}</p>
                </td>
                <td data-label="Submitted At">
                  {{application.created_at}}
                </td>
                <td data-label="Selection Score">
                  <p v-if="application.selection_score === 0" class="text-gray-500 text-sm">Not Available</p>
                  <p v-else>{{application.selection_score}}</p>
                </td>
                <td data-label="Destination">
                  <p v-if="application.selection_score === 0" class="text-gray-500 text-sm">Not Available</p>
                  <p v-else>{{application.university_name}}</p>
                </td>

                <td class="before:hidden lg:w-1 whitespace-nowrap">
                  <BaseButtons type="justify-start lg:justify-end" no-wrap>
                    <BaseButton color="info" :icon="mdiEye" small :to="'/view-application/'+application.id" />
                    <BaseButton
                      color="danger"
                      :icon="mdiTrashCan"
                      small
                      @click="deleteApplication(application.id, application_index)"
                    />
                  </BaseButtons>

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
import {mdiFileDocument, mdiEye, mdiTrashCan} from '@mdi/js'
import SectionMain from '@/components/SectionMain.vue'
import BaseButton from '@/components/BaseButton.vue'
import {computed, onMounted, ref} from "vue";
import BaseButtons from '@/components/BaseButtons.vue'
import BaseLevel from '@/components/BaseLevel.vue'
import CardBox from '@/components/CardBox.vue'
import axios from "axios";
import Swal from "sweetalert2";
import {AuthUser} from "../../types/AuthUser";
import {useAuthStore} from "../../stores/auth";
import {Application} from "../../types/applications/Application";

const perPage = ref(10);
const currentPage = ref(0);
const itemsPaginated = computed(() =>
  applications.value.slice(perPage.value * currentPage.value, perPage.value * (currentPage.value + 1))
);
const numPages = computed(() => Math.ceil(applications.value.length / perPage.value))
const currentPageHuman = computed(() => currentPage.value + 1)
const pagesList = computed(() => {
  const pagesList = []

  for (let i = 0; i < numPages.value; i++) {
    pagesList.push(i)
  }

  return pagesList
})
const is_loading = ref(true);
const user = ref(new AuthUser());
const auth = useAuthStore();
const applications = ref<Application[]>([]);

const deleteApplication = (id: number, index: number) => {
  Swal.fire({
    title: 'Are you sure that you want to delete this application?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes'
  }).then((result) => {
    if (result.isConfirmed) {
      axios.delete(`http://127.0.0.1:8000/api/applications/${id}`)
        .then((response) => {
          Swal.fire({
            title: 'Success',
            icon: 'success',
            html: 'Application deleted successfully!',
            showCancelButton: false,
          })
          applications.value.splice(index,1);
        })
        .catch((error) => {
          console.log('eroare: ', error);
        })
    }
  })
}

const getData = async () => {
  try {
    const response = await axios.get(`http://127.0.0.1:8000/api/user-applications/${user.value.id}`);
    response.data.applications.forEach((application: any) => {
      let parsed_application = new Application(application);
      if(application.university !== null) {
        parsed_application.university_name = application.university.name;
      }
      applications.value.push(parsed_application);
    })
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
  if (auth.user !== null) {
    user.value = new AuthUser(JSON.parse(auth.user));
  }
  getData();
})
</script>
