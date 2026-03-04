export interface Agent {
  id: string
  name: string
  description: string
  type: 'assistant' | 'tool' | 'workflow' | 'custom'
  status: 'active' | 'inactive' | 'running' | 'error'
  createdAt: Date
  updatedAt: Date
  config: AgentConfig
}

export interface AgentConfig {
  model?: string
  temperature?: number
  maxTokens?: number
  tools?: string[]
  prompt?: string
  memoryEnabled?: boolean
  maxHistoryMessages?: number
}

export interface AgentFormData {
  name: string
  description: string
  type: Agent['type']
  config: AgentConfig
}
