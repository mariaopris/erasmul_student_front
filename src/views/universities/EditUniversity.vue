<template>
  <LayoutAuthenticated>
      <SectionMain>
        <div class="flex justify-between items-center">
          <SectionTitleLineWithButton :icon="mdiSchoolOutline" :title="'View University - '+university.name"/>
          <RouterLink to="/universities">
            <PillTag label="Back" :icon="mdiBackburger" />
          </RouterLink>
        </div>

        <template v-if="is_loading">
          <p>Loading ...</p>
        </template>
        <template v-else>
          <CardBox>
            <div class="space-y-2">
              <p>
                <span class="font-bold">Name: </span>
                <span>{{university.name}}</span>
              </p>
              <p>
                <span class="font-bold">Email: </span>
                <span v-if="university.email === '' || university.email === null">-</span>
                <span>{{university.email}}</span>
              </p>
              <p>
                <span class="font-bold">Country: </span>
                <span>{{university.country}}</span>
              </p>
              <p>
                <span class="font-bold">Erasmus Code: </span>
                <span>{{university.code}}</span>
              </p>
              <p>
                <span class="font-bold">Erasmus Coordinator: </span>
                <span>{{university.coordinator}}</span>
              </p>
              <p>
                <span class="font-bold">Mobility Period: </span>
                <span>{{university.mobility_period}} months</span>
              </p>
              <p>
                <span class="font-bold">ISCED Codes: </span>
                <span v-if="university.isced_codes.length === 0">-</span>
                <template v-for="(code, code_index) in university.isced_codes">
                  <span>Code: {{code.code}} - Name: {{code.name}}</span>
                  <span v-if="code_index+1 < isced_codes.length">,</span>
                </template>
              </p>
            </div>

            <div class="flex mt-1">
              <p class="font-bold mr-2">Study Plans:</p>
              <template v-for="(year, year_index) in university.years">
                <template v-if="year === 'BA1'"><span>Bachelor Year 1</span></template>
                <template v-if="year === 'BA2'"><span>Bachelor Year 2</span></template>
                <template v-if="year === 'BA3'"><span>Bachelor Year 3</span></template>
                <template v-if="year === 'BA4'"><span>Bachelor Year 4</span></template>
                <template v-if="year === 'MA1'"><span>Masters Year 1</span></template>
                <template v-if="year === 'MA2'"><span>Masters Year 2</span></template>
                <template v-if="year === 'PhD'"><span>PhD</span></template>
                <span v-if="year_index+1<university.years.length" class="mr-2">,</span>
              </template>
            </div>

            <div class="flex mb-3 mt-1">
              <p class="font-bold mr-2">Study Languages:</p>
              <template v-for="(language, language_index) in university.languages">
                {{language.name}}
                <span v-if="language_index+1<university.languages.length" class="mr-2">,</span>
              </template>
            </div>

            <template v-if="university.description !== '' && university.description !== null">
              <FormField label="Description">
                <FormControl disabled="true" v-model="university.description" type="textarea" placeholder="University Description" />
              </FormField>
            </template>

            <BaseDivider />

            <p class="text-xl font-bold mb-6 text-gray-800">🎓 Departments</p>

            <template v-for="(department, department_index) in university.departments" :key="department.id">
              <div class="mb-10 p-6 bg-white shadow-md rounded-2xl border border-gray-100">
                <p class="text-xl font-semibold text-gray-700 mb-3">
                  {{ department_index + 1 }}. {{ department.name }}
                </p>

                <p class="text-lg font-medium text-gray-600 mb-2">📘 Degrees</p>

                <template v-for="(degree, degree_index) in getDegreeByDepartment(department.id)" :key="degree.id">
                  <div class="bg-gray-50 rounded-xl px-4 py-3 mb-3 border border-gray-200 transition-shadow hover:shadow-md max-w-2xl">
                    <div class="flex justify-between items-center">
                      <p class="text-base text-gray-800 font-medium">
                        {{ degree_index + 1 }}. {{ degree.name }}
                      </p>
                      <button
                        @click="degree.show = !degree.show"
                        class="text-sm text-blue-600 underline hover:text-blue-800 transition"
                      >
                        {{ degree.show ? 'Hide Courses' : 'Show Courses' }}
                      </button>
                    </div>

                    <div v-if="degree.show" class="mt-3">
                      <p class="text-sm font-semibold text-gray-600 mb-2">📚 Courses</p>
                      <template v-for="(course, course_index) in getCoursesByDegree(degree.id)" :key="course.id">
                        <div class="flex justify-between items-center text-sm bg-white border border-gray-100 rounded-lg px-3 py-2 mb-1 hover:bg-gray-50 transition">
                          <p class="text-gray-700">{{ course_index + 1 }}. {{ course.name }}</p>
                          <RouterLink
                            :to="'/edit-course/' + course.id"
                            class="text-blue-500 underline hover:text-blue-700 transition"
                          >
                            View
                          </RouterLink>
                        </div>
                      </template>
                    </div>
                  </div>
                </template>
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
import BaseButton from '@/components/BaseButton.vue';
import BaseButtons from '@/components/BaseButtons.vue';
import {onMounted, ref} from "vue";
import FormField from '@/components/FormField.vue';
import FormControl from '@/components/FormControl.vue';
import BaseDivider from '@/components/BaseDivider.vue';
import {mdiSchoolOutline, mdiBackburger} from '@mdi/js';
import {University} from "../../types/universities/University";
import axios from "axios";
import Swal from "sweetalert2";
import {IscedCode} from "../../types/universities/IscedCode";
import {useRoute} from "vue-router";
import {Language} from "../../types/Language";
import {Degree} from "../../types/universities/Degree";
import {Course} from "../../types/universities/Course";
import PillTag from '@/components/PillTag.vue'

const route = useRoute()
const university = ref<University>(new University());
const isced_codes = ref<IscedCode[]>([]);
const is_loading = ref(true);
const languages = <Language[]>ref([]);

function getCoursesByDegree(id: number) {
  let courses = <Course[]>[];

  university.value.courses.forEach((course: Course) => {
    if(course.degree_id === id) {
      courses.push(new Course(course));
    }
  })

  return courses;
}

function getDegreeByDepartment(id: number) {
  let degrees = <Degree[]>[];

  university.value.degrees.forEach((degree: Degree) => {
    if(degree.department_id === id) {
      degrees.push(degree);
    }
  })

  return degrees;
}

const getUniversity = async () => {
  university.value.id = Number(route.params.id);
  try {
    const response = await axios.get(`http://127.0.0.1:8000/api/universities/${university.value.id}`);
    console.log('response.data', response.data)
    response.data.university.isced_codes = JSON.parse(response.data.university.isced_codes);
    let codes = <IscedCode[]>[];
    response.data.university.isced_codes.forEach((isced_code: string) => {
      let i = isced_codes.value.map(item => item.code).indexOf(isced_code);
      if(i >= 0)
      {
        codes.push(isced_codes.value[i]);
      }
    })
    university.value = new University(response.data.university);
    university.value.isced_codes = codes;
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

const getIscedCodes = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/api/isced-codes");
    response.data.codes.forEach((isced_code: any) => {
      isced_codes.value.push(new IscedCode(isced_code));
    })
    await getUniversity();
  } catch (error) {
    console.log('error', error)
    Swal.fire({
      title: 'Error!',
      text: error.response.data.message,
      icon: 'error',
    })
  }
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

onMounted(() => {
  getLanguages();
  getIscedCodes();
})
</script>

<style src="../../../node_modules/vue-multiselect/dist/vue-multiselect.css"></style>

