'use client'

import { motion, AnimatePresence } from "framer-motion"
import { PremiumCard } from "@/components/ui/premium-card"
import { PremiumButton } from "@/components/ui/premium-button"
import { PremiumInput } from "@/components/ui/premium-input"
import { PremiumBadge } from "@/components/ui/premium-badge"
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Zap, 
  Lightbulb,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RefreshCw
} from "lucide-react"
import { useState, useRef, useEffect } from "react"

interface ChatMessage {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  suggestions?: string[]
}

interface PremiumChatInterfaceProps {
  messages: ChatMessage[]
  onSendMessage: (message: string) => void
  isLoading?: boolean
  suggestions?: string[]
}

export function PremiumChatInterface({ 
  messages, 
  onSendMessage, 
  isLoading = false,
  suggestions = []
}: PremiumChatInterfaceProps) {
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim())
      setInputValue('')
      setIsTyping(true)
      setTimeout(() => setIsTyping(false), 1000)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const quickSuggestions = [
    "Create a modern login page",
    "Design a dashboard layout",
    "Build a contact form",
    "Generate a pricing table",
    "Make a hero section"
  ]

  const displaySuggestions = suggestions.length > 0 ? suggestions : quickSuggestions

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 sm:p-6 border-b border-gray-200"
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-2 bg-gradient-primary rounded-lg sm:rounded-xl flex-shrink-0">
            <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Neural Assistant</h3>
            <p className="text-xs sm:text-sm text-gray-600">AI-powered design companion</p>
          </div>
          {isLoading && (
            <PremiumBadge variant="primary" size="sm" animated className="flex-shrink-0">
              <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
              <span className="hidden sm:inline">Thinking...</span>
            </PremiumBadge>
          )}
        </div>
      </motion.div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4" aria-live="polite">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <PremiumCard 
                variant={message.type === 'user' ? 'primary' : 'elevated'}
                className={`max-w-[85%] sm:max-w-[80%] p-3 sm:p-4 ${
                  message.type === 'user' 
                    ? 'bg-gradient-primary text-white' 
                    : 'bg-white'
                }`}
              >
                <div className="flex items-start gap-2 sm:gap-3">
                  {message.type === 'assistant' && (
                    <div className="p-1.5 sm:p-2 bg-primary-100 rounded-lg flex-shrink-0">
                      <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-primary-600" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs sm:text-sm ${
                      message.type === 'user' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {message.content}
                    </p>
                    <div className={`flex items-center gap-2 mt-2 ${
                      message.type === 'user' ? 'justify-end' : 'justify-start'
                    }`}>
                      <span className={`text-xs ${
                        message.type === 'user' ? 'text-white/70' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                      {message.type === 'assistant' && (
                        <div className="flex items-center gap-1">
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <ThumbsUp className="w-3 h-3 text-gray-400" />
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <ThumbsDown className="w-3 h-3 text-gray-400" />
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <Copy className="w-3 h-3 text-gray-400" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  {message.type === 'user' && (
                    <div className="p-2 bg-white/20 rounded-lg flex-shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </PremiumCard>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <PremiumCard variant="elevated" className="max-w-[80%] p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <Bot className="w-4 h-4 text-primary-600" />
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </PremiumCard>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions */}
      {messages.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 sm:p-4 lg:p-6 border-t border-gray-200"
        >
          <div className="mb-3 sm:mb-4">
            <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Quick Start</h4>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {displaySuggestions.slice(0, 3).map((suggestion, index) => (
                <PremiumButton
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setInputValue(suggestion)}
                  className="text-xs px-2 sm:px-3"
                >
                  <Lightbulb className="w-3 h-3 mr-1" />
                  <span className="hidden sm:inline">{suggestion}</span>
                  <span className="sm:hidden">{suggestion.split(' ')[0]}</span>
                </PremiumButton>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Input */}
      <div className="p-3 sm:p-4 lg:p-6 border-t border-gray-200">
        <div className="flex items-end gap-2 sm:gap-3">
          <div className="flex-1 min-w-0">
            <PremiumInput
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe the UI you want to create..."
              variant="filled"
              size="sm"
              disabled={isLoading}
              className="text-sm"
              aria-label="Chat message input"
            />
          </div>
          <PremiumButton
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            size="sm"
            glow
            className="px-3 sm:px-4 lg:px-6 flex-shrink-0"
            aria-label="Send message"
          >
            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
          </PremiumButton>
        </div>
      </div>
    </div>
  )
}
