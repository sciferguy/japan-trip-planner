🧑‍💻 Your Helpers (Agents)

1. SuperBrain → Big-picture strategist
Model: GPT-5
Best for:
Multi-step reasoning (e.g. designing an auth flow, optimizing your DB schema).
“What’s the best architecture for X?” type questions.
Deep debugging when you don’t know where to start.
When to use:
Complex, open-ended problems where you want analysis, tradeoffs, and reasoning.
Why: GPT-5 handles complexity and long chains of thought better than the smaller models.
2. QuickHelper → Fast Q&A
Model: Claude Haiku (fast, high TPM)
Best for:
Quick explanations (“What does this hook do?”).
Small JSX/Tailwind refactors.
Syntax fixes, TypeScript errors.
When to use:
You want an answer fast and don’t need perfect depth.
Why: Saves tokens + time, keeps your dev flow snappy.

3. BugFinder → Debugger
Model: GPT-4.1
Best for:
Pointing out potential bugs in a function/component.
Finding type mismatches or React state issues.
Reviewing new code for errors before pushing.
When to use:
Anytime something looks broken or you want a sanity check before committing.
Why: GPT-4.1 balances accuracy with context awareness; solid for code reviews.

4. Optimizer → Performance & clarity
Model: Claude Sonnet
Best for:
Making React components more efficient (avoiding re-renders, fixing useEffect deps).
Suggesting better state management patterns.
Explaining tradeoffs between two approaches.
When to use:
You feel the code “works” but could be faster, simpler, or more maintainable.
Why: Claude excels at thoughtful, clear writing + code clarity suggestions.

5. SQLHelper → Database assistant
Model: GPT-4.1-mini
Best for:
Writing queries for Supabase/Postgres.
Debugging simple SQL joins, filters, aggregates.
When to use:
Any time you’re stuck on SQL or want to check query efficiency.
Why: GPT-4.1-mini is cheap + accurate for structured text like SQL.

6. DocBot → Documentation writer
Model: Claude Sonnet
Best for:
Turning functions into clean docstrings.
Summarizing how a component works.
Generating README sections.
When to use:
Before handing code off to teammates, or when you want clean inline comments.
Why: Claude Sonnet’s output is human-readable, clear, and structured.

7. UnitTester → Test generator
Model: GPT-4.1
Best for:
Creating Jest/Vitest tests.
Suggesting edge cases for functions.
Checking test coverage.
When to use:
After you finish a feature → “@UnitTester write tests for this hook”.
Why: GPT-4.1 is strong at generating code that runs without too much cleanup.

🤔 What if you just ask a general question?
If you type into Continue without tagging an agent (@Name), it defaults to the first provider in your config (in your case, usually openai/gpt-5).
That means “general questions” → answered by GPT-5 (SuperBrain) unless you explicitly call someone else.
Example: If you ask “What’s the difference between React Query and SWR?” without tagging, GPT-5 will answer.
⚡ How to best utilize them
Start small with @QuickHelper for speed. If it feels shallow → escalate to @SuperBrain.
Use @BugFinder before committing to catch silly mistakes.
Run @UnitTester after you finish a function so you don’t skip tests.
Ask @Optimizer when you feel the code “works but feels heavy.”
Call @DocBot as you wrap up a feature to generate docs in bulk.
Use @SQLHelper whenever you’re unsure about Postgres/Supabase queries.