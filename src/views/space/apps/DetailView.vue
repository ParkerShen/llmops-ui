<!--
 * @Date: 2026-09-06 17:55:28
 * @Author: parker
 * @FilePath: \llmops-apic:\Users\96082\Desktop\code\llmops\llmops-ui\src\views\space\apps\DetailView.vue
 * @Description: 
-->

<script setup lang="ts">
import { ref } from 'vue'
import { Message } from '@arco-design/web-vue'
import { appsApi } from '@/services/apps'
const query = ref('')
const messages = ref<{ roles: string; content: string }[]>([])
const isLoading = ref(false)
const clearMessages = () => {
    messages.value = []

}
const send = async () => {
    // 1.获取东湖输入的数据，并校验值是否存在
    if (!query.value) {
        Message.error('用户提问不能为空')
        return

    }
    // 当上一条请求没有结束时，不允许发起新的请求
    if (isLoading.value) {
        Message.warning('上一次回复还没有结束')
        return
    }
    // 提取用户的的输入信息
    const humanQuery = query.value
    messages.value.push({
        roles: 'human',
        content: humanQuery
    })
    // 清空输入框 

    query.value = ''

    // 5. 发起 api 请求(示例:POST /app/completion)
    isLoading.value = true
    try {
        const data = await appsApi.completion({ query: humanQuery })
        // 6. AI 回复来自后端统一信封的 data.content
        messages.value.push({ roles: 'ai', content: data.content })
    } catch (e) {
        // 请求失败/后端业务失败会抛 ApiError,e.message 是后端给的提示
        Message.error(e instanceof Error ? e.message : '请求失败,请稍后重试')
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
    <!-- 最外层容器，高度撑满整个浏览器屏幕 -->
    <div class="min-h-screen">
        <!-- 顶部导航 -->
        <header class="flex items-center h-[74px] bg-gray-100 border-b border-gray-200 px-4">
            顶部导航
        </header>

        <!-- 底部内容区 -->
        <div class="flex flex-row h-[calc(100vh-74px)]">
            <!-- 左侧的编排 -->
            <div class="w-2/3 bg-gray-50 h-full">

                <header class="flex items-center h-16 border-b border-gray-200 px-7 text-xl text-gray-700">
                    应用编排
                </header>
                <div class="flex flex-row h-[calc(100%-64px)]">
                    <div class="flex-1 border-r border-gray-200 p-6">人设与回复逻辑</div>
                    <div class="flex-1 p-6">应用能力</div>
                </div>
            </div>

            <!-- 右侧调试与预览 -->
            <div class="flex flex-col w-1/3 bg-white h-full">

                <header
                    class="flex flex-shrink-0 items-center h-16 px-4 text-xl bg-white border-b border-gray-200 shadow-sm">
                    调试与预览
                </header>
                <!-- 调试对话界面 -->

                <div class="h-full min-h-0 px-6 py-7 overflow-x-hidden overflow-y-scroll scrollbar-w-none">
                    <!-- 人类消息 -->
                    <div v-for="message in messages" :key="message.content" class="flex flex-row gap-2 mb-6">
                        <!-- 头像 -->
                        <a-avatar v-if="message.roles === 'human'" :style="{ backgroundColor: '#3370ff' }"
                            class="flex-shirink-0" :size="30">慕</a-avatar>
                        <a-avatar v-else shape="circle" :style="{
                            backgroundColor: '#00d0b6',
                            width: '30px',
                            height: '30px',
                            minWidth: '30px',
                            minHeight: '30px',
                            flexShrink: 0
                        }" class="flex-shirink-0" :size="30"><icon-apps /></a-avatar>

                        <!-- 实际消息 -->
                        <div v-if="message.roles === 'human'" class="flex flex-col gap-2">
                            <div class="font-semibold text-gray-700">{{ message.roles === 'human' ? '慕小课' : 'AI机器人' }}
                            </div>
                            <div
                                class="max-w-max bg-blue-700 text-white border border-blue-800 px-4 py-3 rounded-2xl leading-5">
                                {{ message.content }}
                            </div>
                        </div>
                        <div v-else class="flex flex-col gap-2">
                            <div class="font-semibold text-gray-700">deepseek</div>
                            <div
                                class="bg-gray-100 text-gray-900 border border-gray-200 px-4 py-3 rounded-2xl leading-5">
                                {{ message.content }}
                            </div>
                        </div>
                    </div>

                    <!-- 没有任何数据时 -->
                    <div v-if="messages.length === 0" class="mt-[200px] flex flex-col flex-item justify-center gap-2">
                        <a-avatar :size="70" shape="square" :style="{ backgroundColor: '#00d0b6' }">
                            <icon-apps />
                        </a-avatar>
                        <div class="text-2xl font-semibold text-gray-900 mt-2">ChatGPT聊天机器人</div>
                    </div>

                    <!-- AI加载状态 -->
                    <div v-if="isLoading" class="flex flex-row gap-2 mb-6">
                        <!-- 头像 -->
                        <a-avatar class="flex-shirink-0" :size="30"><icon-apps /></a-avatar>
                        <!-- 实际消息 -->
                        <div class="flex flex-col gap-2">
                            <div class="font-semibold text-gray-700">慕小课</div>
                            <div
                                class="bg-gray-100 text-gray-900 border border-gray-200 px-4 py-3 rounded-2xl leading-5">
                                <icon-loading />
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 调试对话输入框 -->
                <div class="w-full flex-shrink-0 flex flex-col">
                    <!-- 顶部输入框 -->
                    <div class="px-6 flex items-center gap-4">
                        <!-- 清除按钮 -->
                        <a-button class="flex-shrink-0" type="text" shape="circle" @click="clearMessages">
                            <template #icon>
                                <icon-empty size="16" :style="{ color: '#374151' }" />
                            </template>
                        </a-button>
                        <!-- 输入框组件 -->
                        <div class="h-[50px] flex items-center gap-2 px-4 flex-1 border border-gray-200 rounded-full">
                            <input type="text" class="flex-1 outline-0" v-model="query" @keyup.enter="send" />
                            <a-button type="text" shape="circle">
                                <template #icon>
                                    <icon-plus-circle size="16" :style="{ color: '#374151' }" />
                                </template>
                            </a-button>
                            <a-button type="text" shape="circle" @click="send">
                                <template #icon>
                                    <icon-send size="16" :style="{ color: '#1d4ed8' }" />
                                </template>
                            </a-button>
                        </div>
                    </div>

                    <!-- 底部提示文字 -->
                    <div class="text-center text-gray-500 text-xs py-4">
                        内容由AI生成，无法确保真实准确，仅供参考。
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<style scoped></style>