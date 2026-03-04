<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Agent, AgentFormData } from '../types/agent'

const props = defineProps<{
  modelValue: boolean
  agent?: Agent | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  save: [data: AgentFormData]
}>()

const isOpen = ref(props.modelValue)
const formData = ref<AgentFormData>({
  name: '',
  description: '',
  type: 'assistant',
  config: {
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 2000,
    memoryEnabled: true,
    maxHistoryMessages: 10
  }
})

watch(() => props.modelValue, (val) => {
  isOpen.value = val
  if (val && props.agent) {
    formData.value = {
      name: props.agent.name,
      description: props.agent.description,
      type: props.agent.type,
      config: { ...props.agent.config }
    }
  } else if (val && !props.agent) {
    formData.value = {
      name: '',
      description: '',
      type: 'assistant',
      config: {
        model: 'gpt-4',
        temperature: 0.7,
        maxTokens: 2000,
        memoryEnabled: true,
        maxHistoryMessages: 10
      }
    }
  }
})

watch(isOpen, (val) => {
  emit('update:modelValue', val)
})

const close = () => {
  isOpen.value = false
}

const handleSubmit = () => {
  emit('save', { ...formData.value })
  close()
}
</script>

<template>
  <div v-if="isOpen" class="modal-overlay" @click="close">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>{{ agent ? '编辑智能体' : '创建智能体' }}</h2>
        <button class="btn-close" @click="close">✕</button>
      </div>
      
      <form @submit.prevent="handleSubmit" class="modal-body">
        <div class="form-group">
          <label>名称 *</label>
          <input 
            v-model="formData.name" 
            type="text" 
            required
            placeholder="输入智能体名称"
          />
        </div>
        
        <div class="form-group">
          <label>类型 *</label>
          <select v-model="formData.type" required>
            <option value="assistant">助手型</option>
            <option value="tool">工具型</option>
            <option value="workflow">工作流型</option>
            <option value="custom">自定义</option>
          </select>
        </div>
        
        <div class="form-group">
          <label>描述 *</label>
          <textarea 
            v-model="formData.description" 
            required
            placeholder="描述智能体的功能和用途"
            rows="3"
          ></textarea>
        </div>
        
        <div class="form-section">
          <h3>配置选项</h3>
          
          <div class="form-row">
            <div class="form-group">
              <label>模型</label>
              <select v-model="formData.config.model">
                <option value="gpt-4">GPT-4</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                <option value="claude-3">Claude 3</option>
                <option value="custom">自定义模型</option>
              </select>
            </div>
            
            <div class="form-group">
              <label>温度 (0-2)</label>
              <input 
                v-model.number="formData.config.temperature"
                type="number"
                min="0"
                max="2"
                step="0.1"
              />
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>最大令牌数</label>
              <input 
                v-model.number="formData.config.maxTokens"
                type="number"
                min="100"
                max="8000"
              />
            </div>
            
            <div class="form-group">
              <label>历史消息数</label>
              <input 
                v-model.number="formData.config.maxHistoryMessages"
                type="number"
                min="0"
                max="50"
              />
            </div>
          </div>
          
          <div class="form-group">
            <label class="checkbox-label">
              <input 
                v-model="formData.config.memoryEnabled"
                type="checkbox"
              />
              <span>启用记忆功能</span>
            </label>
          </div>
          
          <div class="form-group">
            <label>系统提示词</label>
            <textarea 
              v-model="formData.config.prompt"
              placeholder="定义智能体的行为和角色"
              rows="4"
            ></textarea>
          </div>
        </div>
        
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="close">
            取消
          </button>
          <button type="submit" class="btn btn-primary">
            {{ agent ? '保存' : '创建' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h2 {
  margin: 0;
  font-size: 24px;
  color: #1f2937;
}

.btn-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6b7280;
  padding: 0;
  line-height: 1;
}

.btn-close:hover {
  color: #1f2937;
}

.modal-body {
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #374151;
  font-size: 14px;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group textarea {
  resize: vertical;
  font-family: inherit;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-section {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
}

.form-section h3 {
  margin: 0 0 16px 0;
  font-size: 18px;
  color: #1f2937;
}

.checkbox-label {
  display: flex !important;
  align-items: center;
  cursor: pointer;
}

.checkbox-label input {
  width: auto !important;
  margin-right: 8px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
}

.btn {
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
}

.btn-secondary:hover {
  background: #e5e7eb;
}
</style>
