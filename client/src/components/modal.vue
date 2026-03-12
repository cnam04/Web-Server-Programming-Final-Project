<script setup lang="ts">
type Props = {
  isActive: boolean
  title?: string
  confirmText?: string
  cancelText?: string
  confirmFormId?: string
}

withDefaults(defineProps<Props>(), {
  title: 'Modal title',
  confirmText: 'Save changes',
  cancelText: 'Cancel',
  confirmFormId: undefined
})

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'confirm'): void
}>()

function handleClose() {
  emit('close')
}

function handleConfirm() {
  emit('confirm')
}
</script>

<template>
  <div class="modal" :class="{ 'is-active': isActive }">
    <div class="modal-background" @click="handleClose"></div>

    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">{{ title }}</p>
        <button class="delete" aria-label="close" @click="handleClose"></button>
      </header>

      <section class="modal-card-body">
        <slot>
        </slot>
      </section>

     <footer class="modal-card-foot">
        <div class="buttons">
          <button
            v-if="confirmFormId"
            type="submit"
            class="button is-success"
            :form="confirmFormId"
          >
            {{ confirmText }}
          </button>

          <button
            v-else
            type="button"
            class="button is-success"
            @click="handleConfirm"
          >
            {{ confirmText }}
          </button>

          <button type="button" class="button" @click="handleClose">
            {{ cancelText }}
          </button>
        </div>
      </footer>
    </div>
  </div>
</template>

<style scoped>
</style>