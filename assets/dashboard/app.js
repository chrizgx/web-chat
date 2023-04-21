const app = new Vue({
    el: "#app",
    data: {
        contacts: {results: []},
        otherUsername: '',
    },
    methods: {
        update: async function() {
            const response = await fetch('/api/contacts');
            if (response.ok) {
                const jsonResponse = await response.json();
                this.contacts = jsonResponse;
                console.log('updated contacts ...');
            }
        },
        addContact: async function() {
            const response = await fetch(`/api/contacts/new`, {
                method: "POST",
                body: JSON.stringify({
                    otherUsername: this.otherUsername
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                }
            });
            setTimeout(this.update, 2000);

        }
    }
});

app.update();
setInterval(app.update, 10000);