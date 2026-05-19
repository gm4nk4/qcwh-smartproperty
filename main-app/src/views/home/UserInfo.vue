<template>
	<div class="user-info">
		<div class="user-info-title">
			<p>欢迎来到智慧物业管理系统，{{ username }}</p>
			<span @click="emitLogout" class="logout-btn">退出登录</span>
		</div>
		<p class="user-info-time">{{ currentTime }}</p>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { formatAxis } from '/@/utils/formatTime';

interface Props {
	username?: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
	(e: 'logout'): void;
}>();

const emitLogout = () => emit('logout');

const currentTime = ref('');

const username = computed(() => props.username || '用户');

const updateTime = () => {
	currentTime.value = formatAxis(new Date());
};

onMounted(() => {
	updateTime();
	setInterval(updateTime, 60000);
});
</script>

<style scoped lang="scss">
.user-info {
	padding: 20px;
	background: #3487fa;
	border-radius: 16px;
	box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
	color: #fff;
	margin: 20px;

	.user-info-title {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 18px;
		font-weight: 600;
		margin-bottom: 8px;
	}

	.logout-btn {
		color: #fff;
		cursor: pointer;
		transition: opacity 0.2s;

		&:hover {
			opacity: 0.8;
		}
	}

	.user-info-time {
		font-size: 14px;
		opacity: 0.9;
	}
}
</style>
