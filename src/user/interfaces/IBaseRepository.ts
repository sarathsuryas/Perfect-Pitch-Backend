import { FilterQuery, UpdateQuery } from "mongoose";

export interface IBaseRepository<T> {
  findAll(
    filter: Record<string, unknown>,
    skip: number,
    sort: any,
    limit?: number
  ): Promise<T[]>;

  findById(id: string): Promise<T | null>;

  findOneByQuery(query: FilterQuery<T>): Promise<T | null>;

  create<R>(item: R): Promise<T> 

  update(id: string, item: UpdateQuery<T>): Promise<T | null>;

  delete(id: string): Promise<boolean>;
}
