import { getAPIKey } from "./firebase.js";

const url = "https://api.openai.com/v1/chat/completions"
const altUrl = "https://api.openai.com/v1/completions"
var systemMessage = {
    role: "system",
    content: "Direct all responses in the context of gamification and game design. Keep responses within 280 characters.",
}

// GPT-3.5 Turbo Model
const chatHistory = [];

export const packageMessage = async (message) => {
    const newMessage = {
        content: message,
        sender: "user",
    };

    chatHistory.push(newMessage);
    return await processMessageToChatGPT(chatHistory);
};

async function processMessageToChatGPT(chatHistory) {
    let messages = chatHistory.map((message) => {
        let role = "";
        if (message.sender === "ChatGPT") {
            role = "assistant";
        } 
        else {
            role = "user";
        }
        return { role: role, content: message.content}
      });

    const packageBody = {
        "model": "gpt-3.5-turbo",
        "messages": [
            systemMessage,
            ...messages
        ]
    };

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${await getAPIKey()}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(packageBody)
    });

    const data = await response.json();
    const receivedMessage = {
        content: data.choices[0].message.content,
        user: "ChatGPT"
    }
    chatHistory.push(receivedMessage);

    return data.choices[0].message.content;
};

export function toggleSystemRole(toggle) {
    if (toggle) {
        systemMessage = {
            role: "system",
            content: "Speak like a sassy, sarcastic wizard. Keep your responses within 280 characters.",
        }
    }
    else {
        systemMessage = {
            role: "system",
            content: "Direct all responses in the context of gamification and game design. Keep your responses within 280 characters.",
        }
    }
}

// DaVinci-003 Model
export const getAnswerFromChatGPT = async (prompt) => {
    const body = {
        "model": "text-davinci-003",
        "prompt": prompt,
        "max_tokens": 128,
        "temperature": 0.5,
    }

    const options = {
        method: "POST",
        headers: {
            'Content-Type': "application/json",
            'Authorization': `Bearer ${await getAPIKey()}` 
        },
        body: JSON.stringify(body), 
    }

    const response = await fetch(altUrl, options);
    const data = await response.json();

    return data.choices[0].text;
}

// export const generatePrompt = async (chatArray) => {
//     let introduction = "Direct all responses in the context of gamification and game design. Avoid giving detailed examples. Keep your response within 100 words.";

//     chatArray.forEach((entry) => {
//         //const chatHistory = " " + entry;
//         introduction += entry;
//     });

//     console.log(introduction);

//     const answer = await getAnswerFromAI(introduction);
//     return answer;
// }