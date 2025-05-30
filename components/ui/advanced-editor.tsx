'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { File, Folder, FolderOpen, X, Plus } from 'lucide-react'
import { Button } from './button'
import { cn } from '@/lib/utils'

interface FileItem {
  id: string
  name: string
  language: string
  content: string
}

interface AdvancedEditorProps {
  initialFiles?: FileItem[]
  readOnly?: boolean
  onChange?: (files: FileItem[]) => void
  className?: string
}

export function AdvancedEditor({
  initialFiles = [],
  readOnly = false,
  onChange,
  className,
}: AdvancedEditorProps) {
  const [files, setFiles] = useState<FileItem[]>(initialFiles)
  const [activeFileId, setActiveFileId] = useState<string | null>(
    initialFiles[0]?.id || null
  )
  const [isFileTreeOpen, setIsFileTreeOpen] = useState(true)
  const editorRef = useRef<HTMLTextAreaElement>(null)

  const activeFile = files.find(file => file.id === activeFileId)

  useEffect(() => {
    if (onChange) {
      onChange(files)
    }
  }, [files, onChange])

  const handleFileSelect = (fileId: string) => {
    setActiveFileId(fileId)
  }

  const handleFileClose = (fileId: string) => {
    const newFiles = files.filter(file => file.id !== fileId)
    setFiles(newFiles)
    
    if (activeFileId === fileId) {
      setActiveFileId(newFiles[0]?.id || null)
    }
  }

  const handleContentChange = (content: string) => {
    if (!activeFileId || readOnly) return

    setFiles(prev =>
      prev.map(file =>
        file.id === activeFileId ? { ...file, content } : file
      )
    )
  }

  const addNewFile = () => {
    const newFile: FileItem = {
      id: `file-${Date.now()}`,
      name: 'untitled.js',
      language: 'javascript',
      content: '// New file\n',
    }
    setFiles(prev => [...prev, newFile])
    setActiveFileId(newFile.id)
  }

  return (
    <div className={cn('flex h-full bg-gray-900 rounded-lg overflow-hidden', className)}>
      {/* File Tree */}
      <motion.div
        initial={false}
        animate={{ width: isFileTreeOpen ? 250 : 0 }}
        className="bg-gray-800 border-r border-gray-700 overflow-hidden"
      >
        <div className="p-3 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-white">Files</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={addNewFile}
              className="h-6 w-6"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="p-2">
          {files.map(file => (
            <div
              key={file.id}
              className={cn(
                'flex items-center justify-between p-2 rounded cursor-pointer group',
                activeFileId === file.id
                  ? 'bg-purple-600/20 text-purple-300'
                  : 'text-gray-300 hover:bg-gray-700'
              )}
              onClick={() => handleFileSelect(file.id)}
            >
              <div className="flex items-center space-x-2">
                <File className="h-4 w-4" />
                <span className="text-sm truncate">{file.name}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  handleFileClose(file.id)
                }}
                className="h-5 w-5 opacity-0 group-hover:opacity-100"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Tab Bar */}
        <div className="flex items-center bg-gray-800 border-b border-gray-700">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsFileTreeOpen(!isFileTreeOpen)}
            className="h-8 w-8 m-1"
          >
            {isFileTreeOpen ? <FolderOpen className="h-4 w-4" /> : <Folder className="h-4 w-4" />}
          </Button>
          <div className="flex-1 flex">
            {files.map(file => (
              <div
                key={file.id}
                className={cn(
                  'flex items-center space-x-2 px-3 py-2 border-r border-gray-700 cursor-pointer',
                  activeFileId === file.id
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                )}
                onClick={() => handleFileSelect(file.id)}
              >
                <File className="h-4 w-4" />
                <span className="text-sm">{file.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleFileClose(file.id)
                  }}
                  className="h-4 w-4 p-0 hover:bg-gray-600"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Editor Content */}
        <div className="flex-1 relative">
          {activeFile ? (
            <textarea
              ref={editorRef}
              value={activeFile.content}
              onChange={(e) => handleContentChange(e.target.value)}
              readOnly={readOnly}
              className="w-full h-full p-4 bg-gray-900 text-white font-mono text-sm resize-none focus:outline-none"
              placeholder="Start typing your code..."
              spellCheck={false}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <File className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No file selected</p>
                <p className="text-sm mt-2">Select a file from the sidebar or create a new one</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 