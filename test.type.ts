import type { Equal, Expect } from "@type-challenges/utils";
import createPQueue from "./index";

const add = createPQueue({ concurrency: 1 });

const numberType = add(async () => 1);
const stringType = add(async () => "1");
const objType = add(async () => ({ a: 1 }));

type cases = [
  Expect<Equal<Awaited<typeof numberType>, number>>,
  Expect<Equal<Awaited<typeof stringType>, string>>,
  Expect<Equal<Awaited<typeof objType>, { a: number }>>,
];
