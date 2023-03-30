<script setup>
import { computed } from 'vue'
const props = defineProps({
  tag: String,
  selectedTagsSet: Object
})
const emit = defineEmits(['add', 'remove'])

const isSelected = computed(() => {
  return props.selectedTagsSet.has(props.tag);
})

function handleClick(){
  const eventName = isSelected.value ? 'remove' : 'add';
  emit(eventName, props.tag)
}
</script>

<template>
  <span 
    class="badge m-1 pe-cursor user-select-none" 
    :class="{ 'bg-secondary': !isSelected, 'bg-primary': isSelected }"
    @click="handleClick">
    {{ tag }}
  </span>
</template>
