// interfaces/IBaseRepository.ts

import {
  Document,
  FilterQuery,
  PopulateOptions,
  UpdateQuery,
} from 'mongoose';

export interface IBaseRepository<T extends Document> {
  findAll<R>(
    filter: any,
    skip?: number,
    limit?: number,
    sort?: any,
  ): Promise<R[]>;

  findById<R>(id: string, projection?: Record<string, unknown>): Promise<R | null>;
  find<R>(): Promise<R[]>;
  findByQuery<R>(query: FilterQuery<T>): Promise<R[]>;
  findOneByQuery<R>(query: FilterQuery<T>): Promise<R>;
  findOneWithProjection<R>(
    filter: Record<string, any>,
    projection: Record<string, number>,
  ): Promise<R>;
  findOneAndUpdate(
    filter: Record<string, any>,
    update: Record<string, any>,
  ): Promise<T | null>;

  create<R>(item: R): Promise<T>;
  update(id: string, item: UpdateQuery<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;

  findWithPopulate<R>(
    filter: FilterQuery<T>,
    sort?: Record<string, 1 | -1>,
    populate?: string | PopulateOptions | (string | PopulateOptions)[],
    lean?: boolean,
  ): Promise<R[]>;
}
