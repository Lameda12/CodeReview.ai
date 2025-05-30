'use client'

import { useState } from 'react'
import { Share2, Twitter, Linkedin, Link as LinkIcon, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { generateSocialSharePrompt } from '@/lib/ai/prompts'

interface ShareButtonProps {
  title: string
  text: string
  url: string
}

export function ShareButton({ title, text, url }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  const handleShare = async (platform: 'twitter' | 'linkedin') => {
    const shareUrl = new URL(url, window.location.origin).toString()
    const shareText = generateSocialSharePrompt({
      title,
      text,
      platform,
    })

    if (platform === 'twitter') {
      const twitterUrl = new URL('https://twitter.com/intent/tweet')
      twitterUrl.searchParams.set('text', shareText)
      twitterUrl.searchParams.set('url', shareUrl)
      window.open(twitterUrl.toString(), '_blank')
    } else if (platform === 'linkedin') {
      const linkedinUrl = new URL('https://www.linkedin.com/sharing/share-offsite')
      linkedinUrl.searchParams.set('url', shareUrl)
      linkedinUrl.searchParams.set('title', title)
      linkedinUrl.searchParams.set('summary', text)
      window.open(linkedinUrl.toString(), '_blank')
    }
  }

  const handleCopyLink = async () => {
    const shareUrl = new URL(url, window.location.origin).toString()
    await navigator.clipboard.writeText(shareUrl)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
        title="Share"
      >
        <Share2 className="h-5 w-5 text-gray-400" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-48 rounded-lg bg-gray-800 shadow-lg border border-gray-700 overflow-hidden"
          >
            <div className="p-2 space-y-1">
              <button
                onClick={() => handleShare('twitter')}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700/50 rounded-lg transition-colors"
              >
                <Twitter className="h-4 w-4 text-blue-400" />
                Share on Twitter
              </button>

              <button
                onClick={() => handleShare('linkedin')}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700/50 rounded-lg transition-colors"
              >
                <Linkedin className="h-4 w-4 text-blue-500" />
                Share on LinkedIn
              </button>

              <button
                onClick={handleCopyLink}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700/50 rounded-lg transition-colors"
              >
                {isCopied ? (
                  <Check className="h-4 w-4 text-green-400" />
                ) : (
                  <LinkIcon className="h-4 w-4 text-gray-400" />
                )}
                {isCopied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 