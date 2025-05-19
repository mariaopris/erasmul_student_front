<template>
  <LayoutAuthenticated>
    <SectionMain>
      <UserCard class="mb-6 mt-5" />
      <template v-if="is_loading">
        <p>Loading ...</p>
      </template>
      <template v-else>
        <CardBox>
          <div class="justify-end flex">
            <BaseButton @click="change_pass = true" v-if="!change_pass" color="info" type="button" label="Change Password" />
          </div>
          <template v-if="change_pass">
            <p class="text-xl font-bold py-2 text-blue-500">Change Password</p>
            <div class="grid-cols-2 grid space-x-3">
              <div>
                <FormField label="Current password">
                  <FormControl
                    v-model="passwordForm.password_current"
                    :icon="mdiAsterisk"
                    name="password_current"
                    type="password"
                    required
                  />
                </FormField>
              </div>
              <div>
                <FormField label="New password">
                  <FormControl
                    v-model="passwordForm.password"
                    :icon="mdiFormTextboxPassword"
                    name="password"
                    type="password"
                    required
                  />
                </FormField>

                <FormField label="Confirm password" >
                  <FormControl
                    v-model="passwordForm.password_confirmation"
                    :icon="mdiFormTextboxPassword"
                    name="password_confirmation"
                    type="password"
                    required
                  />
                </FormField>
              </div>
            </div>

            <BaseButtons>
              <BaseButton @click="change_pass = false" color="info" label="Cancel" outline />
              <BaseButton type="submit" color="info" label="Submit" />
            </BaseButtons>
            <BaseDivider />
          </template>

          <div class="grid grid-cols-2 gap-6">
            <div>
              <FormField label="Name" required>
                <FormControl v-model="user.name" :icon="mdiAccount" disabled/>
              </FormField>
              <FormField label="Family Name" required>
                <FormControl v-model="user.family_name" :icon="mdiAccount" disabled/>
              </FormField>
              <FormField label="Date of Birth" required>
                <FormControl v-model="user.date_of_birth" type="date"/>
              </FormField>
              <FormField label="E-mail" required>
                <FormControl v-model="user.email" :icon="mdiMail" type="email" disabled/>
              </FormField>
              <FormField label="Gender" required>
                <div class="flex space-x-3 items-center">
                  <input v-model="user.gender" value="female" type="radio"/>
                  <span class="check">Female</span>
                </div>
                <div class="flex space-x-3 items-center">
                  <input v-model="user.gender" value="male" type="radio"/>
                  <span class="check">Male</span>
                </div>
              </FormField>
              <FormField label="Phone Number (including country prefix)" required>
                <FormControl v-model="user.phone_number" type="text"/>
              </FormField>
            </div>
            <div>
              <FormField label="Nationality" required>
                <FormControl v-model="user.nationality" type="text"/>
              </FormField>
              <FormField label="Country" required>
                <FormControl v-model="user.country" type="text"/>
              </FormField>
              <FormField label="Address" required>
                <FormControl v-model="user.address" type="text"/>
              </FormField>
              <FormField label="Identity Number" required>
                <FormControl v-model="user.identity_no" type="text"/>
              </FormField>
              <FormField label="City" required>
                <FormControl v-model="user.city" type="text"/>
              </FormField>
              <FormField label="Postal Code" required>
                <FormControl v-model="user.postal_code" type="text"/>
              </FormField>
            </div>
          </div>
          <div class="mt-5">
            <FormField label="Study cycle" required>
              <div class="space-y-3">
                <div class="flex space-x-14">
                  <div class="flex space-x-3 items-center">
                    <input v-model="user.year" value="Ba1" type="radio" />
                    <span class="radio">Bachelor Year 1 🏫</span>
                  </div>
                  <div class="flex space-x-3 items-center">
                    <input v-model="user.year" value="Ba2" type="radio" />
                    <span class="radio">Bachelor Year 2 🎓</span>
                  </div>
                  <div class="flex space-x-3 items-center">
                    <input v-model="user.year" value="Ba3" type="radio" />
                    <span class="radio">Bachelor Year 3 📖</span>
                  </div>
                  <div class="flex space-x-3 items-center">
                    <input v-model="user.year" value="Ba4" type="radio" />
                    <span class="radio">Bachelor Year 4 🏆</span>
                  </div>
                </div>
                <div class="flex space-x-14">
                  <div class="flex space-x-3 items-center mr-1.5">
                    <input v-model="user.year" value="Ma1" type="radio" />
                    <span class="radio">Masters Year 1 🎓</span>
                  </div>
                  <div class="flex space-x-3 items-center">
                    <input v-model="user.year" value="Ma2" type="radio" />
                    <span class="radio">Masters Year 2 📘</span>
                  </div>
                </div>
                <div class="flex space-x-14">
                  <div class="flex space-x-3 items-center mr-1.5">
                    <input v-model="user.year" value="PhD" type="radio" />
                    <span class="radio">PhD 🧠</span>
                  </div>
                </div>
              </div>
            </FormField>
          </div>
          <div class="grid grid-cols-2 space-x-3 mt-5">
            <FormField label="Home university" required>
              <Multiselect v-model="user.home_university" :options="universities" :multiple="false" label="name" track-by="name"></Multiselect>
            </FormField>

            <FormField label="Degree" required>
              <Multiselect v-model="user.degree" :options="filteredDegrees()" :multiple="false" label="name" track-by="id"></Multiselect>
            </FormField>
          </div>
          <BaseButtons class="mt-10">
            <BaseButton @click="getUser()" color="info" label="Cancel" outline />
            <BaseButton @click="submit()" color="info" label="Submit" />
          </BaseButtons>
        </CardBox>
      </template>
    </SectionMain>
  </LayoutAuthenticated>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue'
