'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { toast } from 'react-hot-toast'
import { 
  Code, 
  File, 
  Upload, 
  ArrowRight, 
  CheckCircle,
  AlertCircle,
  Clock,
  ChevronRight,
  ChevronLeft,
  Github,
  Share2,
  History,
  Zap,
  Sparkles
} from 'lucide-react'
import { AdvancedEditor } from '@/components/ui/advanced-editor'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

const steps = [
  { id: 'files', title: 'Upload Files', icon: File },
  { id: 'details', title: 'Submission Details', icon: Code },
  { id: 'analysis', title: 'Code Analysis', icon: Sparkles },
  { id: 'review', title: 'Review & Submit', icon: CheckCircle },
]

const codeTemplates = [
  {
    name: 'React Component',
    language: 'typescript',
    content: `import React from 'react';

interface Props {
  // Add your props here
}

export const Component: React.FC<Props> = () => {
  return (
    <div>
      {/* Your component content */}
    </div>
  );
};`,
  },
  {
    name: 'API Route',
    language: 'typescript',
    content: `import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Your API logic here
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}`,
  },
  {
    name: 'Database Model',
    language: 'typescript',
    content: `import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

class User extends Model {
  // Add your model attributes here
}

User.init({
  // Define your model fields here
}, {
  sequelize,
  modelName: 'User',
});

export default User;`,
  },
]

