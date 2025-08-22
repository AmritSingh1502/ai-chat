import { z } from "zod";
const MAX_INPUT_TOKEN = 1000;

export const SUPPORTER_MODELS = ["openai/gpt-4o" ,"openai/gpt-5"];
export type MODEL = typeof SUPPORTER_MODELS[number];

export const CreateChatSchema = z.object({
    conversationId  : z.uuid().optional(),
    message : z.string().max(MAX_INPUT_TOKEN, "Message exceeds maximum token limit"),
    model: z.enum(SUPPORTER_MODELS)
});

// export type Role = "agent" | "user";

export type Message =  {
    content : string;
    role : Role;
}

export type messages  = Message[]

export enum Role {
    Agent = "assistant",
    User = "user"
}


