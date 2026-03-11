<script setup>
import { ref } from 'vue';

const isModalOpen = ref(false);

function openModal() {
    isModalOpen.value = true;
}

function closeModal() {
    isModalOpen.value = false;
}
</script>
<template>
    <button class="js-modal-trigger" data-target="modal-js-example" @click="openModal">
            Add an activity
    </button>
    
    <div class="modal" :class="{ 'is-active' : isModalOpen}">
  <div class="modal-background" @click="closeModal"></div>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Modal title</p>
      <button class="delete" aria-label="close" @click="closeModal"></button>
    </header>
    <section class="modal-card-body">
      <!-- Content ... -->
       <h1 class="title">Add an activity</h1>
    </section>
    <footer class="modal-card-foot">
      <div class="buttons">
        <button class="button is-success">Save changes</button>
        <button class="button" @click="closeModal">Cancel</button>
      </div>
    </footer>
  </div>
</div>
</template>
