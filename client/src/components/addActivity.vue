<script setup>
import { ref } from 'vue';
import activityForm from './activityForm.vue';
import modal from './modal.vue';

const isModalOpen = ref(false);

function openModal() {
    isModalOpen.value = true;
}

function closeModal() {
    isModalOpen.value = false;
}
function handleSessionSaved() {
  isModalOpen.value = false
}
</script>
<template>
    <button class="js-modal-trigger button is-link" data-target="modal-js-example" @click="openModal">
            Add a session
    </button>
    <modal :isActive="isModalOpen"
    title="Create Session"
    confirmText="Save Session"
    confirmFormId="session-form"
    @close="closeModal">
        <activityForm @session-saved="handleSessionSaved"></activityForm>
    </modal>
</template>
