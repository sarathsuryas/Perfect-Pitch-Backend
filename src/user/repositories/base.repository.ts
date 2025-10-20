import { Document, UpdateQuery, FilterQuery, PopulateOptions } from "mongoose";
import { IBaseRepository } from "../interfaces/IBaseRepository";
import mongoose, { Model } from "mongoose";

export class BaseRepository<T extends Document> implements IBaseRepository<T> {
  constructor(private _model: Model<T>) {
    this._model = _model
  }

  async findAll<R>(filter: any, skip: number = 0, limit: number = 0, sort: any): Promise<R[]> {
    try {
      // if(skip && limit && sort) {
      //   return await this._model.find(filter) as R[];
      // }
      if (!filter) {
        return await this._model.find({isBlocked:false}).skip(skip).limit(limit) as R[];
      }
      if (sort) {
        return await this._model.find(filter).sort(sort).skip(skip).limit(limit) as R[];
      }
      return await this._model.find(filter).skip(skip).limit(limit) as R[];
    } catch (error) {
      console.error("Error fetching data:", error);
      throw new Error("Could not fetch records");
    }
  }

  async findById<R>(id: string, projection?: Record<string, unknown>): Promise<R | null> {
    try {
      return await this._model.findById(id, projection).lean<R>();
    } catch (error) {
      console.error("Error fetching record by ID:", error);
      throw new Error("Could not fetch record by ID");
    }
  }
  async findOneByQuery<R>(query: FilterQuery<T>): Promise<R> {
    try {
      return await this._model.findOne(query).lean() as R;
    } catch (error) {
      console.error("Error fetching record by ID:", error);
      throw new Error("Could not fetch record by ID");
    }
  }
  async findOneWithProjection<R>(
    filter: Record<string, any>,
    projection: Record<string, number>
  ): Promise<R> {
    try {
      return await this._model.findOne(filter, projection)
        .lean()

    } catch (error) {
      console.error(error)
    }
  }

  async findOneAndUpdate(
    filter: Record<string,any>,
    update: Record<string, any>
  ): Promise<T | null> {
    try {
      return await this._model.findOneAndUpdate(filter, update)

    } catch (error) {
      console.error(error)
    }
  }


  async find<R>(): Promise<R[]> {
    try {
      return await this._model.find().lean() as R[]
    } catch (error) {
      console.error("Error fetching record by ID:", error);
      throw new Error("Could not fetch record by ID");
    }
  }
  async findByQuery<R>(query: FilterQuery<T>): Promise<R[]> {
    try {
      return await this._model.find(query).lean() as R[]
    } catch (error) {
      console.error("Error fetching record by ID:", error);
      throw new Error("Could not fetch record by ID");
    }
  }


  async create<R>(item: R): Promise<T> {
    try {
      return await this._model.create(item);
    } catch (error) {
      console.error("Error creating record:", error);
      throw new Error("Could not create record");
    }
  }

  async update(id: any, item: UpdateQuery<T>): Promise<T | null> {
    try {
      return await this._model.findByIdAndUpdate(id, item, { new: true });
    } catch (error) {
      console.error("Error updating record:", error);
      throw new Error("Could not update record");
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await this._model.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      console.error("Error deleting record:", error);
      throw new Error("Could not delete record");
    }
  }



  async findWithPopulate<R>(
    filter: FilterQuery<T>,
    sort: Record<string, 1 | -1> = {},
    populate: string | PopulateOptions | (string | PopulateOptions)[] = "",
    lean: boolean = true
  ): Promise<R[]> {
    try {
      console.log(sort)

      const query = this._model.find(filter)
      if (Object.keys(sort).length > 0) {
        query.sort(sort);
      }
      if (populate) {
        query.populate(populate as string);
      }
      if (lean) {
        query.lean();
      }
      return await
        query
          .exec() as R[]
    } catch (error) {
      console.error("Error in findWithPopulate:", error);
      throw new Error("Could not fetch records");
    }
  }

}