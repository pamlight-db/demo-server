import { settings } from './env-config';
import { PamlightAdmin, PamlightDBWriteTypes } from '@pamlight/admin';
import { ServerResponse } from 'http';

// setup Pamlight admin SDK
const pamlightAdmin = new PamlightAdmin(settings.pamlight);

pamlightAdmin.reads.route({
    routeId: 'getDocsList',
    collection: 'demoDocs',
    isSingleDocument: false
});

pamlightAdmin.writes.route({
    routeId: 'createNewDoc',
    collection: 'demoDocs',
    writeType: PamlightDBWriteTypes.CREATE_DOCUMENT,
    docFn: async (payload = {}) => {
        return {
            payload: {
                name: payload.name || '',
                message: payload.message || '',
                date: new Date()
            }
        };
    }
});

pamlightAdmin.start().then(() => {
    console.log('Connected');
}).catch(e => {
    console.log(e);
});

const Server = require('http').createServer((_req: any, res: ServerResponse) => {
    console.log('Req received');

    res.end('(function() {console.log("Backend response")})()');
});

Server.listen(settings.port, () => {
    console.log(`Pamlight demo server listening on port ${settings.port} in ${settings.env} environment`);
});
