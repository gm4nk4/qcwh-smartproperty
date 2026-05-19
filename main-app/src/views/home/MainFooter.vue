<template>
	<footer class="main-footer">
		<span>{{ copyright }}</span>
	</footer>
</template>

<script setup lang="ts">
interface Props {
	copyright?: string;
}

const props = withDefaults(defineProps<Props>(), {
	copyright: '© 2026 智慧物业管理系统',
});
</script>

<style scoped lang="scss">
.main-footer {
	text-align: center;
	padding: 0 20px 0;
	color: rgba(255, 255, 255, 0.7);
	font-size: 14px;
  color: #485CE7;
}
</style>
