const GenerateMessage = (text) =>{
    return {
    text,
    createdAt : new Date().getTime()
}}

const generateLocation = (url) =>{
    return{
        url,
        createdAt: new Date().getTime()
    }
}

export {GenerateMessage, generateLocation}