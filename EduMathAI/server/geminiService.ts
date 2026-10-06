import { GoogleGenAI } from '@google/genai';

// Initialize the shared GoogleGenAI client on the server
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

const SYSTEM_INSTRUCTION = `You are "EduMathAI Tutor", an expert, friendly, and patient Class 9 Mathematics teacher dedicated to helping CBSE and AP State Board students learn, practice, and grow.

Your Teaching Rules:
1. TARGET AUDIENCE: Class 9 students (ages 13-15). Use clear, encouraging, age-appropriate language.
2. STEP-BY-STEP EXPLANATIONS: Break every math solution into logical, numbered steps. Do not just state the final number; explain WHY each step works.
3. FORMULAS: Always explicitly state the mathematical formula, theorem, or axiom being used (e.g., "(a + b)^2 = a^2 + 2ab + b^2", "Central Angle Theorem: Angle at center = 2 × Angle at circumference", "Heron's Formula: s = (a+b+c)/2").
4. FORMATTING: Use clean markdown with bolding for key terms, equations on separate lines or inline, and bullet points for properties.
5. HINTS & GUIDANCE: If the student asks for a hint, give them a subtle clue or intermediate checkpoint rather than solving the entire problem immediately.
6. CHECK FOR UNDERSTANDING: Conclude your explanation with a short, friendly check question or challenge to see if the student understood the concept.
7. NON-MATH QUESTIONS: If a student asks about non-mathematics topics (e.g., video games, movies, general chatter), warmly acknowledge them and politely redirect them back to Class 9 Mathematics.
8. CURRICULUM: Ground your explanations in standard Class 9 topics: Number Systems, Polynomials, Coordinate Geometry, Linear Equations in Two Variables, Euclid's Geometry, Lines and Angles, Triangles, Quadrilaterals, Circles, Heron's Formula, Surface Areas and Volumes, Statistics, Probability, and AP State Board Real Numbers/Proofs.`;

export async function askMathTutor(params: {
  message: string;
  chapterTitle?: string;
  history?: { role: 'user' | 'assistant'; text: string }[];
}): Promise<{ text: string; stepByStep: string[]; formulaReference?: string }> {
  const { message, chapterTitle, history } = params;

  const ai = getAiClient();

  if (ai) {
    try {
      const contents: Array<{ role?: string; parts: Array<{ text: string }> }> = [];

      // Add conversation history if available
      if (history && history.length > 0) {
        for (const item of history.slice(-6)) {
          contents.push({
            role: item.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: item.text }]
          });
        }
      }

      const promptContext = chapterTitle
        ? `[Student is currently studying: Class 9 Mathematics - Chapter: "${chapterTitle}"]\n\nStudent question: ${message}`
        : `Student question: ${message}`;

      contents.push({
        role: 'user',
        parts: [{ text: promptContext }]
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
        }
      });

      const rawText = response.text || '';
      
      // Parse steps if available
      const stepByStep = extractSteps(rawText);
      const formulaReference = extractFormula(rawText);

      return {
        text: rawText,
        stepByStep,
        formulaReference
      };
    } catch (err: any) {
      console.warn('Gemini API call failed, using intelligent educational fallback:', err?.message || err);
    }
  }

  // Smart Math Fallback Engine for offline/keyless environments
  return generateIntelligentMathResponse(message, chapterTitle);
}

function extractSteps(text: string): string[] {
  const lines = text.split('\n');
  const steps: string[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (/^(Step\s*\d+|[1-9]\.)\s+/i.test(trimmed)) {
      steps.push(trimmed);
    }
  }
  return steps.slice(0, 6);
}

function extractFormula(text: string): string | undefined {
  const formulaMatch = text.match(/(?:Formula|Identity|Theorem|Law):\s*([^\n\r]+)/i);
  if (formulaMatch) {
    return formulaMatch[1].trim();
  }
  return undefined;
}

