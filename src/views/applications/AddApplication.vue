<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiBookEdit" title="Add Application"/>

      <template v-if="is_loading">
        <p>Loading ...</p>
      </template>
      <template v-else>
        <CardBox>
          <p class="text-2xl font-semibold mb-5">General information</p>

          <FormField label="Academic Year" class="w-[350px]" required>
            <FormControl v-model="application.academic_year" :options="academicYearOptions"/>
          </FormField>

          <div class="grid grid-cols-2 space-x-3">
            <FormField label="First Name" required>
              <FormControl v-model="application.first_name" disabled="true"/>
            </FormField>

            <FormField label="Last Name" required>
              <FormControl v-model="application.last_name" disabled="true"/>
            </FormField>
          </div>

          <div class="grid grid-cols-2 space-x-3">
            <FormField label="Email" required>
              <FormControl v-model="application.email" type="email" disabled="true"/>
            </FormField>
            <FormField label="Date of birth" required>
              <FormControl v-model="application.date_of_birth" type="date"/>
            </FormField>
          </div>

          <div class="grid grid-cols-2 space-x-3">
            <FormField label="Phone (including country prefix)" required>
              <FormControl v-model="application.phone"/>
            </FormField>
            <FormField label="Identity Number" required>
              <FormControl v-model="application.id_number"/>
            </FormField>
          </div>

          <BaseDivider />

          <div class="mt-5">
            <FormField label="Study cycle" required>
              <div class="space-y-3">
                <div class="flex space-x-14">
                  <div class="flex space-x-3 items-center">
                    <input v-model="application.current_study_year" value="Ba1" type="radio" />
                    <span class="radio">Bachelor Year 1 🏫</span>
                  </div>
                  <div class="flex space-x-3 items-center">
                    <input v-model="application.current_study_year" value="Ba2" type="radio" />
                    <span class="radio">Bachelor Year 2 🎓</span>
                  </div>
                  <div class="flex space-x-3 items-center">
                    <input v-model="application.current_study_year" value="Ba3" type="radio" />
                    <span class="radio">Bachelor Year 3 📖</span>
                  </div>
                  <div class="flex space-x-3 items-center">
                    <input v-model="application.current_study_year" value="Ba4" type="radio" />
                    <span class="radio">Bachelor Year 4 🏆</span>
                  </div>
                </div>
                <div class="flex space-x-14">
                  <div class="flex space-x-3 items-center mr-1.5">
                    <input v-model="application.current_study_year" value="Ma1" type="radio" />
                    <span class="radio">Masters Year 1 🎓</span>
                  </div>
                  <div class="flex space-x-3 items-center">
                    <input v-model="application.current_study_year" value="Ma2" type="radio" />
                    <span class="radio">Masters Year 2 📘</span>
                  </div>
                </div>
                <div class="flex space-x-14">
                  <div class="flex space-x-3 items-center mr-1.5">
                    <input v-model="application.current_study_year" value="PhD" type="radio" />
                    <span class="radio">PhD 🧠</span>
                  </div>
                </div>
              </div>
            </FormField>
          </div>

          <div class="grid grid-cols-2 space-x-3 mt-5">
            <FormField label="Home university" required>
              <Multiselect v-model="home_university" :options="universities" :multiple="false" label="name" track-by="name"></Multiselect>
            </FormField>

            <FormField label="Degree" required>
              <Multiselect v-model="degree" :options="filteredDegrees()" :multiple="false" label="name" track-by="id"></Multiselect>
            </FormField>
          </div>

          <div class="grid grid-cols-2 space-x-3">
            <FormField label="Education field" required>
              <Multiselect v-model="application.education_field" :options="isced_codes" :multiple="false" label="name" track-by="name"></Multiselect>
            </FormField>
            <FormField label="Grade point average (GPA)" required>
              <FormControl v-model="application.gpa" type="number"/>
            </FormField>
          </div>

          <FormField label="Educational/professional awards (summary)">
            <FormControl v-model="application.summary" type="textarea"/>
          </FormField>

          <FormField label="Mobility Program" required>
            <div class="space-y-3">
              <div class="flex space-x-14">
                <div class="flex space-x-3 items-center">
                  <input v-model="application.mobility_program" value="short" type="radio"/>
                  <span>Short-term ERASMUS+</span>
                </div>
                <div class="flex space-x-3 items-center">
                  <input v-model="application.mobility_program" value="long" type="radio"/>
                  <span>Long-term ERASMUS+</span>
                </div>
                <div class="flex space-x-3 items-center">
                  <input v-model="application.mobility_program" value="placement" type="radio"/>
                  <span>ERASMUS+ placement</span>
                </div>
              </div>
            </div>
          </FormField>

          <template v-if="application.mobility_program === 'short'">
            <NotificationBar color="info" :icon="mdiAlert">
              The short term period should not be less then 5 days or bigger then 60 days
              <template #right>
              </template>
            </NotificationBar>
            <div class="grid grid-cols-2 space-x-3">
              <FormField label="Start Period" required>
                <FormControl v-model="application.mobility_start_date" type="date"/>
              </FormField>
              <FormField label="End Period" required>
                <FormControl v-model="application.mobility_end_date" type="date"/>
              </FormField>
            </div>
          </template>
          <template v-else-if="application.mobility_program === 'long' || application.mobility_program === 'placement'">
            <FormField label="Period of mobility" required>
              <div class="space-y-3">
                <div class="flex space-x-14">
                  <div class="flex space-x-3 items-center">
                    <input v-model="application.period_of_mobility" value="first" type="radio"/>
                    <span>First semester</span>
                  </div>
                  <div class="flex space-x-3 items-center">
                    <input v-model="application.period_of_mobility" value="second" type="radio"/>
                    <span>Second semester</span>
                  </div>
                  <div class="flex space-x-3 items-center">
                    <input v-model="application.period_of_mobility" value="entire" type="radio"/>
                    <span>Entire year</span>
                  </div>
                </div>
              </div>
            </FormField>

            <template v-if="application.mobility_program === 'placement'">
              <FormField label="Destination Type" required>
                <div class="space-y-3">
                  <div class="flex space-x-14">
                    <div class="flex space-x-3 items-center">
                      <input v-model="application.destination_type" value="university" type="radio"/>
                      <span>University</span>
                    </div>
                    <div class="flex space-x-3 items-center">
                      <input v-model="application.destination_type" value="non_university" type="radio"/>
                      <span>Non-University</span>
                    </div>
                  </div>
                </div>
              </FormField>
            </template>
          </template>

          <template v-if="application.destination_type !== 'non_university'">
            <FormField label="Destination 1" required>
              <Multiselect v-model="destination_1" :options="universities" :multiple="false" label="name" track-by="name"></Multiselect>
            </FormField>
            <FormField label="Destination 2" required>
              <Multiselect v-model="destination_2" :options="universities" :multiple="false" label="name" track-by="name"></Multiselect>
            </FormField>
            <FormField label="Destination 3" required>
              <Multiselect v-model="destination_3" :options="universities" :multiple="false" label="name" track-by="name"></Multiselect>
            </FormField>
          </template>
          <template v-else>
            <FormField label="Destination Type" required>
              <Multiselect v-model="application.placement_country" :options="countries" :multiple="false"></Multiselect>
            </FormField>
          </template>

          <BaseDivider />

          <p class="text-2xl font-semibold mb-5">Documents</p>

          <FormField label="Language Certificate" required>
            <input type="file" ref="languageInput" accept="application/pdf" @change="handleFileSelect('language')"/>
          </FormField>

          <FormField label="ID" required>
            <input type="file" ref="idInput" accept="application/pdf" @change="handleFileSelect('id')"/>
          </FormField>

          <FormField label="CV" required>
            <input type="file" ref="cvInput" accept="application/pdf" @change="handleFileSelect('cv')"/>
          </FormField>

          <FormField label="Motivation Letter" required>
            <input type="file" ref="letterInput" accept="application/pdf"  @change="handleFileSelect('letter')"/>
          </FormField>

          <FormField label="Transcript of records" required>
            <input type="file" ref="recordsInput" accept="application/pdf" @change="handleFileSelect('records')"/>
          </FormField>

          <FormField label="Diplomas/Awards">
            <input type="file" ref="diplomasInput" accept="application/pdf" @change="handleFileSelect('diplomas')"/>
          </FormField>

          <template #footer>
            <BaseButtons class="justify-center">
              <BaseButton to="/applications" type="button" color="info" outline label="Back"/>
              <BaseButton @click="submit()" color="info" label="Submit" />
            </BaseButtons>
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
import {mdiBookEdit} from '@mdi/js';
import {University} from "../../types/universities/University";
import Multiselect from 'vue-multiselect';
import Swal from "sweetalert2";
import axios from "axios";
import {IscedCode} from "../../types/universities/IscedCode";
import {Application} from "../../types/applications/Application";
import NotificationBar from '@/components/NotificationBar.vue'
import {mdiAlert} from '@mdi/js';
import {useRouter} from "vue-router";
import {AuthUser} from "../../types/AuthUser";
import {useAuthStore} from "../../stores/auth";
import {User} from "../../types/user/User";
import {Degree} from "../../types/universities/Degree";
import {Step} from "../../types/home/Step";

