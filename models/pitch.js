import { gql } from "apollo-server"
import mongoose from "mongoose"

const timezoneSchema = new mongoose.Schema({
  price: {
    type: Number,
    required: true,
  },
  timestart: {
    type: String,
    required: true,
  },
  timeend: {
    type: String,
    required: true,
  }
})

export const pitchSchema = new mongoose.Schema({
  club: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  street: {
    type: String,
  },
  type: {
    type: String,
    required: true,
  },
  timezones: {
    type: [timezoneSchema],
    required: true,
  }
})

const Pitch = mongoose.model("Pitch", pitchSchema);

export const typeDefPitches = gql`
  type Pitch {
    club: String!
    name: String!
    city: String
    street: String
    type: String!
    timezones: [Timezone]
  }

  type Timezone {
    timestart: String!
    timeend: String!
    price: String!
  }

  input TimezoneInput {
    timestart: String
    timeend: String
    price: String
  }

  type Query {
    pitchCount: Int!
    findAvailablePitches(
      city: String!
      type: String!
      timestart: String!
      timeend: String!
    ): Pitch
    getClubPitches(id: ID!): [Pitch]
  }

  type Mutation {
    editPitch(
      id: ID!
      name: String
      timezones: [TimezoneInput]
    ): Pitch
    addPitch(
      club: String!
      name: String!
      city: String
      street: String
      type: String!
      timezones: [TimezoneInput]
    ): Pitch
  }
`

export const pitchCount = async () => {
  return await Pitch.countdocuments({})
}
export const findAvailablePitches = async (root, args) => {
  //Falta filtro por pista disponible
  return await Pitch.find({})
}

export const getClubPitches = async (root, args) => {
  //Falta filtro por pistas del club
  return await Pitch.find({})
}

export const editPitch = (root, args) => {
  const pitch = Pitch.findOne({id: args.id})
  pitch = { ...pitch, ...args }
  return pitch.save()
}

export const addPitch = async (root, args) => {
  const pitch = await new Pitch({...args})
  return pitch.save()
}