import type { Placement } from '@floating-ui/dom'
import { arrow, computePosition, flip, offset, shift } from '@floating-ui/dom'

export interface RecomputePosParams {
  triggerDom?: HTMLElement
  contentDom?: HTMLElement
  arrowDom?: HTMLElement
  placement?: Placement
}

export type Unit = `${number}px`

export function recomputePos({
  triggerDom,
  contentDom,
  arrowDom,
  placement,
}: RecomputePosParams) {
  return new Promise<{
    left: Unit
    top: Unit
  }>((resolve) => {
    if (!triggerDom || !contentDom || !arrowDom)
      return
    computePosition(triggerDom, contentDom, {
      placement,
      middleware: [
        offset(6),
        flip(),
        shift({ padding: 5 }),
        arrow({ element: arrowDom }),
      ],
    }).then(({ x, y, placement, middlewareData }) => {
      const { x: arrowX, y: arrowY } = middlewareData.arrow as any

      const staticSide = {
        top: 'bottom',
        right: 'left',
        bottom: 'top',
        left: 'right',
      }[placement.split('-')[0]]

      Object.assign(arrowDom.style, {
        left: arrowX != null ? `${arrowX}px` : '',
        top: arrowY != null ? `${arrowY}px` : '',
        right: '',
        bottom: '',
        [staticSide as any]: '-4px',
      })
      resolve({
        left: `${x}px`,
        top: `${y}px`,
      })
    })
  })
}