const isced_codes = ref<IscedCode[]>([]);
const universities = ref<University[]>([]);
const is_loading = ref(true);
const application = ref(new Application());
const countries = ref([]);
const language_file = ref(null);
const id_file = ref(null);
const cv_file = ref(null);
const letter_file = ref(null);
const records_file = ref(null);
const diplomas_file = ref(null);
const router = useRouter()
const academicYearOptions = ['2024/2025','2025/2026'];
const languageInput = ref(null);
const idInput = ref(null);
const cvInput = ref(null);
const letterInput = ref(null);
const recordsInput = ref(null);
const diplomasInput = ref(null);
const home_university = ref(new University());
const destination_1 = ref(new University());
const destination_2 = ref(new University());
const destination_3 = ref(new University());
const auth_user = ref(new AuthUser());
const user = ref(new User());
const auth = useAuthStore();
const degrees = ref<Degree[]>([]);
const degree = ref(new Degree());

const handleFileSelect = (type: string) => {
  if(type === 'language') {
    language_file.value = languageInput.value.files[0];
  }
  else if(type === 'id') {
    id_file.value = idInput.value.files[0];
  }
  else if(type === 'cv') {
    cv_file.value = cvInput.value.files[0];
  }
  else if(type === 'letter') {
    letter_file.value = letterInput.value.files[0];
  }
  else if(type === 'records') {
    records_file.value = recordsInput.value.files[0];
  }
  else if(type === 'diplomas') {
    diplomas_file.value = diplomasInput.value.files[0];
  }
}

