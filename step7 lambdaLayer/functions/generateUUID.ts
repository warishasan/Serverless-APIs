import { v4 as uuidv4 } from 'uuid';


async function generateUUID() {

const id = uuidv4()
console.log('id',id)
 

return id

}

export default generateUUID;