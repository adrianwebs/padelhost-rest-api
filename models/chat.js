import { gql } from "apollo-server";
import mongoose from "mongoose";
import { userSchema } from "./user.js";


const messageSchema = new mongoose.Schema({
  text: {
    type: String,
    minlength: 1,
  },
  user: {
    type: userSchema,
  },
  createdAt: {
    type: Date,
    default: Date(),
  },
});

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: false
  },
  messages: [messageSchema],
  createdAt: {
    type: Date,
    default: Date()
  },
  users: [userSchema],
  type: {
    type: String,
    enum: ['match', 'chat'],
    default: 'chat',
  },
});

const Room = mongoose.model("Room", roomSchema);

export const typeDefChats = gql`
  type Room {
    id: ID!
    name: String
    messages: [Message]
    users: [User]
    createdAt: String!
    type: String!
  }

  type Message {
    id: ID!
    text: String!
    user: User
    createdAt: String!
  }

  type Query {
    getRoom(id: ID!): Room
    getRooms: [Room!]
    getRoomsUser(id: ID!): [Room!]
  }

  type Mutation {
    createRoom(name: String!, type: String, users: [UserInput!]): Room
    deleteRoom(id: ID!): Room
    addUserToRoom(id: ID!, user: UserInput!): Room
    sendMessage(id: ID!, text: String!): Message
  }
`

export const getRoom = async (root, args) => {
  return await Room.findOne({_id: args.id})
}

export const getRooms = async (root, args) => {
  return await Room.find({})
}

export const createRoom = (root, args) => {
  const newRoom = new Room({...args})
  return newRoom.save()
}

export const deleteRoom = async (root, args) => {
  const room = await Room.findByIdAndDelete({_id: args.id})
  return room.save()
}

export const addUserToRoom = async (root, args) => {
  return await Room.findOneAndUpdate({id: args.id}, {$push: {users: args.user}})
}

export const sendMessage = async (root, args) => {
  const room = await Room.findOneAndUpdate({id: args.id}, {$push: {messages: args.message}})
  return room.save()
}

export const getRoomsUser = async (root, args) => {
  return await Room.find({users: {$elemMatch: {id: args.id}}})
}