function generateIntelligentMathResponse(
  message: string,
  chapterTitle?: string
): { text: string; stepByStep: string[]; formulaReference?: string } {
  const lower = message.toLowerCase();

  if (lower.includes('circle') || lower.includes('chord') || lower.includes('cyclic')) {
    return {
      text: `Hello there! Let's explore **Circles** from Class 9 Mathematics.\n\n### Key Theorem: The Central Angle Theorem\nThe angle subtended by an arc at the center is double the angle subtended by it at any point on the remaining part of the circle.\n\n**Step 1:** Identify the arc and the center of the circle $O$.\n**Step 2:** If $\\angle AOB$ is the central angle and $P$ is any point on the circumference, then:\n$$\\angle AOB = 2 \\times \\angle APB$$\n**Step 3:** For example, if $\\angle AOB = 110^\\circ$, then $\\angle APB = 110^\\circ / 2 = 55^\\circ$.\n\n### Cyclic Quadrilateral Property\nRemember that in any cyclic quadrilateral, the sum of opposite angles is always $180^\\circ$:\n$$\\angle A + \\angle C = 180^\\circ \\quad \\text{and} \\quad \\angle B + \\angle D = 180^\\circ$$\n\nWould you like to try solving a practice problem on this, or shall we prove why the angle in a semicircle is $90^\\circ$?`,
      stepByStep: [
        'Identify the subtended arc and the circle center',
        'Apply Central Angle Theorem: Angle at center = 2 × Angle at circumference',
        'Divide center angle by 2 to compute circumferential angle',
        'Verify cyclic quadrilateral opposite angles sum to 180°'
      ],
      formulaReference: 'Central Angle: ∠AOB = 2 × ∠APB | Cyclic: ∠A + ∠C = 180°'
    };
  }

  if (lower.includes('polynomial') || lower.includes('factor') || lower.includes('identity')) {
    return {
      text: `Great question on **Polynomials**!\n\n### Standard Identity in Class 9\nLet's review the identity for $(x + y + z)^2$:\n$$(x + y + z)^2 = x^2 + y^2 + z^2 + 2xy + 2yz + 2zx$$\n\n**Step 1:** Identify each component $x, y, z$ in your given expression.\n**Step 2:** Square each individual term: $x^2, y^2, z^2$.\n**Step 3:** Calculate the three cross-product terms: $2xy, 2yz, 2zx$.\n**Step 4:** Sum all terms together carefully respecting any negative signs.\n\n### Remainder & Factor Theorem Tip\nIf a polynomial $p(x)$ is divided by $(x - a)$, the remainder is $p(a)$. If $p(a) = 0$, then $(x - a)$ is a factor of $p(x)$!\n\nDoes this step-by-step breakdown clarify your doubt, or would you like to see a specific numerical example?`,
      stepByStep: [
        'Identify terms x, y, and z',
        'Compute squared terms x², y², z²',
        'Compute cross-product pairs: 2xy, 2yz, 2zx',
        'Combine terms while preserving arithmetic signs'
      ],
      formulaReference: '(x + y + z)² = x² + y² + z² + 2xy + 2yz + 2zx'
    };
  }

  if (lower.includes('heron') || lower.includes('area of triangle')) {
    return {
      text: `Let's solve this with **Heron's Formula** step-by-step!\n\n### The Formula\nWhen you know all three sides $a, b, c$ of a triangle:\n$$\\text{Area} = \\sqrt{s(s - a)(s - b)(s - c)}$$\nwhere $s$ is the **semi-perimeter**:\n$$s = \\frac{a + b + c}{2}$$\n\n**Step 1:** Calculate the semi-perimeter $s$ by adding all 3 sides and dividing by 2.\n**Step 2:** Calculate $(s - a)$, $(s - b)$, and $(s - c)$.\n**Step 3:** Multiply $s \\times (s - a) \\times (s - b) \\times (s - c)$.\n**Step 4:** Take the square root of the product to get the area in square units.\n\n*Quick Check:* For sides $6\\text{ cm}, 8\\text{ cm}, 10\\text{ cm}$:\n- $s = (6 + 8 + 10)/2 = 12$\n- Area = $\\sqrt{12 \\times 6 \\times 4 \\times 2} = \\sqrt{576} = 24\\text{ cm}^2$.\n\nWhat are the side lengths of your triangle? Let's solve it together!`,
      stepByStep: [
        'Calculate semi-perimeter: s = (a + b + c) / 2',
        'Compute differences: (s - a), (s - b), and (s - c)',
        'Multiply s × (s - a) × (s - b) × (s - c)',
        'Take the square root to determine total area'
      ],
      formulaReference: 'Area = √[s(s - a)(s - b)(s - c)] where s = (a + b + c)/2'
    };
  }

  if (lower.includes('surface') || lower.includes('volume') || lower.includes('cylinder') || lower.includes('cone') || lower.includes('sphere')) {
    return {
      text: `Here is the step-by-step breakdown for **Surface Areas and Volumes**!\n\n### Essential 3D Formulas\n- **Right Circular Cylinder:**\n  - Curved Surface Area (CSA) = $2\\pi r h$\n  - Total Surface Area (TSA) = $2\\pi r(r + h)$\n  - Volume = $\\pi r^2 h$\n\n- **Right Circular Cone:**\n  - Slant height $l = \\sqrt{r^2 + h^2}$\n  - CSA = $\\pi r l$\n  - Volume = $\\frac{1}{3}\\pi r^2 h$\n\n- **Sphere:**\n  - Surface Area = $4\\pi r^2$\n  - Volume = $\\frac{4}{3}\\pi r^3$\n\n**Step 1:** Read the question and write down given quantities (radius $r$, height $h$, etc.).\n**Step 2:** Verify all units are matching (e.g., all in cm or all in meters).\n**Step 3:** Substitute into the corresponding formula and solve step-by-step.\n\nWhat specific solid or question are you currently working on?`,
      stepByStep: [
        'List known dimensions (radius r, height h, slant height l)',
        'Ensure dimensional units are uniform (cm or m)',
        'Select the exact formula (CSA, TSA, or Volume)',
        'Substitute values and evaluate step-by-step'
      ],
      formulaReference: 'Cylinder: V = πr²h | Cone: V = (1/3)πr²h | Sphere: V = (4/3)πr³'
    };
  }

  // General helpful Math Teacher response
  return {
    text: `Hello! I'm your **EduMathAI Tutor** for Class 9 Mathematics${chapterTitle ? ` (currently focusing on **${chapterTitle}**)` : ''}.\n\nTo solve mathematics problems effectively, let's follow the **4-Step Problem Solving Method**:\n\n**Step 1: Understand the Problem**\nIdentify what information is given and what you need to find or prove.\n\n**Step 2: Choose the Correct Formula or Theorem**\nWrite down the formula clearly before substituting numbers.\n\n**Step 3: Step-by-Step Calculation**\nPerform algebraic or geometric steps one by one without skipping operations.\n\n**Step 4: Verify Units & Answers**\nDouble-check signs, arithmetic, and required units (cm, cm², degrees, etc.).\n\nHow can I help you right now? You can:\n- Type a specific homework problem\n- Ask me to explain a theorem or formula\n- Request practice questions on this topic\n- Ask for a hint on a question you are stuck on!`,
    stepByStep: [
      'State the given facts and target outcome',
      'Select the governing Class 9 theorem or formula',
      'Execute algebraic substitution step-by-step',
      'Verify results, units, and geometric constraints'
    ],
    formulaReference: 'Learn • Practice • Grow'
  };
}
