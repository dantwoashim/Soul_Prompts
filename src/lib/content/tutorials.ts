export const aiStudioTutorialSteps = [
  {
    id: 'open-playground',
    title: 'Open Gemini AI Studio and keep the run controls visible',
    summary:
      'Start in a fresh chat, make sure the right sidebar is open, and keep the system instructions panel within reach before you begin the scene.',
    image: '/tutorials/ai-studio/step-1.jpg'
  },
  {
    id: 'paste-system-instructions',
    title: 'Paste the copied SoulPrompts block into System instructions',
    summary:
      'Use the copy button from any character page, then paste the full block into System instructions instead of the regular message box.',
    image: '/tutorials/ai-studio/step-2.png'
  },
  {
    id: 'adjust-run-settings',
    title: 'Tune the model and start with a scene-based first message',
    summary:
      'Choose the Gemini model you want, adjust thinking only if the scene needs it, and begin with a concrete location, tension, or relationship beat.',
    image: '/tutorials/ai-studio/step-3.png'
  }
] as const;

export const aiStudioQuickTips = [
  'Paste SoulPrompts into System instructions, not the main composer.',
  'Lead with a scene, not a vague hello. Location and tension create better roleplay immediately.',
  'If the character feels too broad, simplify your opening message before editing the prompt.',
  'Save the setup in AI Studio so you can return to the same character state later.'
] as const;
