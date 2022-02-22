import { makeAutoObservable } from "mobx";

class MessagesState {
    messages = []
    constructor() {
        makeAutoObservable(this)
    }

    pushToMessages(message) {
        this.messages.push(message)
    }
}

export default new MessagesState()