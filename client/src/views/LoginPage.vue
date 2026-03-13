<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/userStore';
import { useAuthStore } from '../stores/authStore'
import router from '@/router';

const userStore = useUserStore();
const users = userStore.users;
const selectedUserId = ref('');

const authStore = useAuthStore();
function handleLogin(){
    const user = userStore.getUserById(Number(selectedUserId.value))
    if (user) {
        authStore.login(user)
    }

    if (authStore.isAdmin){
        router.push('/admin')
    }else{
        router.push('/')
    }
}

</script>

<template>
  <section class="hero is-fullheight">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-centered is-vcentered">
          <div class="column is-8-tablet is-6-desktop is-5-widescreen">
            <div class="box p-6">
              <h1 class="title is-3 has-text-centered mb-5">Login</h1>

              <div class="field">
                <label class="label">Select User</label>
                <div class="control">
                  <div class="select is-fullwidth is-medium">
                    <select v-model="selectedUserId">
                      <option disabled value="">Choose a user</option>
                      <option
                        v-for="user in users"
                        :key="user.id"
                        :value="user.id"
                      >
                        {{ user.username }}{{ user.isAdmin ? ' (admin)' : '' }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
        

              <div class="field mt-5">
                <div class="control">
                  <button class="button is-primary is-fullwidth is-medium" @click="handleLogin">
                    Login
                  </button>
                </div>
              </div>
            </div>
            <div class="block">
                  <p class="is-size-6"> Login hasn't been implemented yet, so just select a user and click the login button to continue. </p>
                  <p class="is-size-6"> I just used pinia to store authentication data, so refresh will default back to non-admin</p>
                  
                </div>
          </div>
        </div>
      </div>
    </div>
  </section>

</template>

<style scoped>

</style>