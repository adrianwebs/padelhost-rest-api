import { gql } from "apollo-server"
import mongoose from "mongoose"
import { userSchema } from "./user.js"
import { pitchSchema } from "./pitch.js"

const clubSchema = new mongoose.Schema({
  user: {
    type: userSchema,
    required: true
  },
  pitches: {
    type: [pitchSchema]
  }
})

const Club = mongoose.model("Club", clubSchema)

export const typeDefClubs = gql`
  type Club {
    user: User!
    pitches: [Pitch]
  }

  type Query {
    allClubs : [Club]
    getClub(id: ID!): Club
  }

  type Mutation {
    createClub(user: UserInput!, pitches: [PitchInput]): Club
  }

  input UserInput {
    id: ID!
    name: String!
    description: String
    phone: String!
    location: String!
    email: String!
    password: String!
    avatar: String!
    type: String!
    category: String
    rank: Int
  }

  input PitchInput {
    club: String!
    name: String!
    city: String!
    street: String!
    type: String!
    timezones: [TimezoneInput]
  }
`

export const allClubs = async () => {
  return await Club.find()
}

export const getClub = async (root, args) => {
  return await Club.findById(args.id)
}

export const createClub = (root, args) => {
  const newClub = new Club({...args})
  return newClub.save()
}
