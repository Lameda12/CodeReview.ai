# CodeReview.ai 🚀

The most impressive AI-powered code review platform ever built. Get intelligent feedback from multiple AI models to improve your code quality, security, and performance.

![CodeReview.ai](https://img.shields.io/badge/CodeReview.ai-AI%20Powered-purple?style=for-the-badge&logo=artificial-intelligence)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 🤖 Multi-AI Review System
- **Multiple AI Models**: Get reviews from OpenAI GPT-4, Anthropic Claude, Google Gemini, and more
- **Consensus Reviews**: Combine insights from multiple AI models for comprehensive feedback
- **Specialized Reviews**: Security-focused, performance-optimized, and architecture-specific reviews

### 🎯 Advanced Code Analysis
- **Security Vulnerability Detection**: Identify potential security issues and get secure alternatives
- **Performance Optimization**: Find bottlenecks and optimization opportunities
- **Code Quality Metrics**: Detailed metrics on complexity, maintainability, and testability
- **Best Practices**: Language-specific recommendations and industry standards

### 🎨 Beautiful User Experience
- **Modern Dark Theme**: Sleek, professional interface optimized for developers
- **Responsive Design**: Perfect experience on desktop, tablet, and mobile
- **Real-time Feedback**: Instant notifications and progress indicators
- **Advanced Code Editor**: VS Code-like editor with syntax highlighting and file management

### 🔧 Developer-Friendly Features
- **Multi-Language Support**: TypeScript, JavaScript, Python, Java, Go, Rust, and more
- **GitHub Integration**: Import repositories and sync with your workflow
- **Export Options**: Download reviews in Markdown, JSON, or PDF formats
- **Version History**: Track changes and improvements over time

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/codereview-ai.git
   cd codereview-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your API keys:
   ```env
   OPENAI_API_KEY=your_openai_key
   ANTHROPIC_API_KEY=your_anthropic_key
   GOOGLE_AI_API_KEY=your_google_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
codereview-ai/
├── app/                    # Next.js 14 App Router
│   ├── layout.tsx         # Root layout with navigation
│   ├── page.tsx           # Homepage with dashboard
│   ├── submit/            # Code submission flow
│   └── review/[id]/       # Individual review pages
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components (buttons, cards, etc.)
│   ├── ai/               # AI-specific components
│   └── layout/           # Layout components (navigation, etc.)
├── lib/                  # Utility functions and services
│   ├── ai/              # AI service and prompt management
│   └── utils.ts         # Helper functions
├── public/              # Static assets
└── styles/              # Global styles and Tailwind config
```

## 🎨 UI Components

### Core Components
- **Button**: Multiple variants with hover effects and loading states
- **Card**: Glassmorphism design with hover animations
- **Badge**: Status indicators with color coding
- **Progress**: Animated progress bars with gradients
- **Tabs**: Smooth tab transitions with active indicators

### Advanced Components
- **AdvancedEditor**: VS Code-like editor with file management
- **ReviewInterface**: Comprehensive review display with filtering
- **Navigation**: Responsive navigation with mobile menu

## 🤖 AI Integration

### Supported AI Providers
- **OpenAI**: GPT-4, GPT-4 Turbo, GPT-3.5 Turbo
- **Anthropic**: Claude-3 Opus, Claude-3 Sonnet, Claude-3 Haiku
- **Google**: Gemini Pro, Gemini Pro Vision
- **Cohere**: Command, Command Light

### Review Types
- **General Review**: Comprehensive code analysis
- **Security Scan**: Vulnerability detection and fixes
- **Performance Check**: Optimization recommendations
- **Architecture Review**: Design patterns and structure analysis

### Prompt Engineering
- **Language-Specific**: Tailored prompts for each programming language
- **Personality Modes**: Encouraging, detailed, humorous, strict, beginner-friendly
- **Focus Areas**: Customizable review focus (security, performance, style, etc.)

## 🎯 Review Features

### Code Analysis
- **Complexity Scoring**: Algorithmic complexity analysis
- **Maintainability Index**: Code maintainability metrics
- **Security Rating**: Vulnerability assessment
- **Performance Score**: Optimization opportunities
- **Test Coverage**: Testability analysis
- **Documentation**: Code documentation quality

### Suggestions System
- **Before/After Examples**: Clear code improvement examples
- **Severity Levels**: Critical, high, medium, low priority issues
- **Category Filtering**: Filter by performance, security, style, bugs
- **Copy to Clipboard**: Easy code snippet copying
- **Estimated Fix Time**: Time estimates for implementing suggestions

## 🔧 Configuration

### Environment Variables
```env
# AI Provider API Keys
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
GOOGLE_AI_API_KEY=your_google_ai_api_key
COHERE_API_KEY=your_cohere_api_key

# Database (Optional)
DATABASE_URL=your_database_url

# Authentication (Optional)
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# GitHub Integration (Optional)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

### Customization
- **Theme Colors**: Modify `tailwind.config.ts` for custom color schemes
- **AI Prompts**: Edit `lib/ai/advanced-prompts.ts` for custom review styles
- **Review Types**: Add new review types in `lib/ai/review-service.ts`

## 📱 Responsive Design

- **Mobile-First**: Optimized for mobile devices
- **Tablet Support**: Perfect tablet experience
- **Desktop Enhanced**: Full-featured desktop interface
- **Touch-Friendly**: Optimized for touch interactions

## 🎨 Design System

### Colors
- **Primary**: Purple gradient (#a855f7 to #9333ea)
- **Secondary**: Gray scale (#1f2937 to #f9fafb)
- **Accent**: Success (green), Warning (yellow), Error (red)

### Typography
- **Sans**: Inter font family
- **Mono**: JetBrains Mono for code
- **Sizes**: Responsive typography scale

### Animations
- **Framer Motion**: Smooth page transitions
- **CSS Animations**: Custom keyframe animations
- **Hover Effects**: Interactive element feedback

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

### Docker
```bash
docker build -t codereview-ai .
docker run -p 3000:3000 codereview-ai
```

### Manual Deployment
```bash
npm run build
npm start
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run linting
npm run lint

# Type checking
npm run type-check
```

## 📈 Performance

- **Lighthouse Score**: 95+ performance score
- **Core Web Vitals**: Optimized for all metrics
- **Bundle Size**: Optimized with tree shaking
- **Image Optimization**: Next.js automatic optimization

## 🔒 Security

- **Input Validation**: Comprehensive input sanitization
- **API Security**: Rate limiting and authentication
- **Code Privacy**: Secure code handling and storage
- **HTTPS**: SSL/TLS encryption

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team**: For the amazing React framework
- **Tailwind CSS**: For the utility-first CSS framework
- **Radix UI**: For accessible component primitives
- **Framer Motion**: For smooth animations
- **Lucide**: For beautiful icons

## 📞 Support

- **Documentation**: [docs.codereview.ai](https://docs.codereview.ai)
- **Issues**: [GitHub Issues](https://github.com/your-username/codereview-ai/issues)
- **Discord**: [Join our community](https://discord.gg/codereview-ai)
- **Email**: support@codereview.ai

---

<div align="center">
  <p>Built with ❤️ by the CodeReview.ai team</p>
  <p>
    <a href="https://github.com/your-username/codereview-ai">⭐ Star us on GitHub</a> •
    <a href="https://twitter.com/codereview_ai">🐦 Follow on Twitter</a> •
    <a href="https://codereview.ai">🌐 Visit Website</a>
  </p>
</div>
