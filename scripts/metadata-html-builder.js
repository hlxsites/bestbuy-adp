import {
  getAnchorVariable,
  getQueryVariable,
  isElement,
} from './scripts.js';
import { fetchSiteConfig } from './site-config.js';
import { addMetadataFields, formatAssetMetadata, getMetadataValue } from './metadata.js';
import { getAssetMetadata } from './polaris.js';

function getAssetIdFromURL() {
  return getQueryVariable('assetId') || getAnchorVariable('assetId');
}

function shouldDisplayMetadataAsRow(metadataInfo, formattedValue) {
  const minCharsForRows = 34;
  const { value } = metadataInfo;

  return ((value !== undefined || value !== null)
    && value && value.length && value.length > minCharsForRows)
    || isElement(formattedValue);
}

/**
 * Add a metadata field to the metadata panel:
 * <div class="item metadata-field metadata-field-<cssClass>">
 *  <div class="label">Title</div>
 * <div class="value">Value</div>
 * </div>
 * @param {HTMLElement} metadataElement - the element to add the metadata field to
 * @param {object} metadataInfo - the metadata info object
 */
function createHTMLForMetadataField(metadataElement, metadataInfo) {
  const name = metadataInfo.field;
  const label = metadataInfo.title;
  const {
    value, dataType, cssClass,
  } = metadataInfo;

  const item = document.createElement('div');
  item.classList.add('item', 'metadata-field', `metadata-field-${cssClass}`);
  const labelDiv = document.createElement('div');
  labelDiv.classList.add('label');
  labelDiv.textContent = label;
  item.appendChild(labelDiv);
  const valueDiv = document.createElement('div');
  valueDiv.classList.add('value');
  if (value === undefined || value === null
      || (Array.isArray(value)
      && value.every((v) => v === undefined || v === null))) {
    valueDiv.classList.add('empty');
    valueDiv.textContent = '--';
    item.appendChild(valueDiv);
    metadataElement.appendChild(item);
  } else {
    const formattedValue = formatAssetMetadata(name, value, dataType);
    if (isElement(formattedValue)) {
      valueDiv.appendChild(formattedValue);
    } else {
      valueDiv.textContent = formattedValue;
    }
    item.appendChild(valueDiv);
    metadataElement.appendChild(item);
    if (shouldDisplayMetadataAsRow(metadataInfo, formattedValue)) {
      item.classList.add('metadata-row');
    }
  }
}

/**
 * Create the metadata HTML used in cards and the asset details
 * @param {object} metadataConfig - the metadata config object
 * @param {object} assetJSON - the asset JSON object
 * @returns {HTMLElement} the metadata-fields element
 * e.g.
 * <div class="metadata-fields">
 *  <div class="item metadata-field metadata-field-<cssClass>">
 *   <div class="label">Title</div>
 *   <div class="value">Value</div>
 * </div>
 */
export function createMetadataHTML(metadataConfig, assetJSON) {
  const metadataTable = document.createElement('div');
  metadataTable.classList.add('metadata-fields');
  addMetadataFields(
    metadataConfig,
    assetJSON,
    (metadataInfo) => {
      createHTMLForMetadataField(metadataTable, metadataInfo);
    },
  );
  return metadataTable;
}

/**
 * Create the metadata HTML for the asset details panel
 * @param {string} configname - the name of the metadata config to use
 * @param {object|string} assetData - the asset data to use
 * @returns {HTMLElement} the metadata element
 * e.g.
 *   <div class="metadata-container">
 *    <div class="metadata-filename"></div>
 *    <div class="metadata-fields">
 *      <div class="item metadata-field metadata-field-<cssClass>">
 *       <div class="label">Title</div>
 *       <div class="value">Value</div>
 *     </div>
 *    </div>
 *  </div>
 */
export async function fetchMetadataAndCreateHTML(configName, assetData, includeFileName = true) {
  let assetJSON;
  if (typeof assetData === 'object') {
    assetJSON = assetData;
  }
  if (typeof assetData === 'string') {
    assetJSON = await getAssetMetadata(assetData);
  }
  if (assetData === undefined || assetJSON === undefined) {
    assetJSON = await getAssetMetadata(getAssetIdFromURL());
  }
  const metadataConfig = await fetchSiteConfig(configName);

  const metadataContainer = document.createElement('div');
  metadataContainer.classList.add('metadata-container');
  if (includeFileName) {
    const fileNameDiv = document.createElement('div');
    fileNameDiv.classList.add('metadata-filename');
    fileNameDiv.textContent = getMetadataValue('repo:name', assetJSON);
    metadataContainer.appendChild(fileNameDiv);
  }
  metadataContainer.appendChild(createMetadataHTML(metadataConfig, assetJSON));
  return metadataContainer;
}