To get started:

1. Run `npm install` in the `reddit-quiz-react` directory
2. Run `npm run build:prod` in the `reddit-quiz-react` directory
3. Enable developer mode in Google Chrome and install the unpacked extension located in `reddit-quiz-react/dist`
4. Run `pip install fastapi` and `pip install sqlitedict`
5. In the `backend` directory, run `uvicorn main:app --reload`

Notes:

To run the demo, please go to the FastAPI docs page at `http://localhost:8000/docs` (Please check the FastAPI terminal output to check which port FastAPI is being hosted from) and run the `/dummy_init/` API call

The bulk of the frontend logic is located in `reddit_quiz_react/src`. The flow will typically follow `inject_script.js` -> `index-foreground.js` into the React components in `components/`. Backend logic is located entirely in `backend/` in `main.py`. 

This will only work on `old.reddit.com`. By default, this extension is enabled on all subreddits. To see the submission options, go to https://old.reddit.com/r/{your_subreddit_here}/submit/. To see the moderator options, go to https://old.reddit.com/r/{your_subreddit_here}/about/edit/. To get the demo working, simply replace the usernames under the `/dummy_init/` API call with ones under your control and submit the corresponding links to your test subreddit.
