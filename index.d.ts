import { PathLike, WriteFileOptions, Stats } from 'fs'

export function distinct(array: any[]): any[]
export function hms(milliseconds: number): string
export function match(array: Object[], property: PropertyKey, query: string): Object[]
export function shuffle(array: any[]): any[]
export function wait(milliseconds: number): Promise<void>
export function format(string: string, ...arguments: any): string
export function color(flags: string, str: string): string
export function isURL(string: string, lazy: boolean): boolean
export function escapeRegex(string: string): string

export function write(path: PathLike, data: any, options?: WriteFileOptions): void
export function read(path: PathLike, options?: { encoding?: null; flag?: string }): Buffer | string[]
export function exists(path: PathLike): boolean
export function stat(path: PathLike): Stats

export function fetch(url: URL, options?: Object): Promise<any>