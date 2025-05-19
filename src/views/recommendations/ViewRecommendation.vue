<template>
  <LayoutAuthenticated>
    <SectionMain>
      <div class="flex justify-between items-center">
        <SectionTitleLineWithButton :icon="mdiLightbulbOn" title="View Recommendation"/>
        <RouterLink to="/recommendations">
          <PillTag label="Back" :icon="mdiBackburger" />
        </RouterLink>
      </div>

      <template v-if="is_loading">
        <p>Loading ...</p>
      </template>
      <template v-else>
        <CardBox>
          <p class="font-semibold text-lg text-blue-500">Requirements </p>
          <div class="p-2">
            <p>
              <span class="font-bold">Year: </span>
              <template v-if="form.year === 'Ba1'">Bachelor Year 1 🏫</template>
              <template v-if="form.year === 'Ba2'">Bachelor Year 2 🎓</template>
              <template v-if="form.year === 'Ba3'">Bachelor Year 3 📖</template>
              <template v-if="form.year === 'Ba4'">Bachelor Year 4 🏆</template>
              <template v-if="form.year === 'Ma1'">Masters Year 1 🎓</template>
              <template v-if="form.year === 'Ma2'">Masters Year 2 📘</template>
              <template v-if="form.year === 'PhD'">PhD 🧠</template>
            </p>

            <p>
              <span class="font-bold">Mobility Duration: </span>
              <template v-if="form.duration === 'first'">First Semester 🌍</template>
              <template v-if="form.duration === 'second'">Second Semester 🌍</template>
              <template v-if="form.duration === 'one_year'">One Year 🌎</template>
            </p>

            <p>
              <span class="font-bold">Sending University: </span>
              <span>{{form.university.name}}</span>
            </p>

            <p>
              <span class="font-bold">Current Degree: </span>
              <span>{{degree}}</span>
            </p>

            <p>
              <span class="font-bold">Preferred Countries: </span>
              <template v-for="(country, country_index) in form.preferred_countries">
                <span>{{country.name}}</span>
                <span v-if="country_index+1 < form.preferred_countries.length">,</span>
              </template>
            </p>

            <p>
              <span class="font-bold">Language of study: </span>
              <span>{{form.study_language.name}}</span>
            </p>
          </div>

          <p class="text-xl font-semibold mt-10 text-blue-500">Recommendations</p>
          <template v-if="form.recommendation.recommendations.length === 0">
            <div class="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-sm mt-3">
              <div class="flex items-center">
                <div>
                  <p class="font-semibold">{{ form.recommendation.message }}!</p>
                  <p class="text-sm text-red-600">{{ form.recommendation.description }}</p>
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <template v-for="(recommendation, recommendation_index) in form.recommendation.recommendations">
              <div class="p-2">
                <p><span class="font-semibold">University Name: </span>
                  <RouterLink :to="'/edit-university/'+recommendation.university.id">
                    <span class="underline text-blue-500">{{recommendation.university_name}}</span>
                  </RouterLink>
                </p>
                <p><span class="font-semibold">Country: </span>{{recommendation.university.country}}</p>

                <p class="my-2 text-red-500">You're all set — these courses add up to your required credits! <span class="font-semibold">({{form.university.no_required_credits}} ECTS)</span></p>
                <template v-for="(course, course_index) in form.recommendation.recommendations_for_required_credits">
                  <div class="py-1">
                    <p>{{course_index+1}}. <span class="font-semibold">{{course.course_name}}</span> ({{course.course_no_credits}} ECTS)
                      <RouterLink :to="'/edit-course/'+course.course_id" class="underline text-blue-500">view</RouterLink>
                    </p>
                  </div>
                </template>

                <button v-if="!open_more_courses" @click="open_more_courses = true" class="py-2 underline text-blue-500 text-xs mt-10">See all recommended courses</button>

                <template v-if="open_more_courses">
                  <div class="py-3 space-x-3 flex mt-5">
                    <p class="text-lg text-red-500">All recommended courses</p>
                    <button @click="open_more_courses = false" class="underline text-blue-500 text-xs">Hide</button>
                  </div>
                  <template v-for="(course, course_index) in recommendation.recommended_courses">
                    <div class="py-1">
                      <p>{{course_index+1}}. <span class="font-semibold">{{course.course_name}}</span> ({{course.course_no_credits}} ECTS)
                        <RouterLink :to="'/edit-course/'+course.course_id" class="underline text-blue-500">view</RouterLink>
                      </p>
                    </div>
                  </template>

                </template>

              </div>
            </template>
          </template>



            <template v-if="feedback_submited">
              <div class="mt-6 p-4 bg-green-100 border border-green-300 rounded-xl text-green-800 shadow-sm">
                <h3 class="text-lg font-semibold">Thank you for your feedback!</h3>
                <p class="text-sm mt-1">Your input helps us improve the recommendation system for future students.</p>
              </div>
            </template>
            <template v-else>
              <div class="mx-auto p-6 bg-white rounded-2xl border shadow-lg mt-5">
                <h2 class="text-xl font-semibold mb-4">Feedback</h2>

                <p class="text-gray-600 mb-4">
                  Please tell us how useful these recommendations are for you.
                </p>

                <div class="flex items-center mb-4 space-x-2">
                  <label class="text-gray-700 font-medium">Score:</label>
                  <div class="flex space-x-1">
                    <button v-for="s in 5" :key="s"
                            @click="feedback.score = s" :class="['w-8 h-8 rounded-full text-white', feedback.score >= s ? 'bg-blue-700' : 'bg-gray-300']">
                      {{ s }}
                    </button>
                  </div>
                </div>
                <div class="mb-4">
                <label for="feedback" class="block text-gray-700 font-medium mb-1">Your feedback:</label>
                <textarea
                  id="feedback"
                  rows="4"
                  class="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Write your comments here..."
                  v-model="feedback.comment"
                ></textarea>
              </div>
                <BaseButton @click="saveFeedback()" color="info" label="Submit"/>
              </div>
            </template>
        </CardBox>
      </template>
    </SectionMain>
  </LayoutAuthenticated>
