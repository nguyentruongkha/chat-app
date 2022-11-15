const users = []



const addUser = ({ id, username, room }) => {
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    if (!username || !room) {
        return {
            error: 'Username and room are required!'
        }
    }

    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    if (existingUser) {
        return {
            error: 'Username is in use!'
        }
    }

    const user = { id, username, room }
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

addUser({
    id: 19,
    username: 'Luffy',
    room: 'East Blue'
})

addUser({
    id: 21,
    username: 'Zoro',
    room: 'East Blue'
})

addUser({
    id: 21,
    username: 'Sanji',
    room: 'North Blue'
})

const getUserInRoom = (room) =>{
    room = room.trim().toLowerCase()
    return users.filter((user) => user.room === room)
}

const getUser = (id) =>{ return users.find((user) => user.id === id) }

const user = getUser(21)

const userList = getUserInRoom('East Blue')

console.log(userList);

export {
    addUser,
    removeUser,
    getUser,
    getUserInRoom
}