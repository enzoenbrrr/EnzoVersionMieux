let i = 0;
async function getKickStatement() {
    i++;
    return fetch('https://kick.com/api/v2/channels/jeanpormanove/livestream', { method: "GET" })
        .then(response => response.json())
        .then(data => {
            let live;
            if (data['data'] != null) {
                let date = new Date();
                let now = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`.split(':').map(Number);
                let start = `${parseInt(data['data']['created_at'].slice(data['data']['created_at'].indexOf('T') + 1, data['data']['created_at'].indexOf(':'))) + 2}${data['data']['created_at'].slice(data['data']['created_at'].indexOf('T') + 3, data['data']['created_at'].indexOf('.'))}`.split(':').map(Number);
                let time_elapsed = [(24 + now[0] - start[0]) % 24 - Math.floor((60 - now[1] + start[1]) / 60), (60 + now[1] - start[1]) % 60 - Math.floor((60 - now[2] + start[2]) / 60), (60 + now[2] - start[2]) % 60];
                live = {
                    'title': data['data']['session_title'],
                    'thumbnail': data['data']['thumbnail']['src'],
                    'start': [String(start[0]).padStart(2, '0'), String(start[1]).padStart(2, '0'), String(start[2]).padStart(2, '0')].join(':'),
                    'time_elapsed': [String(time_elapsed[0]).padStart(2, '0'), String(time_elapsed[1]).padStart(2, '0'), String(time_elapsed[2]).padStart(2, '0')].join(':'),
                    'viewers': data['data']['viewers'],
                    'test': i
                };
            } else {
                live = {
                    'state': null,
                    'test': i
                };
            }
            return live;
        })
        .catch(error => getKickStatement());
}
getKickStatement();
