# Agility CMS Sync SDK
The Agility CMS Sync SDK provides an interface to maintain to sync, store and access content locally.

By keeping a local cache of your content, your web app can access content faster.

## Benefits
- Reduce number of REST API calls to Agility CMS
- Flexible storage options - uses **Local Filesystem** by default, but you can roll your own storage interface, such as **Gatsby GraphQL**, a **Database**, and **Browser Local Storage**



## Use Cases
1. You want to reduce the amount of REST API calls made to your Agility CMS instance.
1. You are running a **Server-Side Redendered (SSR)** web app and you want to cache your content locally, reducing latency for retrieving content.
2. You are using a **Static Site Generator (SSG)** and you don't want to have to re-source all of your content on each build.
3. You have a client-side **Single Page Application**, and want to cache content in local storage in the browser.

## How it Works
This Sync SDK uses the Sync API `getSyncPages` and `getSyncContent` found in our [Agility CMS Content Fetch JS SDK](https://agilitydocs.netlify.com/agility-content-fetch-js-sdk/) and aims to abstract some of the complexities involved in managing synced content.

It Calls the Sync API and returns content that has not yet been synced. The first call will pull everything and save it to your local store. Subsequent calls will only refresh content that has changed since the last time the Sync API was called.

This SDK:
- Calls the API
- Manages your `syncToken` for you
- Stores content in the filesystem (by default)
- Provides ability to extend and store/access content in other places

## Setup
Install `@agility/content-sync`:
```
npm install @agility/content-sync
```

## Sync to Filesystem (using Defaults)
1. Create a sync client:
    ```javascript
    import agilitySync from '@agility/constent-sync'
    const syncClient = agilitySync.getSyncClient({
        //your 'guid' from Agility CMS
        guid: 'some-guid',
        //your 'apiKey' from Agility CMS
        apiKey: 'some-api-key',
        //the language(s) of content you want to source
        languages: ['en-us'],
        //your channel(s) for the pages you want to source 
        channels: ['website']
    });
    ```

2. Run the `runSync` command to synchronize your Agility CMS content (*Content* and *Pages*) to your local filesystem
    ```javascript
    syncClient.runSync();
    ```
    `runSync()` will pull down all your *Sitemap*, *Pages*, and *Content* and store them in your local filesystem under the default path `.agility-files`.

## Sync using a Custom Store
While this SDK provides a filesystem sync interface by default, you can change this and use another one or create your own.
```javascript
import agilitySync from '@agility/constent-sync'
const syncClient = agilitySync.getSyncClient({
    //your 'guid' from Agility CMS
    guid: 'some-guid',
    //your 'apiKey' from Agility CMS
    apiKey: 'some-api-key',
    //the language(s) of content you want to source
    languages: ['en-us'],
    //your channel(s) for the pages you want to source 
    channels: ['website'],
    //your custom storage/access interface
    store: {
        //must be an absolute path to your custom interface JS module
        resolve: `${process.cwd()}/src/store-interface-console`,
        options: {}
    }
});
//start the sync process
syncClient.runSync();
```

## Accessing Content
Once content is in your sync store, you can easily access it as you need it:
```javascript
import agilitySync from '@agility/constent-sync'
const syncClient = agilitySync.getSyncClient({
    //your 'guid' from Agility CMS
    guid: 'some-guid',
    //your 'apiKey' from Agility CMS
    apiKey: 'some-api-key',
    //the language(s) of content you want to source
    languages: ['en-us'],
    //your channel(s) for the pages you want to source 
    channels: ['website']
});

//start the sync process
syncClient.runSync();

//query and retrieve your content
const contentItem = await syncClient.store.getContentItem({
    contentID: 21,
    languageCode: languageCode
})

const contentList = await syncClient.store.getContentList({
    referenceName: 'posts',
    languageCode: languageCode
})
```


## How to Create your Own Sync Store
Create a new `.js` file which exports the following methods:
```javascript
const saveItem = async ({ options, item, itemType, languageCode, itemID }) => {
    console.log(`Console Interface: saveItem has been called`);
    return null;
}

const deleteItem = async ({ options, itemType, languageCode, itemID }) => {
    console.log(`Console Interface: deleteItem has been called`);
    return null;
}

const mergeItemToList = async ({ options, item, languageCode, itemID, referenceName, definitionName }) => {
	console.log(`Console Interface: mergeItemToList has been called`);
    return null;
}

const getItem = async ({ options, itemType, languageCode, itemID }) => {
    console.log(`Console Interface: getItem has been called`)
    return null;
}

const clearItems = async ({ options }) => {
    console.log(`Console Interface: clearItem has been called`)
    return null;
}


export {
	saveItem,
	deleteItem,
	getItem,
	clearItems,
	mergeItemToList
}
```







