<script setup lang="ts">
    import { ref } from 'vue';
    import { useUserStore } from '@/stores/userStore';
    import { showToast } from '@/utils/toast';

    import type {
        User
    } from '@/types';

    const props= defineProps<{
        // define a prop for the products that is an array of Product objects
        currentId: number;
        currentUsername: string;
        currentEmail: string;
        currentIsAdmin: boolean;
        currentImageLink: string;
        currentFriendIds: number[];
    
    }>()
    
    const emit = defineEmits(['user-edited'])
    
    const userStore = useUserStore();
    const currentUser = ref<User>({
        id: props.currentId,
        username: props.currentUsername,
        email: props.currentEmail,
        friendIds: props.currentFriendIds,
        imageLink: props.currentImageLink,
        isAdmin: props.currentIsAdmin,
    })

    function handleSubmit() {
        userStore.editUser(currentUser.value.id, currentUser.value)
        showToast('User edited successfully!', 'is-success')
        emit('user-edited')
    }

</script>

<template>
<form id="edit-user-form" @submit.prevent="handleSubmit">
<div class="field">
  <label class="label">Username</label>
  <div class="control has-icons-left has-icons-right">
    <input class="input" type="text" placeholder="props.currentUsername" v-model="currentUser.username">
    <span class="icon is-small is-left">
      <i class="fas fa-user"></i>
    </span>
  </div>
</div>

<div class="field">
  <label class="label">Email</label>
  <div class="control has-icons-left has-icons-right">
    <input class="input" type="email" placeholder="props.currentEmail" v-model="currentUser.email">
    <span class="icon is-small is-left">
      <i class="fas fa-envelope"></i>
    </span>
  </div>
</div>

<div class="field">
  <label class="label">Add a new image link</label>
  <div class="control has-icons-left has-icons-right">
    <input class="input" type="text" placeholder="props.currentImageLink" v-model="currentUser.imageLink">
    <span class="icon is-small is-left">
      <i class="fas fa-link"></i>
    </span>
  </div>
</div>

<div class="field">
  <label class="label">User Type</label>
  <div class="control">
    <div class="select">
      <select v-model="currentUser.isAdmin">
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