function filteredDegrees() {
  let filtered_degrees = <Degree[]>[];
  degrees.value.forEach((deg: Degree) => {
    if(deg.university_id == home_university.value.id && application.value.current_study_year.includes(deg.level)) {
      filtered_degrees.push(deg);
    }
  })

  return filtered_degrees;
}

const submit = async () => {
  if(application.value.destination_type !== 'non_university') {
    application.value.destination_1 = String(destination_1.value.id);
    application.value.destination_2 = String(destination_2.value.id);
    application.value.destination_3 = String(destination_3.value.id);
  }
  application.value.home_university = String(home_university.value.id);
  application.value.faculty = String(degree.value.id);
  application.value.education_field = JSON.stringify(application.value.education_field);

  try {
    await axios.post("http://127.0.0.1:8000/api/applications", {
        form : {
          user_id: application.value.user_id,
          university_id: application.value.university_id,
          status: application.value.status,
          selection_score: application.value.selection_score,
          feedback_comments: application.value.feedback_comments,
          feedback_admin_id: application.value.feedback_admin_id,
          academic_year: application.value.academic_year,
          first_name: application.value.first_name,
          last_name: application.value.last_name,
          email: application.value.email,
          date_of_birth: application.value.date_of_birth,
          phone: application.value.phone,
          id_number: application.value.id_number,
          faculty: application.value.faculty,
          current_study_year: application.value.current_study_year,
          education_field: application.value.education_field,
          gpa: application.value.gpa,
          summary: application.value.summary,
          mobility_program: application.value.mobility_program,
          period_of_mobility: application.value.period_of_mobility,
          mobility_start_date: application.value.mobility_start_date,
          mobility_end_date: application.value.mobility_end_date,
          destination_type: application.value.destination_type,
          home_university: application.value.home_university,
          destination_1: application.value.destination_1,
          destination_2: application.value.destination_2,
          destination_3: application.value.destination_3,
          placement_country: application.value.placement_country
        }
      })
      .then(async (response) => {
        if (!response.data.status) {
          await Swal.fire({
            title: response.data.message,
            text: response.data.errors.status[0],
            icon: 'error',
          })
        }
        else {
          await uploadFiles(String(response.data.id));
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

const uploadFiles = async (application_id: string) => {
  const formData = new FormData();

  formData.append("language", language_file.value);
  formData.append("id", id_file.value);
  formData.append("cv", cv_file.value);
  formData.append("letter", letter_file.value);
  formData.append("records", records_file.value);
  formData.append("userId", String(user.value.id));
  formData.append("applicationId", application_id);

  if (diplomas_file.value !== null) {
    formData.append("diplomas", diplomas_file.value);
  }

  await axios.post("http://127.0.0.1:8000/api/upload-application-files", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
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
        Swal.fire({
          title: 'Success!',
          text: 'Application added successfully!',
          icon: 'success',
        })
        changeStepStatus();
      }
    })
    .catch((e) => {
      Swal.fire({
        title: 'Error!',
        text: e.response.data.message,
        icon: 'error',
      })
    })
}

const changeStepStatus = async () => {
  try {
    let step = new Step();
    step.tag = '1_2';
    step.status = 'in_progress';
    await axios.put(`http://127.0.0.1:8000/api/steps/`+user.value.id, step)
      .then(async (response) => {
        await router.push('/applications');
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

const getIscedCodes = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/api/isced-codes");
    response.data.codes.forEach((isced_code: any) => {
      let parsed_code = new IscedCode(isced_code);
      parsed_code.name = parsed_code.code + ' - ' + parsed_code.name;
      isced_codes.value.push(parsed_code);
    })
    await getUniversities();
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

const getCountries = async () => {
  try {
    const response = await axios.get("https://restcountries.com/v3.1/all?fields=name");
    response.data.forEach((country: any) => {
      countries.value.push(country.name.common);
    })
    countries.value.sort();
  } catch (error) {
    console.log('error', error)
    Swal.fire({
      title: 'Error!',
      text: error.response.data.message,
      icon: 'error',
    })
  }
}

const getUser = async () => {
  try {
    const response = await axios.get(`http://127.0.0.1:8000/api/user/${auth_user.value.id}`);
    user.value = new User(response.data.user);
    application.value.email = user.value.email;
    application.value.last_name = user.value.family_name;
    application.value.first_name = user.value.name;
    application.value.date_of_birth = user.value.date_of_birth;
    application.value.phone = user.value.phone_number;
    application.value.id_number = user.value.identity_no;
    application.value.current_study_year = user.value.year;
    let university_index = universities.value.findIndex(item => item.id == user.value.home_university);
    if(university_index >= 0) {
      home_university.value = universities.value[university_index];
    }
    let degree_index = degrees.value.findIndex(item => item.id == user.value.degree);
    if(degree_index >= 0) {
      degree.value = degrees.value[degree_index];
    }
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

onMounted(async () => {
  if (auth.user !== null) {
    auth_user.value = new AuthUser(JSON.parse(auth.user));
    user.value.id = auth_user.value.id;
    application.value.user_id = auth_user.value.id;
  }
  await getDegrees();
  await getCountries();
  await getIscedCodes();
  await getUser();
})
</script>

<style src="../../../node_modules/vue-multiselect/dist/vue-multiselect.css"></style>
