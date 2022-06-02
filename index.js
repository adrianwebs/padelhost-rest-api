import './db.js';

import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import express from 'express';
import http from 'http';

import { editPitch, findAvailablePitches, getClubPitches, typeDefPitches, addPitch, pitchCount } from "./models/pitch.js"
import { allUsers, findUser, createUser, editUser, deleteUser, countUsers, typeDefAuthor } from "./models/user.js"
import { allClubs, getClub, createClub, typeDefClubs } from "./models/clubs.js"
import { allReservations, getReservationPerClub, getReservationPerPlayer, createReservation, editReservation, deleteReservation ,typeDefReservation } from "./models/reservations.js"
import { typeDefChats, getRoom, getRooms, getRoomsUser ,addUserToRoom, createRoom, deleteRoom, sendMessage } from "./models/chat.js"

const typeDefs = [ typeDefClubs, typeDefAuthor, typeDefReservation, typeDefPitches, typeDefChats];

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
  }
}

async function startApolloServer(typeDefs, resolvers) {
  const app = express();
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();
  server.applyMiddleware({ app });
  await new Promise(resolve => httpServer.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

startApolloServer(typeDefs, resolvers)