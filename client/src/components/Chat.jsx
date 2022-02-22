import React, { useEffect, useRef, useState } from 'react'
import canvasState from '../store/canvasState'
import messagesState from '../store/messagesState'
import { Modal, Button, InputGroup, FormControl } from 'react-bootstrap'
import { observer } from 'mobx-react-lite'
import { autorun } from "mobx"

const Chat = () => {
    const [messages, setMessages] = useState(messagesState.messages)
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
        const message = {
            key: Date.now(),
            id: canvasState.sessionid,
            username,
            message: inputState,
            method: 'chat'
        }
        setMessages([...messages, message])
        messagesState.pushToMessages(message)

        const socket = canvasState.socket

        socket.send(JSON.stringify(message))

        

        socket.onmessage = (event) => {
            let msg = JSON.parse(event.data)
            if(msg.method === 'chat' && msg.username !== canvasState.username) {
                messagesState.pushToMessages(msg)
                setMessages([...messages, msg])
            }
        }
        setInputState('')
        
    }



    return (
        <div className="chat">
            <div className="chat-messages" ref={chatRef}>
                {messagesState.messages.map(message => (
                    <div key={message.key} className="chat-item">
                        <p className="item-message"><span className="item-author">{message.username}: </span>{message.message}</p>
                    </div>
                ))}
            </div>
            <form className="chat-input">
                <InputGroup>
                    <FormControl placeholder="Сообщение..." value={inputState} onChange={(e) => {setInputState(e.target.value)}} />
                    <Button type="submit" onClick={(e) => sendMessageHandler(e)}>
                        Отправить
                    </Button>
                </InputGroup>
            </form>
        </div>
    )
}

export default observer(Chat)