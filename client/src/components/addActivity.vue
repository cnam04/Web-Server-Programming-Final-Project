<script setup>
import { ref } from 'vue';
import activityForm from './activityForm.vue';

const isModalOpen = ref(false);

function openModal() {
    isModalOpen.value = true;
}

function closeModal() {
    isModalOpen.value = false;
}
</script>
<template>
    <button class="js-modal-trigger button is-link" data-target="modal-js-example" @click="openModal">
            Add a session
    </button>
    
    <div class="modal" :class="{ 'is-active' : isModalOpen}">
  <div class="modal-background" @click="closeModal"></div>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Add your session here!</p>
      <button class="delete" aria-label="close" @click="closeModal"></button>
    </header>
    <section class="modal-card-body">
      <activityForm></activityForm>
    </section>

  </div>
</div>
</template>
