"use client"

import { Board } from "@/types/board";
import { BoardCard } from "./board-card";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BoardGridProps {
  boards: Board[];
  onDelete: (id: string) => void;
  onCreateClick: () => void;
}

export function BoardGrid({ boards, onDelete, onCreateClick }: BoardGridProps) {
  if (boards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center min-h-[400px]">
        <div className="rounded-full bg-muted p-6 mb-4">
          <Plus className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No boards yet</h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          Get started by creating your first board to organize your tasks and projects.
        </p>
        <Button onClick={onCreateClick} size="lg">
          <Plus className="h-4 w-4 mr-2" />
          Create your first board
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {boards.map((board) => (
        <BoardCard key={board.id} board={board} onDelete={onDelete} />
      ))}
    </div>
  );
}
