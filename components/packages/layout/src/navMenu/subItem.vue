<template>
  <template v-for="val in chils">
    <el-sub-menu
      :class="[
        'layout-nav-menu__child-group',
        { 'layout-nav-menu__child-group--nested': depth > 1 },
      ]"
      :index="val.path"
      :key="val.path"
      v-if="val.children && val.children.length > 0"
    >
      <template #title>
        <span class="layout-nav-menu__label">{{ other.setMenuI18n(val) }}</span>
      </template>
      <sub-item :chil="val.children" :depth="depth + 1" />
    </el-sub-menu>
    <template v-else>
      <el-menu-item
        class="layout-nav-menu__child"
        :index="val.path"
        :key="val.path"
        :style="{
          marginLeft: val.level * 18 + 'px !important',
          '--before-left': -(val.level * 18) + 'px',
          height: '36px !important',
          lineHeight: '36px !important',
          minHeight: '36px !important',
        }"
      >
        <template
          v-if="!val.meta.isLink || (val.meta.isLink && val.meta.isIframe)"
        >
          <span class="layout-nav-menu__label">{{
            other.setMenuI18n(val)
          }}</span>
        </template>
        <template v-else>
          <a
            class="w100 layout-nav-menu__label"
            @click.prevent="onALinkClick(val)"
          >
            {{ other.setMenuI18n(val) }}
          </a>
        </template>
      </el-menu-item>
    </template>
  </template>
</template>

<script setup lang="ts" name="navMenuSubItem">
import { computed } from "vue";
import { RouteRecordRaw } from "vue-router";
import other from "/@/utils/other";

const props = defineProps({
  chil: {
    type: Array<RouteRecordRaw>,
    default: () => [],
  },
  depth: {
    type: Number,
    default: 1,
  },
});

const chils = computed(() => {
  return <RouteItems>props.chil;
});

const onALinkClick = (val: RouteItem) => {
  other.handleOpenLink(val);
};
</script>
