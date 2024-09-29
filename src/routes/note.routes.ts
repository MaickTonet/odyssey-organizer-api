import * as express from "express";
import { authentification } from "../middleware/authentification";
import { NoteController } from "../controllers/note.controllers";

const Router = express.Router();

Router.get("/note/:id", authentification, NoteController.getNoteById);

Router.get("/notes/:id", authentification, NoteController.getAllNotesByUser);

Router.post("/note", authentification, NoteController.createNote);

Router.put("/note/:id", authentification, NoteController.updateNote);

Router.delete("/note/:id", authentification, NoteController.deleteNote);

export { Router as noteRouter };
