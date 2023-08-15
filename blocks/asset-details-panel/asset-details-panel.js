import { decorateIcons } from '../../scripts/lib-franklin.js';
import {
  isElement, getQueryVariable, getAnchorVariable,
} from '../../scripts/scripts.js';
import { fetchSiteConfig } from '../../scripts/site-config.js';
import {
  addMetadataFields, formatAssetMetadata, formatConfidence, getMetadataValue, getMetadataValues,
} from '../../scripts/metadata.js';
import {
  getFailedPlaceholderImgSrc,
} from '../../scripts/filetypes.js';
import {
  getOptimizedDeliveryUrl, getAssetMetadata,
} from '../../scripts/polaris.js';
// eslint-disable-next-line import/no-cycle
import { selectNextAsset, selectPreviousAsset, deselectAssetCard } from '../infinite-results/infinite-results.js';

const assetDetailsConfig = await fetchSiteConfig('asset-details');

/**
 * Close the asset details panel and deselect the asset card
 */
export function closeAssetDetails() {
  document.querySelector('.asset-details-panel').classList.remove('open');

  deselectAssetCard();
}

/**
 * Create and return a div containing the tags (xcm:keywords and xcm:machineKeywords)
 * for the asset.  xcm:machineKeywords are smart tags which are displayed with the
 * confidence value in parentheses.
 * @param {object} assetJSON the asset JSON
 */
function getTags(assetJSON) {
  // output xcm:keywords and xcm:machineKeywords
  const output = document.createElement('div');
  output.classList.add('tags');
  const keywords = getMetadataValues('xcm:keywords', assetJSON);
  keywords.forEach((keyword) => {
    const tagDiv = document.createElement('div');
    tagDiv.classList.add('tag');
    tagDiv.classList.add('keyword');
    tagDiv.title = `${keyword.value}`;
    tagDiv.textContent = keyword.value;
    output.appendChild(tagDiv);
  });
  const machineKeywords = getMetadataValues('xcm:machineKeywords', assetJSON);
  if (machineKeywords) {
    machineKeywords.forEach((keyword) => {
      const tagDiv = document.createElement('div');
      tagDiv.classList.add('tag');
      tagDiv.classList.add('keyword');
      tagDiv.textContent = keyword.value;
      tagDiv.title = `${keyword.value} (${formatConfidence(keyword.confidence)})`;
      output.appendChild(tagDiv);
    });
  }
  return output;
}

/**
   * Create and return an img element for the asset
   * @param {string} id the asset id (repo:assetId)
   * @param {string} name the SEO name of the asset (usually repo:name)
   * @param {string} title the title of the asset (usually dc:title)
   * @param {string} type the file type of the asset (usually dc:format)
   * @returns an img element
   */
