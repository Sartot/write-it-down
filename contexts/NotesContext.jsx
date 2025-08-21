"use client";

import { createContext, useContext, useState, useEffect } from 'react';

const NotesContext = createContext();

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};

export const NotesProvider = ({ children, initialNotes }) => {
  const [notes, setNotes] = useState([]);

  // Initialize notes and sort them
  useEffect(() => {
    if (initialNotes && initialNotes.length > 0) {
      const sortedNotes = [...initialNotes].sort((a, b) => {
        const aDate = new Date(a.updatedAt);
        const bDate = new Date(b.updatedAt);
        return bDate - aDate; // Most recent first
      });
      setNotes(sortedNotes);
    }
  }, [initialNotes]);

  const updateNote = (noteId, title, content) => {
    setNotes(prevNotes => {
      const updatedNotes = prevNotes.map(note => 
        note.id === noteId 
          ? { ...note, title, content, updatedAt: new Date().toISOString() }
          : note
      );
      // Re-sort after update to move the updated note to the top
      return updatedNotes.sort((a, b) => {
        const aDate = new Date(a.updatedAt);
        const bDate = new Date(b.updatedAt);
        return bDate - aDate;
      });
    });
  };

  const addNote = (newNote) => {
    setNotes(prevNotes => [newNote, ...prevNotes]);
  };

  const deleteNote = (noteId) => {
    setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
  };

  const value = {
    notes,
    updateNote,
    addNote,
    deleteNote,
    setNotes
  };

  return (
    <NotesContext value={value}>
      {children}
    </NotesContext>
  );
};
