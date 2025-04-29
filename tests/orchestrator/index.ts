import { hash } from 'bcrypt'
import { prisma } from '../../prisma/prisma-client'
import { SALT_OR_ROUNDS } from '../../src/users/services'
import { UserType } from '../../src/users/entities/User'

async function cleanUsers() {
  await prisma.user.deleteMany()
}

async function setUserAdmin() {
  const rules: UserType['rules'] = [
    'write:users',
    'write:cups',
    'delete:cups',
    'read:cups',
    'write:additional',
    'delete:additional',
  ]
  await prisma.user.create({
    data: {
      name: 'josé honorio',
      password: await hash('0000', SALT_OR_ROUNDS),
      phone: '00000000000',
      rules,
      is_admin: true,
    },
  })
}

async function setUser() {
  const rules: UserType['rules'] = []
  return await prisma.user.create({
    data: {
      name: 'josé honorio',
      password: await hash('1111', SALT_OR_ROUNDS),
      phone: '11111111111',
      rules,
    },
    select: { id: true },
  })
}

async function cleanCups() {
  await prisma.cup.deleteMany()
}

async function setCups() {
  const cups = await prisma.cup.createManyAndReturn({
    data: [
      {
        size: 300,
        price: 10,
        description: 'Tem copo',
        in_stock: true,
        quantity_additional: 3,
      },
      {
        size: 400,
        price: 20,
        description: 'Tem copo',
        in_stock: true,
        quantity_additional: 3,
      },
      {
        size: 500,
        price: 30,
        description: 'Tem copo',
        in_stock: true,
        quantity_additional: 3,
      },
      {
        size: 600,
        price: 40,
        description: 'Tem copo',
        in_stock: false,
        quantity_additional: 3,
      },
    ],
  })

  return cups
}

const setAdditional = async () => {
  return await prisma.additional.createManyAndReturn({
    data: [
      { name: 'morango', price: 2 },
      { name: 'nutella', price: 2 },
      { name: 'ovomaltine', price: 0, in_stock: false },
    ],
  })
}

const cleanAdditional = async () => {
  await prisma.additional.deleteMany()
}

const cleanAddresses = async () => {
  await prisma.address.deleteMany()
}

const setAddresses = async () => {
  return await prisma.address.createManyAndReturn({
    data: [
      {
        street: 'rua josé',
        number: 548,
        district: 'água verde',
        complement: 'perto do colégio caetano.',
        city: 'ampére',
        address_complete:
          'rua josé - 548, água verde, ampére, perto do colégio caetano.',
        shipping_price: 4,
      },
      {
        street: 'rua papa joão paulo ii',
        number: 538,
        district: 'água verde',
        complement: 'perto do colégio nereu.',
        city: 'ampére',
        address_complete:
          'rua papa joão paulo ii - 538, água verde, ampére, perto do colégio nereu.',
        shipping_price: 4,
      },
    ],
  })
}

const setAddressesWithUser = async (user_id: string) => {
  await prisma.address.createManyAndReturn({
    data: [
      {
        street: 'rua josé',
        number: 548,
        district: 'água verde',
        complement: 'perto do colégio caetano.',
        city: 'ampére',
        address_complete:
          'rua josé - 548, água verde, ampére, perto do colégio caetano.',
        shipping_price: 4,
      },
      {
        street: 'rua papa joão paulo ii',
        number: 538,
        district: 'água verde',
        complement: 'perto do colégio nereu.',
        city: 'ampére',
        address_complete:
          'rua papa joão paulo ii - 538, água verde, ampére, perto do colégio nereu.',
        shipping_price: 10,
      },
    ],
  })
  return await prisma.address.create({
    data: {
      users: { connect: { id: user_id } },
      street: 'rua vanusa',
      number: 581,
      district: 'água verde',
      complement: 'perto do colégio cecília.',
      city: 'ampére',
      address_complete:
        'rua vanusa - 581, água verde, ampére, perto do colégio cecília.',
      shipping_price: 4,
    },
    select: { address_complete: true, id: true, shipping_price: true },
  })
}
const orchestrator = {
  cleanUsers,
  setUserAdmin,
  setUser,
  cleanCups,
  setCups,
  setAdditional,
  cleanAdditional,
  cleanAddresses,
  setAddresses,
  setAddressesWithUser,
}

export default orchestrator
