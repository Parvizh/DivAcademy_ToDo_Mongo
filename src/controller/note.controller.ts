import { Request, Response } from "express";
import { INote, Note } from "../schema/note.schema";
import { CRUDController } from "./crud.controller";
import { PipelineStage } from "mongoose";

class NoteController extends CRUDController<INote> {

    constructor() {
        super(Note)
    }

    whereConditionFindAll(searchText: string) {
        return null;
    }

    selectFindAll() {
        return null
    }


    beforeUpdate(data: INote, req: Request, res: Response) { }

    async findAllGroupByCategory(req: Request, res: Response) {
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
}

export default new NoteController()