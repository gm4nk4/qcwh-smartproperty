<template>
  <div
    class="layout-logo"
    :class="{ 'is-collapsed': !setShowLogo }"
    @click="onThemeConfigChange"
  >
    <div class="layout-logo__content">
      <img :src="brandLogo" alt="" class="layout-logo__mark" />
      <span v-if="setShowLogo" class="layout-logo__title">{{
        themeConfig.globalTitle
      }}</span>
    </div>
  </div>
</template>

<script setup lang="ts" name="layoutLogo">
import { useThemeConfig } from "/@/stores/themeConfig";
import { useThemeImage } from "/@/utils/themeImages";
import logoMini from "/@/assets/logo-mini.svg";

defineOptions({
  name: "LayoutLogo",
});

const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
const brandBadge = useThemeImage("brandBadge");
const brandLogo = computed(() => brandBadge.value || logoMini);

const setShowLogo = computed(() => {
  let { isCollapse, layout } = themeConfig.value;
  return (
    !isCollapse || layout === "classic" || document.body.clientWidth < 1000
  );
});

const onThemeConfigChange = () => {
  if (themeConfig.value.layout === "transverse") return false;
  themeConfig.value.isCollapse = !themeConfig.value.isCollapse;
};
</script>

<style scoped lang="scss">
.layout-logo {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--theme-text-system);
  cursor: pointer;
  animation: logoAnimation 0.3s ease-in-out;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  &__mark {
    flex: none;
    display: block;
    width: 34px;
    height: 34px;
    object-fit: contain;
  }

  &__title {
    white-space: nowrap;
    display: inline-block;
    font-size: 18px;
    line-height: 1;
    font-weight: 700;
    letter-spacing: 0.02em;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &.is-collapsed {
    justify-content: flex-start;
    padding-inline: 0;
    margin-left: 15px;

    .layout-logo__mark {
      width: 30px;
      height: 30px;
    }
  }

  .layout-logo__content {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-direction: row;
  }
}
</style>
