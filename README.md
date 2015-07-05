# Real-time Node Markdown Editor

Using Node.js, Redis, ShareJS -- and Heroku as a deployment platform -- this app is a real-time Markdown editor capable of serving multiple simultaneous connections and updates, a la Google Docs.
Updates are reflected in real-time across all connections, and instantly persited in a Redis backend DB (powered in production by the 
Redis-to-go Heroku add-on).
