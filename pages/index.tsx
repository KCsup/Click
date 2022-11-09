import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { io, Socket } from 'socket.io-client'
import {useState} from 'react'
import Game from '../game/Game'

export default function Home() {

    const [gameScreen, setGameScreen] = useState(false)
    const [socket, setSocket] = useState<Socket>()

    return !gameScreen ? (
	<div className={styles.container}>
	    <Head>
		<title>Click</title>
	    </Head>

	    <h1>Click</h1>

	    <button className={styles.button} onClick={() => {
		let name = window.prompt("Name: ")
		while(typeof name != 'string' || name.length < 1)
		    name = window.prompt("Name: ")

		const s = io("http://192.168.0.28:6942")

		alert(name)

		s.emit("join", {
		    name: name
		})

		setSocket(s)
		setGameScreen(true)

	    }}>Join</button>
	</div>
    ) : <Game socket={socket!} />
}
