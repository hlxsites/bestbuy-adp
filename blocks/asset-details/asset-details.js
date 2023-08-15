import {
  isElement, getQueryVariable,
} from '../../scripts/scripts.js';
import { fetchSiteConfig } from '../../scripts/site-config.js';
import {
  addMetadataFields, formatAssetMetadata, formatConfidence,
} from '../../scripts/metadata.js';
import {
  getFailedPlaceholderImgSrc,
} from '../../scripts/filetypes.js';
import {
  getOptimizedDeliveryUrl, getAssetMetadata,
} from '../../scripts/polaris.js';

const assetDetailsConfig = await fetchSiteConfig('asset-details');

/**
 * Create and return a div containing the tags (xcm:keywords and xcm:machineKeywords) for the asset.
 * xcm:machineKeywords are smart tags which are displayed with the confidence value in parentheses.
 */
function getTags(assetJSON) {
  // output xcm:keywords and xcm:machineKeywords
  const output = document.createElement('div');
  assetJSON.application['xcm:keywords']?.forEach((keyword) => {
    // output += `<div class="tag keyword">${keyword.value}</div>`;
    const tagDiv = document.createElement('div');
    tagDiv.classList.add('tag');
    tagDiv.classList.add('keyword');
    tagDiv.textContent = keyword.value;
    output.appendChild(tagDiv);
  });
  assetJSON.application['xcm:machineKeywords']?.forEach((keyword) => {
    const tagDiv = document.createElement('div');
    tagDiv.classList.add('tag');
    tagDiv.classList.add('keyword');
    tagDiv.textContent = `${keyword.value} (${formatConfidence(keyword.confidence)})`;
    output.appendChild(tagDiv);
  });
  return output;
}

/**
 * Create and return an img element for the asset
 * @param {*} id the asset id (repo:assetId)
 * @param {*} name the SEO name of the asset (usually repo:name)
 * @param {*} title the title of the asset (usually dc:title)
 * @param {*} type the file type of the asset (usually dc:format)
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

function addMetadataField(metadataElement, metadataInfo) {
  const name = metadataInfo.field;
  const label = metadataInfo.title;
  const { value, dataType, cssClass } = metadataInfo;

  const item = document.createElement('div');
  item.classList.add('item');
  item.classList.add('metadata-field');
  item.classList.add(`metadata-field-${cssClass}`);
  const labelDiv = document.createElement('div');
  labelDiv.classList.add('label');
  labelDiv.textContent = label;
  item.appendChild(labelDiv);
  if (isElement(value)) {
    item.appendChild(formatAssetMetadata(name, value, dataType));
  } else {
    const valueDiv = document.createElement('div');
    valueDiv.classList.add('value');
    valueDiv.textContent = formatAssetMetadata(name, value, dataType);
    item.appendChild(valueDiv);
  }
  metadataElement.appendChild(item);
}

export default async function decorate(block) {
  const assetId = getQueryVariable('assetId');
  const assetJSON = await getAssetMetadata(assetId);
  block.innerHTML = `
    <div id="asset-details-header">
      <a href="javascript:history.back();">
      <div id="file-name" class="name"></div></a>
    </div>
    <div id="image-panel" class="image">
    </div>
    <div id="metadata-panel" class="metadata">
    </div>
    `;
  const fileName = assetJSON?.repository['repo:name'];
  const title = formatAssetMetadata(assetJSON?.embedded['dc:title'] ?? assetJSON?.repository['repo:name']);
  const fileFormat = assetJSON?.repository['dc:format'];
  const tagsElem = getTags(assetJSON);
  const imgElem = getImageElement(assetId, fileName, title, fileFormat);
  const metadata = document.getElementById('metadata-panel');

  if (fileName) document.getElementById('file-name').textContent = fileName;

  addMetadataFields(
    assetDetailsConfig,
    assetJSON,
    (metadataInfo) => {
      addMetadataField(metadata, metadataInfo);
    },
  );
  addMetadataField(
    metadata,
    {
      field: 'tags', title: 'Tags', value: tagsElem, cssClass: 'tags',
    },
  );

  if (imgElem) document.getElementById('image-panel').appendChild(imgElem);
}
