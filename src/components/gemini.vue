<template>
  <div class="agent-container">
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6" v-for="item in statistics" :key="item.label">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <el-statistic :title="item.label" :value="item.value">
              <template #suffix>
                <el-icon :style="{ color: item.color }"><component :is="item.icon" /></el-icon>
              </template>
            </el-statistic>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <div class="toolbar">
      <el-input v-model="searchQuery" placeholder="搜索智能体名称..." style="width: 300px">
        <template #prefix><el-icon><Search /></el-icon></template>
      </el-input>
      <el-button type="primary" :icon="Plus" @click="handleCreate">新建智能体</el-button>
    </div>

    <el-table :data="filteredAgents" border style="width: 100%" v-loading="loading">
      <el-table-column prop="name" label="智能体名称" min-width="180">
        <template #default="{ row }">
          <div style="display: flex; align-items: center">
            <el-avatar :size="32" :src="row.avatar" style="margin-right: 10px" />
            <span style="font-weight: bold">{{ row.name }}</span>
          </div>
        </template>
      </el-table-column>
      
      <el-table-column prop="model" label="底座模型" width="150">
        <template #default="{ row }">
          <el-tag effect="plain">{{ row.model }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="status" label="运行状态" width="120">
        <template #default="{ row }">
          <el-tag :type="statusMap[row.status].type" dot>
            {{ statusMap[row.status].label }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="lastUsed" label="最后调用时间" width="180" />

      <el-table-column label="操作" width="220" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="handleEdit(row)">配置</el-button>
          <el-button size="small" type="success" plain @click="handleDebug(row)">调试</el-button>
          <el-popconfirm title="确定删除该智能体吗？" @confirm="handleDelete(row)">
            <template #reference>
              <el-button size="small" type="danger" link>删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <el-drawer v-model="drawerVisible" :title="editingAgent.id ? '编辑智能体' : '新建智能体'" size="500px">
      <el-form :model="editingAgent" label-position="top">
        <el-form-item label="名称" required>
          <el-input v-model="editingAgent.name" placeholder="输入名称" />
        </el-form-item>
        <el-form-item label="选择模型">
          <el-select v-model="editingAgent.model" style="width: 100%">
            <el-option label="GPT-4o" value="gpt-4o" />
            <el-option label="Claude 3.5 Sonnet" value="claude-3.5" />
            <el-option label="DeepSeek-V3" value="deepseek-v3" />
          </el-select>
        </el-form-item>
        <el-form-item label="系统提示词 (System Prompt)">
          <el-input v-model="editingAgent.prompt" type="textarea" :rows="6" placeholder="设定智能体的人设和任务..." />
        </el-form-item>
        <el-form-item label="温度值 (Temperature)">
          <el-slider v-model="editingAgent.temp" :max="2" :step="0.1" show-input />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="drawerVisible = false">取消</el-button>
        <el-button type="primary" @click="saveAgent">保存配置</el-button>
      </template>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Plus, Search, Cpu, Connection, CircleCheck, Warning } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// 状态映射
const statusMap = {
  online: { label: '运行中', type: 'success' },
  offline: { label: '已停止', type: 'info' },
  error: { label: '异常', type: 'danger' }
}

// 模拟数据
const loading = ref(false)
const searchQuery = ref('')
const agents = ref([
  { id: 1, name: '中英文翻译官', model: 'DeepSeek-V3', status: 'online', lastUsed: '2024-05-20 14:20', prompt: '你是一个翻译专家...', temp: 0.3, avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=1' },
  { id: 2, name: 'SQL 生成助手', model: 'GPT-4o', status: 'online', lastUsed: '2024-05-20 15:10', prompt: '你负责把自然语言转成SQL...', temp: 0.1, avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=2' },
  { id: 3, name: '周报润色机器人', model: 'Claude-3.5', status: 'offline', lastUsed: '2024-05-19 09:00', prompt: '润色我的工作内容...', temp: 0.7, avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=3' }
])

// 统计数据
const statistics = [
  { label: '总计智能体', value: 12, icon: Cpu, color: '#409EFF' },
  { label: '在线实例', value: 8, icon: CircleCheck, color: '#67C23A' },
  { label: '待处理任务', value: 45, icon: Connection, color: '#E6A23C' },
  { label: '异常告警', value: 1, icon: Warning, color: '#F56C6C' },
]

// 筛选逻辑
const filteredAgents = computed(() => {
  return agents.value.filter(a => a.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
})

// 表单与抽屉
const drawerVisible = ref(false)
const editingAgent = ref({})

const handleCreate = () => {
  editingAgent.value = { name: '', model: 'gpt-4o', prompt: '', temp: 0.7 }
  drawerVisible.value = true
}

const handleEdit = (row) => {
  editingAgent.value = { ...row }
  drawerVisible.value = true
}

const saveAgent = () => {
  ElMessage.success('配置已更新')
  drawerVisible.value = false
  // 这里可以添加具体的 API 请求
}

const handleDelete = (row) => {
  agents.value = agents.value.filter(a => a.id !== row.id)
  ElMessage.warning(`已删除智能体：${row.name}`)
}

const handleDebug = (row) => {
  ElMessage.info(`正在打开 ${row.name} 的调试窗口...`)
}
</script>

<style scoped>
.agent-container {
  padding: 24px;
  background-color: #f5f7fa;
  min-height: 100vh;
}
.stat-row {
  margin-bottom: 24px;
}
.stat-card {
  --el-card-padding: 20px;
}
.toolbar {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  background: white;
  padding: 16px;
  border-radius: 8px;
}
:deep(.el-statistic__title) {
  font-size: 14px;
  margin-bottom: 8px;
}
</style>