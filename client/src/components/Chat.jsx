import React, { useEffect, useRef, useState } from 'react'
import canvasState from '../store/canvasState'
import { Modal, Button, InputGroup, FormControl } from 'react-bootstrap'

const Chat = () => {
    const [messages, setMessages] = useState([
        { id: '1', author: 'Ilya', message: 'Допустим тут есть много осмысленного текста много много мнго' }, 
        { id: '2', author: 'Nick', message: 'Some mock' },
    ])
    const [inputState, setInputState] = useState('')
    const chatRef = useRef()


    useEffect(() => {
        chatRef.current.scrollTop = chatRef.current.scrollHeight
    }, [messages])
    


    const sendMessageHandler = (e) => {
        e.preventDefault()
        if (!inputState) {
           return 
        }
        const username = canvasState.username
        setMessages([...messages, {
            id: Date.now(),
            author: username,
            message: inputState
        }])
        setInputState('')
        
    }



    return (
        <div className="chat">
            <div className="chat-messages" ref={chatRef}>
                {messages.map(message => (
                    <div key={message.id} className="chat-item">
                        <p className="item-message"><span className="item-author">{message.author}: </span>{message.message}</p>
                    </div>
                ))}
            </div>
            <form className="chat-input">
                <InputGroup>
                    <FormControl placeholder="Напишите сообщение" value={inputState} onChange={(e) => {setInputState(e.target.value)}} />
                    <Button type="submit" onClick={(e) => sendMessageHandler(e)}>
                        Отправить
                    </Button>
                </InputGroup>
            </form>
        </div>
    )
}

export default Chat