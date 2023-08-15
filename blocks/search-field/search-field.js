export default function decorate(block) {
  const searchField = document.createElement('div');
  searchField.id = `search-field-${Math.random().toString(36).substr(2, 9)}`;
  block.appendChild(searchField);
  window.search.addWidgets([
    // eslint-disable-next-line no-undef
    instantsearch.widgets.searchBox({
      container: `#${searchField.id}`,
      cssClasses: {
        root: 'search-field',
        input: 'search-field-input',
      },
      placeholder: 'Search all assets',
      queryHook(query, search) {
        if (query.length < 3) {
          return;
        }
        search(query);
      },
    }),
  ]);
  block.appendChild(searchField);
}
