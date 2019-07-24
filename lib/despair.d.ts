import { MakeDirectoryOptions } from "fs";

export function distinct(arr: any[]): any[]
export function hms(ms: number): string
export function match(arr: Object[], prop: PropertyKey, query: string): Object[]
export function shuffle(array: any[]): any[]
export function wait(ms: number): Promise<void>
export function format(str: string, ...args: any): string
export function color(str: string): string
export function isURL(str: string, lazy: boolean): boolean
export function escapeRegex(str: string): string
export function unescapeRegex(str: string): string
export function write(path: PathLike, data: any, options?: WriteFileOptions | MakeDirectoryOptions): void
export function read(path: PathLike, options?: { encoding?: null; flag?: string }): Buffer | string[]
export function exists(path: PathLike): boolean
export function stat(path: PathLike): Stats
export function fetch(url: got.GotUrl, options?: got.GotJSONOptions): got.GotPromise<any>
export function html(html: string | Buffer, options?: CheerioOptionsInterface): CheerioStatic
export function rnd(min: number, max: number): number
export function encode(str: string, type: string): string
export function decode(str: string, type: string): string
export function test(fn: Function | any, any: any, full?: boolean): boolean
export function log(...any: any): void
export function err(...any: any): void
export function die(fn: Function, type: any): any