import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Note } from "../entity/Note.entity";
import { encrypt } from "../helpers/encrypt";
import * as cache from "memory-cache";

export class NoteController {
  static async getAllNotes(req: Request, res: Response) {
    const data = cache.get("data");
    if (data) {
      console.log("serving from cache");
      return res.status(200).json({
        data,
      });
    } else {
      console.log("serving from db");
      const noteRepository = AppDataSource.getRepository(Note);
      const notes = await noteRepository.find();
      cache.put("data", notes, 10000);
      return res.status(200).json({
        data: notes,
      });
    }
  }

  static async getAllNotesByUser(req: Request, res: Response) {
    const { id } = req.params;
    console.log("serving from db");
    const noteRepository = AppDataSource.getRepository(Note);
    const notes = await noteRepository.find({
      where: { user: { id } },
      relations: ["user"],
    });
    cache.put("data", notes, 10000);
    return res.status(200).json({
      data: notes,
    });
  }
}
