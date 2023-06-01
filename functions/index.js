/*
█▀ █▄█ █▀▀ █░█ █▀▀ █░█
▄█ ░█░ █▄▄ █▀█ ██▄ ▀▄▀

Author: <Anton Sychev> (anton at sychev dot xyz) 
index.js (c) 2023 
Created:  2023-05-25 18:49:39 
Desc: firebase cloud functions gpt chat completion with stream response
Docs: 
	* OpenAI: https://platform.openai.com/docs/api-reference/chat/create
*/

const { OPEN_AI_KEY } = process.env;

const { Configuration, OpenAIApi } = require("openai");
const openaiApi = new OpenAIApi(new Configuration({ apiKey: OPEN_AI_KEY }));

const functions = require("firebase-functions");

exports.gptPromptStream = functions.https.onRequest(async (req, res) => {
	const { prompt } = JSON.parse(req.body);

	try {
		res.writeHead(200, {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*",
			"Transfer-Encoding": "chunked",
		});

		const completion = await openaiApi.createChatCompletion(
			{
				stream: true,
				model: "gpt-3.5-turbo",
				messages: prompt,
			},
			{ responseType: "stream" }
		);

		let completeResponse = "";

		//On completion have eny arror show it here.
		completion.data.on("error", (err) => {
			console.log("[43] ERROR ---->\n", err);
		});

		//When openai stream are complete
		completion.data.on("end", () => {
			console.log("[48] END of stream ---->\n", completeResponse);
			// do something with completeResponse like insert in your database
		});

		//Get and decode stream data
		completion.data.on("data", (bytes) => {
			const data = bytes.toString();

			if (/data: \[DONE\]/gim.test(data)) {
				console.log("[56] DONE form GPT ---->");
				return;
			}

			const message = data.replace(/^data: /, "");

			try {
				const parsed = JSON.parse(message);

				if (
					!parsed.choices[0].finish_reason &&
					parsed.choices[0].delta.content
				) {
					res.write(parsed.choices[0].delta.content);
					completeResponse += parsed.choices[0].delta.content;
				}
			} catch (error) {
				//NOTE: show error if code can 't process json parsing
				console.error(
					"Could not JSON parse stream message\n",
					"\nmessage: \n",
					message,
					"\nError:\n",
					error
				);
			}
		});
	} catch (err) {
		res.status(400).send({
			status: 400,
			message: "Error on cleaning chat.",
			code: 88,
		});
	}
});
