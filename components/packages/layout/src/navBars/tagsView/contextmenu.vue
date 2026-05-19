<template>
	<transition name="el-zoom-in-center">
		<div
			aria-hidden="true"
			class="el-dropdown__popper el-popper is-light is-pure custom-contextmenu"
			role="tooltip"
			data-popper-placement="bottom"
			:style="`top: ${dropdowns.y + 5}px;left: ${dropdowns.x}px;`"
			:key="Math.random()"
			v-show="state.isShow"
		>
			<ul class="el-dropdown-menu">
				<template v-for="(v, k) in state.dropdownList">
					<li
						class="el-dropdown-menu__item"
						aria-disabled="false"
						tabindex="-1"
						:key="k"
						v-if="!v.affix && v.show"
						@click="onCurrentContextmenuClick(v.contextMenuClickId)"
					>
						<SvgIcon :name="v.icon" />
						<span>{{ $t(v.txt) }}</span>
					</li>
				</template>
			</ul>
			<div class="el-popper__arrow" :style="{ left: `${state.arrowLeft}px` }"></div>
		</div>
	</transition>
</template>

<script setup lang="ts" name="layoutTagsViewContextmenu">
import { computed, reactive } from 'vue';
import { storeToRefs } from 'pinia';
import { useTagsViewRoutes } from '/@/stores/tagsViewRoutes';

const storesTagsViewRoutes = useTagsViewRoutes();
const { favoriteRoutes } = storeToRefs(storesTagsViewRoutes);

const props = defineProps({
	dropdown: {
		type: Object,
		default: () => {
			return {
				x: 0,
				y: 0,
			};
		},
	},
});

const emit = defineEmits(['currentContextmenuClick']);

const state = reactive({
	isShow: false,
	dropdownList: [
		{ contextMenuClickId: 0, txt: 'tagsView.refresh', affix: false, show: true, icon: 'ele-RefreshRight' },
		{ contextMenuClickId: 1, txt: 'tagsView.close', affix: false, show: true, icon: 'ele-Close' },
		{ contextMenuClickId: 2, txt: 'tagsView.closeOther', affix: false, show: true, icon: 'ele-CircleClose' },
		{ contextMenuClickId: 3, txt: 'tagsView.closeAll', affix: false, show: true, icon: 'ele-FolderDelete' },
		{ contextMenuClickId: 4, txt: 'tagsView.fullscreen', affix: false, show: true, icon: 'iconfont icon-fullscreen' },
		{ contextMenuClickId: 5, txt: 'tagsView.favorite', affix: false, show: true, icon: 'ele-Star' },
	],
	item: {},
	arrowLeft: 10,
});

const dropdowns = computed(() => {
	if (props.dropdown.x + 117 > document.documentElement.clientWidth) {
		return {
			x: document.documentElement.clientWidth - 117 - 5,
			y: props.dropdown.y,
		};
	} else {
		return props.dropdown;
	}
});

const onCurrentContextmenuClick = (contextMenuClickId: number) => {
	emit('currentContextmenuClick', Object.assign({}, { contextMenuClickId }, state.item));
};

const openContextmenu = (item: RouteItem) => {
	state.item = item;
	state.isShow = true;
	item.meta?.isAffix ? (state.dropdownList[1].affix = true) : (state.dropdownList[1].affix = false);
	if (favoriteRoutes.value.some((v) => v.path === item.path)) {
		state.dropdownList[5].txt = 'tagsView.cancelFavorite';
	} else {
		state.dropdownList[5].txt = 'tagsView.favorite';
	}
};

const closeContextmenu = () => {
	state.isShow = false;
};

defineExpose({
	openContextmenu,
	closeContextmenu,
});
</script>

<style scoped lang="scss">
.custom-contextmenu {
	position: fixed;
	z-index: 9999;
}
</style>