export default function SubmitPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [files, setFiles] = useState<any[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [language, setLanguage] = useState('typescript')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [analysis, setAnalysis] = useState<any>(null)
  const [estimatedTime, setEstimatedTime] = useState<number | null>(null)
  const [autoSave, setAutoSave] = useState(true)
  const [versionHistory, setVersionHistory] = useState<any[]>([])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      id: `file-${Date.now()}-${file.name}`,
      name: file.name,
      language: file.name.split('.').pop() || 'plaintext',
      content: '',
    }))
    setFiles(prev => [...prev, ...newFiles])
    toast.success(`Added ${acceptedFiles.length} file(s)`)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/javascript': ['.js', '.jsx'],
      'text/typescript': ['.ts', '.tsx'],
      'text/python': ['.py'],
      'text/java': ['.java'],
      'text/cpp': ['.cpp', '.c'],
      'text/go': ['.go'],
      'text/rust': ['.rs'],
    },
    multiple: true,
  })

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success('Code submitted successfully!')
      // Reset form
      setFiles([])
      setTitle('')
      setDescription('')
      setCurrentStep(0)
    } catch (error) {
      toast.error('Failed to submit code')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTemplateSelect = (template: typeof codeTemplates[0]) => {
    setFiles(prev => [...prev, {
      id: `file-${Date.now()}`,
      name: `${template.name.toLowerCase().replace(/\s+/g, '-')}.${template.language}`,
      language: template.language,
      content: template.content,
    }])
    toast.success('Template added')
  }

  const handleGithubImport = async () => {
    // TODO: Implement GitHub import
    toast('GitHub import coming soon!', { icon: 'ℹ️' })
  }

  const handleShare = () => {
    // TODO: Implement sharing
    toast('Sharing coming soon!', { icon: 'ℹ️' })
  }

  const handleVersionHistory = () => {
    // TODO: Implement version history
    toast('Version history coming soon!', { icon: 'ℹ️' })
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div
              {...getRootProps()}
              className={`p-8 border-2 border-dashed rounded-xl text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-purple-500 bg-purple-500/10'
                  : 'border-gray-700 hover:border-purple-500/50'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg text-white mb-2">
                {isDragActive
                  ? 'Drop your files here'
                  : 'Drag and drop your code files here'}
              </p>
              <p className="text-sm text-gray-400">
                or click to select files
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={handleGithubImport}
                className="flex items-center justify-center space-x-2"
              >
                <Github className="h-5 w-5" />
                <span>Import from GitHub</span>
              </Button>
              <Button
                variant="outline"
                onClick={handleVersionHistory}
                className="flex items-center justify-center space-x-2"
              >
                <History className="h-5 w-5" />
                <span>Version History</span>
              </Button>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Code Templates</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {codeTemplates.map((template) => (
                  <button
                    key={template.name}
                    onClick={() => handleTemplateSelect(template)}
                    className="p-4 rounded-lg bg-gray-800/50 border border-gray-700 hover:border-purple-500/50 transition-colors text-left"
                  >
                    <Code className="h-6 w-6 text-purple-500 mb-2" />
                    <h4 className="text-white font-medium">{template.name}</h4>
                    <p className="text-sm text-gray-400 mt-1">
                      {template.language.toUpperCase()}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {files.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Selected Files</h3>
                <div className="space-y-2">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 border border-gray-700"
                    >
                      <div className="flex items-center space-x-3">
                        <File className="h-5 w-5 text-gray-400" />
                        <span className="text-white">{file.name}</span>
                      </div>
                      <button
                        onClick={() => setFiles(prev => prev.filter(f => f.id !== file.id))}
                        className="text-gray-400 hover:text-red-400"
                      >
                        <AlertCircle className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )

      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a descriptive title"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your code and what you'd like to get feedback on"
                rows={4}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Primary Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              >
                <option value="typescript">TypeScript</option>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="go">Go</option>
                <option value="rust">Rust</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="autoSave"
                checked={autoSave}
                onChange={(e) => setAutoSave(e.target.checked)}
                className="rounded border-gray-700"
              />
              <label htmlFor="autoSave" className="text-sm text-gray-400">
                Enable auto-save
              </label>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Code Analysis</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">Complexity Score</p>
                  <div className="flex items-center space-x-2">
                    <Progress value={75} className="flex-1" />
                    <span className="text-white">75%</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Estimated Review Time</p>
                  <p className="text-white">~15 minutes</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Potential Issues</p>
                  <div className="mt-2 space-y-2">
                    <Badge variant="destructive">High complexity in main function</Badge>
                    <Badge variant="warning">Missing error handling</Badge>
                    <Badge variant="info">Consider adding documentation</Badge>
                  </div>
                </div>
              </div>
            </Card>

            <div className="p-6 rounded-xl bg-gray-800/50 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Preview</h3>
              <div className="h-96">
                <AdvancedEditor
                  initialFiles={files}
                  readOnly
                />
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-gray-800/50 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Review Your Submission</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">Title</p>
                  <p className="text-white">{title}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Description</p>
                  <p className="text-white">{description}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Language</p>
                  <p className="text-white capitalize">{language}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Files</p>
                  <div className="mt-2 space-y-2">
                    {files.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center space-x-2 text-white"
                      >
                        <File className="h-4 w-4" />
                        <span>{file.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-gray-800/50 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Preview</h3>
              <div className="h-96">
                <AdvancedEditor
                  initialFiles={files}
                  readOnly
                />
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-8">
      <div className="max-w-4xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    index <= currentStep
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-800 text-gray-400'
                  }`}
                >
                  {index < currentStep ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    <step.icon className="h-6 w-6" />
                  )}
                </div>
                <span
                  className={`ml-2 text-sm ${
                    index <= currentStep ? 'text-white' : 'text-gray-400'
                  }`}
                >
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div
                    className={`w-24 h-0.5 mx-4 ${
                      index < currentStep ? 'bg-purple-500' : 'bg-gray-700'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="mb-8">
          {renderStep()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(prev => prev - 1)}
            disabled={currentStep === 0}
            className="flex items-center"
          >
            <ChevronLeft className="h-5 w-5 mr-2" />
            Previous
          </Button>

          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={handleShare}
              className="flex items-center"
            >
              <Share2 className="h-5 w-5 mr-2" />
              Share
            </Button>

            {currentStep === steps.length - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <Clock className="h-5 w-5 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="flex items-center"
              >
                Next
                <ChevronRight className="h-5 w-5 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 