<template>
  <LayoutAuthenticated>
    <SectionMain>
      <div class="flex space-x-3 justify-between items-center">
        <SectionTitleLineWithButton :icon="mdiHelpBoxMultiple" title="Get Recommendation"/>
      </div>

      <CardBox form @submit="submit()">
        <FormField label="1. Choose Year">
          <div class="space-y-3">
            <div class="flex space-x-14">
              <div class="flex space-x-3 items-center">
                <input v-model="form.year" value="BA1" type="radio"/>
                <span class="radio">Bachelor Year 1</span>
              </div>
              <div class="flex space-x-3 items-center">
                <input v-model="form.year" value="BA2" type="radio"/>
                <span class="radio">Bachelor Year 2</span>
              </div>
              <div class="flex space-x-3 items-center">
                <input v-model="form.year" value="BA3" type="radio"/>
                <span class="radio">Bachelor Year 3</span>
              </div>
              <div class="flex space-x-3 items-center">
                <input v-model="form.year" value="BA4" type="radio"/>
                <span class="radio">Bachelor Year 4</span>
              </div>
            </div>
            <div class="flex space-x-14">
              <div class="flex space-x-3 items-center mr-1.5">
                <input v-model="form.year" value="MA1" type="radio"/>
                <span class="radio">Masters Year 1</span>
              </div>
              <div class="flex space-x-3 items-center">
                <input v-model="form.year" value="MA2" type="radio"/>
                <span class="radio">Masters Year 2</span>
              </div>
            </div>
            <div class="flex space-x-14">
              <div class="flex space-x-3 items-center mr-1.5">
                <input v-model="form.year" value="PhD" type="radio"/>
                <span class="radio">PhD</span>
              </div>
            </div>
          </div>
        </FormField>
        <FormField label="2. Choose Mobility Duration">
          <div class="space-y-3">
            <div class="flex space-x-14">
              <div class="flex space-x-3 items-center">
                <input v-model="form.duration" value="one_semester" type="radio"/>
                <span class="radio">One Semester</span>
              </div>
              <div class="flex space-x-3 items-center">
                <input v-model="form.duration" value="one_year" type="radio"/>
                <span class="radio">One Year</span>
              </div>
            </div>
          </div>
        </FormField>
        <FormField label="3. Select your Faculty">
          <Multiselect v-model="form.faculty" :options="facultyOptions" :multiple="false" label="name" track-by="id"></Multiselect>
        </FormField>
        <FormField label="4. Select your Program">
          <Multiselect v-model="form.faculty" :options="facultyOptions" :multiple="false" label="name" track-by="id"></Multiselect>
        </FormField>
        <FormField label="5. Choose your preferred countries">
          <Multiselect v-model="form.preferred_countries" :options="countries" :multiple="true" label="name" track-by="id"></Multiselect>
        </FormField>

        <template #footer>
          <BaseButtons class="justify-center">
            <BaseButton to="/universities" type="button" color="info" outline label="Back"/>
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
import {mdiHelpBoxMultiple} from '@mdi/js';
import FormField from '@/components/FormField.vue';
import {ref} from "vue";
import {RecommendUniversity} from "../../types/universities/RecommendUniversity";
import Multiselect from 'vue-multiselect';
import BaseButtons from '@/components/BaseButtons.vue';

const facultyOptions = [
  { id: 0, name: 'Aerospace Engineering'},
  { id: 1, name: 'Applied Sciences' },
  { id: 2, name: 'Automatic Control and Computers' },
  { id: 3, name: 'Biotechnical Systems Engineering ' },
  { id: 4, name: 'Chemical Engineering and Biotechnologies' },
  { id: 5, name: 'Electrical Engineering' },
  { id: 6, name: 'Electronics, Telecommunications and Information Technology' },
  { id: 7, name: 'Energy Engineering' },
  { id: 8, name: 'Engineering in Foreign Languages' },
  { id: 9, name: 'Entrepreneurship, Business Engineering and Management' },
  { id: 10, name: 'Faculty of Economic Sciences and Law' },
  { id: 11, name: 'Faculty of Educational Sciences, Social Sciences and Psychology' },
  { id: 12, name: 'Faculty of Electronics, Communications and Computers' },
  { id: 13, name: 'Faculty of Mechanics and Technology' },
  { id: 14, name: 'Faculty of Sciences, Physical Education and Informatics' },
  { id: 15, name: 'Faculty of Theology, Letters, History and Arts' },
  { id: 16, name: 'Industrial Engineering and Robotics' },
  { id: 17, name: 'IOSUD/CSUD - PhD Studies' },
  { id: 18, name: 'Materials Science and Engineering' },
  { id: 19, name: 'Mechanical Engineering and Mechatronics' }
];
const countries = [
  {id: 'FR', name: 'Franta'},
  {id: 'IT', name: 'Italia'},
  {id: 'ES', name: 'Spania'},
  {id: 'DE', name: 'Germania'},
  {id: 'GR', name: 'Grecia'},
  {id: 'SK', name: 'Slovacia'},
  {id: 'TR', name: 'Turcia'},
  {id: 'PL', name: 'Polonia'},
];

const form = ref(new RecommendUniversity());

const submit = () => {

}
</script>

<style src="../../../node_modules/vue-multiselect/dist/vue-multiselect.css"></style>

