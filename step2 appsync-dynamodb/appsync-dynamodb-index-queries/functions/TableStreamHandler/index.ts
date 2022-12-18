// import DynamoDB = require("aws-sdk/clients/dynamodb");

exports.handler = async (event: any) => {
    event.Records.forEach((record: any) => {
        // let parseRecord = recordParser(record.dynamodb.NewImage);
        console.log('Event Id: %s', record.eventID);
        console.log('Event Id: %s', record.eventName);
        console.log('DynamoDB Record: %j', record.dynamodb);
    });
};

// const recordParser = (ImageRecord: any) => {
//     return DynamoDB.Converter.unmarshall(ImageRecord)
// }