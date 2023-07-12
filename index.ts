// 4 Pick
// #object-keys

type MyPick<T, K extends keyof T> = {
  [key in K]: T[key];
};

interface Todo {
  title: string
  description: string
  completed: boolean
}

type TodoPreview = MyPick<Todo, 'title' | 'completed'>

const todo: TodoPreview = {
    title: 'Clean room',
    completed: false,
}

// 7 Readonly 
// #object-keys

type MyReadonly<T> = {
  readonly [key in keyof T]: T[key];
};

interface Todo1 {
  title: string
  description: string
}

const todo1: MyReadonly<Todo1> = {
  title: "Hey",
  description: "foobar"
}

todo1.title = "Hello" // Error: cannot reassign a readonly property
todo1.description = "barFoo" // Error: cannot reassign a readonly property


// 11 Tuple to Object
// #object-keys

type TupleToObject<T extends readonly any[]> = {
  [P in T[number]]: P;
};

const tuple = ['tesla', 'model 3', 'model X', 'model Y'] as const

type result = TupleToObject<typeof tuple> // expected { 'tesla': 'tesla', 'model 3': 'model 3', 'model X': 'model X', 'model Y': 'model Y'}

// 14 First of Array
// #array

type First<T extends any[]> = T['length'] extends 0 ? never : T[0];

type arr1 = ['a', 'b', 'c']
type arr2 = [3, 2, 1]

type head1 = First<arr1> // expected to be 'a'
type head2 = First<arr2> // expected to be 3

// 18 Length of Tuple
// #tuple

type Length<T extends readonly any[]> = T['length'];

// need to extend readonly any[] to get tuple

const tesla = ['tesla', 'model 3', 'model X', 'model Y'] as const;
const spaceX = ['FALCON 9', 'FALCON HEAVY', 'DRAGON', 'STARSHIP', 'HUMAN SPACEFLIGHT'] as const;

type teslaLength = Length<typeof tesla>  // expected 4
type spaceXLength = Length<typeof spaceX> // expected 5

// 43 Exclude
// #union

type MyExclude<T, U> = T extends U ? never : T;

// we're iterating through all union types by T
// the first iteration: 'a' extends 'a' ? never (not include in final type) : 'a';

type Result = MyExclude<'a' | 'b' | 'c', 'a'> // 'b' | 'c'

// 189 Awaited
// #promise #built-in

type PromiseLikeType<T> = ({ then: (onfulfilled: (arg: T) => any) => any } | Promise<T>);
type MyAwaited<T> = T extends PromiseLikeType<infer R> ? MyAwaited<R> : T;

type ExampleType = Promise<string>

type X = MyAwaited<Promise<string>>;
type Y = MyAwaited<Promise<{ field: number }>>;
type Z = MyAwaited<Promise<Promise<string | number>>>;
type Z1 = MyAwaited<Promise<Promise<Promise<string | boolean>>>>;
type T = MyAwaited<{ then: (onfulfilled: (arg: number) => any) => any }>;

// 268 If
// #utils

type If<C, T, F> = C extends true ? T : F;

type A = If<true, 'a', 'b'>  // expected to be 'a'
type B = If<false, 'a', 'b'> // expected to be 'b'

// 533 Concat
// #array

type Concat<T extends readonly any[], U extends readonly any[]> = [...T, ...U];

type Result1 = Concat<[1], [2]> // expected to be [1, 2]
type Result2 = Concat<typeof tuple, typeof tuple> // expected to be [1, 1]

// 898 Includes
// #array

type Includes<T extends readonly any[], U> = T extends [infer L, ...infer R]
  ? [U, L] extends [L, U]
  ? true
  : Includes<R, U> 
  : false

type Test_898_1 = Includes<['Kars', 'Esidisi', 'Wamuu', 'Santana'], 'Dio'> // false
type Test_898_2 = Includes<['Kars', 'Esidisi', 'Wamuu', 'Santana'], 'Kars'> // true
type Test_898_3 = Includes<[{}], { a: 'A' }>;

// 3057 Push
// #array

type Push<T extends any[], U> = [...T, U]; 

type Test_3057_1 = Push<[], 1>;
type Test_3057_2 = Push<[1, 2], '3'>;
type Test_3057_3 = Push<['1', 2, '3'], boolean>;


type Unshift<T extends any[], U> = [U, ...T]; 

type Test_3060_1 = Unshift<[], 1>;
type Test_3060_2 = Unshift<[1, 2], 0>;
type Test_3060_3 = Unshift<['1', 2, '3'], boolean>;

// 3312 Parameters
// #infer #tuple #built-in

type MyParameters<T extends (...args: any[]) => any> = 
  T extends  (...args: infer R) => any
  ? R 
  : [];

const foo = (arg1: string, arg2: number): void => {}
const bar = (arg1: boolean, arg2: { a: 'A' }): void => {}
const baz = (): void => {}

type Test_3312_1 = MyParameters<typeof foo>;
type Test_3312_2 = MyParameters<typeof bar>;
type Test_3312_3 = MyParameters<typeof baz>;


// 2 Get return type
// #infer #built-in

type MyReturnType<T> = T extends (...args: any[]) => infer R
  ? R : never

const fn = (v: boolean) => {
  if (v)
    return 1
  else
    return 2
}

type Test_2_1 = MyReturnType<typeof fn> // should be "1 | 2"