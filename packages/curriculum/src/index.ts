import type { Curriculum } from './schema.ts';
import { GLOSSARY } from './glossary.ts';
import { LABS } from './labs.ts';
import { MODULE_1 } from './modules/mod1.ts';
import { MODULE_2 } from './modules/mod2.ts';
import { MODULE_3 } from './modules/mod3.ts';
import { MODULE_4 } from './modules/mod4.ts';
import { MODULE_5 } from './modules/mod5.ts';
import { MODULE_6 } from './modules/mod6.ts';
import { MODULE_7 } from './modules/mod7.ts';

export * from './schema.ts';
export { GLOSSARY } from './glossary.ts';
export { LABS } from './labs.ts';

export const MODULES = [
  MODULE_1,
  MODULE_2,
  MODULE_3,
  MODULE_4,
  MODULE_5,
  MODULE_6,
  MODULE_7
];

export const CURRICULUM: Curriculum = {
  version: '1.0.0',
  appName: 'Marain',
  tagline: 'From Zero to Fluent in AI',
  modules: MODULES,
  glossary: GLOSSARY,
  labs: LABS
};
