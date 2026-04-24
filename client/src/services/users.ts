import { api } from './myFetch'
import type { DataListEnvelope } from '../../../server/types'
import type { User, UserId } from '@/types'

type ApiUser = {
    id: number
    username: string
    email?: string
    image_link?: string
    imageLink?: string
    is_admin?: boolean
    isAdmin?: boolean
    friend_ids?: number[]
    friendIds?: number[]
}

function toClientUser(user: ApiUser): User {
    return {
        id: user.id,
        username: user.username,
        email: user.email,
        imageLink: user.imageLink ?? user.image_link,
        isAdmin: user.isAdmin ?? user.is_admin ?? false,
        friendIds: (user.friendIds ?? user.friend_ids ?? []) as UserId[],
    }
}

export async function getUsers() {
    const response = await api<DataListEnvelope<ApiUser>>('/users')

    return {
        ...response,
        data: response.data.map(toClientUser),
    }
}