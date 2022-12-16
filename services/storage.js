const config = require("../config/" + process.env.Environment + "_config.json")
const azure = require('azure-storage');
const { base64ToAscii } = require('../utilities').base64ToAscii;

function getAzureTableService() {
    return azure.createTableService(config.storage.accountName, config.storage.apiKey)
}

/**
 * Promisify Azure Table queryEntities
 * @param {*} tableService Azure Table Service
 * @param  {...any} args 
 * @returns Promise
 */
async function queryEntities(tableService, ...args) {
    return new Promise((resolve, reject) => {
        let promiseHandling = (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        };
        args.push(promiseHandling);
        tableService.queryEntities.apply(tableService, args);
    });
};

async function insertOrMergeEntity(tableService, ...args) {
    return new Promise((resolve, reject) => {
        let promiseHandling = (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        };
        args.push(promiseHandling);
        tableService.insertOrMergeEntity.apply(tableService, args);
    });
};

module.exports = {
    getAzureTableService: getAzureTableService,
    queryEntities: queryEntities,
    insertOrMergeEntity:insertOrMergeEntity
}