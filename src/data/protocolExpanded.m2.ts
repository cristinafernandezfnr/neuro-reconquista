import type { ExpandedModule } from './protocolExpanded.types'
import { M2_DAY8, M2_DAY9 } from './protocolExpanded.m2.d8d9'
import { M2_DAY10, M2_DAY11 } from './protocolExpanded.m2.d10d11'
import { M2_DAY12, M2_DAY13 } from './protocolExpanded.m2.d12d13'
import { M2_DAY14 } from './protocolExpanded.m2.d14'

export const MODULE_2: ExpandedModule = {
  module: 2,
  title: 'Reconstrução',
  goal: 'Reconstruir corpo, mente, identidade e vida enquanto cria a base para a reconquista',
  duration: 'Dias 8–14',
  days: [M2_DAY8, M2_DAY9, M2_DAY10, M2_DAY11, M2_DAY12, M2_DAY13, M2_DAY14]
}
