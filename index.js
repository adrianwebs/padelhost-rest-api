import './db.js';

import { ApolloServer } from 'apollo-server-express';
import { makeExecutableSchema } from '@graphql-tools/schema';
import express from 'express';
import { editPitch, findAvailablePitches, getClubPitches, typeDefPitches, addPitch, pitchCount } from "./models/pitch.js"
import { allUsers, findUser, createUser, editUser, deleteUser, countUsers, typeDefAuthor } from "./models/user.js"
import { allClubs, getClub, createClub, typeDefClubs } from "./models/clubs.js"
import { allReservations, getReservationPerClub, getReservationPerPlayer, createReservation, editReservation, deleteReservation ,typeDefReservation } from "./models/reservations.js"
import { typeDefChats, getRoom, getRooms, getRoomsUser ,addUserToRoom, createRoom, deleteRoom, sendMessage, messageAdded } from "./models/chat.js"
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { useServer } from 'graphql-ws/lib/use/ws'

export const SUBSCRIPTION_EVENTS = {
  MESSAGE_ADDED: 'messageAdded',
}

const resolvers = {
  Query: {
    getRoom,
    getRooms,
    getRoomsUser,
    pitchCount,
    findAvailablePitches,
    getClubPitches,
    allClubs,
    getClub,
    allReservations,
    getReservationPerClub,
    getReservationPerPlayer,
    allUsers,
    countUsers,
    findUser,
  },
  Mutation: {
    createRoom,
    deleteRoom,
    addUserToRoom,
    sendMessage,
    createClub,
    editPitch,
    addPitch,
    createReservation,
    editReservation,
    deleteReservation,
    createUser,
    deleteUser,
    editUser,
  },
  Subscription: {
    messageAdded: {
      subscribe: () => messageAdded(),
    }
  }
} 

const schema = makeExecutableSchema({
  typeDefs: [ typeDefClubs, typeDefAuthor, typeDefReservation, typeDefPitches, typeDefChats],
  resolvers,
})

const app = new express()
const httpServer = new createServer(app)

const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql'
})

const serverCleanup = useServer({ schema }, wsServer)

const server = new ApolloServer({
  schema,
  playground: true,
  csrfPrevention: true,
  cache: 'bounded',
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),

    {
      async serverwillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose()
          },
        }
      },
    }
  ]
});

await server.start()
server.applyMiddleware({ app })

httpServer.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`)
})
