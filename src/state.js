import { createSignal } from "@react-rxjs/utils"
import { bind } from "@react-rxjs/core"

export const [clickChange$, setClick] = createSignal();
export const [showSelectedChange$, setShowSelected] = createSignal();
export const [showAllChange$, setShowAll] = createSignal();
export const [checkedCountChange$, setCheckedCount] = createSignal();
export const [useCheckedCount, checkedCount$] = bind(checkedCountChange$, 0)
