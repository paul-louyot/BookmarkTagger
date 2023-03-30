class BookmarkWithTags {
  constructor(bookmark){
    this.chromeTitle = bookmark.title;
    this.dateAdded = bookmark.dateAdded;
    this.url = bookmark.url;
    this.id = bookmark.id;
    this.title = this.#getTitleFromChromeTitle();
    this.tagsSet = new Set(this.#getTagsFromChromeTitle());
  }
  
  get tags(){
    return [...this.tagsSet];
  }
  
  // TODO: setters for tags and title; each updates chromeTitle
  
  get hasSomeTags(){
    return this.tagsSet.size > 0;
  }
  
  updateTags(tagsList){
    this.tagsSet = new Set(tagsList);
    this.save();
  }
  
  save(){
    chrome.bookmarks.update(this.id, {
      title: this.getNewChromeTitle()
    });
  }
  
  remove(){
    return chrome.bookmarks.remove( this.id )
  }
  
  getNewChromeTitle(){
    if (!this.hasSomeTags) return this.title;
    
    return `[ ${[ ...this.tagsSet ].join( ' ' )} ] ${this.title}`
  }
  
  hasTags(tagsArray){
    return tagsArray.every((tag) => this.hasTag(tag));
  }
  
  hasTag(tag){
    return this.tagsSet.has(tag);
  }
  
  #getTagsFromChromeTitle(){
    if (!this.#chromeTitlehasTags()) return [];

    const startIndex = this.chromeTitle.indexOf( '[' );
    const endIndex = this.chromeTitle.indexOf(']');
    return this.chromeTitle.slice(startIndex + 1, endIndex).split(' ').filter((x) => x)
  }
  
  #getTitleFromChromeTitle(){
    if (!this.#chromeTitlehasTags()) return this.chromeTitle;
    
    const endIndex = this.chromeTitle.indexOf(']');
    return this.chromeTitle.slice(endIndex + 1);
  }
  
  #chromeTitlehasTags(){
    const startIndex = this.chromeTitle.indexOf( '[' );
    const endIndex = this.chromeTitle.indexOf(']');
    const boolean =  (typeof this.chromeTitle === 'string' &&
              startIndex === 0 &&
              endIndex !== -1 &&
              endIndex > startIndex)
    return boolean
  }
}

export { BookmarkWithTags }
