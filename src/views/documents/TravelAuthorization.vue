<template>
  <LayoutAuthenticated>
    <SectionMain>
      <div class="flex justify-between items-center mt-3">
        <SectionTitleLineWithButton :icon="mdiFileDocument" title="Travel Authorization"/>
        <RouterLink to="/dashboard">
          <PillTag label="Back" :icon="mdiBackburger" />
        </RouterLink>
      </div>

      <template v-if="is_loading">
        <p>Loading ...</p>
      </template>
      <template v-else>
        <div>
          <CardBox>
            <div class="mb-3 border-2 border-blue-500 bg-blue-50 text-blue-900 p-4 rounded-lg font-sans">
              Please submit a new travel request under the Erasmus section on
              <a href="https://travel.upb.ro/" class="underline text-blue-600 hover:text-blue-800">travel.upb.ro</a>
              and upload all the required documents. At the end add here the Travel Authorization.
            </div>

            <p><span class="font-bold mr-3">Status:</span>
              <span v-if="document.status === 'waiting_for_approval'" class="text-yellow-500">Waiting for Approval</span>
              <span v-else-if="document.status === 'approved'" class="text-green-500">Approved</span>
              <span v-else-if="document.status === 'denied'" class="text-red-500">Denied</span>
              <span v-else>{{document.status}}</span>
            </p>
            <div v-if="document.status === 'Not Available'" class="space-x-3 flex mt-5">
              <div>
                <input type="file" ref="fileInput" accept="application/pdf" @change="handleFileSelect()" class="hidden" id="pdf-upload"/>
                <label for="pdf-upload"
                       class="inline-block px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 transition-colors">
                  Choose document
                </label>
                <span class="text-sm text-gray-700 truncate ml-2">
                  {{ selectedFileName || 'No file selected' }}
                </span>
              </div>
              <BaseButton color="info" outline type="button" label="Upload" @click="upload()"/>
            </div>
            <p class="mt-5"><span class="font-bold">Travel Authorization:</span>
              <template v-if="document.status === 'Not Available'">
                no document uploaded yet
              </template>
              <template v-else>
                <a :href="'http://127.0.0.1:8000/storage/documents/'+user.id+'/'+document.type+'.pdf'" target="_blank" rel="noopener noreferrer">
                  <BaseButton color="success" :icon="mdiFileDownload" small label="Download" class="ml-3"/>
                </a>
                <BaseButton color="danger" :icon="mdiTrashCan" small @click="deleteFile()" class="ml-3"/>
              </template>
            </p>
            <p class="mt-2"><span class="font-bold">Review:</span>
              <template v-if="document.feedback === ''">
                no feedback available
              </template>
              <template v-else>
                {{document.feedback}}
              </template>
            </p>
          </CardBox>
        </div>
      </template>
    </SectionMain>
  </LayoutAuthenticated>
</template>

<script setup lang="ts">
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import {mdiFileDocument, mdiBackburger, mdiFileDownload, mdiTrashCan} from '@mdi/js'
import SectionMain from '@/components/SectionMain.vue'
import BaseButton from '@/components/BaseButton.vue'
import {onMounted, ref} from "vue";
import CardBox from '@/components/CardBox.vue'
import axios from "axios";
import Swal from "sweetalert2";
import {AuthUser} from "../../types/AuthUser";
import {useAuthStore} from "../../stores/auth";
import PillTag from '@/components/PillTag.vue'
import {Step} from "../../types/home/Step";
import {Documentt} from "../../types/documents/Documentt";

const is_loading = ref(true);
const user = ref(new AuthUser());
const auth = useAuthStore();
const file = ref(null);
const fileInput = ref(null);
const selectedFileName = ref('');
const document = ref(new Documentt());

const handleFileSelect = () => {
  file.value = fileInput.value.files[0];
  selectedFileName.value = file.value ? file.value.name : '';
}

const deleteFile = () => {
  Swal.fire({
    title: 'Are you sure that you want to delete this file?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes'
  }).then((result) => {
    if (result.isConfirmed) {
      axios.delete(`http://127.0.0.1:8000/api/documents/${document.value.id}`)
        .then((response) => {
          Swal.fire({
            title: 'Success',
            icon: 'success',
            html: 'File deleted successfully!',
            showCancelButton: false,
          })
          document.value.status = 'Not Available';
          file.value = null;
          fileInput.value = null;
          selectedFileName.value = null;
          getDocument();
        })
        .catch((error) => {
          console.log('eroare: ', error);
        })
    }
  })
}

const upload = async () => {
  const formData = new FormData();

  formData.append("file", file.value);
  formData.append("userId", String(user.value.id));
  formData.append("type", 'travel-authorization');

  await axios.post("http://127.0.0.1:8000/api/upload-document", formData, {
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
        await Swal.fire({
          title: 'Success!',
          text: 'File added successfully!',
          icon: 'success',
        })
        await changeStepStatus();
        await getDocument();
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
    step.tag = '1_4';
    step.status = 'in_progress';
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

const getDocument = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/api/documents/"+user.value.id+"?type=travel-authorization");
    if(response.data.document !== null) {
      document.value = new Documentt(response.data.document);
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

onMounted(() => {
  if (auth.user !== null) {
    user.value = new AuthUser(JSON.parse(auth.user));
  }
  getDocument();
})
</script>
