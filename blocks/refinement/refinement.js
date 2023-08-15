import { decorateIcons } from '../../scripts/lib-franklin.js';
import { fetchSiteConfig } from '../../scripts/site-config.js';

// Define algolia search client globals
/* global instantsearch */

function addFilterButton(block) {
  const toggleFilterPanelButton = document.createElement('div');
  toggleFilterPanelButton.classList.add('refinements-toggle');
  toggleFilterPanelButton.innerHTML = `<button id="filterButton">
  <span class="icon icon-filter"></span>
  <span class="text">Hide Filters</span>
</button> `;
  toggleFilterPanelButton.onclick = () => {
    const span = toggleFilterPanelButton.querySelector('span.text');
    if (span.textContent === 'Hide Filters') {
      span.textContent = 'Show Filters';
      document.querySelector('.refinement-wrapper').classList.remove('open');
      document.querySelector('.section.infinite-results-container').classList.add('left-closed');
    } else {
      span.textContent = 'Hide Filters';
      document.querySelector('.refinement-wrapper').classList.add('open');
      document.querySelector('.section.infinite-results-container').classList.remove('left-closed');
    }
  };

  block.appendChild(toggleFilterPanelButton);
}

export default async function decorate(block) {
  // refinement container
  const refinements = document.createElement('div');
  block.closest('.refinement-wrapper').classList.add('open');
  refinements.id = 'refinements';
  refinements.classList.add('refinements');
  addFilterButton(block);
  block.appendChild(refinements);
  // read in from configuration
  const refinementList = await fetchSiteConfig('refinements');
  // add refinements.  will support more types.
  refinementList.forEach((refinement) => {
    if (!refinement.property) {
      return;
    }
    const refinementDiv = document.createElement('div');
    refinementDiv.classList.add('refinement');
    const label = document.createElement('span');
    label.classList.add('label');
    label.textContent = refinement.name || refinement.property;
    refinementDiv.appendChild(label);
    const options = document.createElement('div');
    options.id = `${refinement.property}-options`;
    options.classList.add('refinement-options');
    refinementDiv.appendChild(options);
    refinements.appendChild(refinementDiv);
    window.search.addWidgets([
      instantsearch.widgets.refinementList(
        {
          container: `#${refinement.property}-options`,
          attribute: refinement.property,
          operator: refinement.operator || 'or',
        },
      ),
    ]);
    const observer = new MutationObserver(() => {
      // check if ais-RefinementList--noRefinement is present
      if (options.querySelector('.ais-RefinementList--noRefinement')) {
        options.parentNode.style.display = 'none';
      } else {
        options.parentNode.style.display = 'block';
      }
    });
    observer.observe(options, {
      subtree: true,
      attributes: true,
    });
  });
  // clear refinements
  const clearRefinements = document.createElement('div');
  clearRefinements.id = 'clear-refinements';
  clearRefinements.classList.add('clear-refinements');
  refinements.appendChild(clearRefinements);
  window.search.addWidgets([
    instantsearch.widgets.clearRefinements(
      {
        container: '#clear-refinements',
      },
    ),
  ]);

  await decorateIcons(block);

  block.querySelectorAll('.refinement').forEach((el) => {
    const labelElem = el.querySelector('.label');
    if (labelElem) {
      labelElem.onclick = () => {
        const options = el.querySelector('.refinement-options');
        if (options.style.display !== 'none') {
          options.style.display = 'none';
          labelElem.setAttribute('aria-expanded', 'false');
        } else {
          options.style.display = 'block';
          labelElem.setAttribute('aria-expanded', 'true');
        }
      };
      const options = el.querySelector('.refinement-options');
      options.style.display = 'block';
      labelElem.setAttribute('aria-expanded', 'true');
      labelElem.setAttribute('aria-controls', options.id);
      labelElem.setAttribute('role', 'button');
    }
  });
}
