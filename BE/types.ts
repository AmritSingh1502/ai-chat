import { z } from "zod";
const MAX_INPUT_TOKEN = 1000;

export const CreateChatSchema = z.object({
    conversationId  : z.uuid().optional(),
    message : z.string().max(MAX_INPUT_TOKEN, "Message exceeds maximum token limit"),
});

export type Role = "agent" | "user";

export type Message =  {
    content : string;
    role : Role;
}[]


