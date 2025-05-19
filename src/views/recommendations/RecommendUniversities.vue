<template>
  <LayoutAuthenticated>
    <SectionMain>
      <CardBox form @submit="submit()">
        <div class="flex space-x-3 justify-center items-center mb-5">
          <SectionTitleLineWithButton title="Get Recommendation 🎯" class="text-2xl font-semibold"/>
        </div>
        <FormField label="1. Choose Year 📚">
          <div class="space-y-3">
            <div class="flex space-x-14">
              <div class="flex space-x-3 items-center">
                <input v-model="form.year" value="Ba1" type="radio" />
                <span class="radio">Bachelor Year 1 🏫</span>
              </div>
              <div class="flex space-x-3 items-center">
                <input v-model="form.year" value="Ba2" type="radio" />
                <span class="radio">Bachelor Year 2 🎓</span>
              </div>
              <div class="flex space-x-3 items-center">
                <input v-model="form.year" value="Ba3" type="radio" />
                <span class="radio">Bachelor Year 3 📖</span>
              </div>
              <div class="flex space-x-3 items-center">
                <input v-model="form.year" value="Ba4" type="radio" />
                <span class="radio">Bachelor Year 4 🏆</span>
              </div>
            </div>
            <div class="flex space-x-14">
              <div class="flex space-x-3 items-center mr-1.5">
                <input v-model="form.year" value="Ma1" type="radio" />
                <span class="radio">Masters Year 1 🎓</span>
              </div>
              <div class="flex space-x-3 items-center">
                <input v-model="form.year" value="Ma2" type="radio" />
                <span class="radio">Masters Year 2 📘</span>
              </div>
            </div>
            <div class="flex space-x-14">
              <div class="flex space-x-3 items-center mr-1.5">
                <input v-model="form.year" value="PhD" type="radio" />
                <span class="radio">PhD 🧠</span>
              </div>
            </div>
          </div>
        </FormField>

        <FormField label="2. Choose Mobility Duration ⏳">
          <div class="space-y-3">
            <div class="flex space-x-14">
              <div class="flex space-x-3 items-center">
                <input v-model="form.duration" value="first" type="radio" />
                <span class="radio">First Semester 🌍</span>
              </div><div class="flex space-x-3 items-center">
                <input v-model="form.duration" value="second" type="radio" />
                <span class="radio">Second Semester 🌍</span>
              </div>
              <div class="flex space-x-3 items-center">
                <input v-model="form.duration" value="one_year" type="radio" />
                <span class="radio">One Year 🌎</span>
              </div>
            </div>
          </div>
        </FormField>

        <FormField label="3. Select your University 🎓">
          <Multiselect v-model="form.university" :options="universities" :multiple="false" label="name" track-by="id"></Multiselect>
        </FormField>

        <FormField label="4. Select your Degree 📜">
          <Multiselect v-model="form.degree" :options="filteredDegrees()" :multiple="false" label="name" track-by="id"></Multiselect>
        </FormField>

        <FormField label="5. Choose your preferred countries 🌍">
          <Multiselect v-model="form.preferred_countries" :options="countries" :multiple="true" label="name" track-by="id"></Multiselect>
        </FormField>

        <FormField label="6. Language of study 🗣️">
          <Multiselect v-model="form.study_language" :options="languages" :multiple="false" label="name" track-by="id"></Multiselect>
        </FormField>

        <template #footer>
          <BaseButtons class="justify-center">
            <BaseButton to="/recommendations" type="button" color="info" outline label="Back" />
            <BaseButton @click="submit()" color="info" label="Submit" />
          </BaseButtons>
        </template>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>

<script setup lang="ts">
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue';
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue';
import CardBox from '@/components/CardBox.vue';
import SectionMain from '@/components/SectionMain.vue';
import BaseButton from '@/components/BaseButton.vue';
import FormField from '@/components/FormField.vue';
import {onMounted, ref} from "vue";
import {RecommendationCriteria} from "../../types/recommendations/RecommendationCriteria";
import Multiselect from 'vue-multiselect';
import BaseButtons from '@/components/BaseButtons.vue';
import axios from "axios";
import Swal from "sweetalert2";
import {Country} from "../../types/Country";
import {Language} from "../../types/Language";
import {AuthUser} from "../../types/AuthUser";
import {useAuthStore} from "../../stores/auth";
import {University} from "../../types/universities/University";
import {Degree} from "../../types/universities/Degree";
import {useRouter} from "vue-router";
import {Step} from "../../types/home/Step";

const countries = ref<Country[]>([]);
const languages = ref<Language[]>([]);
const form = ref(new RecommendationCriteria());
const user = ref(new AuthUser());
const auth = useAuthStore();
const universities =  ref<University[]>([]);
const degrees = ref<Degree[]>([]);
const router = useRouter()

function filteredDegrees() {
  let filtered_degrees = <Degree[]>[];
  degrees.value.forEach((deg: Degree) => {
    if(deg.university_id == form.value.university.id && form.value.year.includes(deg.level)) {
      filtered_degrees.push(deg);
    }
  })

  return filtered_degrees;
}

const save = async () => {
  try {
    await axios.post("http://127.0.0.1:5000/submit-courses/", {
      user_id: form.value.user_id,
      year: form.value.year,
      duration: form.value.duration,
      university: form.value.university,
      degree: form.value.degree,
      preferred_countries: form.value.preferred_countries,
      study_language: form.value.study_language
    })
      .then(async (response) => {
        if (!response.data.status) {
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

const changeStepStatus = async (tag, status) => {
  try {
    let step = new Step();
    step.tag = tag;
    step.status = status;
    await axios.put(`http://127.0.0.1:8000/api/steps/`+user.value.id, step)
      .then(async (response) => {
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
      Swal.fire({
        icon: 'error',
        title: 'Ooops..',
        text: "An unknown error has occurred",
      })
    }
  }
}

const submit = () => {
  save();
  changeStepStatus('1_1', 'done');
  changeStepStatus('1_2', 'in_progress');
  Swal.fire({
    title: 'Your recommendations are being generated!',
    text: 'Please hold on, this may take a few moments',
    icon: 'info',
  })
  router.push('/recommendations')
}

const getLanguages = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/api/languages");
    response.data.languages.forEach((language: any) => {
      languages.value.push(new Language(language));
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

const getCountries = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/api/countries");
    response.data.countries.forEach((country: Country) => {
      countries.value.push(new Country(country));
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

onMounted(() => {
  if (auth.user !== null) {
    user.value = new AuthUser(JSON.parse(auth.user));
  }
  form.value.user_id = user.value.id;
  console.log('form.value.user_id', form.value.user_id)
  getCountries();
  getDegrees();
  getUniversities();
  getLanguages();
})
</script>

<style src="../../../node_modules/vue-multiselect/dist/vue-multiselect.css"></style>

