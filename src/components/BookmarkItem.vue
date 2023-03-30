<script setup>
import { ref, watch } from 'vue'
const props = defineProps({
  bookmark: Object
})

const tagsString = ref(`${props.bookmark.tags.join(' ')} `);

watch(
  tagsString,
  () => {
    const tagsList = tagsString.value.split(' ').filter( x => x)
    props.bookmark.updateTags(tagsList);
  }
)

</script>

<template>
  <li class="list-group-item">
    <div class="row">
      <span class="col d-flex align-items-center justify-content-between">
        <span class="bookmark-title">
          {{ bookmark.title }}
        </span>
        <a :href="bookmark.url" target="_blank" class="bookmark-link p-2">
          <i class="bi bi-box-arrow-up-right"></i>
        </a>
      </span>
      <div class="col">
        <div class="row">
          <div class="col">
            <div class="input-group input-group-sm">
              <input class="form-control tags-input" v-model="tagsString">
            </div>
          </div>
          <div class="col d-flex align-items-center justify-content-end">
            <span class="pe-cursor">
              <i class="bi bi-x-lg pe-cursor delete-button"></i>
            </span>
          </div>
        </div>
      </div>
    </div>
    <!-- <small>
      {{ bookmark.chromeTitle }}
    </small> -->
  </li>

</template>
