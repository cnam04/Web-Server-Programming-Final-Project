<script setup lang="ts">
    import { ref } from 'vue';
    import { useUserStore } from '@/stores/userStore';
    import defaultUserImage from '@/assets/defaultUserImage.jpg';

    import type {
        User,
        UserId
    } from '@/types';
    
    const emit = defineEmits(['user-added'])
    
    const userStore = useUserStore();
    const newUser = ref<User>({
        id: Date.now()%1000000000 as UserId,
        username: '',
        email: '',
        friendIds: [],
        imageLink: defaultUserImage,
        isAdmin: false,
    })

    function handleSubmit() {
        userStore.addUser(newUser.value)
        emit('user-added')
    }

</script>

<template>
<form id="add-user-form" @submit.prevent="handleSubmit">
<div class="field">
  <label class="label">Username</label>
  <div class="control has-icons-left has-icons-right">
    <input class="input" type="text" placeholder="Username" v-model="newUser.username">
    <span class="icon is-small is-left">
      <i class="fas fa-user"></i>
    </span>
  </div>
</div>

<div class="field">
  <label class="label">Email</label>
  <div class="control has-icons-left has-icons-right">
    <input class="input" type="email" placeholder="Email" v-model="newUser.email">
    <span class="icon is-small is-left">
      <i class="fas fa-envelope"></i>
    </span>
  </div>
</div>

<div class="field">
  <label class="label">User Type</label>
  <div class="control">
    <div class="select">
      <select v-model="newUser.isAdmin">
        <option :value="false">Regular User</option>
        <option :value="true">Admin</option>
      </select>
    </div>
  </div>
</div>
</form>
</template>

<style scoped>

</style>