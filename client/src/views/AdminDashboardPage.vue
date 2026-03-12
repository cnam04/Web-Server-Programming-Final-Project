<script setup lang="ts">
import Navbar from '../components/navbar.vue';
import { useUserStore } from '../stores/userStore';
import type { User, UserId } from '../types';
import { ref } from 'vue';
import Modal from '../components/modal.vue';
import addUserForm from '../components/addUserForm.vue';

const users = useUserStore();
function findFriendsByIds(friendIds: UserId[]): User[] {
  return friendIds.map((id) => users.getUserById(id)).filter((user): user is User => user !== undefined);
}
function deleteUser(userId: UserId) {
  users.deleteUser(userId);
}
function editUser(userId: UserId) {
  // Implement user editing logic here
  console.log(`Edit user with ID: ${userId}`);
}

function openAddUserModal() {
  // Implement logic to open a modal for adding a new user
  console.log('Open add user modal');
}

function toggleEditMode() {
  isEditMode.value = !isEditMode.value;
}
const isEditMode = ref(false)




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
	<Navbar></Navbar>
	<section class="section">
		<section class="section">
			<div class="container">
				<h1 class="title is-1">Admin Dashboard</h1>
				<p class="content">This page is ready for dashboard content.</p>
			</div>
		</section>
		<div class="container is-fluid">
				<table class="table is-striped is-hoverable is-fullwidth">
				<thead>
					<tr>
						<th>User Image</th>
						<th>User ID</th>
						<th>Username</th>
						<th>Email</th>
						<th>Friends</th>
						<th><button class="button is-normal is-rounded is-info" @click="openModal"><i class="fas fa-edit"> Add User</i></button>
							<modal :isActive="isModalOpen"
							title="Add a User"
							confirmText="Save User"
							confirmFormId="add-user-form"
							@close="closeModal">
							<addUserForm></addUserForm>
							</modal>
						</th>
					</tr>
				</thead>
					<tbody>
					
					<tr v-for="user in users.users" :key="user.id">
						<td><img :src="user.imageLink" alt="User Image" class="image is-32x32" /></td>
						<td>{{ user.id }}</td>
						<td>{{ user.username }}</td>
						<td>{{ user.email }}</td>
						<td>{{ findFriendsByIds(user.friendIds).map((friend) => friend.username).join(', ') }}</td>
						<td><button class="button is-normal is-rounded is-danger" @click="deleteUser(user.id)"><i class="fas fa-trash"></i></button><button class="button is-normal is-rounded is-warning" @click="toggleEditMode"><i class="fas fa-edit"></i></button></td>
					</tr>
					
				</tbody>
				</table>
		</div>
	</section>
</template>

<style scoped>
.container.is-fluid {
  width : 80%
}

.button {
	  margin-right: 0.8rem;
}
</style>
