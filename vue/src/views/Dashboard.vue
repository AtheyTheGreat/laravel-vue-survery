<template>
  <PageComponent title="Dashboard">
    <div v-if="loading" class="flex justify-center">Loading...</div>
    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-gray-700"
    >
      <DashboardCard class="order-1 lg:order-2" style="animation-delay: 0.1s">
        <template v-slot:title>Total Patients</template>
        <div
          class="text-8xl pb-4 font-semibold flex-1 flex items-center justify-center"
        >
          {{ data.totalPatients }}
        </div>
      </DashboardCard>
      <DashboardCard
        class="order-3 lg:order-1 row-span-2"
        style="animation-delay: 0.2s"
      >
        <template v-slot:title>Latest Patient</template>
        <div v-if="data.latestPatient">
          <h3 class="font-bold text-xl mb-3">{{ data.latestPatient.title }}</h3>
          <div class="flex justify-between text-sm mb-1">
            <div> Name:</div>
            <div>{{ data.latestPatient.name }}</div>
          </div>
          <div class="flex justify-between text-sm mb-1">
            <div> Date:</div>
            <div>{{ data.latestPatient.dob }}</div>
          </div>
          <div class="flex justify-between text-sm mb-1">
            <div>national id:</div>
            <div>{{ data.latestPatient.nationalid}}</div>
          </div>
          <div class="flex justify-between text-sm mb-1">
            <div> Address:</div>
            <div>{{ data.latestPatient.address }}</div>
          </div>
          <div class="flex justify-between">
            <TButton
              :to="{ name: 'PatientView', params: { id: data.latestPatient.id } }"
              link
            >
              <PencilIcon class="w-5 h-5 mr-2" />
              Edit Patient
            </TButton>
          </div>
        </div>
        <div v-else class="text-gray-600 text-center py-16">
          Your don't have Patients yet
        </div>
      </DashboardCard>
    </div>
  </PageComponent>
</template>

<script setup>
import {EyeIcon, PencilIcon} from "@heroicons/vue/solid"
import DashboardCard from "../components/core/DashboardCard.vue";
import TButton from "../components/core/TButton.vue";
import PageComponent from "../components/PageComponent.vue";
import { computed } from "vue";
import { useStore } from "vuex";

const store = useStore();

const loading = computed(() => store.state.dashboard.loading);
const data = computed(() => store.state.dashboard.data);

store.dispatch("getDashboardData");
</script>

<style scoped></style>
