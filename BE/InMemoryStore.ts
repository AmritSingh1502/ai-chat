import type { Message } from "./types.js";

const EVICTION_TIME = 5 * 60 * 1000; // 5 minutes
const EVICTION_CLOCK_TIME = 1 * 60 * 1000; // 1 minute
export class InMemoryStore {
    private static store: InMemoryStore;
    private store: Record<string, {
        messages: Message[],
        evictionTime: number
    }>;

    private clock: NodeJS.Timeout;


    private constructor() {
        this.store = {};
        this.clock = setInterval(() => {
            Object.entries(this.store).forEach(([key, {evictionTime}]) => {
                if(evictionTime > Date.now()){
                    delete this.store[key];
                }
            });
        },EVICTION_CLOCK_TIME)
    }

    private destroy() {
        clearInterval(this.clock);
    }

    static getInstance() {
        if (!InMemoryStore.store) {
            InMemoryStore.store = new InMemoryStore();
        }

        return InMemoryStore.store;
    }

    add(conversationId: string, message: Message) {
        // eviction logic
        if (!this.store[conversationId]) {
            this.store[conversationId] = {
                messages: [],
                evictionTime: Date.now() + EVICTION_TIME
            }
        }

    }
}