function getImageElement(id, name, title, type) {
  const url = getOptimizedDeliveryUrl(id, name, 1024);
  const imgElem = document.createElement('img');
  if (type) {
    imgElem.src = url;
    const altAttrib = (title) ? title.trim().replace(/"/, '"') : name.trim().replace(/"/, '"');
    imgElem.alt = altAttrib;
    imgElem.onerror = function () {
      this.src = getFailedPlaceholderImgSrc(type);
    };
  }
  return imgElem;
}

/**
 * Add a metadata field to the metadata panel
 * @param {HTMLElement} metadataElement - the element to add the metadata field to
 * @param {object} metadataInfo - the metadata info object
 */
function addMetadataField(metadataElement, metadataInfo) {
  const name = metadataInfo.field;
  const label = metadataInfo.title;
  const { value, dataType, cssClass } = metadataInfo;

  const item = document.createElement('div');
  item.classList.add('item', 'metadata-field', `metadata-field-${cssClass}`);
  const labelDiv = document.createElement('div');
  labelDiv.classList.add('label');
  labelDiv.textContent = label;
  item.appendChild(labelDiv);
  if (isElement(value)) {
    item.appendChild(formatAssetMetadata(name, value, dataType));
  } else {
    const valueDiv = document.createElement('div');
    valueDiv.classList.add('value');
    if (value === undefined || value === null
      || (Array.isArray(value)
      && value.every((v) => v === undefined || v === null))) {
      valueDiv.classList.add('empty');
      valueDiv.textContent = '--';
    } else {
      valueDiv.textContent = formatAssetMetadata(name, value, dataType);
    }
    item.appendChild(valueDiv);
  }
  metadataElement.appendChild(item);
}

export async function openAssetDetails(assetId) {
  if (!assetId) return;

  const assetJSON = await getAssetMetadata(assetId);
  if (!assetJSON) return;

  const fileName = getMetadataValue('repo:name', assetJSON);
  const title = formatAssetMetadata(getMetadataValue('dc:title', assetJSON));
  const fileFormat = getMetadataValue('dc:format', assetJSON);
  const tagsElem = getTags(assetJSON);
  const imgElem = getImageElement(assetId, fileName, title, fileFormat);
  const metadataTable = document.querySelector('#asset-details-metadata-fields-table');

  if (fileName) document.querySelector('#asset-details-file-name').textContent = fileName;

  // remove all children from the metadata panel
  metadataTable.innerHTML = '';
  addMetadataFields(
    assetDetailsConfig,
    assetJSON,
    (metadataInfo) => {
      addMetadataField(metadataTable, metadataInfo);
    },
  );
  const tagsContainer = document.querySelector('#asset-details-metadata-tags');
  tagsContainer.innerHTML = '';
  addMetadataField(
    tagsContainer,
    {
      field: 'tags', title: 'Tags', value: tagsElem, cssClass: 'tags',
    },
  );

  const imgPanel = document.querySelector('#asset-details-image-panel');
  if (imgElem) {
    const oldImg = imgPanel.querySelector('img');
    if (oldImg) {
      oldImg.remove();
      imgPanel.appendChild(imgElem);
    } else {
      imgPanel.appendChild(imgElem);
    }
  }

  const assetDetailsPanel = document.querySelector('.asset-details-panel');
  // show the asset details panel
  assetDetailsPanel.classList.add('open');

  // scroll to the top of the panel
  if (assetDetailsPanel.parentElement.scrollTop > 0) {
    assetDetailsPanel.parentElement.scrollTop = 0;
  }
}

export default async function decorate(block) {
  block.innerHTML = ` 
        <div class="asset-details-header-container">
          <div class="asset-details-header">
            <div class="top-left">
              <button id="asset-details-download" class="action action-download-asset" title="Download" aria-label="Download">
                <span class="icon icon-download"></span>
              </button>
              <button id="asset-details-share" class="action action-share-asset" title="Share" aria-label="Share">
                <span class="icon icon-share"></span>
              </button>
            </div>
            <div class="top-right">
              <button id="asset-details-fullscreen" class="action action-asset-fullscreen" title="Fullscreen" aria-label="Fullscreen">
                <span class="icon icon-fullScreen"></span>
              </button>
              <button id="asset-details-previous" class="action action-previous-asset" title="Previous" aria-label="Previous">
                <span class="icon icon-previous"></span>
              </button>
              <button id="asset-details-next" class="action action-next-asset" title="Next" aria-label="Next">
                <span class="icon icon-next"></span>
              </button>
              <button id="asset-details-close" class="action action-close" title="Close" aria-label="Close">
                <span class="icon icon-close"></span>
              </button>
            </div>
          </div>
      </div>
      <div id="asset-details-panel-container">
        <div id="asset-details-image-panel" class="image"></div>
        <div id="asset-details-metadata-container" class="metadata">
          <div id="asset-details-file-name"></div>
          <div id="asset-details-metadata-panel">
            <div id="asset-details-metadata-fields-table" class="metadata-table"></div>
            <div id="asset-details-metadata-fields-rows" class="metadata-rows"></div>
            <div id="asset-details-metadata-tags" class="metadata-tags"></div>
          </div>
        </div>
      </div>
      `;
  decorateIcons(block);
  block.querySelector('#asset-details-close').addEventListener('click', () => {
    closeAssetDetails();
  });
  block.querySelector('#asset-details-previous').addEventListener('click', () => {
    selectPreviousAsset();
  });
  block.querySelector('#asset-details-next').addEventListener('click', () => {
    selectNextAsset();
  });
  const assetId = getQueryVariable('assetId') || getAnchorVariable('assetId');
  if (assetId) openAssetDetails(assetId);
}
