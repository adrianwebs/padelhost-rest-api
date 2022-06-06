import { gql } from "apollo-server"

import mongoose from "mongoose";

export const userSchema = new mongoose.Schema ({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    minlength: 3,
  },
  description: {
    type: String,
    minlength: 15,
    maxlength: 155,
    default: "Hello there! I am new using Padelhost",
  },
  phone: {
    type: String,
    maxlength: 9,
    default: "No phone",
  },
  location: {
    type: String,
    minlength: 5,
    default: "No location"
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
  },
  password: {
    type: String,
    minlength: 5,
    default: "No password"
  },
  avatar: {
    type: String,
    default: "https://avatars.dicebear.com/api/male/john.svg"
  },
  type: {
    type: String,
    default: "Player",
  },
  category: {
    type: String,
    default: "No category"
  },
  rank: {
    type: String,
    default: "No rank"
  },
});

const User = mongoose.model("User", userSchema);

export const typeDefAuthor = gql`
  type User {
    id: ID!
    name: String!
    description: String
    phone: String
    location: String
    email: String!
    password: String
    avatar: String
    type: Type!
    category: String
    rank: Int
  }

  enum Type {
    Club
    Player
  }

  type Query {
    allUsers: [User!]
    findUser(id: ID!): User
    countUsers: Int
  }

  type Mutation {
    createUser(id: ID!, name: String!, description: String, phone: String, location: String, email: String!, password: String, avatar: String, type: Type, category: String, rank: Int): User
    deleteUser(id: ID!): User
    editUser(id: ID!, name: String, description: String, phone: String, location: String, email: String, password: String, avatar: String, type: Type, category: String, rank: Int): User
  }
`

export const createUser = (root, args) => {
  const newUser = new User({...args})
  return newUser.save()
}

export const deleteUser = (root, args) => {
  const user = User.findByIdAndDelete({_id: args.id})
  return user.save()
}

export const editUser = async (root, args) => {
  const user = await User.findOne({_id: args.id})
  user = {...user, ...args}
  return user.save()
}

export const countUsers = async () => {
  return await User.countDocuments()
}

export const allUsers = async () => {
  return await User.find({})
}

export const findUser = (root, args) => {
  return User.findOne({_id: args.id})
}
