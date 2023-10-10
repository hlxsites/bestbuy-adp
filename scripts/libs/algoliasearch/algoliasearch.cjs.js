"use strict";var cacheCommon=require("@algolia/cache-common"),cacheInMemory=require("@algolia/cache-in-memory"),clientAnalytics=require("@algolia/client-analytics"),clientCommon=require("@algolia/client-common"),clientPersonalization=require("@algolia/client-personalization"),clientSearch=require("@algolia/client-search"),loggerCommon=require("@algolia/logger-common"),requesterNodeHttp=require("@algolia/requester-node-http"),transporter=require("@algolia/transporter");function algoliasearch(e,t,c){const i={appId:e,apiKey:t,timeouts:{connect:2,read:5,write:30},requester:requesterNodeHttp.createNodeHttpRequester(),logger:loggerCommon.createNullLogger(),responsesCache:cacheCommon.createNullCache(),requestsCache:cacheCommon.createNullCache(),hostsCache:cacheInMemory.createInMemoryCache(),userAgent:transporter.createUserAgent(clientCommon.version).add({segment:"Node.js",version:process.versions.node})},a={...i,...c},n=()=>e=>clientPersonalization.createPersonalizationClient({...i,...e,methods:{getPersonalizationStrategy:clientPersonalization.getPersonalizationStrategy,setPersonalizationStrategy:clientPersonalization.setPersonalizationStrategy}});return clientSearch.createSearchClient({...a,methods:{search:clientSearch.multipleQueries,searchForFacetValues:clientSearch.multipleSearchForFacetValues,multipleBatch:clientSearch.multipleBatch,multipleGetObjects:clientSearch.multipleGetObjects,multipleQueries:clientSearch.multipleQueries,copyIndex:clientSearch.copyIndex,copySettings:clientSearch.copySettings,copyRules:clientSearch.copyRules,copySynonyms:clientSearch.copySynonyms,moveIndex:clientSearch.moveIndex,listIndices:clientSearch.listIndices,getLogs:clientSearch.getLogs,listClusters:clientSearch.listClusters,multipleSearchForFacetValues:clientSearch.multipleSearchForFacetValues,getApiKey:clientSearch.getApiKey,addApiKey:clientSearch.addApiKey,listApiKeys:clientSearch.listApiKeys,updateApiKey:clientSearch.updateApiKey,deleteApiKey:clientSearch.deleteApiKey,restoreApiKey:clientSearch.restoreApiKey,assignUserID:clientSearch.assignUserID,assignUserIDs:clientSearch.assignUserIDs,getUserID:clientSearch.getUserID,searchUserIDs:clientSearch.searchUserIDs,listUserIDs:clientSearch.listUserIDs,getTopUserIDs:clientSearch.getTopUserIDs,removeUserID:clientSearch.removeUserID,hasPendingMappings:clientSearch.hasPendingMappings,generateSecuredApiKey:clientSearch.generateSecuredApiKey,getSecuredApiKeyRemainingValidity:clientSearch.getSecuredApiKeyRemainingValidity,destroy:clientCommon.destroy,clearDictionaryEntries:clientSearch.clearDictionaryEntries,deleteDictionaryEntries:clientSearch.deleteDictionaryEntries,getDictionarySettings:clientSearch.getDictionarySettings,getAppTask:clientSearch.getAppTask,replaceDictionaryEntries:clientSearch.replaceDictionaryEntries,saveDictionaryEntries:clientSearch.saveDictionaryEntries,searchDictionaryEntries:clientSearch.searchDictionaryEntries,setDictionarySettings:clientSearch.setDictionarySettings,waitAppTask:clientSearch.waitAppTask,customRequest:clientSearch.customRequest,initIndex:e=>t=>clientSearch.initIndex(e)(t,{methods:{batch:clientSearch.batch,delete:clientSearch.deleteIndex,findAnswers:clientSearch.findAnswers,getObject:clientSearch.getObject,getObjects:clientSearch.getObjects,saveObject:clientSearch.saveObject,saveObjects:clientSearch.saveObjects,search:clientSearch.search,searchForFacetValues:clientSearch.searchForFacetValues,waitTask:clientSearch.waitTask,setSettings:clientSearch.setSettings,getSettings:clientSearch.getSettings,partialUpdateObject:clientSearch.partialUpdateObject,partialUpdateObjects:clientSearch.partialUpdateObjects,deleteObject:clientSearch.deleteObject,deleteObjects:clientSearch.deleteObjects,deleteBy:clientSearch.deleteBy,clearObjects:clientSearch.clearObjects,browseObjects:clientSearch.browseObjects,getObjectPosition:clientSearch.getObjectPosition,findObject:clientSearch.findObject,exists:clientSearch.exists,saveSynonym:clientSearch.saveSynonym,saveSynonyms:clientSearch.saveSynonyms,getSynonym:clientSearch.getSynonym,searchSynonyms:clientSearch.searchSynonyms,browseSynonyms:clientSearch.browseSynonyms,deleteSynonym:clientSearch.deleteSynonym,clearSynonyms:clientSearch.clearSynonyms,replaceAllObjects:clientSearch.replaceAllObjects,replaceAllSynonyms:clientSearch.replaceAllSynonyms,searchRules:clientSearch.searchRules,getRule:clientSearch.getRule,deleteRule:clientSearch.deleteRule,saveRule:clientSearch.saveRule,saveRules:clientSearch.saveRules,replaceAllRules:clientSearch.replaceAllRules,browseRules:clientSearch.browseRules,clearRules:clientSearch.clearRules}}),initAnalytics:()=>e=>clientAnalytics.createAnalyticsClient({...i,...e,methods:{addABTest:clientAnalytics.addABTest,getABTest:clientAnalytics.getABTest,getABTests:clientAnalytics.getABTests,stopABTest:clientAnalytics.stopABTest,deleteABTest:clientAnalytics.deleteABTest}}),initPersonalization:n,initRecommendation:()=>e=>(a.logger.info("The `initRecommendation` method is deprecated. Use `initPersonalization` instead."),n()(e))}})}algoliasearch.version=clientCommon.version,module.exports=algoliasearch;