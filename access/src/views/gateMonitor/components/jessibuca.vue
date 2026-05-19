<template>
	<div
		ref="containerRef"
		@dblclick="fullscreenSwich"
		class="jessibuca-container"
	>
		<slot></slot>
		<div class="video-wrapper"></div>
		<div class="buttons-box">
			<div class="buttons-box-left">
				<i v-if="!playing" class="iconfont icon-play jessibuca-btn" @click="playBtnClick"></i>
				<i v-if="playing" class="iconfont icon-pause jessibuca-btn" @click="pause"></i>
				<i class="iconfont icon-stop jessibuca-btn" @click="destroy"></i>
				<i v-if="isNotMute" class="iconfont icon-audio-high jessibuca-btn" @click="mute()"></i>
				<i v-if="!isNotMute" class="iconfont icon-audio-mute jessibuca-btn" @click="cancelMute()"></i>
			</div>
			<div class="buttons-box-right">
				<span class="jessibuca-btn">{{ kBps }} kb/s</span>
				<i class="iconfont icon-camera1196054easyiconnet jessibuca-btn" @click="screenshot" style="font-size: 1rem !important"></i>
				<i class="iconfont icon-shuaxin11 jessibuca-btn" @click="playBtnClick"></i>
				<i v-if="!fullscreen" class="iconfont icon-weibiaoti10 jessibuca-btn" @click="fullscreenSwich"></i>
				<i v-if="fullscreen" class="iconfont icon-weibiaoti11 jessibuca-btn" @click="fullscreenSwich"></i>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';

// 定义props
const props = defineProps<{
	videoUrl?: string;
	error?: string;
	hasAudio?: boolean;
	height?: number;
	idProp: number;
}>();

// 定义emits
const emit = defineEmits(['recordStart', 'recordEnd', 'screenshot', 'destroy']);

// 全局播放器实例存储
const jessibucaPlayer: Record<number, any> = {};

// 响应式状态
const playing = ref(false);
const isNotMute = ref(false);
const fullscreen = ref(false);
const loaded = ref(false);
const kBps = ref(0);
const containerRef = ref<HTMLDivElement | null>(null);

// 播放器尺寸更新
const updatePlayerDomSize = () => {
	const dom = containerRef.value;
	if (dom && dom.parentElement) {
		const parentWidth = dom.parentElement.clientWidth;
		const parentHeight = dom.parentElement.clientHeight;

		// 直接填满父容器
		dom.style.width = parentWidth + 'px';
		dom.style.height = parentHeight + 'px';
	}
};

// 创建播放器
const create = () => {
	if (!containerRef.value) return;

	const options = {
		container: containerRef.value,
		autoWasm: true,
		background: '',
		controlAutoHide: false,
		debug: false,
		decoder: '/decoder.js',
		forceNoOffscreen: false,
		hasAudio: props.hasAudio ?? false,
		heartTimeout: 5,
		heartTimeoutReplay: true,
		heartTimeoutReplayTimes: 3,
		hiddenAutoPause: false,
		hotKey: true,
		isFlv: false,
		isFullResize: true,
		isNotMute: isNotMute.value,
		isResize: true,
		keepScreenOn: true,
		loadingText: '请稍等, 视频加载中......',
		loadingTimeout: 10,
		loadingTimeoutReplay: true,
		loadingTimeoutReplayTimes: 3,
		openWebglAlignment: false,
		operateBtns: {
			fullscreen: true,
			screenshot: true,
			play: true,
			audio: true,
		},
		rotate: 0,
		showBandwidth: false,
		supportDblclickFullscreen: true,
		timeout: 10,
		useMSE: true,
		useWCS: false,
		useWebFullScreen: true,
		videoBuffer: 0.1,
		wasmDecodeErrorReplay: true,
		wcsUseVideoRender: true,
	};

	jessibucaPlayer[props.idProp] = new window.Jessibuca({ ...options });
	const player = jessibucaPlayer[props.idProp];

	player.on('pause', () => {
		playing.value = false;
	});
	player.on('play', () => {
		playing.value = true;
		loaded.value = true;
	});
	player.on('fullscreen', (msg: boolean) => {
		fullscreen.value = msg;
	});
	player.on('mute', (msg: boolean) => {
		isNotMute.value = !msg;
	});
	player.on('kBps', (kBpsVal: number) => {
		kBps.value = Math.round(kBpsVal);
	});
	player.on('error', (msg: any) => {
		console.log('Jessibuca -> error: ', msg);
	});
	player.on('timeout', (msg: any) => {
		console.log('Jessibuca -> timeout: ', msg);
	});
	player.on('recordStart', () => {
		emit('recordStart');
	});
	player.on('recordEnd', () => {
		emit('recordEnd');
	});
};

