import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Note } from "../entity/Note.entity";
import * as cache from "memory-cache";

export class NoteController {
  static async getNoteById(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const cachedNote = cache.get(`note_${id}`);
      if (cachedNote) {
        return res.status(200).json({
          message: "Note retrieved from cache",
          data: cachedNote,
        });
      }

      const noteRepository = AppDataSource.getRepository(Note);

      const note = await noteRepository.findOne({
        where: { id },
      });

      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }

      cache.put(`note_${id}`, note, 10000);

      return res.status(200).json({
        message: "Note retrieved successfully",
        data: note,
      });
    } catch (error) {
      return res.status(500).json({
        message: "An error occurred while retrieving the note",
        error: error.message,
      });
    }
  }

  static async getAllNotesByUser(req: Request, res: Response) {
    const { id } = req.params;

    try {
      // Verifica se os dados já estão em cache
      const cachedNotes = cache.get(`user_notes_${id}`);
      if (cachedNotes) {
        return res.status(200).json({
          message: "Notes retrieved from cache",
          data: cachedNotes,
        });
      }

      const noteRepository = AppDataSource.getRepository(Note);

      const notes = await noteRepository.find({
        where: { user: { id } },
        relations: ["user"],
      });

      if (!notes || notes.length === 0) {
        return res.status(404).json({
          message: "No notes found for this user",
        });
      }

      cache.put(`user_notes_${id}`, notes, 10000);

      return res.status(200).json({
        message: "Notes retrieved successfully",
        data: notes,
      });
    } catch (error) {
      return res.status(500).json({
        message: "An error occurred while retrieving notes",
        error: error.message,
      });
    }
  }

  static async createNote(req: Request, res: Response) {
    const { userID, complete, description, tags, limitDate } = req.body;

    if (!userID || !description || !limitDate) {
      return res.status(400).json({
        message: "Missing required fields: userID, description, or limit date",
      });
    }

    try {
      const note = new Note();
      note.user = userID;
      note.complete = complete || false;
      note.description = description;
      note.tags = tags || [];
      note.limitDate = limitDate;

      const noteRepository = AppDataSource.getRepository(Note);

      await noteRepository.save(note);

      return res.status(201).json({
        message: "Note created successfully",
        data: note,
      });
    } catch (error) {
      return res.status(500).json({
        message: "An error occurred while creating the note",
        error: error.message,
      });
    }
  }

  static async updateNote(req: Request, res: Response) {
    const { id } = req.params;
    const { userID, complete, description, tags, limitDate } = req.body;

    try {
      const noteRepository = AppDataSource.getRepository(Note);

      const note = await noteRepository.findOne({ where: { id } });

      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }

      if (complete !== undefined) note.complete = complete;
      if (description) note.description = description;
      if (tags !== undefined) note.tags = tags;
      if (limitDate) note.limitDate = limitDate;

      await noteRepository.save(note);

      return res.status(200).json({
        message: "Note updated successfully",
        data: note,
      });
    } catch (error) {
      return res.status(500).json({
        message: "An error occurred while updating the note",
        error: error.message,
      });
    }
  }

  static async deleteNote(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const noteRepository = AppDataSource.getRepository(Note);

      const note = await noteRepository.findOne({ where: { id } });

      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }

      await noteRepository.remove(note);

      return res.status(200).json({
        message: "Note deleted successfully",
        deletedNote: note,
      });
    } catch (error) {
      return res.status(500).json({
        message: "An error occurred while deleting the note",
        error: error.message,
      });
    }
  }
}
