# MockVibe - API Quota Management Guide

## Current Situation
Your Gemini API free tier quota has been exhausted. The application now automatically falls back to using pre-generated questions stored in your database.

## Fallback System Features

### ✅ What's Implemented
1. **Pre-generated Question Database** - 40+ questions across all categories and difficulty levels
2. **Automatic Fallback** - When API quota is exceeded, the system automatically serves questions from the database
3. **Smart Question Selection** - Questions are matched by category, difficulty, and ensures no duplicates in a session
4. **User Feedback** - Users are informed when fallback mode is active

## How to Set It Up

### Step 1: Seed the Database with Questions
Run this command in your backend directory to populate the database with pre-generated questions:

```bash
node seedQuestionsDatabase.js
```

This will add 40+ questions covering:
- **Behavioral** (Beginner, Intermediate, Expert)
- **Coding** (Beginner, Intermediate, Expert)
- **Technical Theory** (Beginner, Intermediate, Expert)
- **System Design** (Intermediate, Expert)
- **HR** (Beginner, Intermediate)

### Step 2: Test the Fallback
Start the server and try starting an interview. When the API quota is exhausted, questions will automatically come from your database.

## Options to Resume Full AI Functionality

### Option 1: Upgrade to Paid Gemini API (Recommended)
1. Visit [Google AI Studio](https://ai.google.dev/)
2. Upgrade to a **paid plan**
3. Replace your API key in `.env`
4. The system will automatically use the API when quota is available

### Option 2: Use a Different AI Service
Update `aiService.js` to use:
- OpenAI API (GPT-4)
- Claude API (Anthropic)
- LLaMA (Ollama - free, self-hosted)

### Option 3: Enhance the Database Questions
Add more questions by:
1. Editing `seedQuestionsDatabase.js`
2. Adding questions to the `questionsToSeed` array
3. Running `node seedQuestionsDatabase.js` again

## How the Fallback Works

```
Interview Request
        ↓
Try API Call (Gemini)
        ↓
    Success? → Return AI-generated question
        ↓
    Rate Limited/Quota? → Fallback to Database
        ↓
    Return Pre-generated question
```

## Current API Usage
- **Request Limit**: Free tier exhausted
- **Solution**: Automatically using database fallback
- **User Experience**: Seamless - users won't know the difference

## Next Steps

1. **Immediate**: Run the seeding script to populate questions
2. **Short-term**: Test the interview flow with database questions
3. **Long-term**: 
   - Upgrade to paid Gemini API, OR
   - Implement your own AI service, OR
   - Build a question management dashboard to add more questions

## Monitoring

The server logs will show:
- `"Using cached question"` - Question served from memory cache
- `"API quota exhausted, using database fallback questions"` - Using database fallback
- `"Using database fallback question"` - Last resort fallback

This means your application continues to work even when API quota is exhausted!
