# app
app for vote

[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/lobbycitoyen?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)



INSTALL


git clone git@github.com:lobbycitoyen/lobbycitoyen.git
cd lobbycitoyen
npm install
> can take a few minutes
cp config_default.json config.json
nano config.json
> edit file (PORT, domain, sockets, ..)


node index.js (dev)
or 
forever start index.js (production/persistence)
