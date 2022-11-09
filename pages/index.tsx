import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { io, Socket } from 'socket.io-client'
import { Player } from '../server/server'

export default function Home() {
    return (
	<div className={styles.container}>
	    <Head>
		<title>Click</title>
	    </Head>

	    <h1>Click</h1>

	    <button onClick={() => {
		let name = window.prompt("Name: ")
		while(typeof name != 'string' || name.length < 1)
		    name = window.prompt("Name: ")

		const socket = io("http://localhost:6942")

		alert(name)

		socket.emit("join", {
		    name: name
		})

	    }}>Join</button>
	</div>
    )
}
