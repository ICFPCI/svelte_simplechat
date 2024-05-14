import type { ComponentType } from "svelte";
import { icons, type Icon } from "lucide-svelte";

import type token from "jose"

export type Conversation = {
	id: number
	name: string
	users: User[]
	contact: User | null
	messages: Message[]
	created: Date
	modified: Date
	type: string
	is_archived: boolean
}

export type User = {
	id?: number
	first_name: string
	last_name: string
	username: string
	email: string
	password: string
	created?: Date
	modified?: Date
}

export type Message = {
	id: number
	text: string
	conversation_id: number
	conversation: Conversation
	user_id: number
	user: User
	created: Date
	modified: Date
}

export type JWTToken = {
	access_token: string,
	refresh_token: string
}