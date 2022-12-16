const util = require('util');
const azure = require('azure-storage');

class AzureStorageTable {
    #queryEntities;
    #createTableIfNotExists;
    #insertEntity;
    constructor(storageAccountOrConnectionString, storageAccessKey, host = false) {
        let args = [
            storageAccountOrConnectionString,
            storageAccessKey
        ]
        if (host !== false) {
            args.push(host)
        }
        this.tableService = azure.createTableService.apply(azure, args)
        
        // promisify required functions
        this.queryEntities = util.promisify(this.tableService.queryEntities).bind(this.tableService)
        this.createTableIfNotExists = util.promisify(this.tableService.createTableIfNotExists).bind(this.tableService)
        this.insertEntity = util.promisify(this.tableService.insertEntity).bind(this.tableService)
        this.insertOrMergeEntity = util.promisify(this.tableService.insertOrMergeEntity).bind(this.tableService)
        this.deleteEntity = util.promisify(this.tableService.deleteEntity).bind(this.tableService)
    }
}

module.exports = {
    AzureStorageTable
}