interface SocialShareContext {
  title: string
  text: string
  platform: 'twitter' | 'linkedin'
}

const hashtags = {
  general: ['#CodeReview', '#AI', '#Programming'],
  languages: {
    javascript: ['#JavaScript', '#WebDev'],
    python: ['#Python', '#DataScience'],
    typescript: ['#TypeScript', '#WebDev'],
    java: ['#Java', '#Enterprise'],
    cpp: ['#CPlusPlus', '#Systems'],
    go: ['#GoLang', '#Backend'],
    rust: ['#Rust', '#Systems'],
    ruby: ['#Ruby', '#WebDev'],
    php: ['#PHP', '#WebDev'],
    swift: ['#Swift', '#iOS'],
  },
}

const templates = {
  twitter: {
    review: [
      "🔥 My code just got roasted by AI! Check out this savage review:\n\n{text}\n\n{url}",
      "🤖 AI found {issues} issues in my {language} code. Challenge accepted! 💪\n\n{url}",
      "🎯 Just got an AI code review with a {rating}/10 score. Time to level up! 🚀\n\n{url}",
      "💡 AI suggested {improvements} improvements to my code. Mind blown! 🤯\n\n{url}",
    ],
    achievement: [
      "🏆 Just made it to the top {rank} developers on CodeReview.ai! 🚀\n\n{url}",
      "🌟 Earned the {badge} badge for {reason}! Time to celebrate! 🎉\n\n{url}",
      "📈 My code review score improved by {percentage}% this week! 📊\n\n{url}",
    ],
    hallOfShame: [
      "😅 My code made it to the Hall of Shame! At least the AI found it funny... 😂\n\n{url}",
      "🤦‍♂️ AI roasted my code so hard it's trending! 🔥\n\n{url}",
      "💀 My code got the 'Most Entertaining Review' award. Not sure if I should be proud... 😅\n\n{url}",
    ],
  },
  linkedin: {
    review: [
      "I recently received an AI-powered code review that provided valuable insights into my {language} implementation. The review highlighted {key_points} and suggested {improvements} improvements. Check it out!\n\n{url}",
      "Excited to share my experience with AI code review! The system analyzed my code and provided a comprehensive assessment, scoring {rating}/10. Here are the key takeaways:\n\n{text}\n\n{url}",
      "As a developer, I'm always looking for ways to improve my code quality. Recently, I tried an AI code review system that provided detailed feedback on my {language} implementation. The results were eye-opening!\n\n{url}",
    ],
    achievement: [
      "I'm proud to announce that I've been recognized as a top {rank} developer on CodeReview.ai! This achievement reflects my commitment to code quality and continuous improvement.\n\n{url}",
      "Thrilled to have earned the {badge} badge on CodeReview.ai! This recognition highlights my dedication to {reason} and my passion for writing clean, efficient code.\n\n{url}",
      "Excited to share that my code review scores have improved by {percentage}% this week! This progress demonstrates my commitment to learning and growing as a developer.\n\n{url}",
    ],
    hallOfShame: [
      "In the spirit of transparency and learning, I'm sharing a humorous moment from my coding journey. My code recently received a particularly entertaining review from our AI system, earning a spot in the 'Hall of Shame'! 😄\n\n{url}",
      "Sometimes the best learning experiences come from our mistakes! My code recently received a viral-worthy review from our AI system, highlighting some entertaining oversights. Check it out!\n\n{url}",
    ],
  },
}

export function generateSocialSharePrompt(context: SocialShareContext): string {
  const { title, text, platform } = context
  const templateCategory = title.toLowerCase().includes('review')
    ? 'review'
    : title.toLowerCase().includes('achievement')
    ? 'achievement'
    : 'hallOfShame'

  const platformTemplates = templates[platform][templateCategory]
  const template = platformTemplates[Math.floor(Math.random() * platformTemplates.length)]

  // Extract variables from the text
  const language = text.match(/\[language:(\w+)\]/)?.[1] || 'code'
  const rating = text.match(/\[rating:(\d+)\]/)?.[1] || '8'
  const issues = text.match(/\[issues:(\d+)\]/)?.[1] || 'several'
  const improvements = text.match(/\[improvements:(\d+)\]/)?.[1] || 'multiple'
  const rank = text.match(/\[rank:(\d+)\]/)?.[1] || '10'
  const badge = text.match(/\[badge:([^\]]+)\]/)?.[1] || 'Code Master'
  const reason = text.match(/\[reason:([^\]]+)\]/)?.[1] || 'writing clean code'
  const percentage = text.match(/\[percentage:(\d+)\]/)?.[1] || '20'
  const keyPoints = text.match(/\[key_points:([^\]]+)\]/)?.[1] || 'several important aspects'

  // Replace variables in the template
  return template
    .replace('{text}', text)
    .replace('{language}', language)
    .replace('{rating}', rating)
    .replace('{issues}', issues)
    .replace('{improvements}', improvements)
    .replace('{rank}', rank)
    .replace('{badge}', badge)
    .replace('{reason}', reason)
    .replace('{percentage}', percentage)
    .replace('{key_points}', keyPoints)
    .replace('{url}', '') // URL will be added by the ShareButton component
}

export function getHashtags(language?: string): string[] {
  const languageTags = language ? hashtags.languages[language as keyof typeof hashtags.languages] || [] : []
  return [...hashtags.general, ...languageTags]
} 