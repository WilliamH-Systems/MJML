type ContentBlock =
  | { type: "text"; paragraphs: string[] }
  | { type: "code"; language: string; lines: string[] };

interface Section {
  heading: string;
  content: ContentBlock[];
}

export interface TemplateData {
  preview: string;
  meta: string;
  title: string;
  subtitle: string;
  sections: Section[];
  cta_url: string;
  cta_label: string;
  footer: string;
  gradient_image_url: string;
}

export const data: TemplateData = {
  preview: "Broadband Intelligence: Why I'm Building an Agentic Future",
  meta: "NucBox K12 | FEDORA 44 | 2026",
  title: "Broadband Intelligence:",
  subtitle: "Why I'm Building an Agentic Future",

  sections: [
    {
      heading: "01 / The AMCC & Infinite Willpower",
      content: [
        {
          type: "text",
          paragraphs: [
            `There's a moment everyone hits—not a crisis, not a catastrophe—just that quiet "eh… I'll scroll for a bit" that turns into a black hole. And honestly, this is the real test of a habit system. Strengthen your habits until they are strong enough, like muscles.`,
            `I used to be that person. I was disorganized, prone to the doomscroll, and definitely not the picture of an early-rising founder. But somewhere along the line, I had an epiphany: willpower is not a finite resource. The Anterior Mid Cingulate Cortex can be trained by doing hard things and choosing the harder path.`,
            `However, I still believe in systems a LOT. My life is run by a daily schedule on Google Calendar and a spreadsheet acting as a living log of my life, tracking every achievement, milestone, success and necessary failure. It's a habit system that acts like a muscle, getting stronger with every repetition.`,
          ],
        },
      ],
    },
    {
      heading: '02 / The "Broadband" of Intelligence: AI and the New Learning Curve',
      content: [
        {
          type: "text",
          paragraphs: [
            `I've been learning Python since I was 13, and now I'm diving headfirst into Agentic AI. You don't have to wait until you've mastered every textbook concept. The feedback loop is so much tighter now. You can prototype an idea, watch it break in interesting ways, learn exactly which fundamentals you're missing, and then go study those with purpose instead of guessing what matters. Building ambitious things early forces you to grow into the engineer you want to become. It's just like how, in the past, people replaced dial-up with broadband.`,
            `Classrooms still operate like \u201cdial\u2011up\u201d while the world outside is running on \u201cbroadband.\u201d Over the next few years, the value of an education will depend on whether schools update their teaching to focus more on creativity, problem\u2011solving, and understanding how to work with AI instead of competing with it.`,
          ],
        },
      ],
    },
    {
      heading: "03 / Man with Machine & Reversing the Wrapper Paradigm",
      content: [
        {
          type: "text",
          paragraphs: [
            `The future isn't Man. The future isn't Machine. The future is Man with Machine. True progress comes from collaboration—that man with machine will be victorious over the paths of humans alone or machines alone. This means the human role is shifting from "processor" to "architect."`,
            `SaaS will never be a cultural breakout or a single, revolutionary consumer device like the iPhone. SaaS is not a product; it is just easy-to-replicate slop—the plumbing of the business world. In 2026, wrapper AI "startups" are already flooding the market. Lured by self-proclaimed marketing gurus, anyone can spin up a Lovable website and call it a startup. AI has shattered, pulverized, and vaporized the barrier to entry through vibe coding.`,
            `Consequently, almost all of these software experiments are doomed to die out quickly due to high churn and a total lack of distribution. I do not want to build just another one of these destined-to-fail startups. I really want to sharpen my agentic AI skills. Not merely AI. Interdisciplinary skills \u2014 what Steve Jobs had. I want to train my divergent thinking.`,
          ],
        },
      ],
    },
    {
      heading: "04 / The Path Algorithms",
      content: [
        {
          type: "code",
          language: "python",
          lines: [
            `<span style="color:#60a5fa;">def</span> <span style="color:#facc15;">process_human_existence</span>(path_selection):`,
            `&nbsp;&nbsp;<span style="color:#60a5fa;">if</span> path_selection == <span style="color:#34d399;">"THE_REALIST"</span>:`,
            `&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#f8fafc;">return</span> <span style="color:#94a3b8;">"STAGNATION (Safe but forgotten)"</span>`,
            `&nbsp;&nbsp;<span style="color:#60a5fa;">elif</span> path_selection == <span style="color:#34d399;">"THE_DELUSIONAL_GAMBLER"</span>:`,
            `&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#f8fafc;">return</span> <span style="color:#f87171;">"FAILURE (99.9999999% Statistical certainty)"</span>`,
            `&nbsp;&nbsp;<span style="color:#60a5fa;">elif</span> path_selection == <span style="color:#34d399;">"THE_MONUMENTAL_VISIONARY"</span>:`,
            `&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#f8fafc;">return</span> <span style="color:#34d399;">"THE_MIRACLE (0.0000001% Survival against the odds)"</span>`,
          ],
        },
        {
          type: "text",
          paragraphs: [
            `In the cosmic game of Russian Roulette, the odds are flipped completely against you. There is only one empty chamber out of a billion. The journey to success isn't all about numbers. It's about who you become at the end. That internal transformation is the true measure. Can you rig the system?`,
          ],
        },
      ],
    },
  ],

  cta_url: "https://github.com",
  cta_label: "Execute System Engine >_",
  footer: "system_runtime: 2026 // paradigm: man_with_machine // status: building",
  gradient_image_url: "https://cdn.jsdelivr.net/gh/USER/MJML@main/template/dist/gradient.png",
};
