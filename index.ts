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