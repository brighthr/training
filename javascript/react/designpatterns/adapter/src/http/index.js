import axios from 'axios';


const get = (url) => {
    const config = {
        method: 'GET',
        url,
        headers: {
            'X-RapidAPI-Host': 'omgvamp-hearthstone-v1.p.rapidapi.com',
            'X-RapidAPI-Key': '903a97b45fmshfc4bb309cd17b2cp16f23bjsn89247a334f3b'
          }
    }
    return axios.request(config).then((response) => {
        console.log(response)
        return new Promise((resolve) => resolve({
            success: true, 
            response,
            error: false
        }))
    }
    ).catch((error) => {
        console.log(error)
        return  Promise.resolve({
            success: false,
            error
        })
    })
}

export { get }