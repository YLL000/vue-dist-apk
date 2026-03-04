<script setup lang="ts">
import { ref, computed } from 'vue'
import AgentCard from '../components/AgentCard.vue'
import AgentForm from '../components/AgentForm.vue'
import type { Agent, AgentFormData } from '../types/agent'

const agents = ref<Agent[]>([
  {
    id: '1',
    name: '代码助手',
    description: '帮助编写、审查和优化代码的智能助手。支持多种编程语言，能够理解上下文并提供智能建议。',
    type: 'assistant',
    status: 'active',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-03-01'),
    config: {
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 2000,
      memoryEnabled: true,
      maxHistoryMessages: 10
    }
  },
  {
    id: '2',
    name: '数据分析工具',
    description: '自动化数据分析和可视化工具，支持多种数据格式，能生成专业报告。',
    type: 'tool',
    status: 'running',
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-03-02'),
    config: {
      model: 'gpt-4',
      temperature: 0.3,
      maxTokens: 4000,
      memoryEnabled: false
    }
  },
  {
    id: '3',
    name: '文档处理流程',
    description: '自动化的文档处理工作流，包括提取、转换和归档功能。',
    type: 'workflow',
    status: 'inactive',
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-02-28'),
    config: {
      model: 'gpt-3.5-turbo',
      temperature: 0.5,
      maxTokens: 1500,
      memoryEnabled: true
    }
  },
  {
    id: '4',
    name: '智能客服',
    description: '多语言客户服务智能体，能够处理常见问题和复杂查询。',
    type: 'custom',
    status: 'active',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-03-03'),
    config: {
      model: 'claude-3',
      temperature: 0.8,
      maxTokens: 3000,
      memoryEnabled: true,
      maxHistoryMessages: 20
    }
  }
])

const searchQuery = ref('')
const filterType = ref<string>('all')
const filterStatus = ref<string>('all')
const isFormOpen = ref(false)
const editingAgent = ref<Agent | null>(null)

const filteredAgents = computed(() => {
  return agents.value.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         agent.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesType = filterType.value === 'all' || agent.type === filterType.value
    const matchesStatus = filterStatus.value === 'all' || agent.status === filterStatus.value
    return matchesSearch && matchesType && matchesStatus
  })
})

const stats = computed(() => ({
  total: agents.value.length,
  active: agents.value.filter(a => a.status === 'active').length,
  running: agents.value.filter(a => a.status === 'running').length,
  inactive: agents.value.filter(a => a.status === 'inactive').length
}))

const openCreateForm = () => {
  editingAgent.value = null
  isFormOpen.value = true
}

const openEditForm = (agent: Agent) => {
  editingAgent.value = agent
  isFormOpen.value = true
}

const handleSave = (data: AgentFormData) => {
  if (editingAgent.value) {
    const index = agents.value.findIndex(a => a.id === editingAgent.value!.id)
    if (index !== -1) {
      agents.value[index] = {
        ...editingAgent.value,
        ...data,
        updatedAt: new Date()
      }
    }
  } else {
    const newAgent: Agent = {
      id: Date.now().toString(),
      ...data,
      status: 'inactive',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    agents.value.push(newAgent)
  }
}

const handleDelete = (agentId: string) => {
  if (confirm('确定要删除这个智能体吗？')) {
    agents.value = agents.value.filter(a => a.id !== agentId)
  }
}

const handleToggleStatus = (agent: Agent) => {
  const index = agents.value.findIndex(a => a.id === agent.id)
  if (index !== -1) {
    const newStatus = agent.status === 'active' ? 'inactive' : 'active'
    agents.value[index] = {
      ...agent,
      status: newStatus,
      updatedAt: new Date()
    }
  }
}
</script>

<template>
  <div class="agent-management">
    <div class="header">
      <div class="header-content">
        <div>
          <h1>智能体管理</h1>
          <p class="subtitle">管理和监控您的 AI 智能体</p>
        </div>
        <button class="btn-create" @click="openCreateForm">
          <span class="btn-icon">+</span>
          创建智能体
        </button>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">📊</div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.total }}</div>
          <div class="stat-label">总智能体</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);">✓</div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.active }}</div>
          <div class="stat-label">已激活</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);">⚡</div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.running }}</div>
          <div class="stat-label">运行中</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);">⏸️</div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.inactive }}</div>
          <div class="stat-label">未激活</div>
        </div>
      </div>
    </div>

    <div class="filters-section">
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="搜索智能体名称或描述..."
          class="search-input"
        />
      </div>
      
      <div class="filter-group">
        <select v-model="filterType" class="filter-select">
          <option value="all">所有类型</option>
          <option value="assistant">助手型</option>
          <option value="tool">工具型</option>
          <option value="workflow">工作流型</option>
          <option value="custom">自定义</option>
        </select>
        
        <select v-model="filterStatus" class="filter-select">
          <option value="all">所有状态</option>
          <option value="active">已激活</option>
          <option value="inactive">未激活</option>
          <option value="running">运行中</option>
          <option value="error">错误</option>
        </select>
      </div>
    </div>

    <div class="agents-grid">
      <AgentCard
        v-for="agent in filteredAgents"
        :key="agent.id"
        :agent="agent"
        @edit="openEditForm"
        @delete="handleDelete"
        @toggle-status="handleToggleStatus"
      />
    </div>

    <div v-if="filteredAgents.length === 0" class="empty-state">
      <div class="empty-icon">🔍</div>
      <h3>没有找到智能体</h3>
      <p>尝试调整搜索条件或创建新的智能体</p>
    </div>

    <AgentForm
      v-model="isFormOpen"
      :agent="editingAgent"
      @save="handleSave"
    />
  </div>
</template>

<style scoped>
.agent-management {
  min-height: 100vh;
  background: #f9fafb;
  padding: 0;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px;
  color: white;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h1 {
  margin: 0;
  font-size: 32px;
  font-weight: 700;
}

.subtitle {
  margin: 8px 0 0 0;
  opacity: 0.9;
  font-size: 16px;
}

.btn-create {
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  color: #667eea;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-create:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.btn-create .btn-icon {
  font-size: 20px;
  font-weight: bold;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  padding: 30px 40px;
  max-width: 1400px;
  margin: 0 auto;
  margin-top: -20px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
  line-height: 1;
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
  margin-top: 4px;
}

.filters-section {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px 20px;
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  min-width: 300px;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 18px;
}

.search-input {
  width: 100%;
  padding: 12px 16px 12px 48px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  font-size: 14px;
  background: white;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.filter-group {
  display: flex;
  gap: 12px;
}

.filter-select {
  padding: 12px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  font-size: 14px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-select:focus {
  outline: none;
  border-color: #667eea;
}

.agents-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 20px;
  padding: 0 40px 40px;
  max-width: 1400px;
  margin: 0 auto;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-state h3 {
  margin: 0 0 8px 0;
  font-size: 24px;
  color: #374151;
}

.empty-state p {
  margin: 0;
  font-size: 16px;
}

@media (max-width: 768px) {
  .header {
    padding: 24px;
  }
  
  .header-content {
    flex-direction: column;
    gap: 20px;
    align-items: flex-start;
  }
  
  .stats-grid {
    padding: 20px 24px;
  }
  
  .filters-section {
    padding: 0 24px 16px;
  }
  
  .agents-grid {
    padding: 0 24px 24px;
  }
}
</style>
