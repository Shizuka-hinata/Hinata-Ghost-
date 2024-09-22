const axios = require('axios');



let lastResponseMessageID = null;



async function handleCommand(api, event, args, message) {

    try {

        const question = args.join(" ").trim();



        if (!question) {

            return message.reply("Hey 👋 my name is Hinata..💚 and I'm here to help you🥰");

        }



        const { response, messageID } = await getAIResponse(question, event.senderID, event.messageID);

        lastResponseMessageID = messageID;



        api.sendMessage(`|   /)    /)\n|(｡•ㅅ•｡)〝₎₎ 𝐑𝐄𝐏𝐎𝐍𝐒𝐄 ! .°-`✦\n\n╭━∪━∪━━━━━━━━━✦\n│🍀💚❀✰𝐉𝐔𝐍𝐈𝐎𝐑✰❀💚\n╰━━━━━━━━━━━━✦\n${response}\n━━━━━━━━━━━━━━━━`, event.threadID, messageID);

    } catch (error) {

        console.error("Error in handleCommand:", error.message);

        message.reply("An error occurred while processing your request.");

    }

}



async function getAnswerFromAI(question) {

    try {

        const services = [

            { url: 'https://markdevs-last-api.onrender.com/gpt4', params: { prompt: question, uid: 'your-uid-here' } },

            { url: 'http://markdevs-last-api.onrender.com/api/v2/gpt4', params: { query: question } },

            { url: 'https://markdevs-last-api.onrender.com/api/v3/gpt4', params: { ask: question } }

        ];



        for (const service of services) {

            const data = await fetchFromAI(service.url, service.params);

            if (data) return data;

        }



        throw new Error("No valid response from any AI service");

    } catch (error) {

        console.error("Error in getAnswerFromAI:", error.message);

        throw new Error("Failed to get AI response");

    }

}



async function fetchFromAI(url, params) {

    try {

        const { data } = await axios.get(url, { params });

        if (data && (data.gpt4 || data.reply || data.response || data.answer || data.message)) {

            const response = data.gpt4 || data.reply || data.response || data.answer || data.message;

            console.log("AI Response:", response);

            return response;

        } else {

            throw new Error("No valid response from AI");

        }

    } catch (error) {

        console.error("Network Error:", error.message);

        return null;

    }

}



async function getAIResponse(input, userId, messageID) {

    const query = input.trim() || "hi";

    try {

        const response = await getAnswerFromAI(query);

        return { response, messageID };

    } catch (error) {

        console.error("Error in getAIResponse:", error.message);

        throw error;

    }

}



module.exports = {

    config: {

        name: 'junior',

        author: 'coffee',

        role: 0,

        category: 'ai',

        shortDescription: 'AI to answer any question',

    },

    onStart: async function ({ api, event, args }) {

        const input = args.join(' ').trim();

        try {

            const { response, messageID } = await getAIResponse(input, event.senderID, event.messageID);

            lastResponseMessageID = messageID;

            api.sendMessage(`|   /)    /)\n|(｡•ㅅ•｡)〝₎₎ 𝐑𝐄𝐏𝐎𝐍𝐒𝐄 ! .°-`✦\n\n╭━∪━∪━━━━━━━━━✦\n│🍀💚❀✰𝐉𝐔𝐍𝐈𝐎𝐑✰❀💚\n╰━━━━━━━━━━━━✦\n${response}\n━━━━━━━━━━━━━━━━`, event.threadID, messageID);

        } catch (error) {

            console.error("Error in onStart:", error.message);

            api.sendMessage("An error occurred while processing your request.", event.threadID);

        }

    },

    onChat: async function ({ event, message, api }) {

        const messageContent = event.body.trim().toLowerCase();



        // Check if the message is a reply to the bot's message or starts with "ai"

        if ((event.messageReply && event.messageReply.senderID === api.getCurrentUserID()) || (messageContent.startsWith("junior") && event.senderID !== api.getCurrentUserID())) {

            const input = messageContent.replace(/^junior\s*/, "").trim();

            try {

                const { response, messageID } = await getAIResponse(input, event.senderID, event.messageID);

                lastResponseMessageID = messageID;

                api.sendMessage(`|   /)    /)\n|(｡•ㅅ•｡)〝₎₎ 𝐑𝐄𝐏𝐎𝐍𝐒𝐄 ! .°-`✦\n\n╭━∪━∪━━━━━━━━━✦\n│🍀💚❀✰𝐉𝐔𝐍𝐈𝐎𝐑✰❀💚\n╰━━━━━━━━━━━━✦\n${response}\n━━━━━━━━━━━━━━━━`, event.threadID, messageID);

            } catch (error) {

                console.error("Error in onChat:", error.message);

                api.sendMessage("An error occurred while processing your request.", event.threadID);

            }

        }

    },

    handleCommand // Export the handleCommand function for command-based interactions

};
