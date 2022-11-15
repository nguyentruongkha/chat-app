const socket = io() 



const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $meassge = document.querySelector('#message')
const $meassgeLocation = document.querySelector('#location-message-template').innerHTML

const $meassgeTemplate = document.querySelector('#message-template').innerHTML

const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true})

socket.on('message', (message)=>{
    console.log(message);
    let m = message
    if(message.text){
        m = message.text
    }

    const html = Mustache.render($meassgeTemplate,{
        message: m,
        CreatedAt: moment(message.CreatedAt).format('h:mm a')
    })

    $meassge.insertAdjacentHTML('beforeend', html)
})

socket.on('sendPosition',(message)=>{
    
    const html = Mustache.render($meassgeLocation,{
        url: message.url,
        CreatedAt: moment(message.CreatedAt).format('h:mm a')
    })
    $meassge.insertAdjacentHTML('beforeend', html)
})

$messageForm.addEventListener('submit', (e)=>{
    e.preventDefault()
    $messageFormButton.setAttribute('disabled', 'disabled')

    const message = e.target.elements.message.value
    console.log(message);

    socket.emit('sendMessage', message,(error)=>{
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        if(error){
            return console.log(error);
        }
        console.log('Message is delivered');
    })
})

document.querySelector('#send-location').addEventListener('click', ()=>{
    if(!navigator.geolocation){
        return alert('Not allow to know location')
    }

    navigator.geolocation.getCurrentPosition((position)=>{

        socket.emit('sendLocation',{
            lat: position.coords.latitude,
            lon: position.coords.longitude
        }, ()=>{
            console.log('location shared');
        })

    })
    
})

socket.emit('join', {username, room}, (error)=>{
    if(error){
        alert(error)
        location.href = '/'
    }
})
