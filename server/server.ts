import { Server } from 'socket.io'

const app = require('express')()
const server = require('http').createServer(app)
const io = new Server(server, {
    cors: {
	origin: "*",
    }
})
const port = 6942

export class Player {
    name: string
    socketId: string
    clicks: number
    host: boolean

    constructor(name: string, socketId: string) {
	this.name = name
	this.socketId = socketId

	this.clicks = 0
	this.host = false
    }
}

let players: Player[] = []
let gameStarted = false

const update = (): void => {
    io.emit("update", {
	players: players,
	gameStarted: gameStarted
    })
}

const getPlayer = (socketId: string): Player | undefined => {
    return players.find(p => p.socketId == socketId)
}

io.on("connect", socket => {
    console.log("New Connection")

    socket.on("disconnect", () => {
	console.log("Disconnected")
	const player = getPlayer(socket.id)

	if(player != undefined) {
	    players.splice(players.indexOf(player), 1)

	    if(player.host && players.length > 0) players[0].host = true
	}

	update()
    })

    socket.on("join", (res: {name: string}) => {
	let player = new Player(res.name, socket.id)
	if(players.length == 0) player.host = true
	players.push(player)

	console.log(`${res.name} Joined!`)

	update()
    })
})

server.listen(port, () => {
    console.log(`Server Started on Port: ${port}`)
})

