import { gql } from "apollo-server"
import mongoose from "mongoose"
import { pitchSchema } from "./pitch.js"
import { userSchema } from "./user.js"

const ReservationSchema = new mongoose.Schema({
  pitch: {
    type: pitchSchema,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  timestart: {
    type: String,
    required: true
  },
  timeend: {
    type: String,
    required: true
  },
  teams: {
    type: [{
      firstPlayer: {
        type: userSchema,
        required: true
      },
      secondPlayer: {
        type: userSchema
      }
    }],
    required: true
  }
})

const Reservation = mongoose.model("Reservation", ReservationSchema)

export const typeDefReservation = gql`
  type Reservation {
    id: ID!
    price: String!
    timestart: String!
    timeend: String!
    teams: [Team!]
    status: String!
    pitch: Pitch!
  }

  type Team {
    firstPlayer: User!
    secondPlayer: User
  }

  type Query {
    allReservations: [Reservation!]
    getReservationPerClub(club: String!): [Reservation!]
    getReservationPerPlayer(club: String!): [Reservation]
  }

  type Mutation {
    createReservation(
      price: String!
      timestart: String!
      timeend: String!
      teams: [TeamInput!]
      status: String!
      pitch: PitchInput!
    ): Reservation!
    editReservation(
      id: ID!
      price: String
      timestart: String
      timeend: String
      teams: [TeamInput]
      status: String
      pitch: PitchInput
    ): Reservation!
    deleteReservation(id: ID!): Reservation!
  }

  input TeamInput {
    firstPlayer: UserInput!
    secondPlayer: UserInput
  }

`

export const getReservationPerClub = async (root, args) => {
  return await Reservation.find({ "pitch.club": args.club })
}

export const getReservationPerPlayer = async (root, args) => {
  //Filtro del pistas por club
  return await Reservation.find({})
  // reservations.filter(book => book.teams.map((team) => {
  //   if (team.firstPlayer.id === args.id || team.secondPlayer.id === args.id) {
  //     return book
  //   }
  // }))
}

export const allReservations = async () => {
  return await Reservation.find({})
}

export const createReservation = (root, args) => {
  const newReservation = new Reservation({ ...args })
  return newReservation.save()
}

export const editReservation = (root, args) => {
  const reservation = Reservation.findOne({ id: args.id })
  reservation = { ...reservation, ...args }
  return reservation.save()
}

export const deleteReservation = (root, args) => {
  const reservation = Reservation.findByIdAndDelete({id: args.id})
  return reservation.save()
}