</template>

<script setup lang="ts">
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue';
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue';
import CardBox from '@/components/CardBox.vue';
import SectionMain from '@/components/SectionMain.vue';
import {onMounted, ref} from "vue";
import {RecommendationCriteria} from "../../types/recommendations/RecommendationCriteria";
import axios from "axios";
import Swal from "sweetalert2";
import {Degree} from "../../types/universities/Degree";
import {useRoute} from "vue-router";
import {mdiLightbulbOn, mdiBackburger} from '@mdi/js'
import {University} from "../../types/universities/University";
import {Recommendations} from "../../types/recommendations/Recommendations";
import PillTag from '@/components/PillTag.vue'
import BaseButton from '@/components/BaseButton.vue'
import {Feedback} from "../../types/recommendations/Feedback";

const form = ref(new RecommendationCriteria());
const degrees = ref<Degree[]>([]);
const is_loading = ref(true);
const route = useRoute()
const degree = ref('');
const universities = ref<University[]>([])
const open_more_courses = ref(false);
const feedback = ref(new Feedback());
const feedback_submited = ref(false);

const getUniversities = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/api/universities");
    response.data.universities.forEach((university: any) => {
      university.isced_codes = university.isced_codes.split(',');
      universities.value.push(new University(university));
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

const getDegrees = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/api/degrees");
    response.data.degrees.forEach((degree: any) => {
      degrees.value.push(new Degree(degree));
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

const saveFeedback = async () => {
  try {
    await axios.post("http://127.0.0.1:8000/api/feedbacks", {
      form: {
        recommendation_id: feedback.value.recommendation_id,
        score: feedback.value.score,
        comment: feedback.value.comment
      }
    })
      .then(async (response) => {
        console.log('response', response.data)
        if(response.data.status) {
          feedback_submited.value = true;
        }
        else {
          await Swal.fire({
            title: response.data.message,
            text: response.data.errors.status[0],
            icon: 'error',
          })
        }
      });
  } catch (e) {
    console.log(e);
    if (e.response?.data?.error) {
      Swal.fire({
        icon: 'error',
        title: 'Ooops..',
        text: e.response.data.error,
      })
    }
  }
}

const getRecommendation = async () => {
  form.value.id = Number(route.params.id);
  feedback.value.recommendation_id = form.value.id;

  try {
    const response = await axios.get(`http://127.0.0.1:8000/api/recommendations/${form.value.id}`);
    form.value = new RecommendationCriteria(response.data.recommendation);
    let i = degrees.value.findIndex(item => item.id == form.value.degree);
    if(i >= 0) {
      degree.value = degrees.value[i].name;
    }
    if(form.value.recommendation.hasOwnProperty('recommendations')) {
      form.value.recommendation.recommendations.forEach((recommendation: Recommendations) => {
        let i = universities.value.findIndex(item => item.id == recommendation.university_id);
        if(i >= 0) {
          recommendation.university = universities.value[i];
        }
      })
    }

    console.log('form.value', form.value)
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

onMounted(async () => {
  await getDegrees();
  await getUniversities();
  await getRecommendation();
})
</script>


