import { AppSyncResolverEvent,AppSyncAuthorizerEvent,AppSyncAuthorizerResult } from 'aws-lambda';


exports.handler =  async(event:AppSyncAuthorizerEvent):Promise<AppSyncAuthorizerResult<any>> => {
    console.log(`event >`, JSON.stringify(event, null, 2))
    const {
        authorizationToken,
    } = event

    const response:AppSyncAuthorizerResult<any> = {
        isAuthorized: authorizationToken === 'custom-authorized',
        resolverContext: {
            userid: 'test-user-id',
        },
        deniedFields:[],
        ttlOverride:1
        
    }
    console.log(`response >`, JSON.stringify(response, null, 2))
    return response
}

