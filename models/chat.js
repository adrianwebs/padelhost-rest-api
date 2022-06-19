import { gql } from "apollo-server";
import { PubSub } from "graphql-subscriptions";
import mongoose from "mongoose";
import { SUBSCRIPTION_EVENTS } from "../index.js";
import { userSchema } from "./user.js";

const pubsub = new PubSub()

const messageSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    minlength: 1,
  },
  user: {
    type: userSchema,
  },
  createdAt: {
    type: String,
    default: Date.now().toString(),
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
  id: {
    type: String,
    required: true,
  }
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

  input UserMessage {
    id: ID
    name: String
    email: String
    avatar: String
  }

  input MessageInput {
    id: ID!
    text: String!
    user: UserMessage
    createdAt: String
  }

  type Query {
    getRoom(id: ID!): Room
    getRooms: [Room!]
    getRoomsUser(id: ID!): [Room!]
  }

  type Mutation {
    createRoom(id: ID!, name: String!, type: String, users: [UserInput!]): Room
    deleteRoom(id: ID!): Room
    addUserToRoom(id: ID!, user: UserInput!): Room
    sendMessage(id: ID!, message: MessageInput!): Room
  }

  type Subscription {
    messageAdded: [Room]
  }
`

export const getRoom = async (root, args) => {
  return await Room.findOne({id: args.id})
}

export const getRooms = async (root, args) => {
  return await Room.find({})
}

export const createRoom = (root, args) => {
  const newRoom = new Room({...args})
  return newRoom.save()
}

export const deleteRoom = async (root, args) => {
  const room = await Room.findOneAndDelete({id: args.id}, {returnDocument: 'after'})
  return room.save()
}

export const addUserToRoom = async (root, args) => {
  return await Room.findOneAndUpdate({id: args.id}, {$push: {users: args.user}}, {returnDocument: 'after'})
}

export const sendMessage = async (root, args) => {
  const room = await Room.findOneAndUpdate({id: args.id}, {$push: {messages: args.message}}, {returnDocument: 'after'})
  pubsub.publish(SUBSCRIPTION_EVENTS.MESSAGE_ADDED, {messageAdded: await Room.find({users: {$elemMatch: {id: args.message.user.id}}})})
  return room
}

export const getRoomsUser = async (root, args) => {
  return await Room.find({users: {$elemMatch: {id: args.id}}})
}

export const messageAdded = () => {
  return pubsub.asyncIterator(SUBSCRIPTION_EVENTS.MESSAGE_ADDED)
} 