const app = new Vue({
    el: "#app",
    data: {
        myId: 0,
        userId: 0,
        chatId: 0,
        userInfo: {},
        chat: {messages: []},
        newMessage: '',
        updating: true,
    },
    computed: {
        lastMessage: function() {
            if (this.chat.messages.length) {
                return this.chat.messages[0].message;
            }
            return '!!null';
        }
    },
    methods: {
        setup: async function() {
            const urlParams = new URLSearchParams(window.location.search);
            this.userId = urlParams.get('user');
            this.chatId = urlParams.get('id');
            const getUserId = await fetch('/api/id');
            const getUserIdJson = await getUserId.json();
            this.myId = getUserIdJson.id;
            const getUserInfo = await fetch(`/api/chat/userinfo/${this.userId}`);
            const getUserInfoJson = await getUserInfo.json();
            this.userInfo = getUserInfoJson;
            this.update();
        },
        update: async function() {
            const response = await fetch(`/api/chat/${this.chatId}`, {
                method: "POST",
                body: JSON.stringify({
                    lastMessage: this.lastMessage
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8'
                }
            });
            if (response.ok) {
                const jsonResponse = await response.json();
                this.chat = jsonResponse;
                console.log('updated contacts ...');
            } else {
                console.log(response.status);
            }
            if (this.updating) {
                return setTimeout(this.update, 1000);
            }
        },
        sendMessage: async function() {
            if (this.newMessage === '') {
                return;
            }
            const message = this.newMessage;
            this.newMessage = '';
            console.log(message);
            // this.chat.messages.unshift({message, id: this.myId});
            const response = await fetch(`/api/chat/${this.chatId}/new`, {
                method: "POST",
                body: JSON.stringify({
                    message: message
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8'
                }
            });
            this.update;
        },
        back: async function() {
            window.location.href = window.location.hostname;
        }
    }
});

app.setup();

// app.chat = {
//     messages: [
//         {message: "goodnight bro", id: 0},
//         {message: "Chiao Chris", id: 1},
//         {message: "I gotta go now...", id: 1},
//         {message: "That's it", id: 0}
//     ]
// }

document.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        app.sendMessage();
    }
})