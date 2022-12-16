
const config = require("../config/" + process.env.Environment + "_config.json");
// const fnv = require('fnv-plus')

const { CosmosDbPartitionedStorage } = require('botbuilder-azure');
const CosmosClient = require("@azure/cosmos").CosmosClient;
const { calculateChangeHash } = require('botbuilder-core');

let _refStore;
let _refStoreList;

function getCosmosConfig() {
    return {
        cosmosDbEndpoint: config.cosmosDB.cosmosDbEndpoint,
        authKey: config.cosmosDB.authKey,
        databaseId: config.cosmosDB.databaseId,
        containerId: config.cosmosDB.referenceContainerId,
        compatibilityMode: config.cosmosDB.compatibilityMode === "false" ? false : true
    }
}

module.exports.getRefStore = function getRefStore(channelId) {
    if (channelId !== "msteams") return
    if (_refStore === undefined) {
        const cosmosDbPartitionedStorage = new CosmosDbPartitionedStorage(getCosmosConfig());
        _refStore = new ReferenceStore(cosmosDbPartitionedStorage, "msteams" /* only for msteams channel */)
    }
    return _refStore
}

module.exports.getRefStoreList = function getRefStoreList(channelId) {
    if (channelId !== "msteams") return
    if (_refStoreList === undefined) {
        // cosmos specific functionality for fetch all users
        const cosmosConfig = getCosmosConfig()
        const client = new CosmosClient({ endpoint: cosmosConfig.cosmosDbEndpoint, key: cosmosConfig.authKey });
        const database = client.database(cosmosConfig.databaseId);
        const container = database.container(cosmosConfig.containerId);

        _refStoreList = new ReferenceStoreListCosmos(container, "msteams")
    }
    return _refStoreList
}

class ReferenceStore {
    constructor(storage, channelId, namespace = "") {
        this.storage = storage
        this.channelId = channelId
        this.namespace = namespace
    }

    async getReference(userPrincipalName) {
        const key = this.getStorageKey(userPrincipalName)
        const items = await this.storage.read([key])
        const conversationReference = items[key] || {}
        return conversationReference
    }

    async setReference(userPrincipalName, conversationReference) {
        const key = this.getStorageKey(userPrincipalName)
        const item = {}
        item[key] = conversationReference
        await this.storage.write(item)
        return
    }

    async setReference(userPrincipalName, conversationReference, oldConversationReference) {
        const key = this.getStorageKey(userPrincipalName)
        if (calculateChangeHash(oldConversationReference) !== calculateChangeHash(conversationReference)) {
            const item = {}
            item[key] = conversationReference
            await this.storage.write(item)
        }
        return
    }

    async deleteReference(userPrincipalName) {
        const key = this.getStorageKey(userPrincipalName)
        return await this.storage.delete([key])
    }

    // getStorageKey(userPrincipalName) {
    //     return `${this.channelId}/conv-reference/${fnv.hash(userPrincipalName.toLowerCase(), 64).hex()}/${this.namespace}`;
    // }

    getStorageKey(userPrincipalName) {
        return `${userPrincipalName.toLowerCase()}`
    }
}

class ReferenceStoreListCosmos {
    constructor(container, channelId, namespace = "") {
        this.container = container
        this.channelId = channelId
        this.namespace = namespace
    }

    async * fetchAll() {
        const queryOptions = {
            maxItemCount: 100
        }
        const querySpec = {
            query: `SELECT c.realId, c.document from c`,
        };
        const query = this.container.items.query(querySpec, queryOptions);
        for await (const res of query.getAsyncIterator()) {
            for (const record of res?.resources) {
                yield record
            }
        }
    }

    async * fetchOne(userID) {
        const queryOptions = {
            //maxItemCount: 100,
        }
        const querySpec = {
            query: `SELECT c.realId, c.document from c where c.id = '${userID}'`
        }
        const query = this.container.items.query(querySpec, queryOptions)
        for await (const res of query.getAsyncIterator()) {
            for (const record of res?.resources) {
                console.log(record)
                yield record;
            }
        }
    }
}

module.exports.ReferenceStore = ReferenceStore;

