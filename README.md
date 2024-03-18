# Firebase Cloud Functions for GPT Chat Completion

![firebase+gpt](images/firebase_and_gpt.jpg?raw=true)

Example of ChatGPT ***Stream*** implementation in Firebase with functions. For this method you have to use `fetch`.
***Issue:***: This method seems to be slower than the other Stream method because it does not stream.

## SETUP

In `functions` folder create file `.env` with your OpenAI Api key.

Sample: 
```text
OPEN_AI_KEY="sk-<your key here>"
```

## SETUP WITH CUSTOM FUNCTIONS FOLDER

To use functions in a custom folder different from the default, suppose the destination folder is `functions` inside we create a new folder named `gpt-chat-completion-stream` and copy files from this project that are inside the `functions` folder. Then edit the `firebase.json` file from the root folder of your project.

```json
{
	...
	"firestore": {
		...
	},
	...
	"functions": [
		{
			"source": "functions/gpt-chat-completion-stream",
			"codebase": "gpt-chat-completion-stream",
			"predeploy": ["npm --prefix \"$RESOURCE_DIR\" run lint"],
			"ignore": [
				"node_modules",
				".git",
				"firebase-debug.log",
				"firebase-debug.*.log"
			],
			"runtime": "nodejs16"
		}
	]
	...
}
```

## Deploy

Run `firebase deploy --only functions:gpt-chat-completion-stream`

## Sample usage in REACT

```javascript
const [responseChunk, setResponseChunk] = useState<string>("");
let responseStream = "";

const callPrompt = (e:any) => {
	fetch("https://<region>-<project-name>.cloudfunctions.net/gptPromptStream", {
		method: "POST",
		body: JSON.stringify({
			prompt: [{role: "user", content: "Hello world"}],
		}),
	}).then(async (response) => {
		if(!response && !response.body) return;

		const decoder = new TextDecoder("utf-8");
		const reader = response?.body?.getReader();

		while (true) {
			const { done, value } = await reader.read();
			
			if (done) {
				break;
			}

			const text = decoder.decode(value);

			responseStream += text;
			setResponseChunk(responseStream);
		}
	})
	.catch((err) => {
		console.error(`Error occurred while attempting Fetch request: ${err}`);
	});
};
...

//JSX part:

<>
	<button onClick={callPrompt}>Call prompt</button>

	<h1>Response</h1>
	<div>{responseChunk}</div>
</>
```

---

# BEWARE <h1>⚠️</h1>

This method may no longer be functional as the LangChain package is updated daily.

If you feel like collaborating you can create Pull Request...


