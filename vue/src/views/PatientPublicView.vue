<template>
  <div class="py-5 px-8">
    <div v-if="loading" class="flex justify-center">Loading...</div>
    <form @submit.prevent="submitPatient" v-else class="container mx-auto">
      <div class="grid grid-cols-6 items-center">
        <div class="col-span-5">
          <h1 class="text-3xl mb-3">{{ patient.name }}</h1>
          <p class="text-gray-500 text-sm" v-html="patient.nationalid"></p>
        </div>
      </div>

      <div v-if="patientFinished" class="py-8 px-6 bg-emerald-400 text-white w-[600px] mx-auto">
        <div class="text-xl mb-3 font-semibold ">Thank you registring</div>
        <button @click="submitAnotherResponse" type="button" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Submit another response
        </button>
      </div>
      <div v-else>
        <hr class="my-3">

        <button
          type="submit"
          class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Submit
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import PatientViewer from "../components/viewer/PatientViewer.vue";
const route = useRoute();
const store = useStore();

const loading = computed(() => store.state.currentPatient.loading);
const patient = computed(() => store.state.currentPatient.data);

const patientFinished = ref(false);

const answers = ref({});

store.dispatch("getPatientBySlug", route.params.slug);

function submitPatient() {
  console.log(JSON.stringify(answers.value, undefined, 2));
  store
    .then((response) => {
      if (response.status === 201) {
        patientFinished.value = true;
      }
    });
}

</script>

<style></style>
