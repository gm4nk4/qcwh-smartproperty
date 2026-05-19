<template>
	<div style="overflow: auto; height: 550px; padding-top: 20px">
		<div v-if="filetype === 'docx' || filetype === 'xlsx' || filetype === 'xls' || filetype === 'pptx'" class="office-preview-fallback">
			<el-empty description="当前环境未安装 Office 预览组件，暂不支持该格式在线预览" />
		</div>
		<div class="leftMain" v-else-if="filetype === 'pdf'">
			<el-empty description="当前环境未安装 PDF 预览组件，暂不支持该格式在线预览" />
		</div>
		<!-- txt -->
		<div v-else-if="filetype === 'txt'">
			<pre>  {{ txtContent }}</pre>
		</div>
		<!-- 图片 -->
		<el-image
			style="width: 50%; margin: 0 auto; display: block"
			@load="loading = false"
			v-else-if="
				filetype === 'apng' ||
				filetype === 'avif' ||
				filetype === 'bmp' ||
				filetype === 'gif' ||
				filetype === 'ico' ||
				filetype === 'jpeg' ||
				filetype === 'jpg' ||
				filetype === 'png' ||
				filetype === 'svg' ||
				filetype === 'tiff' ||
				filetype === 'webp'
			"
			:src="fileUrl"
		/>
		<!-- 视频格式 -->
		<div v-else-if="filetype === 'mp4' || filetype === 'webm' || filetype === 'ogg'">
			<video style="height: 500px" width="100%" height="100%" controls preload="auto" @loadeddata="onVideoLoaded">
				<source :src="fileUrl" type="video/mp4" />
				Your browser does not support the video tag.
			</video>
		</div>
		<!-- 音频文件格式 -->
		<div v-else-if="filetype === 'mp3' || filetype === 'aac' || filetype === 'wav'">
			<audio style="width: 100%; height: 100px; padding: 30px; margin-top: 10px" controls :src="fileUrl"></audio>
		</div>

		<pre v-else>  {{ JsonVal }}</pre>
	</div>
</template>
<script setup lang="ts">
const emit = defineEmits(['closeFile']);

// 如果是xls文件一定要加这个配置
let options = {
	xls: true, //预览xlsx文件设为false；预览xls文件设为true
	minColLength: 0, // excel最少渲染多少列，如果想实现xlsx文件内容有几列，就渲染几列，可以将此值设置为0.
	minRowLength: 0, // excel最少渲染多少行，如果想实现根据xlsx实际函数渲染，可以将此值设置为0.
	widthOffset: 10, //如果渲染出来的结果感觉单元格宽度不够，可以在默认渲染的列表宽度上再加 Npx宽
	heightOffset: 10, //在默认渲染的列表高度上再加 Npx高
	beforeTransformData: (workbookData) => {
		return workbookData;
	}, //底层通过exceljs获取excel文件内容，通过该钩子函数，可以对获取的excel文件内容进行修改，比如某个单元格的数据显示不正确，可以在此自行修改每个单元格的value值。
	transformData: (workbookData) => {
		return workbookData;
	}, //将获取到的excel数据进行处理之后且渲染到页面之前，可通过transformData对即将渲染的数据及样式进行修改，此时每个单元格的text值就是即将渲染到页面上的内容
};

const props = defineProps({
	fileUrl: {
		typr: String,
		default: '',
	},
});
const visible = ref(false);
const loading = ref(false);
const filetype = ref('');
const txtContent = ref('');
const JsonVal = ref('');
watch(
	() => props.fileUrl,
	(newVal) => {
		changeFileURl(newVal);
	}
);

onMounted(() => {
	changeFileURl(props.fileUrl);
});

const changeFileURl = (newVal) => {
	loading.value = true;
	console.log(newVal);
	if (!newVal) return false;
	let type = newVal.split('.')[newVal.split('.').length - 1];
	filetype.value = type;

	if (type === 'txt') {
		fetchTxtFile(newVal);
	}

	if (type === '' || !type) {
		try {
			// 字符串格式
			// 递归地处理对象中的属性值
			const fullyParsedObject = recursiveParse(JSON.parse(newVal));
			JsonVal.value = fullyParsedObject;
			loading.value = false;
		} catch (error) {
			JsonVal.value = newVal;
			loading.value = false;
		}
	}
};

const tryParseJson = (value) => {
	try {
		return JSON.parse(value);
	} catch (e) {
		return value; // 如果不是有效的JSON字符串，则返回原始值
	}
};

const recursiveParse = (obj) => {
	if (typeof obj !== 'object' || obj === null) {
		// 对于非对象类型的值，尝试将其解析为JSON字符串（如果可能）
		return tryParseJson(obj);
	}

	if (Array.isArray(obj)) {
		// 对于数组，递归处理每个元素
		return obj.map(recursiveParse);
	}

	// 对于对象，递归处理每个属性值
	const parsedObj = {};
	for (const key in obj) {
		if (obj.hasOwnProperty(key)) {
			parsedObj[key] = recursiveParse(obj[key]);
		}
	}

	return parsedObj;
};

const fetchTxtFile = (url) => {
	loading.value = true;

	fetch(url)
		.then((response) => response.text())
		.then((text) => {
			loading.value = false;
			txtContent.value = text;
		})
		.catch((error) => {
			console.error('Error fetching txt file:', error);
		});
};

const onVideoLoaded = () => {
	loading.value = false;
};

const close = () => {
	loading.value = false;
	emit('closeFile');
};
const renderedHandler = () => {
	loading.value = false;
	console.log('渲染完成');
};

// 打开弹窗
const openDialog = async () => {
	beforeUpload();
};

const beforeUpload = () => {
	visible.value = true;
};
const errorHandler = () => {
	console.log('渲染失败');
	loading.value = false;
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>

<style scoped>
.docx-preview-wrapper {
	width: 100% !important;
	height: 100% !important;
}

.loading-next-box {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}
.loading-next-box-warp {
	width: 80px;
	height: 80px;
}
.loading-next-box-warp .loading-next-box-item {
	width: 33.333333%;
	height: 33.333333%;
	background: var(--el-color-primary);
	float: left;
	animation: loading-next-animation 1.2s infinite ease;
	border-radius: 1px;
}
.loading-next-box-warp .loading-next-box-item:nth-child(7) {
	animation-delay: 0s;
}
.loading-next-box-warp .loading-next-box-item:nth-child(4),
.loading-next-box-warp .loading-next-box-item:nth-child(8) {
	animation-delay: 0.1s;
}
.loading-next-box-warp .loading-next-box-item:nth-child(1),
.loading-next-box-warp .loading-next-box-item:nth-child(5),
.loading-next-box-warp .loading-next-box-item:nth-child(9) {
	animation-delay: 0.2s;
}
.loading-next-box-warp .loading-next-box-item:nth-child(2),
.loading-next-box-warp .loading-next-box-item:nth-child(6) {
	animation-delay: 0.3s;
}
.loading-next-box-warp .loading-next-box-item:nth-child(3) {
	animation-delay: 0.4s;
}
@keyframes loading-next-animation {
	0%,
	70%,
	100% {
		transform: scale3D(1, 1, 1);
	}
	35% {
		transform: scale3D(0, 0, 1);
	}
}
</style>
