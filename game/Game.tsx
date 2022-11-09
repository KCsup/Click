import {useEffect, useState} from 'react'
import { Socket } from 'socket.io-client'
import { Player } from '../server/server'
import styles from '../styles/Game.module.css'

const Game = ({socket}: {socket: Socket}) => {

    const [players, setPlayers] = useState<Player[]>([])
    const [gameStarted, setGameStarted] = useState(false)
    const [gameOver, setGameOver] = useState(false)

    const [countdown, setCountdown] = useState(20)
    const [countTimer, setCountTimer] = useState<() => void>()

    useEffect(() => {
	if(countTimer != undefined) countTimer()
    })

    const isSelf = (player: Player) => {
	return player.socketId == socket.id
    }

    const getSelf = () => {
	return players.find(p => isSelf(p))
    }

    const getLeaderboard = () => {
	let leaderboard = [...players]
	leaderboard.splice(leaderboard.indexOf(leaderboard.find(p => p.host)!), 1)
	leaderboard.sort((p1, p2) => { return p2.clicks - p1.clicks })
	return leaderboard
    }

    socket.on("update", (res: {
	players: Player[],
	gameStarted: boolean,
	gameOver: boolean
    }) => {
	setPlayers(res.players)
	setGameStarted(res.gameStarted)
	setGameOver(res.gameOver)
    })

    socket.on("noJoin", () => {
	alert("Someone in this game already has that username.")
	window.close()
    })

    return (
    	<div className={styles.container}>
	    {gameStarted ? (
		<>
		    {!gameOver ? (
			<>

			    {getSelf()?.host ? (
				<>
			    
				    <h1>Time Left: {countdown}</h1>
				    <h1>Scores</h1>
				    <ol>
					{getLeaderboard().map((p) => {
					    return <li key={p.name}><h2>{`${p.name}: ${p.clicks}`}</h2></li>
					})}
				    </ol>
				</>
			    ) : (
				<>
				    <button className={styles.button} onClick={() => {
					socket.emit("click")
				    }}>Click!</button>
				</>
			    )}
			</>
		    ) : (
			<>
			    <h1>Results:</h1>
			    <ol>
				{getLeaderboard().slice(0, 3).map((p) => {
				    return <li key={p.name}><h2>{`${p.name}: ${p.clicks}`}</h2></li>
				})}
			    </ol>
			</>
		    )}
		</>
	    ) : (
		<>
		    <h1>Players</h1>
		    <ul>
			{players.map(p => {
			    let nameString = p.name
			    if(isSelf(p)) nameString += " (That's You!)"
			    if(p.host) nameString += " [HOST]"

			    return <li key={p.name}><h2>{nameString}</h2></li>
			})}
		    </ul>

		    {getSelf()?.host && players.length > 1 ? (
			<>
			    <button onClick={() => {
				socket.emit("startGame")

				setCountTimer(() => {
				    let newCountdown = countdown
				    let interval = setInterval(() => {
					if(newCountdown > 0) {
					    newCountdown -= 1
					    setCountdown(newCountdown)
					}
					else {
					    clearInterval(interval)
					    socket.emit("gameOver")
					}
				    }, 1000)
				})
			    }}>Start Game</button>
			</>
		    ) : null}
		</>
	    )}
	</div>
    )
}

export default Game