// 播放
const play = async (url: string) => {
	if (!url) return;

	destroy();
	create();

	const player = jessibucaPlayer[props.idProp];
	if (!player) return;

	player.on('play', () => {
		playing.value = true;
		loaded.value = true;
	});

	if (player.hasLoaded()) {
		player.play(url);
	} else {
		player.on('load', () => {
			player.play(url);
		});
	}
};

// 点击播放按钮
const playBtnClick = () => {
	if (props.videoUrl) {
		play(props.videoUrl);
	}
};

// 暂停
const pause = () => {
	const player = jessibucaPlayer[props.idProp];
	if (player) {
		player.pause();
	}
	playing.value = false;
};

// 截图
const screenshot = () => {
	const player = jessibucaPlayer[props.idProp];
	if (player) {
		player.screenshot();
	}
};

// 静音
const mute = () => {
	const player = jessibucaPlayer[props.idProp];
	if (player) {
		player.mute();
	}
};

// 取消静音
const cancelMute = () => {
	const player = jessibucaPlayer[props.idProp];
	if (player) {
		player.cancelMute();
	}
};

// 销毁播放器
const destroy = () => {
	const player = jessibucaPlayer[props.idProp];
	if (player) {
		player.destroy();
	}
	jessibucaPlayer[props.idProp] = null;
	playing.value = false;
};

// 全屏切换
const fullscreenSwich = () => {
	const player = jessibucaPlayer[props.idProp];
	if (player) {
		const isFull = isFullscreen();
		player.setFullscreen(!isFull);
		fullscreen.value = !isFull;
	}
};

// 检查是否全屏
const isFullscreen = () => {
	return !!(
		document.fullscreenElement ||
		document.msFullscreenElement ||
		document.mozFullScreenElement ||
		document.webkitFullscreenElement
	);
};

// 监听videoUrl变化
watch(
	() => props.videoUrl,
	(newValue, oldValue) => {
		if (newValue && newValue !== oldValue) {
			destroy();
			play(newValue);
		}
	},
	{ immediate: true }
);

onMounted(() => {
	nextTick(() => {
		updatePlayerDomSize();
		window.addEventListener('resize', updatePlayerDomSize);
	});
});

onBeforeUnmount(() => {
	window.removeEventListener('resize', updatePlayerDomSize);
	destroy();
});

// 暴露方法给父组件
defineExpose({
	play,
	pause,
	destroy,
	screenshot,
});
</script>

<style scoped>
.jessibuca-container {
	width: 100%;
	height: 100%;
	background-color: #000000;
	margin: 0 auto;
	position: relative;
}

.video-wrapper {
	width: 100%;
	height: 100%;
	position: absolute;
	top: 0;
	left: 0;
}

.buttons-box {
	width: 100%;
	height: 28px;
	background-color: rgba(43, 51, 63, 0.7);
	position: absolute;
	display: flex;
	left: 0;
	bottom: 0;
	user-select: none;
	z-index: 10;
}

.jessibuca-btn {
	width: 20px;
	color: rgb(255, 255, 255);
	line-height: 27px;
	margin: 0px 10px;
	padding: 0px 2px;
	cursor: pointer;
	text-align: center;
	font-size: 0.8rem !important;
}

.buttons-box-left {
	display: flex;
}

.buttons-box-right {
	position: absolute;
	right: 0;
	display: flex;
}
</style>