<script setup>
import { computed, ref } from 'vue'
import BookmarkItem from './components/BookmarkItem.vue';
import TagItem from './components/TagItem.vue'
import { BookmarkWithTags } from './BookmarkWithTags.js'

const bookmarks = ref([])
const bookmarksTree = ref([]);
const bookmarksWithTags = ref([]);
const selectedTagsSet = ref(new Set);

chrome.bookmarks
  .getTree()
  .then((res) => { bookmarksTree.value = res[0] })
  .then(() => { bookmarks.value = flattenTree(bookmarksTree.value) })
  .then(() => { 
    bookmarksWithTags.value = 
      bookmarks.value.map((bookmark) => new BookmarkWithTags(bookmark))
                     .sort((a, b) =>  1 * (b.dateAdded - a.dateAdded) )
  })

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

function removeBookmark(id){
  const index = bookmarksWithTags.value.findIndex( b => b.id === id );
  bookmarksWithTags.value.splice(index, 1);
}

</script>

<template>
  <h1>BookmarkTagger</h1>
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
    <template v-for="tag in tagsSet.values()" :key="tag">
      <TagItem 
        :tag="tag" 
        :selected-tags-set="selectedTagsSet"
        @add="(tag) => selectedTagsSet.add(tag)"
        @remove="(tag) => selectedTagsSet.delete(tag)"
      />
    </template>
  </div>

  <ul class="list-group">
    <template v-for="bookmark in filteredBookmarks" :key="bookmark.id">
      <BookmarkItem :bookmark="bookmark" @remove="removeBookmark"/>
    </template>
  </ul>
</template>
