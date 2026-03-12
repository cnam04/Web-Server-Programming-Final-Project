<script setup lang="ts">
    import { ref } from 'vue';
    import { useUserStore } from '@/stores/userStore';

    import type {
        User,
        UserId
    } from '@/types';

</script>

<template>
    <div class="field">
    <label class="label">Name</label>
    <div class="control">
        <input class="input" type="text" placeholder="Name">
    </div>
</div>

<div class="field">
  <label class="label">Username</label>
  <div class="control has-icons-left has-icons-right">
    <input class="input" type="text" placeholder="Username">
    <span class="icon is-small is-left">
      <i class="fas fa-user"></i>
    </span>
  </div>
</div>

<div class="field">
  <label class="label">Email</label>
  <div class="control has-icons-left has-icons-right">
    <input class="input" type="email" placeholder="Email">
    <span class="icon is-small is-left">
      <i class="fas fa-envelope"></i>
    </span>
  </div>
</div>

<div class="field">
  <label class="label">User Type</label>
  <div class="control">
    <div class="select">
      <select>
        <option>Regular User</option>
        <option>Admin</option>
      </select>
    </div>
  </div>
</div>
</template>

<style scoped>

</style>