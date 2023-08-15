import { fetchSiteConfig } from '../../scripts/site-config.js';

// Define algolia search client globals
/* global instantsearch */

// read in from configuration
const refinementList = await fetchSiteConfig('refinements');
const facetLabels = {};
for (const item of refinementList) {
  facetLabels[item.property] = item.name;
}
export default function decorate(block) {
  const currentRefinements = document.createElement('div');
  currentRefinements.id = 'current-refinements';
  currentRefinements.classList.add('current-refinements');
  block.appendChild(currentRefinements);

  window.search.addWidgets([
    instantsearch.widgets.currentRefinements(
      {
        container: '#current-refinements',
        transformItems: (items) => {
          for (let i = 0; i < items.length; i += 1) {
            // eslint-disable-next-line max-len
            items[i].label = facetLabels[items[i].attribute] ? facetLabels[items[i].attribute] : items[i].label;
          }
          return items;
        },
      },
    ),
  ]);
}
