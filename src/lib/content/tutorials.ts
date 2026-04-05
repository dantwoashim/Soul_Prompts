export const aiStudioTutorialSteps = [
  {
    id: 'open-playground',
    title: 'Open your chat workspace and keep the instruction panel visible',
    summary:
      'Start in a fresh conversation, make sure the setup controls are open, and keep the instruction panel within reach before you begin the scene.',
    image: '/tutorials/guide/step-1.jpg'
  },
  {
    id: 'paste-system-instructions',
    title: 'Paste the copied SoulPrompts block into the instruction layer',
    summary:
      'Use the copy button from any character page, then paste the full block into the instruction area instead of the regular message box.',
    image: '/tutorials/guide/step-2.png'
  },
  {
    id: 'adjust-run-settings',
    title: 'Adjust the settings and start with a scene-based first message',
    summary:
      'Choose the settings you want, keep the scene grounded, and begin with a concrete location, tension, or relationship beat.',
    image: '/tutorials/guide/step-3.png'
  }
] as const;

export const aiStudioQuickTips = [
  'Paste SoulPrompts into the instruction layer, not the main composer.',
  'Lead with a scene, not a vague hello. Location and tension create better roleplay immediately.',
  'If the character feels too broad, simplify your opening message before editing the prompt.',
  'Save the setup in your workspace so you can return to the same character state later.'
] as const;
