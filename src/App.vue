<script setup>
// import HelloWorld from './components/HelloWorld.vue'
import { computed, ref, watch } from 'vue'
import BookmarkItem from './components/BookmarkItem.vue';
import { BookmarkWithTags } from './BookmarkWithTags.js'

const bookmarks = ref([])
const bookmarksTree = ref([]);
const bookmarksWithTags = ref([]);
const selectedTagsSet = ref(new Set);

watch(
  selectedTagsSet.value,
  () => {
    // console.log(selectedTagsSet.value)
  }
)

chrome.bookmarks
  .getTree()
  .then((res) => { bookmarksTree.value = res[0] })
  .then(() => { bookmarks.value = flattenTree(bookmarksTree.value) })
  .then(() => { 
    bookmarksWithTags.value = 
      bookmarks.value.map((bookmark) => new BookmarkWithTags(bookmark))
                     .sort((a, b) =>  1 * (b.dateAdded - a.dateAdded) )
  })
  // .then(() => {console.log(bookmarksWithTags.value)})

const filteredBookmarks = computed(() => {
  return bookmarksWithTags.value.filter((bookmark) =>  bookmark.hasTags([...selectedTagsSet.value]))
})

const tagsSet = computed(() => {
  const set = new Set;
  for (const bookmark of bookmarksWithTags.value) {
    if (bookmark.hasSomeTags){
      bookmark.tags.forEach(e => { set.add(e); })
    }
  }
  return set;
})


function flattenTree( tree ) {
  let list = []
  let isLeaf = ( !tree.children && tree.url )
  if ( isLeaf ) {
    list.push( tree )
  } else {
    for ( let child of tree.children ) {
      list.push( flattenTree( child ) )
    }
  }
  return list.flat( Infinity )
}



</script>

<template>
  <h1>Bookmark tags handler</h1>
  <div class="row">
    <div class="col">
      <div class="input-group">
        <input id="filterInput" placeholder="Filtrer ici" type="text" class="form-control tags-input" value="">
      </div>
    </div>
    <div class="col">
      <span>
        <button class="btn btn-primary" id="clear-filters-button" @click="selectedTagsSet.clear()">Clear filters</button>
      </span>
    </div>
  </div>

  <div id="badges-container" class="my-2">
    <template v-for="tag in tagsSet.values()">
      <span class="badge bg-secondary m-1 pe-cursor" @click="selectedTagsSet.add(tag)">
        {{ tag }}
      </span>
    </template>
  </div>

  <!-- <ul class="list-group" id="bookmarks-container">
  </ul class="list-group"> -->

  <ul class="list-group">
    <template v-for="bookmark in filteredBookmarks">
      <BookmarkItem :bookmark="bookmark"/>
    </template>
  </ul>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
