# Real-time Node Markdown Editor

[![Greenkeeper badge](https://badges.greenkeeper.io/BrianSipple/Node-Markdown-Editor.svg)](https://greenkeeper.io/)

Using Node.js, Redis, ShareJS -- and Heroku as a deployment platform -- this app is a real-time Markdown editor capable of serving multiple simultaneous connections and updates, a la Google Docs.
Updates are reflected in real-time across all connections, and instantly persited in a Redis backend DB (powered in production by the 
Redis-to-go Heroku add-on).
