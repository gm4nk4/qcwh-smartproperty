<template>
	<div class="layout-padding layout-padding-unset layout-iframe">
		<div class="layout-padding-auto layout-padding-view">
			<div class="w100" v-for="v in setIframeList" :key="v.path" v-loading="v.meta.loading" element-loading-background="white">
				<transition-group :name="name">
					<iframe
						:src="v.meta.isLink"
						:key="v.path"
						frameborder="0"
						height="100%"
						width="100%"
						style="position: absolute"
						:data-url="v.path"
						v-show="getRoutePath === v.path"
						ref="iframeRef"
					/>
				</transition-group>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="layoutIframeView">
const props = defineProps({
	refreshKey: {
		type: String,
		default: () => '',
	},
	name: {
		type: String,
		default: () => 'slide-right',
	},
	list: {
		type: Array,
		default: () => [],
	},
});

const iframeRef = ref();
const route = useRoute();

const setIframeList = computed(() => {
	return (<RouteItems>props.list).filter((v: RouteItem) => v.meta?.isIframeOpen);
});

const getRoutePath = computed(() => {
	return route.meta.isDynamic ? route.meta.isDynamicPath : route.path;
});
</script>

<style scoped lang="scss">
.layout-iframe {
	height: 100%;
	.layout-padding-view {
		height: 100%;
	}
}
</style>
