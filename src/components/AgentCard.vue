<script setup lang="ts">
import type { Agent } from '../types/agent'

defineProps<{
  agent: Agent
}>()

const emit = defineEmits<{
  edit: [agent: Agent]
  delete: [agentId: string]
  toggleStatus: [agent: Agent]
}>()

const getStatusColor = (status: Agent['status']) => {
  const colors = {
    active: '#10b981',
    inactive: '#6b7280',
    running: '#3b82f6',
    error: '#ef4444'
  }
  return colors[status]
}

const getStatusText = (status: Agent['status']) => {
  const texts = {
    active: '激活',
    inactive: '未激活',
    running: '运行中',
    error: '错误'
  }
  return texts[status]
}

const getTypeIcon = (type: Agent['type']) => {
  const icons = {
    assistant: '🤖',
    tool: '🔧',
    workflow: '⚡',
    custom: '⭐'
  }
  return icons[type]
}

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<template>
  <div class="agent-card">
    <div class="agent-header">
      <div class="agent-icon">{{ getTypeIcon(agent.type) }}</div>
      <div class="agent-title">
        <h3>{{ agent.name }}</h3>
        <span class="agent-type">{{ agent.type }}</span>
      </div>
      <div 
        class="agent-status" 
        :style="{ backgroundColor: getStatusColor(agent.status) }"
      >
        {{ getStatusText(agent.status) }}
      </div>
    </div>
    
    <p class="agent-description">{{ agent.description }}</p>
    
    <div class="agent-config" v-if="agent.config">
      <div class="config-item" v-if="agent.config.model">
        <span class="config-label">模型:</span>
        <span class="config-value">{{ agent.config.model }}</span>
      </div>
      <div class="config-item" v-if="agent.config.temperature">
        <span class="config-label">温度:</span>
        <span class="config-value">{{ agent.config.temperature }}</span>
      </div>
    </div>
    
    <div class="agent-footer">
      <span class="agent-date">{{ formatDate(agent.updatedAt) }}</span>
      <div class="agent-actions">
        <button 
          class="btn-icon" 
          @click="emit('toggleStatus', agent)"
          :title="agent.status === 'active' ? '停用' : '激活'"
        >
          {{ agent.status === 'active' ? '⏸️' : '▶️' }}
        </button>
        <button 
          class="btn-icon" 
          @click="emit('edit', agent)"
          title="编辑"
        >
          ✏️
        </button>
        <button 
          class="btn-icon btn-danger" 
          @click="emit('delete', agent.id)"
          title="删除"
        >
          🗑️
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.agent-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 1px solid #e5e7eb;
}

.agent-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.agent-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.agent-icon {
  font-size: 32px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
}

.agent-title {
  flex: 1;
}

.agent-title h3 {
  margin: 0;
  font-size: 18px;
  color: #1f2937;
  font-weight: 600;
}

.agent-type {
  font-size: 12px;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.agent-status {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  color: white;
  font-weight: 500;
}

.agent-description {
  color: #4b5563;
  font-size: 14px;
  line-height: 1.6;
  margin: 0 0 12px 0;
}

.agent-config {
  background: #f9fafb;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 12px;
}

.config-item {
  display: flex;
  gap: 8px;
  font-size: 13px;
  margin-bottom: 4px;
}

.config-item:last-child {
  margin-bottom: 0;
}

.config-label {
  color: #6b7280;
  font-weight: 500;
}

.config-value {
  color: #1f2937;
}

.agent-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #e5e7eb;
}

.agent-date {
  font-size: 12px;
  color: #9ca3af;
}

.agent-actions {
  display: flex;
  gap: 8px;
}

.btn-icon {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background 0.2s;
}

.btn-icon:hover {
  background: #f3f4f6;
}

.btn-icon.btn-danger:hover {
  background: #fee2e2;
}
</style>
