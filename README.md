# Based on react-webpack-babel

Server part: [https://github.com/DanielSitarz/socket-chat-server]

Run with `npm run dev` for development, `npm run build` for production and `npm test` for tests and standardjs code style check.
After setting up, chat is avaible on `/chat/room/:roomName`

# Features
1. Rooms are based on address param. You just change it to anything and you are in this room with everyone with the same link.
2. There is notification when someone else in the room is typing.
3. Messages are grouped by their senders, just like in the Facebook Messanger.
4. You can send links, youtube videos and images including gifs.
5. There is also notification about new message showing up in the title of the page.
6. Chat should work both on PC and mobile.
7. User names are random generated from arrays with adjectives and nouns. (it's fun, e.g. Depressed Snake or Dysfunctional Pancake)
8. Messages are stored in localStorage so they doesn't dissapear after you leave and you can just delete them to be more private.
9. It just works like a chat.

# Why?
I'm learning React which looks for me just awesome!

# What's in it?
1. [React](https://github.com/facebook/react) - for all those fancy renders methods and the components.
2. [Redux](https://github.com/reactjs/redux/) - for its little store.
3. [Babel](https://github.com/babel/babel) - for compiling new js to old js.
4. [Webpack](https://github.com/webpack/webpack) - for packing all this stuff.
5. [Immutable.js](https://github.com/facebook/immutable-js/) - for nice immutable collections, because React likes them so I do.
6. [Socket.io](https://github.com/socketio/socket.io) - for communication in 'real time'.
7. [SASS](https://github.com/sass/sass) - for not that boring CSS.
8. [Jest](https://github.com/facebook/jest) - for tests.
9. [Standard](https://github.com/feross/standard) - for JS standard style

# TODO
1. Multiline input.
2. Messages lazy loading.
3. Changing nickname.
4. Changing room without editing page address.
5. Scroll down when a lot of messages with images.
6. Enter should send message...
7. More tests, more!
8. Hold send button to send bigger message (like in Messenger with emotes, already have 'power' property associated with message)
9. Better notifications system (support multiple notifications, e.g. new message and count of new messages)