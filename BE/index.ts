import express from "express";
import { CreateChatSchema, Role } from "./types";
import { createCompletion } from "./openrouter";
import { InMemoryStore } from "./InMemoryStore";

const app = express();

app.use(express.json());

app.post("/chat", async (req, res) => {
    const { success, data } = CreateChatSchema.safeParse(req.body);

    const conversationId = req.body.conversationId ?? Bun.randomUUIDv7();

    if (!success) {
        res.status(411).json({
            message: "Incorrect Inputs",
        });
        return;
    }

    let existingMessges = InMemoryStore.getInstance().get(conversationId);

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Connection", "keep-alive");

    let message = "";
    // event emitter
    await createCompletion(
        [
            ...existingMessges,
            {
                role: Role.User,
                content: data.message,
            },
        ],
        data.model,
        (chunk: string) => {
            message += chunk;
            res.write(data);
        }
    );

    res.end();

    InMemoryStore.getInstance().add(conversationId, {
        role: Role.User,
        content: data.message,
    });

    InMemoryStore.getInstance().add(conversationId, {
        role: Role.Agent,
        content: message,
    });

    //store in db
});

app.listen(3000);
