import { NextResponse } from 'next/server';
import Groq from "groq-sdk";

const GROQ_API_KEY = process.env.GROQ_API_KEY;

export async function POST(req: Request) {
  if (!GROQ_API_KEY) {
    return NextResponse.json({
      error: 'Missing GROQ_API_KEY in environment variables'
    }, { status: 500 });
  }

  try {
    const { prompt, taskType, essay, dataOutline } = await req.json();

    // Calculate word count
    const wordCount = essay.trim().split(/\s+/).length;

    // Strict validation: Reject nonsense/ultra-short submissions immediately
    if (wordCount < 20) {
      return NextResponse.json({
        criteria: { taskAchievement: 0, coherence: 0, lexical: 0, grammar: 0 },
        overallBand: 0,
        wordCount: wordCount,
        taskType: taskType,
        feedback: {
          strengths: [],
          improvements: ["The submission is too short to be evaluated."],
          tips: ["Please write a complete essay (at least 150 words for Task 1, 250 for Task 2)."]
        },
        modelAnswer: "No model answer generated for incomplete submission."
      });
    }

    // Determine task-specific requirements
    const isTask1 = taskType === 'Task 1';
    const minWords = isTask1 ? 150 : 250;
    const idealMin = isTask1 ? 160 : 260;
    const idealMax = isTask1 ? 190 : 290;

    // Check for word count penalty
    const belowMinimum = wordCount < minWords;
    const maxBandIfPenalty = 6.5;

    // Create the examiner prompt
    const examinerPrompt = isTask1
      ? createTask1ExaminerPrompt(prompt, essay, wordCount, dataOutline, belowMinimum, idealMin, idealMax)
      : createTask2ExaminerPrompt(prompt, essay, wordCount, belowMinimum, idealMin, idealMax);

    const groq = new Groq({ apiKey: GROQ_API_KEY });

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an expert IELTS Writing Examiner with 15+ years of experience. 
You provide accurate, strict assessments based on official IELTS band descriptors.
You also write exceptional Band 8-9 model answers.
Always output valid JSON only, no markdown.`
        },
        { role: "user", content: examinerPrompt }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.4,
      response_format: { type: "json_object" }
    });

    const textOutput = completion.choices[0]?.message?.content;
    if (!textOutput) throw new Error("No response from AI");

    let evaluation = JSON.parse(textOutput);

    // Enforce word count penalty
    if (belowMinimum && evaluation.overallBand > maxBandIfPenalty) {
      evaluation.overallBand = maxBandIfPenalty;
      evaluation.wordCountPenalty = true;
    }

    // Ensure word count is included
    evaluation.wordCount = wordCount;
    evaluation.taskType = taskType;

    return NextResponse.json(evaluation);

  } catch (error) {
    console.error('Evaluation Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ═══════════════════════════════════════════════════════════════
// TASK 1 EXAMINER (Data Description)
// ═══════════════════════════════════════════════════════════════
function createTask1ExaminerPrompt(
  prompt: string,
  essay: string,
  wordCount: number,
  dataOutline: string | undefined,
  belowMinimum: boolean,
  idealMin: number,
  idealMax: number
): string {
  return `
IELTS TASK 1 EXAMINATION

═══════════════════════════════════════════════════════════════
CANDIDATE SUBMISSION
═══════════════════════════════════════════════════════════════
Task Prompt: "${prompt}"
Word Count: ${wordCount} words ${belowMinimum ? '⚠️ BELOW 150 MINIMUM - MAX BAND 6.5' : ''}
${dataOutline ? `\nData Reference:\n${dataOutline}` : ''}

Candidate Essay:
"${essay}"

═══════════════════════════════════════════════════════════════
TASK 1 GRADING CRITERIA
═══════════════════════════════════════════════════════════════

1. TASK ACHIEVEMENT (25%)
   Band 9: Fully satisfies requirements. Clear overview. All key features highlighted.
   Band 8: Covers requirements well. Clear overview. Key features with relevant details.
   Band 7: Covers requirements. Clear overview. Main features identified.
   Band 6: Addresses task but may lack overview or have irrelevant details.
   Band 5: Recounts details mechanically with no clear overview.

   CRITICAL: Must have OVERVIEW paragraph. No opinions allowed. Data must be accurate.

2. COHERENCE & COHESION (25%)
   Band 9: Effortless cohesion. Skillful paragraphing.
   Band 8: Logical sequencing. Good cohesive devices.
   Band 7: Clear progression. Range of linking words.
   Band 6: Coherent but some faulty/mechanical linking.
   Band 5: Inadequate organization.

3. LEXICAL RESOURCE (25%)
   Band 9: Wide range. Sophisticated control. Rare errors.
   Band 8: Skillful use of uncommon vocabulary.
   Band 7: Sufficient range. Some awareness of style.
   Band 6: Adequate range. Some inaccuracy.
   Band 5: Limited range. Repetitive.

   Task 1 vocabulary: "increased sharply", "remained stable", "fluctuated", "peaked at", "whereas", "in contrast"

4. GRAMMATICAL RANGE & ACCURACY (25%)
   Band 9: Full flexibility. Rare minor errors.
   Band 8: Wide range. Majority error-free.
   Band 7: Variety of structures. Frequent error-free sentences.
   Band 6: Mix of simple/complex. Some errors but meaning clear.
   Band 5: Limited range. Frequent errors.

═══════════════════════════════════════════════════════════════
REQUIRED OUTPUT (JSON)
═══════════════════════════════════════════════════════════════

{
  "criteria": {
    "taskAchievement": <5.0-9.0>,
    "coherence": <5.0-9.0>,
    "lexical": <5.0-9.0>,
    "grammar": <5.0-9.0>
  },
  "overallBand": <average rounded to 0.5>${belowMinimum ? ', MAX 6.5 due to word count' : ''},
  "feedback": {
    "strengths": ["List 2-3 specific strengths with quotes"],
    "improvements": ["List 2-3 specific improvements needed with examples"],
    "tips": ["2-3 actionable tips to improve score"]
  },
  "modelAnswer": "<Write a Band 8-9 model answer here. CRITICAL: MUST be EXACTLY ${idealMin}-${idealMax} words. DO NOT BE LAZY. WRITE A LONG, DETAILED ANSWER.>"
}

CRITICAL INSTRUCTIONS FOR MODEL ANSWER:
1. Count your words carefully - the answer MUST be between ${idealMin} and ${idealMax} words
2. Write a complete, exceptional Task 1 essay with proper paragraphing
3. Include: Introduction (paraphrase) + Overview + 2 body paragraphs
4. Use Band 8-9 vocabulary and grammar
5. FAILURE TO MEET WORD COUNT WILL BE PENALIZED. WRITE MORE.
`;
}

// ═══════════════════════════════════════════════════════════════
// TASK 2 EXAMINER (Opinion/Argument Essay)
// ═══════════════════════════════════════════════════════════════
function createTask2ExaminerPrompt(
  prompt: string,
  essay: string,
  wordCount: number,
  belowMinimum: boolean,
  idealMin: number,
  idealMax: number
): string {
  return `
IELTS TASK 2 EXAMINATION

═══════════════════════════════════════════════════════════════
CANDIDATE SUBMISSION
═══════════════════════════════════════════════════════════════
Essay Question: "${prompt}"
Word Count: ${wordCount} words ${belowMinimum ? '⚠️ BELOW 250 MINIMUM - MAX BAND 6.5' : ''}

Candidate Essay:
"${essay}"

═══════════════════════════════════════════════════════════════
TASK 2 GRADING CRITERIA
═══════════════════════════════════════════════════════════════

1. TASK RESPONSE (25%)
   Band 9: Fully addresses all parts. Position clear throughout. Fully extended ideas.
   Band 8: Sufficiently addresses all parts. Well-developed response.
   Band 7: Addresses all parts. Clear position. Main ideas extended.
   Band 6: Addresses parts but not equally. Position present but unclear.
   Band 5: Only partially addresses task. Position unclear.

   CRITICAL: Must have clear thesis. Must address ALL parts of question. Ideas must be developed with examples.

2. COHERENCE & COHESION (25%)
   Band 9: Effortless cohesion. Skillful paragraphing.
   Band 8: Logical sequencing. Good use of cohesive devices.
   Band 7: Clear progression. Range of cohesive devices.
   Band 6: Coherent arrangement. Some faulty/mechanical linking.
   Band 5: Inadequate organization.

3. LEXICAL RESOURCE (25%)
   Band 9: Wide range. Sophisticated control. Rare errors.
   Band 8: Skillful use of uncommon vocabulary.
   Band 7: Sufficient range. Awareness of style/collocation.
   Band 6: Adequate range for task. Some inaccuracy.
   Band 5: Limited range. Repetitive vocabulary.

   Academic vocabulary: "compelling evidence", "fundamentally", "nevertheless", "consequently", "it is widely acknowledged"

4. GRAMMATICAL RANGE & ACCURACY (25%)
   Band 9: Full flexibility and accuracy. Rare minor errors.
   Band 8: Wide range. Majority error-free sentences.
   Band 7: Variety of complex structures. Good control.
   Band 6: Mix of simple/complex. Errors don't impede meaning.
   Band 5: Limited range. Frequent errors.

═══════════════════════════════════════════════════════════════
REQUIRED OUTPUT (JSON)
═══════════════════════════════════════════════════════════════

{
  "criteria": {
    "taskResponse": <5.0-9.0>,
    "coherence": <5.0-9.0>,
    "lexical": <5.0-9.0>,
    "grammar": <5.0-9.0>
  },
  "overallBand": <average rounded to 0.5>${belowMinimum ? ', MAX 6.5 due to word count' : ''},
  "feedback": {
    "strengths": ["List 2-3 specific strengths with quotes from essay"],
    "improvements": ["List 2-3 specific areas to improve with examples"],
    "tips": ["2-3 actionable tips to reach higher band"]
  },
  "modelAnswer": "<Write a Band 8-9 model answer here. CRITICAL: MUST be EXACTLY ${idealMin}-${idealMax} words. DO NOT BE LAZY. WRITE A LONG, DETAILED ANSWER.>"
}

CRITICAL INSTRUCTIONS FOR MODEL ANSWER:
1. Count your words carefully - the answer MUST be between ${idealMin} and ${idealMax} words
2. Write a complete, exceptional Task 2 essay with proper paragraphing
3. Include: Introduction (background + thesis) + 2 body paragraphs + Conclusion
4. Use Band 8-9 vocabulary and grammar
5. FAILURE TO MEET WORD COUNT WILL BE PENALIZED. WRITE MORE.
`;
}
