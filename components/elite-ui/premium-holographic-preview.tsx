'use client'

import { motion } from "framer-motion"
import { PremiumCard } from "@/components/ui/premium-card"
import { PremiumButton } from "@/components/ui/premium-button"
import { 
  Monitor, 
  Tablet, 
  Smartphone, 
  Maximize2, 
  Minimize2,
  RotateCcw,
  Download,
  Share2,
  Eye,
  Code
} from "lucide-react"
import { useState } from "react"

interface PremiumHolographicPreviewProps {
  previewHtml?: string
  code?: string
  onDownload?: () => void
  onShare?: () => void
  onReset?: () => void
}

type ViewportType = 'desktop' | 'tablet' | 'mobile'

export function PremiumHolographicPreview({ 
  previewHtml,
  code,
  onDownload,
  onShare,
  onReset
}: PremiumHolographicPreviewProps) {
  const [viewport, setViewport] = useState<ViewportType>('desktop')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview')

  const viewportConfig = {
    desktop: { width: '100%', height: '600px', icon: Monitor, label: 'Desktop' },
    tablet: { width: '768px', height: '1024px', icon: Tablet, label: 'Tablet' },
    mobile: { width: '375px', height: '667px', icon: Smartphone, label: 'Mobile' }
  }

  const currentViewport = viewportConfig[viewport]

  return (
    <div className="space-y-6">
      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Preview</h3>
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 w-full sm:w-auto">
            {Object.entries(viewportConfig).map(([key, config]) => {
              const IconComponent = config.icon
              return (
                <PremiumButton
                  key={key}
                  variant={viewport === key ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewport(key as ViewportType)}
                  className="px-2 sm:px-3 flex-1 sm:flex-none"
                >
                  <IconComponent className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  <span className="hidden sm:inline">{config.label}</span>
                </PremiumButton>
              )
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <PremiumButton
              variant={activeTab === 'preview' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('preview')}
              className="px-2 sm:px-3"
            >
              <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              <span className="hidden sm:inline">Preview</span>
            </PremiumButton>
            <PremiumButton
              variant={activeTab === 'code' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('code')}
              className="px-2 sm:px-3"
            >
              <Code className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              <span className="hidden sm:inline">Code</span>
            </PremiumButton>
          </div>

          <div className="flex items-center gap-1">
            <PremiumButton
              variant="outline"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="px-2 sm:px-3"
            >
              {isFullscreen ? <Minimize2 className="w-3 h-3 sm:w-4 sm:h-4" /> : <Maximize2 className="w-3 h-3 sm:w-4 sm:h-4" />}
            </PremiumButton>

            {onReset && (
              <PremiumButton
                variant="outline"
                size="sm"
                onClick={onReset}
                className="px-2 sm:px-3"
              >
                <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
              </PremiumButton>
            )}

            {onDownload && (
              <PremiumButton
                variant="secondary"
                size="sm"
                onClick={onDownload}
                className="px-2 sm:px-3"
              >
                <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                <span className="hidden sm:inline">Download</span>
              </PremiumButton>
            )}

            {onShare && (
              <PremiumButton
                variant="accent"
                size="sm"
                onClick={onShare}
                className="px-2 sm:px-3"
              >
                <Share2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                <span className="hidden sm:inline">Share</span>
              </PremiumButton>
            )}
          </div>
        </div>
      </motion.div>

      {/* Preview Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm' : ''}`}
      >
        <PremiumCard 
          variant="elevated" 
          className={`${isFullscreen ? 'absolute inset-4' : ''} overflow-hidden`}
        >
          {/* Holographic Overlay */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="premium-holographic opacity-10" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5" />
          </div>

          {/* Device Frame */}
          <div className="relative p-3 sm:p-4 lg:p-6">
            <div className="mx-auto bg-white rounded-xl sm:rounded-2xl shadow-elevated overflow-hidden">
              {/* Device Header */}
              <div className="bg-gray-100 px-3 sm:px-4 py-2 flex items-center justify-between">
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full" />
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full" />
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full" />
                </div>
                <div className="text-xs text-gray-600 font-medium">
                  {currentViewport.label} View
                </div>
              </div>

              {/* Content Area */}
              <div className="relative">
                {activeTab === 'preview' ? (
                  <div 
                    className="overflow-auto"
                    style={{ 
                      width: viewport === 'desktop' ? '100%' : currentViewport.width,
                      height: viewport === 'desktop' ? '300px' : currentViewport.height,
                      maxWidth: '100%',
                      maxHeight: '100%'
                    }}
                  >
                    {previewHtml ? (
                      <iframe
                        srcDoc={previewHtml}
                        className="w-full h-full border-0"
                        sandbox="allow-scripts allow-same-origin"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full min-h-[200px] sm:min-h-[300px] lg:min-h-[400px] bg-gray-50">
                        <div className="text-center p-4">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                            <Eye className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
                          </div>
                          <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No Preview Available</h4>
                          <p className="text-sm text-gray-600">Generate a UI component to see the preview</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-3 sm:p-4 lg:p-6">
                    <pre className="text-xs sm:text-sm text-gray-800 overflow-auto max-h-[300px] sm:max-h-[400px] lg:max-h-[600px]">
                      <code>{code || '// No code available'}</code>
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Holographic Effects */}
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent"
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary-500/20 to-transparent rounded-full blur-xl"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </div>
        </PremiumCard>

        {/* Fullscreen Overlay */}
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsFullscreen(false)}
          />
        )}
      </motion.div>

      {/* Loading State */}
      {!previewHtml && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 animate-premium-float">
            <Eye className="w-8 h-8 text-white" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Ready to Preview</h4>
          <p className="text-gray-600">Generate a UI component to see the holographic preview</p>
        </motion.div>
      )}
    </div>
  )
}
