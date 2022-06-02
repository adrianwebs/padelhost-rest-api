import './db.js';

import { ApolloServer } from 'apollo-server';

import { editPitch, findAvailablePitches, getClubPitches, typeDefPitches, addPitch, pitchCount } from "./models/pitch.js"
import { allUsers, findUser, createUser, editUser, deleteUser, countUsers, typeDefAuthor } from "./models/user.js"
import { allClubs, getClub, createClub, typeDefClubs } from "./models/clubs.js"
import { allReservations, getReservationPerClub, getReservationPerPlayer, createReservation, editReservation, deleteReservation ,typeDefReservation } from "./models/reservations.js"
import { typeDefChats, getRoom, getRooms, getRoomsUser ,addUserToRoom, createRoom, deleteRoom, sendMessage } from "./models/chat.js"

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

const server = new ApolloServer({
  typeDefs: [ typeDefClubs, typeDefAuthor, typeDefReservation, typeDefPitches, typeDefChats],
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
}).catch(err => {
  console.log(err);
});
