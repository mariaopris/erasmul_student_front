<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiBook" :title="'View Course - '+course.name"/>

      <template v-if="is_loading">
        <p>Loading ...</p>
      </template>
      <template v-else>
        <CardBox>
          <div class="space-y-2">
            <p>
              <span class="font-bold">Course Name: </span>
              <span>{{course.name}}</span>
            </p>
            <p>
              <span class="font-bold">University Name: </span>
              <span>{{course.university.name}}</span>
            </p>
            <p>
              <span class="font-bold">Department: </span>
              <span>{{course.department.name}}</span>
            </p>
            <p>
              <span class="font-bold">Degree: </span>
              <span>{{course.degree.name}}</span>
            </p>
            <p>
              <span class="font-bold">Course Language: </span>
              <span>{{course.language.name}}</span>
            </p>
            <p>
              <span class="font-bold">Semester: </span>
              <span>{{course.semester.name}}</span>
            </p>
            <p>
              <span class="font-bold">Year: </span>
              <template v-if="course.level === 'Ba'">Bachelor</template>
              <template v-if="course.level === 'Ma'">Master</template>
              <template v-if="course.level === 'PhD'">PhD</template>
              <template v-if="course.level !== 'PhD'"> - Year {{ course.year }}</template>
              🎓
            </p>
            <p>
              <span class="font-bold">Number of Credits: </span>
              <span>{{course.no_credits}} ECTS</span>
            </p>
            <p>
              <span class="font-bold">Course Description: </span>
              <FormControl v-model="course.description" type="textarea" disabled="true"/>
            </p>
            <p>
              <span class="font-bold">Course Link: </span>
              <a :href="course.link" class="underline text-blue-500">{{course.link}}</a>
            </p>
          </div>


          <template #footer>
            <BaseButton to="/courses" type="button" color="info" outline label="Back"/>
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
import {ref} from "vue";
import FormControl from '@/components/FormControl.vue';
import {mdiBook} from '@mdi/js';
import {University} from "../../types/universities/University";
import axios from "axios";
import Swal from "sweetalert2";
import {onMounted} from "vue";
import {Department} from "../../types/universities/Department";
import {Course} from "../../types/universities/Course";
import {useRoute} from "vue-router";
import {Language} from "../../types/Language";

const university = ref<University>(new University());
const universities = ref<University[]>([]);
const departments = ref<Department[]>([]);
const course = ref(new Course());
const route = useRoute();
const languages = ref<Language[]>([]);
const is_loading = ref(true);

const getCourse = async () => {
  course.value.id = Number(route.params.id);

  try {
    const response = await axios.get("http://127.0.0.1:8000/api/courses/"+course.value.id);
    course.value = new Course(response.data.course);
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

const getDepartments = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/api/departments");
    response.data.departments.forEach((department: Department) => {
      departments.value.push(new Department(department));
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
  is_loading.value = false;
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

onMounted(async () => {
  await getCourse();
  await getLanguages();
  await getDepartments();
  await getUniversities();
})

</script>


