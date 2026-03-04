import type { ComputedRef, MaybeRef } from 'vue'
export type LayoutKey = "default" | "default-v1"
declare module 'nuxt/app' {
  interface PageMeta {
    layout?: MaybeRef<LayoutKey | false> | ComputedRef<LayoutKey | false>
  }
}