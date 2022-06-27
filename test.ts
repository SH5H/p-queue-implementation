import createPQueue from "./index";

const delay = (n: number) => new Promise((resolve) => setTimeout(resolve, n));

test("return value", async () => {
  const add = createPQueue({ concurrency: 1 });

  const a = add(async () => {
    await delay(0);
    return "first";
  });
  const b = add(async () => {
    await delay(0);
    return 2;
  });
  const c = add(async () => {
    await delay(0);
    return { n: 3 };
  });
  const d = add(async () => {
    await delay(0);
    return [4];
  });

  const [r1, r2, r3, r4] = await Promise.all([a, b, c, d]);

  expect(r1).toBe("first");
  expect(r2).toBe(2);
  expect(r3).toStrictEqual({ n: 3 });
  expect(r4).toStrictEqual([4]);
});

test("when concurrency is 1", async () => {
  const add = createPQueue({ concurrency: 1 });
  const testList: number[] = [];

  const a = add(async () => {
    await delay(500);
    testList.push(4);
  });
  const b = add(async () => {
    await delay(400);
    testList.push(3);
  });
  const c = add(async () => {
    await delay(300);
    testList.push(2);
  });
  const d = add(async () => {
    await delay(200);
    testList.push(1);
  });

  await Promise.all([a, b, c, d]);

  expect(testList).toStrictEqual([4, 3, 2, 1]);
});

test("when concurrency is 2", async () => {
  const add = createPQueue({ concurrency: 2 });
  const testList: number[] = [];

  const a = add(async () => {
    await delay(500);
    testList.push(4);
  });
  const b = add(async () => {
    await delay(100);
    testList.push(3);
  });
  const c = add(async () => {
    await delay(100);
    testList.push(2);
  });
  const d = add(async () => {
    await delay(100);
    testList.push(1);
  });

  await Promise.all([a, b, c, d]);

  expect(testList).toStrictEqual([3, 2, 1, 4]);
});
