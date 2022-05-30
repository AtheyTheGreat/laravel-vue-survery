<template>
  <div
    class="flex flex-col py-4 px-6 shadow-md bg-white hover:bg-gray-50 h-[470px]">
    <h4 class="mt-4 text-lg font-bold">{{ patient.name }}</h4>
    <div v-html="patient.dob" class="overflow-hidden flex-1"></div>
    <div v-html="patient.nationalid" class="overflow-hidden flex-1"></div>
    <div v-html="patient.address" class="overflow-hidden flex-1"></div>
    <div class="flex justify-between items-center mt-3">
      <TButton :to="{ name: 'PatientView', params: { id: patient.id } }">
        <PencilIcon class="wo-5 h-5 mr-2 " />
        Edit
      </TButton>
      <div class="flex items-center">
        <TButton :href="`/view/patient/${patient.slug}`" circle link target="_blank">
          <ExternalLinkIcon class="w-5 h-5" />
        </TButton>

        <TButton v-if="patient.id" @click="emit('delete', patient)" circle link color="red">
          <TrashIcon class="w-5 h-5" />
        </TButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import TButton from "./core/TButton.vue";
import { PencilIcon, ExternalLinkIcon, TrashIcon } from '@heroicons/vue/solid'

const { patient } = defineProps({
  patient: Object,
});
const emit = defineEmits(["delete", "edit"]);
</script>

<style></style>
