const express = require('express');
const { OpenAI } = require('openai');
require('dotenv').config();

// Initialize OpenAI with the new API structure
const openai = new OpenAI({
    apiKey:"",
});

const textGeneration = async (prompt) => {
    try {
        // Use chat completions API (recommended) instead of completions
        const response = await openai.chat.completions.create({
            model: 'gpt-4-turbo', // or 'gpt-4', 'gpt-4-turbo', etc.
            messages: [
                { role: 'user', content: prompt }
            ],
            temperature: 0.9,
            max_tokens: 100,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0.6,
        });
    
        return {
            status: 1,
            response: response.choices[0].message.content
        };
    } catch (error) {
        console.error('OpenAI API Error:', error);
        return {
            status: 0,
            response: ''
        };
    }
};

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use((req, res, next) => {
    console.log(`Path ${req.path} with Method ${req.method}`);
    next();
});


app.get('/', (req, res) => {
    res.sendStatus(200);
});


app.post('/dialogflow', async (req, res) => {
    
    let action = req.body.queryResult.action;
    let queryText = req.body.queryResult.queryText;

    if (action === 'input.unknown') {
        let result = await textGeneration(queryText);
        if (result.status == 1) {
            res.send(
                {
                    fulfillmentText: result.response
                }
            );
        } else {
            res.send(
                {
                    fulfillmentText: `Sorry, I'm not able to help with that.`
                }
            );
        }
    } else {
        res.send(
            {
                fulfillmentText: `No handler for the action ${action}.`
            }
        );
    }
});

app.listen(PORT, () => {
    console.log(`Server is up and running at ${PORT}`);

});
