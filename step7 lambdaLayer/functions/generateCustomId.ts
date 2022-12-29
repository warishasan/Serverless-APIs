
import {generateId} from '../lambdaLayers/apiDependencies/generateCustomId'
const myFunctions = require('/opt/generateCustomId')

const generate_id = myFunctions.generateId as typeof generateId



async function GenerateCustomId() {

const id = generate_id()
console.log('id',id)
 

return id.toString()

}

export default GenerateCustomId;