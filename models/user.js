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
    maxlength: 155
  },
  phone: {
    type: String,
    minlength: 9,
  },
  location: {
    type: String,
    minlength: 5,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
  },
  avatar: {
    type: String,
  },
  type: {
    type: String,
  },
  category: {
    type: String,
  },
  rank: {
    type: String,
  },
});

const User = mongoose.model("User", userSchema);

export const typeDefAuthor = gql`
  type User {
    id: ID!
    name: String!
    description: String
    phone: String!
    location: String!
    email: String!
    password: String!
    avatar: String!
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
    createUser(name: String!, description: String, phone: String!, location: String!, email: String!, password: String!, avatar: String!, type: Type!, category: String, rank: Int): User
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
