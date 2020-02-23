import { logInfo, logSuccess } from '../util'


export default async function () {

    const languageCodes = this.config.languages;
    const channels = this.config.channels;
    const syncStorageInterface = this.syncStorageInterface;

	for (const languageCode of languageCodes) {

		logSuccess(`Starting Sync for ${languageCode}`);
		let syncState = await syncStorageInterface.getSyncState(languageCode);

		if (!syncState) syncState = { itemToken: 0, pageToken: 0 };

		const newItemToken = await this.syncContent(languageCode, syncState.itemToken);
		const newPageToken = await this.syncPages(languageCode, syncState.pageToken);

		if (newItemToken != syncState.itemToken
			|| newPageToken != syncState.pageToken) {
			//if we sync ANYTHING - pull the new sitemap down
			

			for (const channelName of channels) {
				const sitemap = await this.agilityClient.getSitemapFlat({ channelName, languageCode });
                syncStorageInterface.saveSitemap({ sitemap, languageCode, channelName });
                logInfo(`Updated Sitemap channels: ${channelName}`);
			}

			
		}

		syncState.itemToken = newItemToken;
		syncState.pageToken = newPageToken;

		await syncStorageInterface.saveSyncState({ syncState, languageCode });

		logSuccess(`Completed Sync for ${languageCode}`);

	}

}