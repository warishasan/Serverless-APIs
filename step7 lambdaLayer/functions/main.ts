
import { AppSyncResolverEvent } from 'aws-lambda';
import GenerateUUID from './generateUUID'
import GenerateCustomId from './generateCustomId'

exports.handler = async (event:AppSyncResolverEvent<any>) => {
    switch (event.info.fieldName) {

        case "generateUUID":
            return  await GenerateUUID();
        case "generateCustomId":
            return await GenerateCustomId();
  
        default:
            return null;
    }
}