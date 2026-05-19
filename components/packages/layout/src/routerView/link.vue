<template>
	<div class="layout-link" v-if="isLink"></div>
</template>

<script setup lang="ts" name="layoutLink">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import other from '/@/utils/other';

const route = useRoute();

const isLink = computed(() => {
	if (route.meta.isLink) {
		other.handleOpenLink(route);
		return true;
	}
	return false;
});
</script>
