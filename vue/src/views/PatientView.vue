<template>
  <PageComponent>
    <template v-slot:header>
      <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold text-gray-900">
          {{ route.params.id ? model.name : "Create a Patient" }}
        </h1>

        <div class="flex">
          <TButton v-if="model.slug" link :href="`/view/patient/${model.slug}`" target="_blank" class="mr-2">
            <ExternalLinkIcon class="w-5 h-5" />
            View Public link
          </TButton>
          <TButton v-if="route.params.id" color="red" @click="deletePatient()">
            <TrashIcon class="w-5 h-5 mr-2" />
            Delete
          </TButton>
        </div>
      </div>
    </template>
    <div v-if="patientLoading" class="flex justify-center">Loading...</div>
    <form v-else @submit.prevent="savePatient" class="animate-fade-in-down">
      <div class="shadow sm:rounded-md sm:overflow-hidden">
        <!-- Patient Fields -->
        <div class="px-4 py-5 bg-white space-y-6 sm:p-6">
          <!-- name -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700"
              >Name</label
            >
            <input
              type="text"
              name="name"
              id="name"
              v-model="model.name"
              autocomplete="patient_name"
              class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          <!--/ name -->

          <!-- dob -->
          <div>
            <label for="dob" class="block text-sm font-medium text-gray-700"
              >DoB</label
            >
            <input
              type="date"
              name="dob"
              id="dob"
              v-model="model.dob"
              autocomplete="patient_dob"
              class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          <!--/ dob -->

          <!--  national id -->
          <div>
            <label
              for="national_id"
              class="block text-sm font-medium text-gray-700"
              >National ID</label
            >
            <input
              type="text"
              name="national_id"
              id="national_id"
              v-model="model.nationalid"
              class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          <!--/ national id -->

          <!--  Address  -->
          <div>
            <label
              for="address"
              class="block text-sm font-medium text-gray-700"
              >Address</label
            >
            <input
              type="text"
              name="address"
              id="address"
              v-model="model.address"
              class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          <!--/ address  -->

          <!--  islands  -->
          <div>
            <label
              for="island_name"
              class="block text-sm font-medium text-gray-700"
              >Island</label
            >
            <input
              type="text"
              name="island_name"
              id="island_name"
              v-model="model.island_name"
              class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          <!--/ islands  -->

        </div>
        <!--/ Survey Fields -->
        <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
          <TButton>
            <SaveIcon class="w-5 h-5 mr-2" />
            Save
          </TButton>
        </div>
      </div>
    </form>
  </PageComponent>
</template>

<script setup>
import { v4 as uuidv4 } from "uuid";
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { SaveIcon, TrashIcon, ExternalLinkIcon } from '@heroicons/vue/solid'
import store from "../store";
import PageComponent from "../components/PageComponent.vue";
import PatientEditor from "../components/editor/PatientEditor.vue";
import TButton from "../components/core/TButton.vue";

const router = useRouter();

const route = useRoute();

// Get patient loading state, which only changes when we fetch patient from backend
const patientLoading = computed(() => store.state.currentPatient.loading);

// Create empty patient
let model = ref({
  id: null,
  name: "",
  dob: "",
  nationalid: "",
  address: "",
  island_name: "",
});

// Watch to current patient data change and when this happens we update local model
watch(
  () => store.state.currentPatient.data,
  (newVal, oldVal) => {
    model.value = {
      ...JSON.parse(JSON.stringify(newVal)),
      status: !!newVal.status,
    };
  }
);

// If the current component is rendered on patient update route we make a request to fetch patient
if (route.params.id) {
  store.dispatch("getPatient", route.params.id);
}

/**
 * Create or update patient
 */
function savePatient() {
  let action = "created";
  if (model.value.id) {
    action = "updated";
  }
  store.dispatch("savePatient", { ...model.value }).then(({ data }) => {
    store.commit("notify", {
      type: "success",
      message: "The patient was successfully " + action,
    });
    router.push({
      name: "PatientView",
      params: { id: data.data.id },
    });
  });

}

function deletePatient() {
  if (
    confirm(
      `Are you sure you want to delete this patient? Operation can't be undone!!`
    )
  ) {
    store.dispatch("deletePatient", model.value.id).then(() => {
      router.push({
        name: "Patients",
      });
    });
  }
}
</script>

<style></style>
