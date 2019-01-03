module.exports = function () {
    const { Client } = require('pg');
    
    const client = new Client({
        user: process.env.PGUSER,
        host: process.env.HOST,
        database: process.env.DATABASE,
        password: process.env.PGPASSWORD,
    });
    
    this.connectToDatabase = function() {
        console.log("Attempting connection.");
        client.connect(function (error) { 
            console.error(error);            
            return;
        });
    }
    
    this.killConnection = function() {
        client.end();   
        console.log("Closing connection."); 
    }
    
    this.querydb = function(str) {   
        return new Promise(function(resolve, rej) {
            client.query(str, (err, res) => {
                if (err) {
                    console.error(err.stack);
                    resolve(undefined);
                } else {
                    resolve(res.rows[0]);
                }
            })
        });
    } 

    this.createNewApp = function(uri, table) {
        let appid = Math.random().toString(36).substring(7);        
        this.querydb('INSERT INTO public.db (appid, url, tablename) VALUES (\'' + appid + '\',\'' + uri + '\',\'' + table + '\')')
            .then(res => {
                return res;
            })
            .catch(err => {
                console.error(err);
            })
    }
    
    this.getURIById = function(appid, table) {
        return this.querydb('SELECT url FROM ' + table + ' WHERE appid = \'' + appid + '\'');
    }

    this.getURI = function(uri, table) {
        return this.querydb('SELECT url FROM ' + table + ' WHERE url = \'' + uri + '\'');
    }

    this.getAppId = function(uri, table) {
        return this.querydb('SELECT appid FROM ' + table + ' WHERE url = \'' + uri + '\'')
    }
}