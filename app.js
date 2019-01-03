const pg = require('pg')

function App() {
    id = Math.random().toString(36).substring(7);
    uri = "";

    this.setURI = function(data) {
        uri = data;
    }

    this.connect = async => {
        client = new pg.Client(uri);
        await client.connect;
    }
}