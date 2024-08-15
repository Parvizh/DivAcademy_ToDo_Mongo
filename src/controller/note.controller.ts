import { Request, Response } from "express";
import { INote, Note } from "../schema/note.schema";
import { PipelineStage } from "mongoose";
import { errorHandler } from "../helpers/errorHandler";
import { SORT_TYPE } from "../enums/sort.enum";


const create = async (req: Request, res: Response) => {
    try {
        const result = await Note.create(req.body);
        return res.status(201).json({ result })
    } catch (error: any) {
        return errorHandler(res, 500, error.message)
    }
}


const findOne = async (req: Request, res: Response) => {
    try {
        const result = await Note.findById(req.params.id)
        if (!result) return errorHandler(res, 404, "This data is not found")
        return res.status(200).json({ result })
    } catch (error: any) {
        return errorHandler(res, 500, error.message)
    }
}


const find = async (req: Request, res: Response) => {
    try {
        const { page, limit, sort, order = SORT_TYPE.DESC, searchText = '' } = req.query;

        const orderParser = order == SORT_TYPE.ASC ? 1 : -1;
        const skip = (Number(page) - 1) * Number(limit)


        const resultPromise = Note
            .find()
            .sort(sort ? { [sort as string]: orderParser } : {})
            .populate(null)
            .select(null)
            .skip(skip)
            .limit(Number(limit))
            .lean()

        const totalCountPromise = Note.countDocuments()

        const [result, totalCount] = await Promise.all([resultPromise, totalCountPromise])

        return res.status(200).json({
            result,
            metadata: {
                limit,
                page,
                totalCount,
                totalPages: totalCount < Number(limit) ? totalCount : Math.ceil(totalCount / Number(limit))
            }
        })
    } catch (error: any) {
        return errorHandler(res, 500, error.message)
    }


}

const findAllGroupByCategory = async (req: Request, res: Response) => {
    const pipeline: PipelineStage[] = [
        {
            $group: {
                _id: "$categoryId",
                noteCount: { $sum: 1 },
                lastNote: { $last: "$$ROOT" }
            }
        },
        {
            $lookup: {
                from: "categories",
                localField: "_id",
                foreignField: "_id",
                as: "categoryDetails"
            }
        },
        {
            $unwind: "$categoryDetails"
        },
        {
            $project: {
                _id: 0,
                categoryId: "$categoryDetails._id",
                categoryTitle: "$categoryDetails.title",
                noteCount: 1,
                lastNote: 1,
            }
        },
        {
            $sort: { "noteCount": 1 }
        }
    ]

    const result = await Note.aggregate(pipeline).exec();
    return res.status(200).json({ result })
}


const update = async (req: Request, res: Response) => {
    try {
        // const result = await this.model.findByIdAndUpdate(req.params.id, req.body, { new: true });
        let result: INote = await Note.findById(req.params.id)
        if (!result) return errorHandler(res, 404, "This data is not found")


        if (!res.headersSent) {
            result = Object.assign(result, req.body)
            const data = await result.save()

            return res.status(200).json({ result: data })

        }
    } catch (error: any) {
        return errorHandler(res, 500, error.message)
    }
}

export const remove= async (req: Request, res: Response)=> {
    try {
        const result = await Note.findByIdAndDelete(req.params.id);
        if (!result) return errorHandler(res, 404, "This data is not found")
        return res.status(201).json({ result })
    } catch (error: any) {
        return errorHandler(res, 500, error.message)
    }
}


export { create, findOne, findAllGroupByCategory, update }