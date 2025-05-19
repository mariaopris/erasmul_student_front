<template>
  <LayoutAuthenticated>
    <SectionMain>
      <div class="flex justify-between items-center">
        <SectionTitleLineWithButton :icon="mdiLightbulbOn" title="Recommendations"/>
      </div>

      <template v-if="is_loading">
        <p>Loading ...</p>
      </template>
      <template v-else>
        <div>
          <div class="justify-end flex py-2">
            <RouterLink to="/recommend-university">
              <BaseButton type="button" color="info" label="Get Recommendation"/>
            </RouterLink>
          </div>

          <CardBox has-table>
            <table>
              <thead>
              <tr>
                <th># (Newest First)</th>
                <th>Created At</th>
                <th>Status</th>
                <th />
              </tr>
              </thead>
              <tbody>
              <tr v-for="(recommendation, recommendation_index) in itemsPaginated" :key="recommendation.id">
                <td data-label="#">
                  {{ recommendation_index + 1 }}
                </td>
                <td data-label="Created At">
                  {{ recommendation.created_at }}
                </td>
                <td data-label="Status">
                  <template v-if="recommendation.status === 'in_progress'">
                    <p class="text-yellow-500 font-semibold">In progress ...</p>
                  </template>
                  <template v-else-if="recommendation.status === 'finished'">
                    <p class="text-green-500 font-semibold">Finished</p>
                  </template>
                  <template v-else>
                    {{ recommendation.status }}
                  </template>
                </td>
                <td class="before:hidden lg:w-1 whitespace-nowrap">
                  <BaseButtons type="justify-start lg:justify-end" no-wrap>
                    <BaseButton color="info" :icon="mdiEye" small :to="'view-recommendation/'+recommendation.id" />
                    <BaseButton
                      color="danger"
                      :icon="mdiTrashCan"
                      small
                      @click="deleteRecommendation(recommendation.id, recommendation_index)"
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
import {mdiLightbulbOn, mdiTrashCan, mdiEye} from '@mdi/js'
import SectionMain from '@/components/SectionMain.vue'
import BaseButton from '@/components/BaseButton.vue'
import {computed, onMounted, ref} from "vue";
import BaseButtons from '@/components/BaseButtons.vue'
import BaseLevel from '@/components/BaseLevel.vue'
import CardBox from '@/components/CardBox.vue'
import axios from "axios";
import Swal from 'sweetalert2'
import {RecommendationCriteria} from "../../types/recommendations/RecommendationCriteria";
import {AuthUser} from "../../types/AuthUser";
import {useAuthStore} from "../../stores/auth";

const perPage = ref(10);
const currentPage = ref(0);
const itemsPaginated = computed(() =>
  filtered_recommendations.value.slice(perPage.value * currentPage.value, perPage.value * (currentPage.value + 1))
);
const is_loading = ref(true);
const recommendations = ref<RecommendationCriteria[]>([]);
const filtered_recommendations = ref<RecommendationCriteria[]>([]);
const numPages = computed(() => Math.ceil(filtered_recommendations.value.length / perPage.value))
const currentPageHuman = computed(() => currentPage.value + 1)
const auth_user = ref(new AuthUser());
const auth = useAuthStore();
const pagesList = computed(() => {
  const pagesList = []

  for (let i = 0; i < numPages.value; i++) {
    pagesList.push(i)
  }

  return pagesList
})

const deleteRecommendation = (id: number, index: number) => {
  Swal.fire({
    title: 'Are you sure that you want to delete this recommendation?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes'
  }).then((result) => {
    if (result.isConfirmed) {
      axios.delete(`http://127.0.0.1:8000/api/recommendations/${id}`)
        .then((response) => {
          Swal.fire({
            title: 'Success',
            icon: 'success',
            html: 'Recommendation deleted successfully!',
            showCloseButton: true
          })
          filtered_recommendations.value.splice(index,1);
        })
        .catch((error) => {
          console.log('eroare: ', error);
        })
    }
  })
}

const getRecommendations = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/api/recommendations/?user_id="+auth_user.value.id);
    response.data.recommendations.forEach((recommendation: any) => {
      recommendations.value.push(new RecommendationCriteria(recommendation));
    })
    filtered_recommendations.value = JSON.parse(JSON.stringify(recommendations.value));
    console.log('recommendations.value',recommendations.value)

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
    auth_user.value = new AuthUser(JSON.parse(auth.user));
  }
  getRecommendations();
})
</script>
