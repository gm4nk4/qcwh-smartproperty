<template>
	<div class="camera-monitor">
		<!-- 播放网格区域 -->
		<div ref="playBox" class="play-box-container">
			<div
				v-for="i in 4"
				:key="i"
				class="play-box"
				:class="{ active: playerIdx === i - 1 }"
				@click="playerIdx = i - 1"
			>
				<div v-if="!videoUrl[i - 1]" class="no-signal">
					{{ videoTip[i - 1] || '无信号输入' }}
				</div>
				<JessibucaPlayer
					v-else
					:ref="(el: any) => setPlayerRef(el, i)"
					:videoUrl="videoUrl[i - 1]"
					:idProp="i"
					:hasAudio="false"
				/>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="CameraMonitor">
import { ref, onMounted, onBeforeUnmount } from 'vue';

// 异步加载Jessibuca播放组件
const JessibucaPlayer = defineAsyncComponent(() => import('./jessibuca.vue'));

// 接收 props
const props = defineProps<{
	gateId?: string;
}>();

// 当前选中的播放窗口索引
const playerIdx = ref(0);

// 播放URL数组（前3个播放测试流，第4个为空）
const videoUrl = ref<string[]>([]);
const videoTip = ref<string[]>([]);

// 测试流数据
const testData = {
	app: '监控设备1号',
	stream: '监控设备1号',
	ws_flv: 'ws://10.40.92.101:80/监控设备1号/监控设备1号.live.flv',
};

// 播放器引用存储
const playerRefs = ref<any[]>([]);

const setPlayerRef = (el: any, index: number) => {
	if (el) {
		playerRefs.value[index - 1] = el;
	}
};

onMounted(() => {
	// 初始化视频URL和提示
	videoUrl.value = [testData.ws_flv, testData.ws_flv, testData.ws_flv, ''];
	videoTip.value = ['', '', '', ''];
});

onBeforeUnmount(() => {
	// 销毁所有播放器
	playerRefs.value.forEach((player, index) => {
		if (player && player.destroy) {
			player.destroy(index + 1);
		}
	});
});
</script>

<style scoped lang="scss">
.camera-monitor {
	height: 100%;
	display: flex;
	flex-direction: column;

	.play-box-container {
		flex: 1;
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: 1fr 1fr;
		gap: 12px;
		background-color: #fff;
		padding: 12px;

		.play-box {
			background: rgba(37, 47, 64, 1);
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 12px;
			position: relative;
			overflow: hidden;
			cursor: pointer;
			border: 2px solid transparent;
			transition: border-color 0.3s;

			&.active {
				border: 4px solid rgb(0, 198, 255);
			}

			.no-signal {
				color: #ffffff;
				font-size: 14px;
			}
		}
	}
}
</style>