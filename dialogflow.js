const dialogflow = require('@google-cloud/dialogflow');
const { WebhookClient, Suggestion } = require('dialogflow-fulfillment');
const express = require("express")
const cors = require("cors");

const app = express();
app.use(express.json())
app.use(cors());

const PORT = process.env.PORT || 8080;
app.get('/', (req, res) => {
    res.send("it is working");
});

app.post("/webhook", async(req, res) => {
    var id = (res.req.body.session).substr(43);
    console.log(id)
    const agent = new WebhookClient({ request: req, response: res });

    function hi(agent) {
        console.log(`intent  =>  hi`);
        agent.add("Hi sir, how can I assist?")
    }

    function fallback(agent) {
        console("intent => fallback")
        agent.add("fallback from the webhook or server side.")
    }

    function registration(agent) {
        const { phoneNumber, name, fatherName, email, cnic } = agent.parameters;
        agent.add(`Thank you for your interest!\n
We successfully collected your data and soon our team will contact you.\n
Your data provided is as below:\n
Your Name: ${name.name}\n
Your Father Name: ${fatherName.name}\n
Your Email is: ${email}\n
Your Phone Number is: ${phoneNumber}\n
Your CNIC number is: ${cnic}\n
Please feel free to contact us in case of any problem.`);

    }

    let intentMap = new Map();
    intentMap.set('Default Welcome Intent', hi);
    intentMap.set('Default Fallback Intent', fallback);
    intentMap.set('Default Welcome Intent', hi);
    intentMap.set('registration', registration);
    agent.handleRequest(intentMap);
})
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});