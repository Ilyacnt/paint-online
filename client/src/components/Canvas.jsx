import { observer } from 'mobx-react-lite'
import React, { useEffect, useRef, useState } from 'react'
import canvasState from '../store/canvasState'
import toolState from '../store/toolState'
import Brush from '../tools/Brush'
import { Modal, Button, InputGroup, FormControl } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import Rect from '../tools/Rect'
import axios from 'axios'
import Chat from './Chat'
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react"


const Canvas = observer(() => {
	const canvasRef = useRef()
	const usernameRef = useRef()
	const [showModal, setShowModal] = useState(true)
	const params = useParams()

	const { editor, onReady } = useFabricJSEditor()

	const mouseUpHandler = () => {
		console.log('Mouse up canvas');
		const data = canvasRef.current.toDataURL()
		canvasState.pushToUndo(data)
		axios.post(`http://localhost:5000/image?id=${params.id}`, { img: data })
		// .then(res => console.log(res))
	}

	const mouseMoveHandler = (e) => {
		console.log(e);
	}

	const connectionHandler = (e) => {
		e.preventDefault()
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
		toolState.setTool(new Brush(canvasRef.current))
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
					<form>
						<InputGroup>
							<FormControl placeholder="Введите ваше имя" ref={usernameRef} />
							<Button type="submit" onClick={(e) => connectionHandler(e)}>
								Войти
							</Button>
						</InputGroup>
					</form>
					<div className="instruction">
						<h1>Руководство</h1>
						<p>Данное приложение предназначено для совместного рисования и проектирования.</p>
						<p>Для входа в приложение введите своё имя. Оно будет отображатся в общем чате.</p>
						<p>В панели инструментов в верхней части экрана можно выбрать инструмент для рисования, отменить действие и сохранить изображение</p>
						<p>
							Для совместного рисования скопируйте ссылку сгенерированную в адресной строке и отправьте своим коллегам.
							Все действия на холсте будут видны в рамкох одной сессии, доступ к которой осуществляется по ссылке.
						</p>
						<p>Некотрые функции приложения могут работать некорректно, данные недоработки будут исправлены в следующих версиях приложения.</p>
					</div>
				</Modal.Body>
			</Modal>
			<canvas 
				ref={canvasRef} 
				width={900} 
				height={600} 
				onMouseUp={() => mouseUpHandler()} 
				/>
			{/* <FabricJSCanvas ref={canvasRef} onReady={onReady} /> */}
			<Chat />
		</div>
	)
})

export default Canvas