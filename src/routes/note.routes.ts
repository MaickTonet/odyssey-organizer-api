import * as express from "express";
import { authentification } from "../middleware/authentification";
import { NoteController } from "../controllers/note.controllers";
import { authorization } from "../middleware/authorization";

const Router = express.Router();

Router.get("/notes", authentification, NoteController.getAllNotes);
Router.get("/notes/:id", authentification, NoteController.getAllNotesByUser);
// Router.post("/movies", authentification, NoteController.createMovie);

// Router.put(
//   "/movies/:id",
//   authentification,
//   authorization(["admin"]),
//   NoteController.updateMovie
// );
// Router.delete(
//   "/movies/:id",
//   authentification,
//   authorization(["admin"]),
//   NoteController.deleteMovie
// );

export { Router as noteRouter };
