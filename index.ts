type Task<TaskResultType> = (() => PromiseLike<TaskResultType>) | (() => TaskResultType);
type QueueType = (() => Promise<void>)[];

const createPQueue = ({ concurrency }: { concurrency: number }) => {
  let pendingCount = 0;

  const queue: QueueType = [];

  // execute task in queue
  const executor = async () => {
    if (queue.length === 0) return;
    if (pendingCount >= concurrency) return;

    pendingCount++;
    const next = queue.shift()!;
    await next();
    pendingCount--;

    if (queue.length !== 0) {
      // console.log("execute next task");
      executor();
    } else {
      // console.log("task is done");
    }
  };

  const add = async <TaskResultType>(cb: Task<TaskResultType>): Promise<TaskResultType> => {
    return new Promise(async (resolve) => {
      const task = async (): Promise<void> => {
        const result = await cb();
        resolve(result);
      };

      queue.push(task);
      executor();
    });
  };

  return add;
};

export default createPQueue;

// const add = createPQueue();

// const delay = async (n: number) => {
//   await new Promise((resolve) => setTimeout(resolve, n));
// };

// const test = async () => {
//   const a = () =>
//     add(async () => {
//       await delay(3000);
//       console.log(1);
//       return 1;
//     }); // 4 초

//   const b = () =>
//     add(async () => {
//       await delay(2000);
//       console.log(2);
//       return 2;
//     }); // 4 초

//   const c = () =>
//     add(async () => {
//       await delay(0);
//       console.log(3);
//       return 3;
//     }); // 4 초

//   const d = () =>
//     add(async () => {
//       await delay(3000);
//       console.log(4);
//       return 4;
//     }); // 4 초

//   const [aa, bb, cc, dd] = await Promise.all([a(), b(), c(), d()]);

//   console.log(aa, bb, cc, dd);
// };

// test();
