import { hash } from 'bcrypt'
import { prisma } from '../../prisma/prisma-client'
import { SALT_OR_ROUNDS } from '../../src/users/services'
import { UserType } from '../../src/users/entities/User'
import { fakerPT_BR as faker } from '@faker-js/faker'

async function cleanUsers() {
  await prisma.user.deleteMany()
}

async function setUserAdmin() {
  const rules: UserType['rules'] = [
    'write:users',
    'write:cups',
    'read:users',
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
      { name: 'ninho', price: 0 },
      { name: 'banana', price: 0 },
      { name: 'amendoim', price: 0 },
      { name: 'paçoca', price: 0 },
      { name: 'amêndoas', price: 0 },
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

const cleanOrders = async () => {
  await prisma.order.deleteMany()
}

const cleanDb = async () => {
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.cup.deleteMany()
  await prisma.additional.deleteMany()
  await prisma.address.deleteMany()
  await prisma.user.deleteMany()
}

const setUsers = async () => {
  const data = [
    {
      id: '6664c49e-c650-430b-ba4b-e23fe06cc9c9',
      name: 'Emanuel Batista',
      phone: '(18) 84415-0662',
      password: '',
      rules: [],
      is_admin: false,
    },
    {
      id: '7349140f-4ba6-4283-aabd-0f3efd203cc4',
      name: 'Joana Franco',
      phone: '+55 (59) 0667-4193',
      password: '',
      rules: [],
      is_admin: false,
    },
    {
      id: '60c59b57-4a25-4c9a-8c9c-8bd141e8218c',
      name: 'Maria Alice Carvalho',
      phone: '+55 (77) 0815-6618',
      password: '',
      rules: [],
      is_admin: false,
    },
    {
      id: 'eddc32b0-0784-4020-b053-e08b9ed91224',
      name: 'Marcela Batista',
      phone: '+55 (94) 1453-3063',
      password: '',
      rules: [],
      is_admin: false,
    },
    {
      id: '7661a17e-d78a-4a27-a5a7-5c31f70a5220',
      name: 'Sophia Carvalho',
      phone: '+55 (54) 9450-9090',
      password: '',
      rules: [],
      is_admin: false,
    },
    {
      id: '49ff9f73-ad69-495a-9491-7aa7c80f474c',
      name: 'Marcos Silva',
      phone: '(39) 7550-3315',
      password: '',
      rules: [],
      is_admin: false,
    },
    {
      id: 'a1ffa7bb-4150-4b11-af4d-46c94c917777',
      name: 'Arthur Franco',
      phone: '(49) 67697-4736',
      password: '',
      rules: [],
      is_admin: false,
    },
    {
      id: '7fabe26a-a673-434b-997c-0bd949719fbc',
      name: 'Gúbio Pereira',
      phone: '(07) 12338-6286',
      password: '',
      rules: [],
      is_admin: false,
    },
    {
      id: 'e7b2053d-46dd-4d92-86f1-e456cde06687',
      name: 'Dra. Dalila Braga',
      phone: '(36) 34882-0965',
      password: '',
      rules: [],
      is_admin: false,
    },
    {
      id: '08dd3c71-a636-4b77-acda-c1e14810915d',
      name: 'Anthony Costa',
      phone: '+55 (67) 3070-1305',
      password: '',
      rules: [],
      is_admin: false,
    },
    {
      id: 'd6c55e59-54fd-4837-bbe0-bc20d7b624eb',
      name: 'Rebeca Macedo',
      phone: '(79) 75620-4154',
      password: '',
      rules: [],
      is_admin: false,
    },
    {
      id: '4718fcda-d074-40ce-bb34-87f42397c366',
      name: 'Bryan Batista',
      phone: '(58) 4775-6037',
      password: '',
      rules: [],
      is_admin: false,
    },
    {
      id: '5780d159-4ce8-4cdc-ae4e-20c6401580cf',
      name: 'Sílvia Batista',
      phone: '(93) 2681-9826',
      password: '',
      rules: [],
      is_admin: false,
    },
    {
      id: '000ae3a6-5702-4009-923b-b867d21dc6b7',
      name: 'Clara Barros',
      phone: '(72) 4873-1214',
      password: '',
      rules: [],
      is_admin: false,
    },
    {
      id: '6cfd4790-2a8a-4220-98b2-5fe5198145e5',
      name: 'Raul Franco',
      phone: '+55 (16) 3588-1196',
      password: '',
      rules: [],
      is_admin: false,
    },
    {
      id: '1dcc992a-b985-4c62-9a18-308040b3f228',
      name: 'Lorraine Batista',
      phone: '(24) 3490-9663',
      password: '',
      rules: [],
      is_admin: false,
    },
    {
      id: '292dd9cf-6614-488a-bb08-5bba6d779465',
      name: 'Eloá Batista',
      phone: '(83) 29567-6612',
      password: '',
      rules: [],
      is_admin: false,
    },
    {
      id: '8de6615e-6949-4e66-861b-b64c70baed14',
      name: 'Ana Clara Oliveira Neto',
      phone: '(03) 1978-1046',
      password: '',
      rules: [],
      is_admin: false,
    },
    {
      id: 'e24c6deb-e87f-45b6-8855-3c9c276175e9',
      name: 'Emanuel Pereira',
      phone: '+55 (04) 9151-3643',
      password: '',
      rules: [],
      is_admin: false,
    },
    {
      id: 'bf2a0855-4c8c-4c47-b2ce-4adb0b9488b0',
      name: 'Cecília Souza',
      phone: '+55 (71) 7032-5014',
      password: '',
      rules: [],
      is_admin: false,
    },
  ]
  return await prisma.user.createManyAndReturn({
    data,
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
  cleanOrders,
  cleanDb,
  setUsers,
}

export default orchestrator