import { mdiAccount, mdiMail, mdiAsterisk, mdiFormTextboxPassword, mdiGithub } from '@mdi/js'
import SectionMain from '@/components/SectionMain.vue'
import CardBox from '@/components/CardBox.vue'
import BaseDivider from '@/components/BaseDivider.vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import UserCard from '@/components/UserCard.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import {User} from "@/types/user/User";
import {ResetPassword} from "@/types/user/ResetPassword";
import {AuthUser} from "@/types/AuthUser";
import {useAuthStore} from "@/stores/auth";
import axios from "axios";
import Swal from "sweetalert2";
import Multiselect from 'vue-multiselect';
import {Degree} from "@/types/universities/Degree";
import {University} from "@/types/universities/University";

const change_pass = ref(false);
const user = ref(new User());
const passwordForm = ref(new ResetPassword());
const auth_user = ref(new AuthUser());
const auth = useAuthStore();
const is_loading = ref(true);
const degrees = ref<Degree[]>([]);
const universities = ref<University[]>([]);

function filteredDegrees() {
  let filtered_degrees = <Degree[]>[];
  degrees.value.forEach((deg: Degree) => {
    if(deg.university_id === user.value.home_university.id && user.value.year.includes(deg.level)) {
      filtered_degrees.push(deg);
    }
  })

  return filtered_degrees;
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

const submit = async () => {
  user.value.home_university = String(user.value.home_university.id);
  user.value.degree = String(user.value.degree.id);
  try {
    await axios.put(`http://127.0.0.1:8000/api/user/${user.value.id}`, {
      form: {
        name: user.value.name,
        family_name: user.value.family_name,
        email: user.value.email,
        gender: user.value.gender,
        date_of_birth: user.value.date_of_birth,
        nationality: user.value.nationality,
        country: user.value.country,
        address: user.value.address,
        city: user.value.city,
        postal_code: user.value.postal_code,
        phone_number: user.value.phone_number,
        home_university: user.value.home_university,
        degree: user.value.degree,
        identity_no: user.value.identity_no,
        year: user.value.year,
        is_complete: user.value.is_complete
      }
    })
      .then(async (response) => {
        console.log(response)
        if(response.data.status) {
          await Swal.fire({
            title: 'Done!',
            text: 'User details changed!',
            icon: 'success',
          })
        }
        else {
          if(response.data.message === 'Validation errors') {
            await Swal.fire({
              title: response.data.message,
              text: response.data.errors[Object.keys(response.data.errors)[0]][0],
              icon: 'error',
            })
          }
        }
      });
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
    const response = await axios.get(`http://127.0.0.1:8000/api/user/${user.value.id}`);
    user.value = new User(response.data.user);
    let university_index = universities.value.findIndex(item => item.id == user.value.home_university);
    if(university_index >= 0) {
      user.value.home_university = universities.value[university_index];
    }
    let degree_index = degrees.value.findIndex(item => item.id == user.value.degree);
    if(degree_index >= 0) {
      user.value.degree = degrees.value[degree_index];
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

onMounted(async () => {
  if (auth.user !== null) {
    auth_user.value = new AuthUser(JSON.parse(auth.user));
    user.value.id = auth_user.value.id;
    await getUniversities();
    await getDegrees();
    await getUser();
  }
})
</script>

<style src="../../../node_modules/vue-multiselect/dist/vue-multiselect.css"></style>
