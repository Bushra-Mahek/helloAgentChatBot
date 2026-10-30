import { loadEnv } from './env'
import { ChatGoogle } from "@langchain/google";
import { ChatGroq } from "@langchain/groq";
import { ChatOpenAI } from "@langchain/openai";


export type Provider = 'gemini' | 'groq' | 'openai';

export function createChatModel(): {provider : Provider; model : any}{
    loadEnv();
    const forced = (process.env.PROVIDER || "").toLowerCase();
    const hasGemini = !!process.env.GEMINI_API_KEY;
    const hasOpenai = !!process.env.OPENAI_API_KEY;
    const hasGroq = !!process.env.GROQ_API_KEY;
    
    const base = {temperature : 0 as const};

    if(forced === 'gemini' || (!forced && hasGemini)){
        
        return {
            provider : 'gemini',
            model : new ChatGoogle({
                ...base,
                apiKey:process.env.GEMINI_API_KEY,
                model : "gemini-3.8-flash"})
        }
    };

    if(forced === 'groq' || (!forced && hasGroq)){
        return {
            provider : 'groq',
            model : new ChatGroq({
                ...base,         
  apiKey: process.env.GROQ_API_KEY, // Default value.
  model: "llama-3.1-8b-instant",
})
    }
    };
    

    if(forced === 'openai' || (!forced && hasOpenai)){
        return {
            provider : 'openai',
            model : new ChatOpenAI({
                ...base,
  apiKey: process.env.OPENAI_API_KEY,
  model: "gpt-4o-mini",
})
        
    }
    };

    if (forced) {
        throw new Error(`Unsupported or unavailable provider: ${forced}`);
    }

    


    return {
        provider: "gemini",
        model: new ChatGoogle({
            ...base,
            model: "gemini-3.8-flash"
        }),
    };
}