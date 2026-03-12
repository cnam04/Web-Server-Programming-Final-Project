<script setup lang="ts">
import type { LoggedClimb } from '../types'

defineProps<{
  climb: LoggedClimb
}>()

function hasColor(climb: LoggedClimb): climb is LoggedClimb & { color: string } {
  return 'color' in climb
}

function hasName(climb: LoggedClimb): climb is LoggedClimb & { name: string } {
  return 'name' in climb
}
</script>

<template>
  <div class="box  mb-3">
    <div class="content mb-0">
      <p class="mb-2"><strong>Climb ID:</strong> {{ climb.id }}</p>

      <p v-if="hasColor(climb)" class="mb-2">
        <strong>Color:</strong> {{ climb.color || 'N/A' }}
      </p>

      <p v-if="hasName(climb)" class="mb-2">
        <strong>Name:</strong> {{ climb.name || 'Unnamed climb' }}
      </p>

      <p class="mb-2"><strong>Grade:</strong> {{ climb.grade || 'N/A' }}</p>
      <p class="mb-2"><strong>Style:</strong> {{ climb.style }}</p>
      <p class="mb-2"><strong>Attempt:</strong> {{ climb.attempt }}</p>
      <p class="mb-2"><strong>Quality:</strong> {{ climb.quality }}/10</p>
      <p class="mb-0"><strong>Comment:</strong> {{ climb.comment || 'No comment.' }}</p>
    </div>
  </div>
</template>