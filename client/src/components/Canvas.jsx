import { observer } from 'mobx-react-lite'
import React, { useEffect, useRef, useState } from 'react'
import canvasState from '../store/canvasState'
import toolState from '../store/toolState'
import Brush from '../tools/Brush'
import { Modal, Button, InputGroup, FormControl } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import Rect from '../tools/Rect'
import axios from 'axios'


const Canvas = observer(() => {
	const canvasRef = useRef()
	const usernameRef = useRef()
	const [showModal, setShowModal] = useState(true)
	const params = useParams()

	const mouseDownHandler = () => {
		const data = canvasRef.current.toDataURL()
		canvasState.pushToUndo(data)
		axios.post(`http://localhost:5000/image?id=${params.id}`, { img: data })
		// .then(res => console.log(res))
	}

	const connectionHandler = () => {
		canvasState.setUsername(usernameRef.current.value)
		setShowModal(false)
	}

	const drawHandler = (msg) => {
		const figure = msg.figure
		const ctx = canvasRef.current.getContext('2d')
		switch (figure.type) {
			case 'brush':
				Brush.draw(ctx, figure.x, figure.y)
				break;
			case 'rect':
				Rect.staticDraw(ctx, figure.x, figure.y, figure.width, figure.height, figure.color)
				break;
			case 'finish':
				ctx.beginPath()
				break;

			default:
				break;
		}
	}


	useEffect(() => {
		canvasState.setCanvas(canvasRef.current)
		// toolState.setTool(new Brush(canvasRef.current))
		let ctx = canvasRef.current.getContext('2d')
		axios.get(`http://localhost:5000/image?id=${params.id}`)
			.then(res => {
				const img = new Image()
				img.src = res.data
				img.onload = () => {
					console.log(this);
					ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
                    ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height)
				}
			})
	}, [])


	useEffect(() => {
		if (canvasState.username) {
			const socket = new WebSocket('ws://localhost:5000/')
			canvasState.setSocket(socket)
			canvasState.setSessionid(params.id)
			toolState.setTool(new Brush(canvasRef.current, socket, params.id))
			socket.onopen = () => {
				socket.send(JSON.stringify({
					id: params.id,
					username: canvasState.username,
					method: 'connection'
				}))
			}
			socket.onmessage = (event) => {
				let msg = JSON.parse(event.data)
				switch (msg.method) {
					case 'connection':
						console.log(`Пользователь ${msg.username} подключен`)
						break;
					case 'draw':
						drawHandler(msg)
						break;

					default:
						break;
				}
			}
		}
	}, [canvasState.username])

	return (
		<div className="canvas">
			<Modal show={showModal} onHide={() => { }}>
				<Modal.Body>
					<InputGroup>
						<FormControl placeholder="Введите ваше имя" ref={usernameRef} />
						<Button onClick={() => connectionHandler()}>
							Войти
						</Button>
					</InputGroup>
				</Modal.Body>
			</Modal>
			<canvas ref={canvasRef} width={900} height={600} onMouseDown={() => mouseDownHandler()} />
		</div>
	)
})

export default Canvas